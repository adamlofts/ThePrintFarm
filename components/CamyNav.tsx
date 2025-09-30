import React, {useEffect, useState} from 'react';
import {useAccountsAndTenantAdmin} from "@hooks/AccountsProvider";
import {useSupabase} from "@hooks/SupabaseProvider";
import {useNavigate} from "react-router-dom";
import {Container, Dropdown, DropdownButton, DropdownHeader, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {CreateTeamModal} from "./CreateTeamModal";
import {createTeam} from "@api/api";


interface CamyNavProps {
}

function CamyLink({onClick, children, href}) {
    return <Nav.Link  href={href} onClick={onClick}>{children}</Nav.Link>
}

export function CamyNav({}: CamyNavProps) {
    const {accounts, focusedAccount, isTenantAdmin, loading, tenants} = useAccountsAndTenantAdmin();
    const {supabase, authenticated} = useSupabase();
    const navigate = useNavigate();
    const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);

    const handleLogOut = async () => {
        const {error} = await supabase.auth.signOut();
        navigate('/');
    };

    const handleSetAccount = (newAccount) => {
        navigate(`/a/${newAccount.account_id}/quotes`);
    };

    const handleCreateTeam = async (teamName: string) => {
        const {account_id: newTeamId} = await createTeam(supabase, teamName);
        // redirect because account list is out of date
        window.location.assign(`/quote/a/${newTeamId}/quotes`);
    };

    const personalAccount = accounts.find((a) => a.personal_account);
    const teams = accounts.filter((a) => !a.personal_account);

    const tenant = tenants.find((t) => t.tenant_id === focusedAccount?.tenant_id);

    return <>
    {isTenantAdmin &&
        <Navbar expand="sm" className="bg-body-secondary">
            <Container fluid={true}>
                <Navbar.Brand href={import.meta.env.VITE_ROUTER_BASENAME}>CamyPro</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <span>Admin for {tenant.name}</span>
                    </Nav>
                    {<Nav>
                        {tenants.length > 0 &&
                            <NavDropdown title="Owner" align={"end"}>
                                {tenants.map(t => <NavDropdown.Item key={t.tenant_id}>{t.name}</NavDropdown.Item>)}
                            </NavDropdown>}
                        <Nav.Link>Settings</Nav.Link>
                        {authenticated && <Nav.Link onClick={handleLogOut}>Log Out</Nav.Link>}
                    </Nav>}
                </Navbar.Collapse>
            </Container>
        </Navbar>}

        <Navbar expand="sm" className="bg-body-tertiary"
        >
            <Container fluid={true}>
                {!isTenantAdmin &&
                <>
                    {/*{brand.logo && <Navbar.Brand href={import.meta.env.VITE_ROUTER_BASENAME}>*/}
                    {/*    <img src={brand.logo} style={{height: brand.logoHeight}}/></Navbar.Brand>}*/}
                    <Navbar.Brand href={import.meta.env.VITE_ROUTER_BASENAME}>ThePrintFarm</Navbar.Brand>
                </>}
                {isTenantAdmin && <Navbar.Brand>Customer: <b>{focusedAccount.name}</b></Navbar.Brand>}
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto"/>
                    {<Nav>
                        {authenticated && focusedAccount && <>
                            <CamyLink href={`${import.meta.env.VITE_ROUTER_BASENAME}a/${focusedAccount.account_id}/orders`}>Orders</CamyLink>
                            <CamyLink href={`${import.meta.env.VITE_ROUTER_BASENAME}a/${focusedAccount.account_id}/quotes`}>Quotes</CamyLink>
                            <CamyLink href={`${import.meta.env.VITE_ROUTER_BASENAME}a/${focusedAccount.account_id}/new`}>New Quote</CamyLink>
                        </>}
                        {focusedAccount && !isTenantAdmin &&
                            <DropdownButton title={`${focusedAccount.name}`} variant="1" align={"end"}>
                                {personalAccount && <>
                                    <DropdownHeader>Personal</DropdownHeader>
                                    <Dropdown.Item
                                        onClick={() => handleSetAccount(personalAccount)}>{personalAccount.name}</Dropdown.Item>
                                </>}
                                <Dropdown.Divider/>
                                <DropdownHeader>Teams</DropdownHeader>
                                {teams.map((a) => <Dropdown.Item key={a.account_id}
                                                                 onClick={() => handleSetAccount(a)}>{a.name}</Dropdown.Item>)}
                                <Dropdown.Item onClick={() => setShowCreateTeamModal(true)}>Create...</Dropdown.Item>
                                <Dropdown.Divider/>
                                <Dropdown.Item onClick={handleLogOut}>Log Out</Dropdown.Item>
                            </DropdownButton>
                        }

                    </Nav>}
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <CreateTeamModal show={showCreateTeamModal}
                         onCreate={handleCreateTeam}
                         onHide={() => setShowCreateTeamModal(false)}/>
    </>
}
