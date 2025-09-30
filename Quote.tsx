import React, {useEffect, useState} from 'react'
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Route, Routes, useNavigate, useParams} from 'react-router-dom';
import {NewQuotePage} from './pages/NewQuotePage';
import {SupabaseProvider, useSupabase} from "./hooks/SupabaseProvider";
import {RendererProvider} from "./hooks/RendererProvider";
import {AuthPage} from "./pages/AuthPage";
import {ListPage} from "./pages/ListPage";
import {CompleteProfilePage} from "./pages/CompleteProfilePage";
import {AccountsProvider} from "./hooks/AccountsProvider";
import {OrderPage} from "./pages/OrderPage";

import './style-quote.scss';


function ListPageRemount({isOrder}) {
    const {account} = useParams();
    // force remount on version change
    return <ListPage key={account}/>
}

function NewQuotePageRemount({}) {
    const {spec} = useParams();
    // force remount on spec change
    return <NewQuotePage key={spec}/>
}

function RedirectToAccountPage() {
    const navigate = useNavigate();
    const {supabase} = useSupabase();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const {data, error} = await supabase.rpc('get_accounts');

            if (error?.code === "42501") {
                await supabase.auth.signOut();

                // permission denied. user is not authenticated
                navigate(`/new`, {replace: true});
                return null;
            }

            if (error) {
                console.error('Error fetching accounts:', error);
                return null;
            }

            if (data.length === 0) {
                // needs to complete profile.
                navigate(`/complete_profile`, {replace: true});
                return;
            }

            const defaultAccount = data[0];
            navigate(`/a/${defaultAccount.account_id}/new`, {replace: true});
        }
        fetchData();
    }, []);

    return null;
}

function AppRoutes() {
    // const location = useLocation();
    //
    // useEffect(() => {
    //     console.log("Route changed:", location.pathname, location.search, location.hash);
    // }, [location]);

    return (
        <Routes>
            <Route path="/" element={<RedirectToAccountPage/>}/>

            <Route path="/sign_in" element={<AuthPage view={'sign_in'}/>}/>
            <Route path="/update_password" element={<AuthPage view={'update_password'}/>}/>

            <Route path="/complete_profile" element={<CompleteProfilePage/>}/>

            <Route path="/new" element={<NewQuotePageRemount/>}/>
            <Route path="/new/:spec" element={<NewQuotePageRemount/>}/>

            <Route path="/a/:account/new" element={<NewQuotePageRemount/>}/>
            <Route path="/a/:account/new/:spec" element={<NewQuotePageRemount/>}/>

            <Route path="/a/:account/order/:order" element={<OrderPage/>}/>
            <Route path="/a/:account/order/:order/version/:version" element={<OrderPage/>}/>
            <Route path="/a/:account/order/:order/version/:version/:rev" element={<OrderPage/>}/>

            <Route path="/a/:account/quotes" element={<ListPageRemount isOrder={false}/>}/>
            <Route path="/a/:account/orders" element={<ListPageRemount isOrder={true}/>}/>
        </Routes>
    );
}

function App() {
    return (
        <React.StrictMode>
            <SupabaseProvider>
                <AccountsProvider>
                    <RendererProvider>
                        <BrowserRouter basename={import.meta.env.VITE_ROUTER_BASENAME} future={{
                            v7_startTransition: true,
                            v7_relativeSplatPath: true,
                        }}>
                            <AppRoutes/>
                        </BrowserRouter>
                    </RendererProvider>
                </AccountsProvider>
            </SupabaseProvider>
        </React.StrictMode>
    );
}

export function bootstrap() {
    const container = document.getElementById('reactApp');
    const root = createRoot(container);
    root.render(
        <App/>
    );
}

bootstrap();

