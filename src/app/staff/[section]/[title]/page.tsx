import {createClient, getMfaUser, getUserProfile} from "@/lib/supabase/server";
import {PERMISSIONS, SUPABASE_SCHEMA} from "@/lib/consts";
import {notFound, redirect} from "next/navigation";
import Content from "@/app/staff/[section]/[title]/Content";
import styles from "./page.module.css"
import "./globals.css"
import {InfoPage} from "@/lib/types";

export default async function Page({params}: {
    params: Promise<{ section: string, title: string }>
}) {
    // Check edit permissions
    const supabase = await createClient()
    const user = await getMfaUser(supabase)
    if (!user) redirect("/");
    const profile = (await getUserProfile(supabase))!;
    const editable = profile.permissions.includes(PERMISSIONS.pages.write) || profile.permissions.includes(PERMISSIONS.admin)

    // Fetch content
    const { section, title } = await params
    const {data, error} = await supabase.schema(SUPABASE_SCHEMA).from("pages")
        .select("*")
        .eq("section", section)
        .eq("title", title)
    if (error) {
        console.error(error);
        return "Something went wrong!"
    } else if (data.length == 0) notFound()
    const page: InfoPage = data[0]

    return <div id={styles.content}>
        <Content page={page} editable={editable}/>
    </div>
}