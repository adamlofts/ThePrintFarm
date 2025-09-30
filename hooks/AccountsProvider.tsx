import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import {useSupabase} from "./SupabaseProvider";
import {useNavigate, useParams} from "react-router-dom";
import {Account, getTenantId} from "@api/api";

type AccountsContextType = {
    loading: boolean;
    accounts: Account[];
    tenants: string[];

    loadAccountId: (id: string) => void;
    findAccountById: (id: string) => {
        account: Account;
        isTenantAdmin: boolean;
    } | null;
};

type AccountsProviderType = {
    loading: boolean;
    accounts: Account[];  // my accounts
    focusedAccount: Account;
    isTenantAdmin: boolean;
    tenants: string[];
};

const AccountsContext = createContext<AccountsContextType | null>(null);

const pendingAccountIds = {};

export function AccountsProvider({children}: { children: React.ReactNode }) {
    const {supabase, authenticated, loading: supabaseLoading} = useSupabase();

    // base
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);

    // extra
    const [extraAccounts, setExtraAccounts] = useState([]);

    useEffect(() => {
        if (!authenticated || supabaseLoading) {
            return;
        }

        let isMounted = true;
        const fetchAccounts = async () => {
            const [{data: data1, error: error1}, {data: data2, error: error2}] = await Promise.all([
                supabase.rpc("get_accounts"),
                supabase.rpc("get_tenants")
            ]);

            if (!isMounted) {
                return;
            }
            if (error1 || error2) {
                console.error(`Error fetching accounts: ${error1} ${error2}`);
                return;
            }

            const newAccounts: Account[] = data1;

            if (!newAccounts.length) {
                // never complete loading. works for complete profile page.
                return;
            }

            const personalAccount = newAccounts.find((a) => a.personal_account);
            if (personalAccount.tenant_id !== getTenantId()) {
                // fixme: Redirect
                console.error(`Tenant mismatch ${getTenantId()}`);
                console.error(personalAccount);

                await supabase.auth.signOut();
                return;
            }

            setAccounts(newAccounts);

            const newTenants: string[] = data2;
            setTenants(newTenants);

            for (const account of newAccounts) {
                delete pendingAccountIds[account.account_id];
            }

            const newExtraAccounts = [];
            for (const pendingAccountId in pendingAccountIds) {
                const {data: data3, error: error3} = await supabase.rpc('get_account', {account_id: pendingAccountId});
                newExtraAccounts.push(data3);
            }
            setExtraAccounts(newExtraAccounts);
            setLoading(false);
        };
        setLoading(true);
        fetchAccounts();

        return () => {
            isMounted = false;
        };
    }, [authenticated, supabaseLoading]);

    const handleAccountId = useCallback((accountId: string) => {
        pendingAccountIds[accountId] = true;
    }, []);

    const handleFindAccount = useCallback((accountId: string) => {
        const match = accounts.find((a) => a.account_id === accountId);
        if (match) {
            return {
                account: match,
                isTenantAdmin: false,
            };
        }
        return {
            account: extraAccounts.find((a) => a.account_id == accountId),
            isTenantAdmin: true,
        }
    }, [accounts, extraAccounts]);

    return (
        <AccountsContext.Provider
            value={{
                loading,
                accounts,
                tenants,
                findAccountById: handleFindAccount,
                loadAccountId: handleAccountId,
            }}
        >
            {children}
        </AccountsContext.Provider>
    );
}

export function useAccountsAndTenantAdmin(): AccountsProviderType {
    const {account: focusedAccountId} = useParams();
    const ctx = useContext(AccountsContext);
    if (!ctx) throw new Error("useAccountsAndTenantAdmin must be used within AccountsProvider");

    if (focusedAccountId) {
        ctx.loadAccountId(focusedAccountId);
    }

    if (ctx.loading) {
        return {
            accounts: [],
            focusedAccount: null,
            loading: true,
            isTenantAdmin: false,
            tenants: [],
        };
    }

    const {account: focusedAccount, isTenantAdmin} = ctx.findAccountById(focusedAccountId);
    return {
        accounts: ctx.accounts,
        loading: false,
        focusedAccount: focusedAccount,
        isTenantAdmin: ctx.tenants.length > 0 && ctx.tenants.some((t) => t.tenant_id === focusedAccount?.tenant_id),
        tenants: ctx.tenants,
    };
}
