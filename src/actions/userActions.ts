'use server';
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";   

export async function getUserInfo() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from("Users")
        .select(`
            UserID,
            FirstName,
            LastName,
            UserName,
            Email
        `)
        .eq("UserID", user.id)
        .single();

    if (error) {
        console.error("Error fetching user information:", error);
        return null;
    }

    return data;
}