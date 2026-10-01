"use client";

import {
    BlockTypeSelect,
    BoldItalicUnderlineToggles, CreateLink, diffSourcePlugin, DiffSourceToggleWrapper,
    headingsPlugin, InsertTable,
    listsPlugin, ListsToggle,
    markdownShortcutPlugin,
    MDXEditor, MDXEditorMethods,
    quotePlugin, Separator, tablePlugin,
    thematicBreakPlugin, toolbarPlugin, UndoRedo
} from "@mdxeditor/editor";
import Button from "react-bootstrap/Button";
import {InfoPage} from "@/lib/types";
import {useRef} from "react";
import {createClient} from "@/lib/supabase/client";
import {SUPABASE_SCHEMA} from "@/lib/consts";
import {FormControl} from "react-bootstrap";

export default function Content({page, editable}: { page: InfoPage, editable: boolean }) {

    const editorRef = useRef<MDXEditorMethods>(null);
    const pageSectionInputRef = useRef<HTMLInputElement>(null);
    const pageTitleInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient()

    const sectionTitleEditable = !(page.section === "Home" && page.title === "Welcome")

    async function save() {
        const mdx = editorRef.current!
        const pageSectionInput = pageSectionInputRef.current!
        const pageTitleInput = pageTitleInputRef.current!
        const newData = {
            ...page,
            title: pageTitleInput.value,
            section: pageSectionInput.value,
            content: mdx.getMarkdown()
        }
        const {data, error} = await supabase.schema(SUPABASE_SCHEMA)
            .from("pages")
            .upsert(newData)
            .eq("id", page.id)
        if (error) {
            console.error(error);
            return
        }
        window.location.pathname = `/staff/${pageSectionInput.value}/${pageTitleInput.value}`
    }

    return <>
        <div id={"save-button-container"} style={!editable ? {display: "none"} : undefined}>
            <FormControl id={"page-section-input"}
                         defaultValue={page.section}
                         ref={pageSectionInputRef}
                         disabled={!sectionTitleEditable}
            />
            <span id={"save-button-container-separator"}>/</span>
            <FormControl id={"page-title-input"}
                         defaultValue={page.title}
                         ref={pageTitleInputRef}
                         disabled={!sectionTitleEditable}
            />
            <div id={"spacer"}/>
            <Button onClick={save} id={"save-button"}>Save</Button>
        </div>

        <MDXEditor
            ref={editorRef}
            className={"dark-theme"}
            readOnly={!editable}
            plugins={[
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                markdownShortcutPlugin(),
                tablePlugin(),
                diffSourcePlugin({
                    diffMarkdown: page.content,
                    viewMode: 'rich-text',
                    readOnlyDiff: true
                }),
                toolbarPlugin({
                    toolbarClassName: 'dark-toolbar' + (editable ? "" : " hidden"),
                    toolbarContents: () => {
                        return editable ? <>
                            <BlockTypeSelect/>
                            <BoldItalicUnderlineToggles/>
                            <ListsToggle/>
                            <Separator/>
                            <CreateLink/>
                            <InsertTable/>
                            <DiffSourceToggleWrapper>
                                <UndoRedo/>
                            </DiffSourceToggleWrapper>
                        </> : null
                    }
                })

            ]}

            markdown={page.content}
        />
    </>
}