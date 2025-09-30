import React, {useState} from 'react'
import styles from './EmbedForm.module.css';
import {defaultSpec,} from "@api/api";
import {useSupabase} from "@hooks/SupabaseProvider";
import {Auth} from "@supabase/auth-ui-react";
import {ThemeSupa} from "@supabase/auth-ui-shared";
import {SpecDropdown} from "./SpecDropdown";
import {FormDispatch} from "./PartDispatch";
import type {SpecAny} from "@api/types";
import {crossSpecAndFiles ,quote} from "@api/api";

export function EmbedForm({specType, setSpecType, onNewQuote, specTypes, account_id}) {
    const {supabase, loading: supabaseLoading, authenticated} = useSupabase();
    const [spec, setSpec] = useState<SpecAny>(defaultSpec(specType));
    const [files, setFiles] = useState([]);
    const [working, setWorking] = useState(false);
    const [error, setError] = useState('');
    const [valid, setValid] = useState(true);
    const needsFiles = ['3dp', 'laminate_sheet'].includes(spec.type);

    const triggerSpecChange = (changed: boolean, newSpec: SpecAny, newValid: boolean) => {
        setSpec(newSpec);
        setValid(newValid);
    }

    const handleFilesChange = (newFiles: any[]) => {
        setFiles(newFiles);
    };

    async function trigger() {
        setWorking(true);

        const specs = {};
        let i = 0;
        for (const appendSpec of await crossSpecAndFiles(specType, spec, files)) {
            specs[i] = appendSpec;
            i++;
        }

        let resp;
        try {
            resp = await quote(supabase, {
                revision_id: '',
                newVersion: false,
                specs: specs,
                account_id: account_id,

                new_shipping_address: null,
                new_billing_address: null,

                new_validity: -1,
                new_price_quality: '',
                new_order_review_state: '',
            });
        } catch (e) {
            setWorking(false);
            setError("Failed to generate quote");
            return;
        }

        onNewQuote(resp);
    }


    const disabled = !account_id || !authenticated || !valid || (needsFiles && files.length === 0) || working;

    return <>
        {!authenticated &&
            <div className={styles.panelTop}>
                <b>Sign Up or Sign In to Get a Quote</b>

                <Auth supabaseClient={supabase} appearance={{theme: ThemeSupa}}
                      view={'sign_up'}
                      providers={[]} redirectTo={import.meta.env.VITE_SUPABASE_REDIRECT_TO}/>
            </div>}

        <div className={styles.productRow}>
            Quote for
            <SpecDropdown selection={specType} onChange={setSpecType} specTypes={specTypes}/>
        </div>

        <FormDispatch initial={spec} onSpecChange={triggerSpecChange} symbol={''} isNew={true}
                      setFiles={handleFilesChange}/>

        <div className={styles.error}>{error}</div>

        <div className={styles.actionButtons}>
            {!working &&
                <button className="btn btn-primary btn-lg" onClick={trigger} disabled={disabled}>Get Quote</button>}
            {working && <button className="btn btn-primary btn-lg" type="button" disabled>
                                    <span className="spinner-grow spinner-grow-sm" role="status"
                                          aria-hidden="true"></span>
                &nbsp;Working...</button>}

        </div>
    </>;
}

