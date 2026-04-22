'use server';
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createItem(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser(); 
    
    if (!user) {
        console.error("User not authenticated.");
        return { error: "User not authenticated" };
    }

    const itemName = formData.get("itemName") as string;
    const listID = formData.get("listID") as string; // Updated to match the new schema's column name
    const quantity = parseInt(formData.get("quantity") as string) || 1; 
    const price = parseFloat(formData.get("price") as string) || 0.0; 
    
    const sharedWithRaw = formData.get("sharedWith") as string;
    const sharedWith = sharedWithRaw ? JSON.parse(sharedWithRaw) : [];

    if (!itemName || !listID) {
        return { error: "Item name and List ID are required." };
    }

    const { data: newItem, error: itemError } = await supabase
        .from("Items") // Updated to match your new schema table name
        .insert({
            ItemName: itemName,
            GroceryListID: listID,
            Quantity: quantity,
            Price: price
        })
        .select("ItemID")
        .single();

    if (itemError || !newItem) {
        console.error("Error creating item:", itemError);
        return { error: "Error creating item" };
    }

    if (sharedWith.length > 0) {
        const splitInserts = sharedWith.map((userID: string) => ({
            ItemID: newItem.ItemID,
            UserID: userID
        }));

        const { error: splitError } = await supabase
            .from("ItemSplits")
            .insert(splitInserts);

        if (splitError) {
            console.error("Error assigning item splits:", splitError);
        }
    }

    revalidatePath("/dashboard");
    return { success: true };
}

export async function deleteItem(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        console.error("User not authenticated.");
        return { error: "User not authenticated" };
    }
    
    const itemID = formData.get("itemID") as string;

    const { error } = await supabase
        .from("Items") // Updated to match your new schema table name
        .delete()
        .eq("ItemID", itemID);

    if (error) {
        console.error("Error deleting item:", error);
        return { error: "Error deleting item" };
    }
    
    revalidatePath("/dashboard");
    return { success: true };
}