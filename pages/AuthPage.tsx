import {Auth, UpdatePassword} from "@supabase/auth-ui-react";
import {ThemeSupa} from "@supabase/auth-ui-shared";
import React, {useEffect} from 'react'
import {useSupabase} from "@hooks/SupabaseProvider";
import {CamyNav} from "@components/CamyNav";
import styles from './AuthPage.module.css';
import {useNavigate} from "react-router-dom";

interface AuthPageProps {
    view: string;
}

export function AuthPage({view}: AuthPageProps) {
    const {supabase, authenticated, loading} = useSupabase();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && authenticated) {
            navigate('/');
        }
    }, [loading, authenticated]);

    return <>
        <CamyNav/>
        <div className="container">
            <div className="row">
                <div className="col-6 offset-3 pt-4">
                    <div className={styles.panel}>
                        <div className="px-4 py-2">
                            <Auth supabaseClient={supabase} appearance={{theme: ThemeSupa}}
                                  view={view}
                                  providers={[]} redirectTo={import.meta.env.VITE_SUPABASE_REDIRECT_TO}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

