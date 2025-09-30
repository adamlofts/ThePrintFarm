import React, {useEffect, useState} from 'react';
import styles from "./OrderAddressComponent.module.css";

import {OrderAddress} from "@api/api";
import {useSupabase} from "@hooks/SupabaseProvider";

interface OrderAddressComponentProps {
    address_id: string;
}

export function OrderAddressComponent({address_id}: OrderAddressComponentProps) {
    const [address, setAddress] = useState<OrderAddress>();
    const {supabase, loading} = useSupabase();

    useEffect(() => {
        const fetchData = async () => {
            let {data, error} = await supabase
                .from('OrderAddress')
                .select('*')
                .eq('id', address_id)
                .single();
            const newOrderAddress: OrderAddress = data;
            setAddress(newOrderAddress);
        };

        fetchData();

    }, [address_id]);

    if (!address) {
        return null;
    }
    return (
        <div className={styles.address}>
            <span>{address.street}</span>
            <span>{address.city}</span>
            <span>{address.state}</span>
            <span>{address.zip_code}</span>
            <span>{address.country}</span>
        </div>
    );
}