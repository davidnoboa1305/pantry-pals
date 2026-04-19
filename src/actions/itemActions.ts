'use server';
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { parse } from "path";

// This actions file is for item related actions, such as creating a new item and adding them to lists
export async function createItem(formData: FormData) {
    const supabase = await createClient();
    const {data: { user }} = await supabase.auth.getUser(); 
    if (!user) {
        console.error("User not authenticated.");
        return {error: "User not authenticated"};
    }
    const itemName = formData.get("itemName") as string;
    const groceryListID = formData.get("groceryListID") as string;
    const quantity = parseInt(formData.get("quantity") as string) || 1; // default to 1 if not provided or invalid
    const price = parseFloat(formData.get("price") as string) || 0.0; // default to 0.0 if not provided or invalid

    const { error } = await supabase
        .from("ItemList")
        .insert({
            ItemName: itemName,
            GroceryListID: groceryListID,
            Quantity: quantity,
            Price: price
        });
    if (error) {
        console.error("Error creating item:", error);
        return {error: "Error creating item"};
    }
    //return {success: true};
    revalidatePath("/dashboard");
}

export async function deleteItem(formData: FormData) {
    const supabase = await createClient();
    const {data: { user }} = await supabase.auth.getUser();
    if (!user) {
        console.error("User not authenticated.");
        return {error: "User not authenticated"};
    }
    const itemID = formData.get("itemID") as string;

    const { error } = await supabase
        .from("ItemList")
        .delete()
        .eq("ItemID", itemID);
    if (error) {
        console.error("Error deleting item:", error);
        return {error: "Error deleting item"};
    }
    revalidatePath("/dashboard");
}
