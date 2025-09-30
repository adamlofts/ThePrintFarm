import React, {useEffect, useState} from "react";
import {OrderAddressInsert, quote, Revision} from "@api/api";
import {useNavigate} from "react-router-dom";
import {useSupabase} from "@hooks/SupabaseProvider";
import styles from './AddressForm.module.css';

interface AddressFormProps {
    initialAddress: OrderAddressInsert;
    onChange: (address: OrderAddressInsert) => void;
}

export function AddressForm({initialAddress, onChange}: AddressFormProps) {
    const [address, setAddress] = useState(initialAddress);

    useEffect(() => {
        onChange(address);
    }, [address, onChange]);

    const handleChange = (field: keyof OrderAddressInsert, value: string) => {
        setAddress(prev => ({...prev, [field]: value}));
    };

    return (
        <div className="mb-3">
            <div className="mb-3">
                <label className="form-label">Street</label>
                <input
                    type="text"
                    value={address.street}
                    onChange={(e) => handleChange("street", e.target.value)}
                    className="form-control"
                />
            </div>

            <div className="mb-3">
                <label className="form-label">City</label>
                <input
                    type="text"
                    value={address.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className="form-control"
                />
            </div>

            <div className="mb-3">
                <label className="form-label">State / County</label>
                <input
                    type="text"
                    value={address.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    className="form-control"
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Postcode</label>
                <input
                    type="text"
                    value={address.zip_code}
                    onChange={(e) => handleChange("zip_code", e.target.value)}
                    className="form-control"
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Country</label>
                <input
                    type="text"
                    value={address.country}
                    readOnly
                    className="form-control-plaintext"
                />
            </div>
        </div>
    );
}


interface AddressManagerProps {
    revision: Revision;
    country: string;
}

export function AddressManager({revision, country}: AddressManagerProps) {
    const emptyAddress: OrderAddressInsert = {
        city: "",
        country: country,
        state: "",
        street: "",
        tenant_id: "",
        zip_code: ""
    };

    const navigate = useNavigate();
    const {supabase, loading} = useSupabase();

    const [visible, setVisible] = useState(false);
    const [shippingAddress, setShippingAddress] = useState<OrderAddressInsert>(emptyAddress);
    const [useDifferentBilling, setUseDifferentBilling] = useState(false);
    const [billingAddress, setBillingAddress] = useState<OrderAddressInsert>(emptyAddress);
    const [working, setWorking] = useState(false);


    const handleSetAddress = async () => {
        setWorking(true);
        const {
            order_id,
            id: newRevisionId,
            account_id
        } = await quote(supabase, {
            revision_id: revision.id,
            newVersion: false,
            specs: {},
            account_id: revision.account_id,

            new_shipping_address: shippingAddress,
            new_billing_address: useDifferentBilling ? billingAddress : shippingAddress,

            new_validity: -1,
            new_price_quality: '',
            new_order_review_state: '',
        });
        navigate(`/a/${account_id}/order/${order_id}?rev=${newRevisionId}`);
    };

    if (!visible) {
        return <button className="btn btn-secondary" onClick={() => setVisible(true)}>Enter Shipping Address</button>;
    }
    return (
        <>
            <div className="">

                {/*<h3>Shipping Address</h3>*/}
                <AddressForm initialAddress={shippingAddress} onChange={setShippingAddress}/>

                <div className="form-check mb-3">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={useDifferentBilling}
                        onChange={(e) => setUseDifferentBilling(e.target.checked)}
                        id="differentBillingCheck"
                    />
                    <label className="form-check-label" htmlFor="differentBillingCheck">
                        Use a different billing address
                    </label>
                </div>

                {useDifferentBilling && (
                    <>
                        <h4>Billing Address</h4>
                        <AddressForm initialAddress={billingAddress} onChange={setBillingAddress}/>
                    </>
                )}

                <div className={styles.buttons}>
                    <button className={styles.button} onClick={handleSetAddress} disabled={working}>
                        Save
                    </button>

                    <button className={styles.button} onClick={() => setVisible(false)} disabled={working}>
                        Cancel
                    </button>
                </div>
            </div>
        </>
    );
}
