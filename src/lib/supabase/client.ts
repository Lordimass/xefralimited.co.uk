import { createBrowserClient } from '@supabase/ssr'
import {SupabaseClient, User} from "@supabase/supabase-js";
import {useEffect, useState} from "react";
export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_DATABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    )
}

export function useGetUser(supabase: SupabaseClient) {
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        async function checkLoggedIn() {
            const {data: {user}, error: getUserError} = await supabase.auth.getUser();
            if (getUserError) throw getUserError;
            setUser(user);
        }
        checkLoggedIn().then();
    }, []);
    return user;
}

export async function login(email: string, password: string) {
    const supabase = createClient();
    console.log("Get User ", await supabase.auth.getUser())
    const {data: emailExists, error: emailCheckError} = await supabase.rpc("email_exists", {email_to_check: email})
    if (emailCheckError) {console.error(emailCheckError); return;}
    if (emailExists) {
        const {data: signInData, error: signInError} = await supabase.auth.signInWithPassword({email, password})
        if (!signInError) {
            console.log("Sign in successful: ", signInData)
            console.log("Get User ", await supabase.auth.getUser())
            return {...signInData, newAccount: false}
        } else {
            console.error("Something went wrong signing in: ", signInError)
            throw signInError
        }
    } else {
        const {data: signUpData, error: signUpError} = await supabase.auth.signUp({email, password})
        if (!signUpError) {
            console.log("Sign up successful: ", signUpData)
            return {...signUpData, newAccount: true}
        } else {
            console.error("Something went wrong signing up: ", signUpError)
            throw signUpError
        }
    }
}

export async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
}