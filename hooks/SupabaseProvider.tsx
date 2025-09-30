import React, {createContext, useContext, useEffect, useState} from 'react'
import {createClient, SupabaseClient} from "@supabase/supabase-js";

const supabaseClient = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

type SupabaseContextType = {
    supabase: SupabaseClient;
    authenticated: boolean;
    loading: boolean;
};

const SupabaseContext = createContext<SupabaseContextType | null>(null);

export const SupabaseProvider = ({children}: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        // Subscribe to auth changes
        const {
            data: {subscription},
        } = supabaseClient.auth.onAuthStateChange((event, session) => {
            if (event === "INITIAL_SESSION") {
                setAuthenticated(session !== null);
            } else if (event === "SIGNED_IN") {
                // This event fires every time the browser tab gains focus.
                // Important not to put the session in the context
                setAuthenticated(true);
            } else if (event === "SIGNED_OUT") {
                setAuthenticated(false);
            } else if (event === "TOKEN_REFRESHED") {
                // pass
                // setAuthenticated(false);
            }
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <SupabaseContext.Provider value={{supabase: supabaseClient, loading, authenticated: authenticated}}>
            {children}
        </SupabaseContext.Provider>
    );
};

export const useSupabase = () => {
    const client = useContext(SupabaseContext);
    if (!client) {
        throw new Error('useSupabaseClient must be used within a SupabaseProvider');
    }
    return client;
};
