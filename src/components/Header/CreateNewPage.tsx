"use client";

import {createRef, useState} from "react";
import NavItem from "react-bootstrap/NavItem";
import Offcanvas from "react-bootstrap/Offcanvas";
import Button from "react-bootstrap/Button";
import {FormControl, FormLabel} from "react-bootstrap";
import {createClient} from "@/lib/supabase/client";
import {SUPABASE_SCHEMA} from "@/lib/consts";

export default function CreateNewPage() {
    const [error, setError] = useState<string>()
    const [showOffCanvas, setShowOffCanvas] = useState(false);
    const handleClose = () => setShowOffCanvas(false);
    const handleShow = () => setShowOffCanvas(true);

    const sectionInputRef = createRef<HTMLInputElement>();
    const titleInputRef = createRef<HTMLInputElement>();

    const supabase = createClient()

    async function submit() {
        const section = sectionInputRef.current!.value
        const title = titleInputRef.current!.value

        // Check if a page with this section and title already exist
        const {data: checkData, error: checkError} = await supabase.schema(SUPABASE_SCHEMA)
            .from("pages")
            .select("id")
            .eq("section", section)
            .eq("title", title)
        if (checkError) {
            console.error(checkError)
            setError(checkError.message)
            return
        } else if (checkData.length > 0) {
            setError("A page with this section and title name already exists!")
            return
        }

        // Create new page
        const {data, error} = await supabase.schema(SUPABASE_SCHEMA)
            .from("pages")
            .upsert({section, title})
        if (error) {
            console.error(error)
            setError(error.message)
        } else {
            window.location.pathname = `/staff/${section}/${title}`
        }
    }

    return (<>
        <NavItem>
            <Button onClick={handleShow}>Create New Page</Button>
        </NavItem>


        <Offcanvas show={showOffCanvas} onHide={handleClose}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Create new page</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <FormLabel>Section</FormLabel>
                <FormControl ref={sectionInputRef}/>
                <br/>
                <FormLabel>Title</FormLabel>
                <FormControl ref={titleInputRef}/>
                <br/>
                <Button onClick={submit}>Create</Button>
                {error ? <p>{error}</p> : null}
            </Offcanvas.Body>
        </Offcanvas>
    </>)
}