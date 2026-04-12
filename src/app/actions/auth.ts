'use server';
import { createClient } from "@/lib/supabase/server";
import {redirect} from "next/navigation";

export async function login(formData: FormData) {
    //supabase by default uses email and password
    const supabase = await createClient();
    const username = formData.get("username") as string; // implement later
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const {error} = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        console.error("Login error:", error);
        return;
    }
}

export async function register(formData: FormData) {
    const supabase = await createClient();
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const {error} = await supabase.auth.signUp({ email, password });

    if (error) {
        console.error("Registration error:", error);
        return;
    }

    redirect("/login");
}    