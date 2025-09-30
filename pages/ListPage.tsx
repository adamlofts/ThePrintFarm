import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {Order, Revision, Version} from '../components/QuoteForm';
import {useSupabase} from "@hooks/SupabaseProvider";
import styles from "./ListPage.module.css";
import {CamyNav} from "@components/CamyNav";
import {currencyFormat, qualityTitle} from "@api/api";
import {formatDate} from "../api/api";

interface OrderComponentProps {
    order: OrderWithLatestVersion;
}

export function OrderComponent({order}: OrderComponentProps) {
    const navigate = useNavigate();

    function trigger() {
        navigate(`/a/${order.account_id}/order/${order.id}`);
    }

    let formatCost = '';
    if (order.Revision.grand_total > 0) {
        const symbol = {
            'USD': '$',
            'GBP': '£',
        }[order.Revision.currency];
        formatCost = currencyFormat(order.Revision.grand_total, symbol);
    }
    return <div className={styles.orderRow} onClick={trigger}>
        <div className={styles.nameCol}> {order.custom_name}{order.id.substring(0, 8)} {order.name}</div>
        <div className={styles.timeCol}>{formatDate(new Date(order.Revision.created_at))}</div>
        <div>{order.Version.review_state}</div>
        <div className={styles.qualityCol}>{qualityTitle[order.Revision.lowest_quality]}</div>
        <div></div>
        <div className={styles.costCol}>{formatCost}</div>
    </div>
}

interface ListPageProps {
    isOrder: boolean;
}

type OrderWithLatestVersion = Order & { Version: Version, Revision: Revision };

export function ListPage({isOrder}: ListPageProps) {
    const navigate = useNavigate();
    const {account} = useParams();
    const {supabase, loading} = useSupabase();
    const [orders, setOrders] = useState<OrderWithLatestVersion[]>([]);
    const location = useLocation();
    const isOrders = location.pathname.endsWith("/orders");

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            let query = supabase
                .from('Order')
                .select('*, Version!latest_version(*), Revision!latest_revision(*)')
                .eq('account_id', account);

            if (isOrders) {
                query = query
                    .not('ordered_at', 'is', null)
                    .order('ordered_at', { ascending: false });
            } else {
                query = query
                    .is('ordered_at', null)
                    .order('created_at', { ascending: false });
            }
            let {data, error} = await query;
            const newOrders: OrderWithLatestVersion[] = data;
            setOrders(newOrders);
            if (!isMounted) return;
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [isOrder])

    return <>
        <CamyNav/>
        <div className={styles.container}>
            <div className="row gx-0 pb-5">
                <div className="col col-6 offset-3">
                    <div className={styles.grid}>
                        {orders.map((o) => <OrderComponent key={o.id} order={o}/>)}

                        <button className="btn btn-outline-primary" onClick={() => navigate(`/a/${account}/new`)}>New Quote</button>
                    </div>
                </div>

            </div>
        </div>
    </>
}
