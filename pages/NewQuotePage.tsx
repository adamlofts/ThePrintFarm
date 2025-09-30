import React, {useEffect, useRef, useState} from 'react';
import {FileForm,} from '@components/EmbedForm';

import styles from './NewQuotePage.module.css';
import {useSupabase} from "@hooks/SupabaseProvider";
import {useAccountsAndTenantAdmin} from "@hooks/AccountsProvider";
import {CamyNav} from "@components/CamyNav";
import {useNavigate, useParams} from 'react-router-dom';
import {defaultSpec} from "../api/api";
import {allSpecTypes} from "../api/types";
import {FileDropForm} from "@components/FileDropForm";
import {Footer} from "@components/Footer";

export function NewQuotePage() {
    const dropTargetRef = useRef<HTMLDivElement>(null);

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

    const newQuoteHandler = ({account_id, order_id}) => {
        navigate(`/a/${account_id}/order/${order_id}`);
    }

    const spec = defaultSpec('3dp');

    return <>
        <CamyNav/>
        <div className={styles.bg} ref={dropTargetRef}>
            <div className="container py-5 mb-5">
                <FileDropForm
                    spec={spec}
                    specType={specType}
                    onNewQuote={newQuoteHandler}
                    account_id={focusedAccount?.account_id}
                    dropTargetElmt={dropTargetRef.current}
                />
            </div>
        </div>
    </>
}
