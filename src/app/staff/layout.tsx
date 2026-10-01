import {createClient, getMfaUser, getUserProfile} from "@/lib/supabase/server";
import {redirect} from "next/navigation";
import {PERMISSIONS} from "@/lib/consts";
import {Footer} from "@/components/Footer/Footer";
import {Header} from "@/components/Header/Header";

import '@mdxeditor/editor/style.css'

export default async function Layout({children}: LayoutProps<"/staff">) {
    const supabase = await createClient()
    const user = await getMfaUser(supabase)
    if (!user) redirect("/");
    const profile = await getUserProfile(supabase);
    if (!profile || !(
        profile.permissions.includes(PERMISSIONS.admin)
        || profile.permissions.includes(PERMISSIONS.pages.read)
    )) redirect("/");

    return <>
        <Header/>
        <main>
            {children}
        </main>
        <Footer/>
    </>
}