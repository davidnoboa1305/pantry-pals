'use server';
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";   

// This actions file is for list related actions, such as creating a new list
export async function createList(formData: FormData) {
    const supabase = await createClient();
    const {data: { user }} = await supabase.auth.getUser();
    if (!user) {
        console.error("User not authenticated.");
        return {error: "User not authenticated"};
    }

    const listName = formData.get("listName") as string;
    const { error } = await supabase
        .from("GroceryList")
        .insert({
            ListName: listName,
            UserID: user.id, //owner of the list is the user who created it
        });
    if (error) {
        console.error("Error creating list:", error);
        return {error: "Error creating list"};
    }
    revalidatePath("/dashboard");
    //return {success: true};
}

export async function deleteList(formData: FormData) {
    const supabase = await createClient();
    const {data: { user }} = await supabase.auth.getUser();
    if (!user) {
        console.error("User not authenticated.");
        return {error: "User not authenticated"};
    }
    const groceryListID = formData.get("listID") as string;
    const { error } = await supabase
        .from("GroceryList")
        .delete()
        .eq("GroceryListID", groceryListID)
        .eq("UserID", user.id);
    if (error) {
        console.error("Error deleting list:", error);
        return {error: "Error deleting list"};
    }
    revalidatePath("/dashboard");
    //return {success: true};
}

export async function getUserLists() {
    const supabase = await createClient();
    const {data: { user }} = await supabase.auth.getUser();
    if (!user) {
        console.error("User not authenticated.");
        return;
    }

    const {data: owned} = await supabase
        .from("GroceryList")
        .select("*")
        .eq("UserID", user.id);
    const {data: shared} = await supabase
        .from("GroupMember")
        .select("GroceryList (*)")
        .eq("UserID", user.id);

    const sharedLists = shared?.map((s) => s.GroceryList) || [];

    return [...(owned || []), ...sharedLists];
}