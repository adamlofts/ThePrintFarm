import React, {useEffect, useState} from 'react';

import styles from './NewQuotePage.module.css';
import {useSupabase} from "@hooks/SupabaseProvider";
import {getTenantId, useAccountsAndTenantAdmin} from "@hooks/AccountsProvider";
import {CamyNav} from "@components/CamyNav";
import {useNavigate, useParams} from 'react-router-dom';
import {EmbedForm} from "../components/EmbedForm";
import {allSpecTypes} from "../api/types";

export function NewQuotePage() {
    const {spec: paramSpec} = useParams();
    const {supabase, loading: supabaseLoading, authenticated} = useSupabase();
    const {focusedAccount, loading: accountLoading} = useAccountsAndTenantAdmin();
    const navigate = useNavigate();
    const [specType, setSpecType] = useState(paramSpec || allSpecTypes[0]);

    // If the user is authenticated but we are visiting this page WITHOUT an account param
    // then redirect to / to either complete profile or get back here WITH an account param.
    useEffect(() => {
        if (supabaseLoading || accountLoading) {
            return;
        }
        if (!authenticated || focusedAccount) {
            return;
        }
        navigate('/');
    }, [authenticated, supabaseLoading, accountLoading]);

    const triggerSpecTypeChange = (newSpecType: string)=> {
        if (focusedAccount) {
            navigate(`/a/${focusedAccount.account_id}/new/${newSpecType}`, {replace: true});
        } else{
            navigate(`/new/${newSpecType}`, {replace: true});
        }
    }

    const newQuoteHandler = ({account_id, order_id}) => {
        navigate(`/a/${account_id}/order/${order_id}`);
    }

    return <>
        <CamyNav/>
        <div className={styles.bg}>
            <div className="container py-5 mb-5">
                <div className="row">
                    <div className="col-12">
                        <div className={styles.panel}>
                            <EmbedForm
                                specType={specType} setSpecType={triggerSpecTypeChange}
                                onNewQuote={newQuoteHandler} specTypes={allSpecTypes}
                                account_id={focusedAccount?.account_id}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}
