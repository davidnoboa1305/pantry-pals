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

    // Extract the new fields we added to the frontend form
    const listName = formData.get("listName") as string;
    const listDescription = formData.get("listDescription") as string;
    const groupID = formData.get("groupID") as string;

    if (!groupID) {
        return {error: "A group must be selected to create a list."};
    }

    const { error } = await supabase
        .from("GroceryLists")
        .insert({
            ListName: listName,
            ListDescription: listDescription,
            GroupID: groupID, 
            CreatedBy: user.id, 
        });

    if (error) {
        console.error("Error creating list:", error);
        return {error: "Error creating list"};
    }

    revalidatePath("/dashboard");
    return {success: true};
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
        .from("GroceryLists")
        .delete()
        .eq("GroceryListID", groceryListID)
        .eq("CreatedBy", user.id); 

    if (error) {
        console.error("Error deleting list:", error);
        return {error: "Error deleting list"};
    }
    
    revalidatePath("/dashboard");
    return {success: true};
}

export async function getUserLists() {
    const supabase = await createClient();
    const {data: { user }} = await supabase.auth.getUser();
    
    if (!user) {
        console.error("User not authenticated.");
        return [];
    }

    const { data: lists, error } = await supabase
        .from("GroceryLists")
        .select(`
            *,
            Groups ( GroupName )
        `)
        .order('DateCreated', { ascending: false });

    if (error) {
        console.error("Error fetching user lists:", error);
        return [];
    }

    return lists || [];
}

export async function getListDetails(listId: string) {
    const supabase = await createClient();
    const {data: { user }} = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data: list, error } = await supabase
        .from("GroceryLists")
        .select(`
            *,
            Groups ( GroupName ),
            Items ( 
                *,
                ItemSplits (
                    UserID,
                    Users ( UserName, FirstName )
                )
            )
        `)
        .eq("GroceryListID", listId)
        .maybeSingle(); 

    if (error) {
        console.error("Error fetching list details:", error);
        return null;
    }
    return list;
}
// TO DO: Implement updateListName and updateListDescription functions to allow users to edit their lists.
export async function updateListName(formData: FormData) {
    const supabase = await createClient();
    const {data: { user }} = await supabase.auth.getUser();
    if (!user) {
        console.error("User not authenticated.");
        return;
    }

    const listID = formData.get("listID") as string;
    const newName = formData.get("listName") as string;

    const { error } = await supabase
        .from("GroceryLists")
        .update({ ListName: newName })
        .eq("GroceryListID", listID)
        .eq("CreatedBy", user.id);

    if (error) {
        console.error("Error updating list name:", error);
        return { error: "Error updating list name" };
    }
    revalidatePath("/dashboard");
    return { success: true };
    
}

export async function updateListDescription(formData: FormData) {
    const supabase = await createClient();
    const {data: { user }} = await supabase.auth.getUser();
    if (!user) {
        console.error("User not authenticated.");
        return;
    }

    const listID = formData.get("listID") as string;
    const newDescription = formData.get("listDescription") as string;

    const { error } = await supabase
        .from("GroceryLists")
        .update({ ListDescription: newDescription })
        .eq("GroceryListID", listID)
        .eq("CreatedBy", user.id);

    if (error) {
        console.error("Error updating list description:", error);
        return { error: "Error updating list description" };
    }

    revalidatePath("/dashboard");
    return { success: true };

}