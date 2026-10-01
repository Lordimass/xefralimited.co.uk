import Navbar from "react-bootstrap/esm/Navbar";
import {Container, DropdownItem, Nav, NavbarBrand} from "react-bootstrap";
import NavDropdown from "react-bootstrap/NavDropdown"
import Image from "next/image";
import "./Header.css"
import {createClient} from "@/lib/supabase/server";
import {SUPABASE_SCHEMA} from "@/lib/consts";
import {InfoPage} from "@/lib/types";

export async function Header() {
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

    return (<Navbar expand="lg" className={"bg-body-primary"}>
            <Container>
                <NavbarBrand href={"/"}>
                    <Image src={"/logo.webp"} alt={"Xefra Ltd."} width={48} height={48}/> <h2>Staff Hub</h2>
                </NavbarBrand>
                {Object.keys(groupedPages).map(section => <NavDropdown key={section} title={section}>
                    {groupedPages[section].map(title =>
                        <DropdownItem href={`/staff/${section}/${title.title}`} key={title.title}>
                            {title.title}
                        </DropdownItem>
                    )}
                </NavDropdown>)}
            </Container>
        </Navbar>
    );
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