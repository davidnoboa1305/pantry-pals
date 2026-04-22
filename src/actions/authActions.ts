'use server';
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
    const supabase = await createClient();
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    if (!username || !password) {
        return { error: "Username and password are required." };
    }
    const { data: User, error: userError } = await supabase
        .from("Users") // <-- UPDATED to match new schema
        .select("Email")
        .eq("UserName", username)
        .single();
    if (userError || !User) {
        console.error("Login error - User not found: ", userError);
        return { error: "Invalid username or password." };
    }
    const { error: authError } = await supabase.auth.signInWithPassword({
        email: User.Email,
        password,
    });
    if (authError) {
        console.error("Login error:", authError);
        return { error: authError.message };
    }
    redirect("/dashboard");
}

export async function register(formData: FormData) {
    const supabase = await createClient();
    const firstname = formData.get("firstname") as string;
    const lastname = formData.get("lastname") as string;
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email, 
        password, 
        options: { 
            data: { firstname, lastname, username } 
        } 
    });
    if (authError) {
        console.error("Signup error:", authError.message);
        return { error: authError.message };
    }
    if (authData.user) { 
        const { error: dbError } = await supabase
            .from("Users") // <-- UPDATED to match new schema
            .insert({
                UserID: authData.user.id,
                FirstName: firstname,
                LastName: lastname,
                UserName: username,
                Email: email,
            });

        if (dbError) {
            console.error("Database error:", dbError.message);
            return { error: "Account created, but failed to set up profile." };
        }
    }
    redirect("/login");
}
export async function logout() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    
    if (error) {
        console.error("Logout error:", error);
    } 
    
    redirect("/login");
}