'use server';
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function sendInvite(formData: FormData) {
    const supabase = await createClient();
    const friendId = formData.get("friendId") as string;
    const groceryListId = formData.get("groceryListId") as string;
    const {data: { user }} = await supabase.auth.getUser(); 
    if (!user) {
        console.error("User not authenticated.");
        return;
    }

    const { error } = await supabase
        .from("RecentlyInvited")
        .insert({
            GroceryListID: groceryListId,
            ReceiverID: friendId,
            SenderID: user.id,
            Status: "pending",
        });

    if (error) {
        console.error("Error sending invite:", error);
        return;
    }
    revalidatePath("/dashboard");
    return;
}

export async function respondToInvite(formData: FormData) {
    const supabase = await createClient();
    const {data: { user }} = await supabase.auth.getUser();

    const inviteId = formData.get("inviteId") as string;
    if (!user) {
        console.error("User not authenticated.");
        return;
    }
    const {data: invite, error: inviteError} = await supabase
        .from("RecentlyInvited")
        .select("GroceryListID")
        .eq("RecentlyInvitedID", inviteId)
        .single(); 
    if (inviteError || !invite) {
        console.error("Error fetching invite:", inviteError);
        return;
    }

    // Join grocery list
    await supabase.from("GroupMember").insert({
        GroceryListID: invite.GroceryListID,
        UserID: user.id,
    });

    await supabase.from("RecentlyInvited").update({Status: "accepted"}).eq("RecentlyInvitedID", inviteId);

    revalidatePath("/dashboard");
    return;
}

export async function getUserInvites() {
    const supabase = await createClient();
    const {data: { user }} = await supabase.auth.getUser();
    if (!user) {
        console.error("User not authenticated.");
        return [];
    }
    const {data: invites, error} = await supabase
    .from("RecentlyInvited")
    .select("RecentlyInvitedID, Status, GroceryList:GroceryListID (ListName), Sender:SenderID (UserName)")
    .eq("RecieverID", user.id)
    .eq("Status", "pending");
    if (error) {
        console.error("Error fetching invites:", error);
        return [];
    }

    return invites || [];
}