import React, {useEffect, useState} from 'react'
import styles from './OrderHeaderComponent.module.css';
import {OrderWithVersions, quote, Revision, SpecManual, Version} from "@api/api";
import {Button, ButtonGroup, Dropdown} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {useAccountsAndTenantAdmin} from "@hooks/AccountsProvider";
import {useSupabase} from "@hooks/SupabaseProvider";
import {
    compareQuality,
    formatDate,
    formatDurationToNow,
    qualityTitle,
    revisionExpiryDate
} from "@api/api";

interface OrderComponentProps {
    order: OrderWithVersions;
    version: Version;
    revision: Revision;
}

export function OrderHeaderComponent({order, version: focusedVersion, revision}: OrderComponentProps) {
    const navigate = useNavigate();
    const {supabase} = useSupabase();
    const {focusedAccount} = useAccountsAndTenantAdmin();
    const [files, setFiles] = useState([]);

    const versionItems = order.Version.map((version) =>
        <Dropdown.Item
            key={version.id}
            onClick={(evt) => navigate(`/a/${order.account_id}/order/${order.id}/version/${version.id}`)}
        >Version {version.index + 1}</Dropdown.Item>)

    const handleNewVersion = async () => {
        const {order_id, id: newRevisionId, version_id, account_id} = await quote(supabase, {
            revision_id: revision.id,
            newVersion: true,
            specs: {},
            account_id: revision.account_id,

            new_shipping_address: null,
            new_billing_address: null,

            new_validity: null,
            new_price_quality: null,
            new_order_review_state: '',
        });
        navigate(`/a/${account_id}/order/${order_id}/version/${version_id}`);
    }

    useEffect(() => {
        const fetchData = async () => {
            let {data, error} = await supabase
                .from('File')
                .select('*')
                .eq('order_id', order.id);
            const newFiles: File[] = data;
            setFiles(newFiles);
        };
        fetchData();
    }, [order]);

    const isRevisionResult = !!revision?.result_at;
    let isOrdered = !!order.ordered_revision_id;

    let expiry;
    let isExpired = false;
    if (revision.lowest_validity_days) {
        expiry = revisionExpiryDate(revision);
        isExpired = expiry.getTime() < new Date().getTime();
    }

    let helpText;
    if (isOrdered) {
        helpText = <div>Ordered on {formatDate(new Date(order.ordered_at))}</div>
    } else if (isExpired) {
        helpText = <div>This quote has expired</div>
    } else if (expiry) {
        helpText = <div>Valid for purchase {formatDurationToNow(expiry)}</div>
    } else if (revision.ShippingItem.length === 0) {
        helpText = <div>Enter shipping address for price and lead time</div>
    } else if (focusedVersion.review_state === 'in_review') {
        helpText = <div>Our team are reviewing your quote</div>
    } else {
        helpText = <div>Price is subject to change. Quote must be locked in by our team</div>
    }

    let title = order.custom_name;
    if (!title && isRevisionResult) {
        title = qualityTitle[revision.lowest_quality];
    }

    return <>
        <div className={styles.headerRow}>
            <h1 className={styles.h1}>{title}</h1>
            <div className={styles.hash}>{order.id.substring(0, 8)}</div>
            <button className={styles.nameButton}>Set Name...</button>

                <div className={styles.text}>
                    {/*{revision.lowest_quality}*/}
                </div>
                <div className={styles.buttons}>
                    <Dropdown as={ButtonGroup} align={"end"}>
                        <Button variant={"outline-primary"}>{files.length} file{files.length === 1 ? '': 's'}</Button>
                        {/*<Button variant={"outline-primary"}>Updates (4 hours ago)</Button>*/}
                        {/*<Button className={styles.headerButton}>⇩ PDF</Button>*/}
                        <Dropdown.Toggle variant={"outline-primary"}>{focusedVersion && `Version ${focusedVersion.index + 1}` || ""}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {versionItems}
                            <Dropdown.Divider/>
                            <Dropdown.Item onClick={handleNewVersion}>New Version</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
        </div>

        {false && isRevisionResult && <div className={styles.secondRow}>
            {helpText}
        </div>}
    </>
}

