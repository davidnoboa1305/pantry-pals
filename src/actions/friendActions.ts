'use server';
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function sendFriendRequest(formData: FormData) {
    const supabase = await createClient();
    const friendUsername = formData.get("friendUsername") as string;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.error("User not authenticated.");
        return {error: "User not authenticated"};
    }

    //find user id of friend using their username
    const { data: friendUser, error: friendError } = await supabase
        .from("UserProfile")
        .select("UserID")
        .eq("UserName", friendUsername)
        .single();

    if (friendError) {
        console.error("Error fetching friend user:", friendError);
        return {error: "Error fetching friend user"};
    }

    //insert friend request into database
    const { error: requestError } = await supabase
        .from("FriendList")
        .insert({
            RequesterID: user.id,
            TargetID: friendUser?.UserID,
            Status: "pending",
        });

    if (requestError) {
        console.error("Error inserting friend request:", requestError);
        return {error: "Error inserting friend request"};
    }

    revalidatePath("/dashboard");
    return {success: true};
}

export async function respondToFriendRequest(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.error("User not authenticated.");
        return {error: "User not authenticated"};
    }
    const friendRequestID = formData.get("friendRequestID") as string;
    const {error} = await supabase
        .from("FriendList")
        .update({Status: "accepted"})
        .eq("FriendListID", friendRequestID)
        .eq("TargetID", user.id);
    if (error) {
        console.error("Error updating friend request:", error);
        return {error: "Error updating friend request"};
    }
    revalidatePath("/dashboard");
    return {success: true};
}

export async function removeFriend(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.error("User not authenticated.");
        return {error: "User not authenticated"};
    }
    const friendListID = formData.get("friendListID") as string;
    const {error} = await supabase
        .from("FriendList")
        .delete()
        .eq("FriendListID", friendListID);
    if (error) {
        console.error("Error removing friend:", error);
        return {error: "Error removing friend"};
    }
    revalidatePath("/dashboard");
    return {success: true};
}