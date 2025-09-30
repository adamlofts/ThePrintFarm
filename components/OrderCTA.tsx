import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Order, postOrderState, quote, RevisionWithRelations, Version} from '@api/api';
import {useSupabase} from "@hooks/SupabaseProvider";
import styles from "./OrderCTA.module.css";
import {FormSelect, InputGroup} from 'react-bootstrap';
import {
    addWorkingDaysUK,
    Currency,
    currencyFormat,
    PriceQuality,
    qualityTitle,
    ReviewState,
    revisionExpiryDate,
    TENANT
} from "@api/api";
import {useAccountsAndTenantAdmin} from "@hooks/AccountsProvider";
import {AddressManager} from "@components/ui/AddressForm";
import {OrderAddressComponent} from "@components/ui/OrderAddressComponent";


interface OrderCTAProps {
    order: Order;
    version: Version;
    revision: RevisionWithRelations;

    touched: boolean;
    isEdit: boolean;
    triggerRevise: (currency: Currency | null, quality: PriceQuality, newValidity: number, newOrderReviewState: ReviewState | '') => void;
    triggerRevert: () => void;
    triggerBeginRevise: () => void;
}

export function OrderCTA({
                             order,
                             version,
                             revision,
                             isEdit,
                             touched,
                             triggerRevert,
                             triggerRevise,
                             triggerBeginRevise
                         }: OrderCTAProps) {
    const navigate = useNavigate();
    const {supabase, loading} = useSupabase();
    const {accounts, focusedAccount, isTenantAdmin} = useAccountsAndTenantAdmin();
    const [newPriceQuality, setNewPriceQuality] = useState(revision.lowest_quality);
    const [newValidity, setNewValidity] = useState(revision.lowest_validity_days.toString());
    const [newReviewState, setNewReviewState] = useState('reviewed');
    const [working, setWorking] = useState(false);
    const [isPayment, setIsPayment] = useState(false);

    const symbol = {
        'USD': '$',
        'GBP': '£',
    }[revision?.currency];

    const handleRequestReview = async () => {
        setWorking(true);
        const {order_id, id: newRevisionId, version_id, account_id} = await quote(supabase, {
            revision_id: revision.id,
            newVersion: false,
            specs: {},
            account_id: revision.account_id,

            new_shipping_address: null,
            new_billing_address: null,

            new_validity: null,
            new_price_quality: null,
            new_order_review_state: 'in_review',
        });
        navigate(`/a/${order.account_id}/order/${order.id}?rev=${newRevisionId}`);
    }

    const handlePaymentReceived = async () => {
        // await postReviewState(supabase, version.id, 'payment_received');
        // navigate(`/a/${order.account_id}/order/${order.id}?rev=payment_received`);
    }


    const handlePOUpload = async () => {
        // await postReviewState(supabase, version.id, 'payment_review');
        // navigate(`/a/${order.account_id}/order/${order.id}?rev=payment_review`);
    }

    // const handleChangeCurrency = async () => {
    //     await postReviewState(supabase, version.id, 'payment_review');
    //     navigate(`/a/${order.account_id}/order/${order.id}?rev=payment_review`);
    // }

    const handleBeginOrder = async () => {
        setWorking(true);
        await postOrderState(supabase, order.id, {
            ordered_revision_id: revision.id,
            ordered_version_id: version.id,
        });
        navigate(`/a/${order.account_id}/order/${order.id}?rev=beginorder`);
    }

    if (!focusedAccount) {
        return null;  // wait to load
    }

    let isOrdered = !!order.ordered_revision_id;

    let expiry;
    let isExpired = false;
    if (revision.lowest_validity_days) {
        expiry = revisionExpiryDate(revision);
        isExpired = expiry.getTime() < new Date().getTime();
    }

    let formattedExpiryDate = '';
    if (expiry && !isExpired) {
        formattedExpiryDate = new Intl.DateTimeFormat("en-GB", {
            weekday: undefined, //false, //withWeekday ? "long" : undefined,
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(expiry);
    }

    const inReview = !isExpired && version.review_state === 'in_review';
    const reviewed = !isExpired && version.review_state === 'reviewed';

    function handleSaveChanges() {
        setWorking(true);
        triggerRevise('', newPriceQuality, Number(newValidity), newReviewState);
    }

    if (isEdit) {
        const validityOptions = [5, 30, 90, 180];

        const touched2 = touched || newPriceQuality !== revision.lowest_quality || newReviewState !== version.review_state ||
            newValidity !== revision.lowest_validity_days.toString();

        return <div className={styles.cta}>
            {isTenantAdmin && <>
                <div className={styles.dropdownRow}>
                    <label>Price Type</label>
                    <FormSelect
                        onChange={(evt) => setNewPriceQuality(evt.target.value)}
                        value={newPriceQuality}
                    >
                        <optgroup label="No Price">
                            <option value="no_price">No Price</option>
                        </optgroup>

                        <optgroup label="Estimates">
                            <option value="rom">Order of Magnitude</option>
                            <option value="indicative">Indicative</option>
                            <option value="preliminary_estimate">Preliminary</option>
                            <option value="budgetary_estimate">Budgetary Estimate</option>
                            <option value="detailed_estimate">Detailed Estimate</option>
                        </optgroup>

                        <optgroup label="Prices">
                            <option value="target_price">Target</option>
                            <option value="fixed_price">Fixed</option>
                            <option value="not_to_exceed">Not-to-Exceed</option>
                        </optgroup>
                    </FormSelect>

                </div>
                <div className={styles.dropdownRow}>
                    <label>Purchase for</label>
                    <InputGroup>
                        <FormSelect
                            onChange={(evt) => setNewValidity(evt.target.value)}
                            value={newValidity}
                        >
                            <optgroup>
                                <option key={"0"} value={"0"}>Not Purchasable</option>
                                <option key={"1"} value={"1"}>1 day</option>
                                {validityOptions.map((o, index) => <option key={o} value={o}>{o} days</option>)}
                            </optgroup>
                        </FormSelect>
                    </InputGroup>
                </div>
                <div className={styles.dropdownRow}>
                    <label>Review State</label>
                    <InputGroup>
                        <FormSelect
                            onChange={(evt) => setNewReviewState(evt.target.value)}
                            value={newReviewState}
                        >
                            <option value="">None</option>
                            <option value="in_review">In Review</option>
                            <option value="reviewed">Reviewed</option>
                        </FormSelect>
                    </InputGroup>
                </div>
            </>}

            <button className={styles.ctaButton} onClick={triggerRevert} disabled={working}>Cancel</button>
            {<button className={styles.ctaButton}
                     disabled={!touched2 || working}
                     onClick={handleSaveChanges}>Save Changes</button>}
        </div>;
    }

    if (isPayment) {
        return <>
            <b>Contact us to arrange for a purchase order (PO) or payment</b>
            <table className="table table-bordered">
                <tbody>
                <tr>
                    <th>📞 Phone</th>
                    <td>{TENANT.paymentMethods.phone.number}</td>
                </tr>
                <tr>
                    <th> ✉️ Email</th>
                    <td><a href={`mailto:${TENANT.paymentMethods.email.email}`}>{TENANT.paymentMethods.email.email}</a></td>
                </tr>
                </tbody>
            </table>
            <button className={styles.ctaButton} onClick={() => setIsPayment(false)} disabled={working}>Cancel</button>
        </>
    }

    let formattedDeliveryDay = '';
    if (revision.ShippingItem.length) {
        const grand_lead_time = revision.ShippingItem[0].part_max_lead_time + revision.ShippingItem[0].lead_time_days;
        const deliveryDay = addWorkingDaysUK(new Date(), grand_lead_time + 1);  // start date from tomorrow

        formattedDeliveryDay = new Intl.DateTimeFormat("en-GB", {
            weekday: undefined, //false, //withWeekday ? "long" : undefined,
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(deliveryDay);
    }

    return <div className={styles.cta}>
        {inReview && <>
            <div className={styles.reviewAlert}>
                <div><strong>Our team is reviewing this quote</strong></div>
                It will be completed within one working day
            </div>
        </>}
        {reviewed && !isOrdered && <>
            <div className={styles.reviewedAlert}>
                <div><strong>Review Complete</strong></div>
                This quote has been reviewed
            </div>
        </>}
        {isOrdered && <>
            <div className={styles.reviewedAlert}>
                <div><strong>Order in Progress</strong></div>
                This quote has been ordered
            </div>
        </>}

        {!order.shipping_address_id &&
            <>
                {<AddressManager revision={revision} country={focusedAccount.country3}/>}
            </>}

        {revision.ShippingItem.length > 0 &&
            <>
                <div className={styles.leadHeader}>Lead time</div>

                <div className={styles.leadTime}>
                    <div>{qualityTitle[revision.lowest_quality]}</div>
                    <div>{revision.lead_time_max_part} working days</div>
                    <div>{currencyFormat(revision.total, symbol)}</div>
                </div>

                <div className={styles.leadHeader}>Shipping</div>
                <div>
                    <div className={styles.leadTime}>
                        <div>
                            {revision.ShippingItem[0].name}
                        </div>
                        <div></div>
                        <div>{currencyFormat(revision.shipping_total, symbol)}</div>
                    </div>

                    <div className={styles.deliveryDay}>
                        <div>Estimated Delivery</div>
                        <div><span>{formattedDeliveryDay}</span>{expiry && !isExpired && " if ordered now"}</div>
                        {formattedExpiryDate && <div> Price and lead time valid until {formattedExpiryDate}</div>}
                    </div>
                </div>

                {order.shipping_address_id &&
                    <>
                        <div className={styles.leadHeader}>Ship to</div>
                         <OrderAddressComponent address_id={order.shipping_address_id}/>
                    </>}

                {order.billing_address_id &&
                    <>
                        <div className={styles.leadHeader}>Bill to</div>
                        <OrderAddressComponent address_id={order.billing_address_id}/></>}
            </>
        }



        {/*{revision?.currency !== 'USD' && <button className={styles.ctaButton} onClick={(evt) => triggerRevise('USD')}>USD</button>}*/}

        {!isOrdered && (isExpired || !expiry) && !inReview && !reviewed && order.shipping_address_id &&
            <button className={styles.ctaButton} onClick={handleRequestReview} disabled={working}>Lock in Price and Lead
                Time</button>}

        {!isOrdered && expiry && !isExpired &&
            <>
                <b>Payment</b>
                <button className={styles.ctaButton} onClick={() => setIsPayment(true)}>Email & Phone</button>
                <button className={styles.ctaButton} disabled>Upload a PO</button>
                <button className={styles.ctaButton} disabled>Pay by Card</button>
            </>}

        {isTenantAdmin && <>
            <hr/>

            Admin

            {!order.ordered_revision_id &&
                <button
                    className={styles.adminButton}
                    onClick={triggerBeginRevise} disabled={working}>Revise Price</button>}

            {/*{stateCanMarkReview.includes(version.review_state) &&*/}
            {/*    <button className={styles.ctaButton} onClick={handleMarkReviewed}>Mark Reviewed</button>}*/}
            {/*{version.review_state === 'payment_review' &&*/}
            {/*    <button className={styles.ctaButton} onClick={handlePaymentReceived}>Payment Received</button>}*/}

            {!order.ordered_revision_id &&
                <button
                    className={styles.adminButton} onClick={handleBeginOrder} disabled={working}>Begin Order</button>}
        </>}

    </div>;
}
