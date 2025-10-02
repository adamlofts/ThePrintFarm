import React, {useState} from 'react'
import styles from './EmbedForm.module.css';
import {crossSpecAndFiles, quote} from "@api/api";
import {useSupabase} from "@hooks/SupabaseProvider";
import {Auth} from "@supabase/auth-ui-react";
import {ThemeSupa} from "@supabase/auth-ui-shared";
import {FileDropWrapper} from "./ui/FileDropWrapper";

export function FileDropForm({spec, specType, onNewQuote, account_id, dropTargetElmt}) {
    const {supabase, loading: supabaseLoading, authenticated} = useSupabase();
    const [working, setWorking] = useState(false);
    const [error, setError] = useState('');
    const [valid, setValid] = useState(true);

    async function trigger(newFiles: any[]) {
        setWorking(true);

        const specs = {};
        let i = 0;
        for (const appendSpec of await crossSpecAndFiles(specType, spec, newFiles)) {
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


    const disabled = !account_id || !authenticated || !valid || working;

    return <>
        <FileDropWrapper targetElement={dropTargetElmt} onFilesDropped={trigger}>
            {(hover) => (
                <div className={`${styles.panel} ${hover ? styles.hover : ''}`}>

                    {!authenticated &&
                        <div className={styles.panelTop}>
                            <b>Sign Up or Sign In to Get a Quote</b>

                            <Auth supabaseClient={supabase} appearance={{theme: ThemeSupa}}
                                  view={'sign_up'}
                                  providers={[]} redirectTo={import.meta.env.VITE_SUPABASE_REDIRECT_TO}/>
                        </div>}

                    <div className={styles.files}>

                        <div className={styles.docs}>
                            <div className={styles.doc}>
                                <img
                                    src={`${import.meta.env.BASE_URL}assets/doc.svg`}/>
                                <span>.STL</span>
                            </div>
                            <div className={styles.doc}>
                                <img
                                    src={`${import.meta.env.BASE_URL}assets/doc.svg`}/>
                                <span>.PLY</span>
                            </div>
                            <div className={styles.doc}>
                                <img
                                    src={`${import.meta.env.BASE_URL}assets/doc.svg`}/>
                                <span>.3MF</span>
                            </div>
                        </div>

                        Drop 5 files here to get started
                        <div>or</div>
                        <input
                            type="file"
                            // ref={inputRef}
                            onChange={evt => trigger(evt.target.files)}
                            multiple
                        />

                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    {/*<div className={styles.actionButtons}>*/}
                    {/*    {!working &&*/}
                    {/*        <button className="btn btn-primary btn-lg" onClick={trigger} disabled={disabled}>Get*/}
                    {/*            Quote</button>}*/}
                    {/*    {working && <button className="btn btn-primary btn-lg" type="button" disabled>*/}
                    {/*                <span className="spinner-grow spinner-grow-sm" role="status"*/}
                    {/*                      aria-hidden="true"></span>*/}
                    {/*        &nbsp;Working...</button>}*/}

                    {/*</div>*/}
                </div>
            )}</FileDropWrapper>
    </>;
}
