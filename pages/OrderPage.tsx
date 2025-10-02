import React, {useEffect, useState} from 'react';
import {useLocation, useParams} from 'react-router-dom';
import {OrderHeaderComponent} from '@components/OrderHeaderComponent';
import {
    Currency,
    defaultSpec,
    Item,
    OrderWithVersions,
    PriceQuality,
    resolvedLeadTime,
    ReviewState,
    reviseQuote,
    RevisionWithRelations,
    SpecAny,
    SpecManual
} from '@api/api';
import {RevisionComponent} from "@components/RevisionComponent";
import {useSupabase} from "@hooks/SupabaseProvider";
import styles from "./OrderPage.module.css";
import {useAccountsAndTenantAdmin} from "@hooks/AccountsProvider";
import {CamyNav} from "@components/CamyNav";
import {SpecDropdown} from "@components/SpecDropdown";
import {OrderCTA} from "@components/OrderCTA";
import {FormDispatch} from "../components/PartDispatch";
import {allSpecTypes} from "../api/types";
import {Footer} from "@components/Footer";


const useQuery = () => new URLSearchParams(useLocation().search);


interface OrderComponentProps {
    orderId: string;
    versionId: string;
    revisionId: string;
    onNewRevision: (newRevisionId: string) => void;
}

function OrderComponent({orderId, versionId, revisionId, onNewRevision}: OrderComponentProps) {
    const {isTenantAdmin, focusedAccount} = useAccountsAndTenantAdmin();

    const {supabase, loading} = useSupabase();
    const query = useQuery();

    const [order, setOrder] = useState();
    const [version, setVersion] = useState();
    const [revision, setRevision] = useState<RevisionWithRelations>(null);

    const [touchedSpec, setTouchedSpec] = useState<any>({});
    const [touched, setTouched] = useState(false);

    const [appendSpecs, setAppendSpecs] = useState<SpecAny>([]);
    const [touchedAppendSpecs, setTouchedAppendSpecs] = useState<SpecAny>([]);
    const [appendSpecsFiles, setAppendSpecsFiles] = useState({});  // index -> [files]
    const [editIndexes, setEditIndexes] = useState<number[]>([]);
    const [removeIndexes, setRemoveIndexes] = useState<number[]>([]);
    const [manualPriceSpecs, setManualPriceSpecs] = useState({});  // index -> ManualSpec
    const [isRevising, setIsRevising] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            while (isMounted) {
                let {data, error} = await supabase
                    .from('Order')
                    .select('*, Version!Version_order_id_fkey(*)')
                    .eq('id', orderId)
                    .order('index', {referencedTable: 'Version', ascending: true})
                    .single();
                const newOrder: OrderWithVersions = data;
                setOrder(newOrder);

                if (!isMounted) break;

                const focusedVersionId = versionId || newOrder.latest_version;
                const newVersion = newOrder.Version.find((v) => v.id == focusedVersionId);
                setVersion(newVersion);

                ({data, error} = await supabase
                    .from('Revision')
                    .select('*, Part(*, Item(*)), OrderAddress(*), ShippingItem(*)')
                    .eq('id', newVersion.latest_revision)
                    .order('index', {referencedTable: 'Part'})
                    .single());
                if (!isMounted) break;
                const newRevision: RevisionWithRelations = data;

                setRevision(newRevision);

                if (newRevision.result_at) {
                    break; // Stop polling once revision is loaded
                }

                await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1s before retry
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [orderId, revisionId]);

    const handleSpecChange = async (index: number, newTouched: boolean, partType: string, newSpec: any, triggerRevise: boolean) => {
        const newTouchedSpec = {
            ...touchedSpec,
            [index]: {
                ...newSpec,
                type: partType,
            },
        };

        setTouchedSpec(newTouchedSpec);
        setTouched(newTouched);

        if (triggerRevise) {
            const newRevisionId = await reviseQuote(
                supabase,
                revision,
                newTouchedSpec,
                touchedAppendSpecs,
                appendSpecsFiles,
                isTenantAdmin,
                manualPriceSpecs,
                '', '', -1,
                '');

            setEditIndexes([]);
            setRemoveIndexes([]);
            setAppendSpecs([]);
            setAppendSpecsFiles({});
            setTouchedAppendSpecs([]);
            setTouched(false);
            setTouchedSpec({});
            setManualPriceSpecs([]);
            setIsRevising(false);

            onNewRevision(newRevisionId);
        }
    };

    const handleTriggerRemove = (partIndex: number) => {
        setIsRevising(true);
        setRemoveIndexes([...removeIndexes, partIndex]);
        handleSpecChange(partIndex, true, 'remove', {});
    };

    const handleTriggerEdit = (index: number) => {
        setIsRevising(true);
        setEditIndexes([...editIndexes, index]);
    };

    const handleTriggerManualPrice = (index: number) => {
        setIsRevising(true);

        const part = revision.Part[index];
        setManualPriceSpecs({
            ...manualPriceSpecs,
            [index]: {
                name: part.name,
                items: part.Item.map((pitem: Item) => {
                    return {
                        quantity: pitem.quantity,
                        unit_price: pitem.unit_price,
                        name: pitem.name,
                        lead_time_days: resolvedLeadTime(part.Item, pitem),
                    };
                }),
                type: 'manual',
                subspec_type: part.subspec_type || part.type,
                subspec_id: part.subspec_id || part.spec_id,

                price_quality: 'fixed_price',
                validity_days: 30,
            }
        });
        setTouched(true);
    };

    const handleRevert = () => {
        setEditIndexes([]);
        setRemoveIndexes([]);
        setAppendSpecs([]);
        setTouchedAppendSpecs([]);
        setAppendSpecsFiles({});
        setManualPriceSpecs([]);
        setIsRevising(false);
    };

    const handleRevise = async (currency: Currency | '', quality: PriceQuality, newValidity: number,
                                newOrderReviewState: ReviewState | '') => {
        const newRevisionId = await reviseQuote(supabase,
            revision,
            touchedSpec,
            touchedAppendSpecs,
            appendSpecsFiles,
            isTenantAdmin,
            manualPriceSpecs,
            currency, quality, newValidity,
            newOrderReviewState);

        setEditIndexes([]);
        setRemoveIndexes([]);
        setAppendSpecs([]);
        setAppendSpecsFiles({});
        setTouchedAppendSpecs([]);
        setTouched(false);
        setTouchedSpec({});
        setManualPriceSpecs([]);
        setIsRevising(false);

        onNewRevision(newRevisionId);
    }

    const handleAppend = (newSpec) => {
        setAppendSpecs([...appendSpecs, newSpec]);
        setTouchedAppendSpecs([...touchedAppendSpecs, newSpec]);
        setTouched(true);
        setIsRevising(true);
    }

    const handleAppendSpecChange = (index, newSpec) => {
        const copy = [...touchedAppendSpecs];
        copy[index] = newSpec;
        setTouchedAppendSpecs(copy)
        setTouched(true);
    };

    const handleAppendSpecFiles = (index, files) => {
        setAppendSpecsFiles({
            ...appendSpecsFiles,
            [index]: files,
        });
    };

    const handleUpdateManualPriceSpec = (index: number, newSpec: SpecManual) => {
        const part = revision.Part[index];

        setManualPriceSpecs({
            ...manualPriceSpecs,
            [index]: {
                ...newSpec,
                type: 'manual',

                subspec_type: part.subspec_type || part.type,
                subspec_id: part.subspec_id || part.spec_id,
            },
        });
    }


    const handleAddTube = (newSpecType: string) => {
        handleAppend(defaultSpec(newSpecType));
    }

    const handleAddManual = () => {
        const specManual: SpecManual = {
            name: 'Manual Part',
            items: [{
                quantity: 1,
                unit_price: 100,
                name: 'New Item',
                lead_time_days: 5,
            }],
            subspec_type: '',
            subspec_id: '',
            type: 'manual',
            validity_days: 30,
            price_quality: 'fixed_price',
        }
        handleAppend(specManual);
    }

    const handleBeginRevise = () => {
        setIsRevising(true);
    }

    const symbol = {
        'USD': '$',
        'GBP': '£',
    }[revision?.currency];

    const revisionResult = !!revision?.result_at;
    const inReviewAndNotAdmin = (version?.review_state === 'in_review' || version?.review_state === 'reviewed') && !isTenantAdmin;
    const readOnly = !!order?.ordered_at || inReviewAndNotAdmin;


    return <>
        <div className={`${styles.mainColumn} ${revisionResult ? '' : styles.mainColumnLoading}`}>
            {false && order && revision &&
                <OrderHeaderComponent order={order} version={version} revision={revision}/>}

            {!revisionResult && <div className={styles.panelWipe}>

                Calculating…</div>}

            {revisionResult && <RevisionComponent
                readOnly={readOnly}
                revision={revision}
                onSpecChange={handleSpecChange}
                editIndexes={editIndexes}
                removeIndexes={removeIndexes}
                triggerEdit={handleTriggerEdit}
                triggerRemove={handleTriggerRemove}
                triggerManualPrice={handleTriggerManualPrice}
                manualPriceSpecs={manualPriceSpecs}
                isEdit={isRevising}
                updateManualPriceSpec={handleUpdateManualPriceSpec}
            />}

            {appendSpecs.map((spec, index) =>
                <div key={index} className={styles.appendFrame}>
                    <FormDispatch initial={spec}
                                  onSpecChange={(touched, newSpec) => handleAppendSpecChange(index, newSpec)}
                                  symbol={symbol} isNew={true}
                                  setFiles={files => handleAppendSpecFiles(index, files)}
                    ></FormDispatch>
                </div>)}

            {revisionResult && !readOnly && <div className={styles.appendButtons}>
                <SpecDropdown onChange={handleAddTube} specTypes={allSpecTypes}/>

                {isTenantAdmin &&
                    <button className={styles.adminButton} onClick={handleAddManual}>Add New Manual</button>}
            </div>}
        </div>

        <div className={styles.stickyColumn}>
            <div className={styles.stickySpacer}></div>
            <div className={styles.stickyContainer}>
                <div className={styles.sticky}>
                    {version && revision && revisionResult && <OrderCTA
                        key={revision.id}
                        order={order} version={version} revision={revision} touched={touched}
                        isEdit={isRevising}
                        triggerRevert={handleRevert}
                        triggerRevise={handleRevise}
                        triggerBeginRevise={handleBeginRevise}
                    ></OrderCTA>}
                </div>
            </div>
        </div>
    </>
}


export function OrderPage({}) {
    const {order: orderId, version: versionId, rev: rev} = useParams();
    const [revisionId, setRevisionId] = useState('');

    // If the revision parameter changes in navigate, then change the displayed revision id
    useEffect(() => {
        if (!rev) {
            return;
        }
        setRevisionId(rev);
    }, [rev]);

    return <>
        <CamyNav/>
        <div className={styles.container}>
            <div className="row gx-0">
                <OrderComponent
                    orderId={orderId} versionId={versionId} revisionId={revisionId} onNewRevision={setRevisionId}/>
            </div>
        </div>
        <Footer/>
    </>
}
