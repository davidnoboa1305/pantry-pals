'use server';
import { createClient } from "@/lib/supabase/server";
import {redirect} from "next/navigation";


export async function login(formData: FormData) {
    //supabase by default uses email and password
    const supabase = await createClient();
    const username = formData.get("username") as string; // implement later
    const password = formData.get("password") as string;

    console.log("Attempting login with username: ", username);

    if (!username || !password) {
        console.error("Username and password are required.");
        return;
    }

    const {data: User, error: userError} = await supabase
    .from("UserProfile")
    .select("Email")
    .eq("UserName", username)
    .single();

    if (userError || !User) {
        console.error("Login error: ", userError);
        return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
        email: User.Email,
        password,
    });

    if (authError) {
        console.error("Login error:", authError);
        return;
    }

    console.log("User logged in successfully:", username);
    redirect("/homepage");
}

export async function register(formData: FormData) {
    //supabase by default uses email and password
    const supabase = await createClient();
    const firstname = formData.get("firstname") as string; // implement later
    const lastname = formData.get("lastname") as string; // implement later
    const username = formData.get("username") as string; // implement later
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const {data: authData, error: authError} = await supabase.auth.signUp({ email, password, options: { data: { firstname, lastname, username } } });

    if (authError) {
        console.error("Signup error:", authError.message);
        return;
    }

    if (authData.user) { //send contents to database
        const {error: dbError} = await supabase.from("UserProfile").insert({
            UserID: authData.user.id,
            FirstName: firstname,
            LastName: lastname,
            UserName: username,
            Email: email,
        });

        if (dbError) {
            console.error("Database error:", dbError.message);
            return;
        }

        console.log("User registered successfully:", authData.user);
    }

    

    redirect("/login");
}    