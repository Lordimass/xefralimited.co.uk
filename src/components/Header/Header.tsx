import Navbar from "react-bootstrap/esm/Navbar";
import {Container, DropdownItem, NavbarBrand, NavbarToggle} from "react-bootstrap";
import NavDropdown from "react-bootstrap/NavDropdown"
import Image from "next/image";
import NavbarCollapse from "react-bootstrap/NavbarCollapse"
import "./Header.css"
import {createClient, getUserProfile} from "@/lib/supabase/server";
import {PERMISSIONS, SUPABASE_SCHEMA} from "@/lib/consts";
import {InfoPage} from "@/lib/types";
import CreateNewPage from "@/components/Header/CreateNewPage";

export async function Header() {

    // Fetch and group pages
    const supabase = await createClient();
    const {data, error} = await supabase.schema(SUPABASE_SCHEMA)
        .from("pages")
        .select("*")
    if (error) {
        console.error(error);
    }
    const pages: InfoPage[] = data ?? []
    const groupedPages: {[key: string]: {title: string, content: string}[]} = {}
    for (let page of pages) {
        const section = groupedPages[page.section] || []
        section.push({title: page.title, content: page.content})
        groupedPages[page.section] = section
    }

    // Check if user is an editor
    const profile = (await getUserProfile(supabase))!
    const isEditor = profile.permissions.includes(PERMISSIONS.pages.write)
        || profile.permissions.includes(PERMISSIONS.admin)

    return (<><Navbar expand="lg" className={"bg-body-primary"}>
            <Container>
                <NavbarBrand href={"/"}>
                    <Image src={"/logo.webp"} alt={"Xefra Ltd."} width={48} height={48}/> <h2>Staff Hub</h2>
                </NavbarBrand>
                <NavbarToggle aria-controls="responsive-navbar-nav" />
                <NavbarCollapse id="responsive-navbar-nav">
                    {Object.keys(groupedPages).map(section => <NavDropdown key={section} title={section}>
                        {groupedPages[section].map(title =>
                            <DropdownItem href={`/staff/${section}/${title.title}`} key={title.title}>
                                {title.title}
                            </DropdownItem>
                        )}
                    </NavDropdown>)}
                    {isEditor ? <CreateNewPage/> : null}
                </NavbarCollapse>
            </Container>
        </Navbar>
    </>);
}

export function BlankHeader() {
    return (<Navbar expand="lg" className={"bg-body-primary"}>
            <Container>
                <NavbarBrand href={"/"}>
                    <Image src={"/logo.webp"} alt={"Xefra Ltd."} width={48} height={48}/> <h2>Staff Hub</h2>
                </NavbarBrand>
            </Container>
        </Navbar>
    );
}