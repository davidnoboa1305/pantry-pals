'use server';
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createGroup(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.error("User not authenticated.");
        return { error: "User not authenticated" };
    }
    const groupName = formData.get("groupName") as string;
    const { data: newGroup, error: groupError } = await supabase
        .from("Groups")
        .insert({ 
            GroupName: groupName, 
            CreatedBy: user.id 
        })
        .select("GroupID")
        .single();

    if (groupError || !newGroup) {
        console.error("Error creating group:", groupError);
        return { error: "Failed to create group" };
    }
    const { error: memberError } = await supabase
        .from("GroupMembers")
        .insert({ 
            GroupID: newGroup.GroupID, 
            UserID: user.id 
        });

    if (memberError) {
        console.error("Error adding creator to group members:", memberError);
        return { error: "Failed to add creator to group members" };
    }

    revalidatePath("/dashboard");
    return { success: true, groupID: newGroup.GroupID };
}

export async function addUserToGroup(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "User not authenticated" };

    const usernameToAdd = formData.get("username") as string;
    const groupID = formData.get("groupID") as string;

    const { data: targetUser, error: userError } = await supabase
        .from("Users")
        .select("UserID")
        .eq("UserName", usernameToAdd)
        .single();

    if (userError || !targetUser) {
        console.error("Error fetching target user:", userError);
        return { error: "User not found. Please check the username." };
    }

    const { error: memberError } = await supabase
        .from("GroupMembers")
        .insert({ 
            GroupID: groupID, 
            UserID: targetUser.UserID 
        });

    if (memberError) {
        console.error("Error inserting group member:", memberError);
        return { error: "Failed to add user. They might already be in this group." };
    }

    revalidatePath("/dashboard");
    return { success: true };
}

export async function removeUserFromGroup(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "User not authenticated" };

    const targetUserID = formData.get("targetUserID") as string;
    const groupID = formData.get("groupID") as string;

    const { error } = await supabase
        .from("GroupMembers")
        .delete()
        .eq("GroupID", groupID)
        .eq("UserID", targetUserID);

    if (error) {
        console.error("Error removing user from group:", error);
        return { error: "Failed to remove user from group" };
    }
    revalidatePath("/dashboard", "layout"); 
    return { success: true };
}

export async function getUserGroups() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data, error } = await supabase
        .from("Groups")
        .select(`
            *,
            GroupMembers (
                UserID,
                Users:Users (
                    FirstName,
                    LastName,
                    UserName
                )
            )
        `);
    if (error) {
        console.error("Error fetching groups:", error);
        return [];
    }
    return data;
}

export async function getGroupMembers(groupID: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data, error } = await supabase
        .from("GroupMembers")
        .select(`
            UserID,
            Users ( UserName, FirstName, LastName )
        `)
        .eq("GroupID", groupID);

    if (error || !data) {
        console.error("Error fetching group members:", error);
        return [];
    }
    return data.map((item: any) => ({
        UserID: item.UserID,
        UserName: item.Users.UserName,
        FirstName: item.Users.FirstName,
        LastName: item.Users.LastName
    }));
}

export async function updateGroup(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const groupID = formData.get("groupID") as string;
    const newName = formData.get("groupName") as string;

    const { error } = await supabase
        .from("Groups")
        .update({ GroupName: newName })
        .eq("GroupID", groupID)
        .eq("CreatedBy", user.id);

    if (error) {
        console.error("Error updating group:", error);
        return { error: "Failed to update group name." };
    }

    revalidatePath("/dashboard/groups");
    return { success: true };
}

export async function deleteGroup(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "User not authenticated" };

    const groupID = formData.get("groupID") as string;

    const { error } = await supabase
        .from("Groups")
        .delete()
        .eq("GroupID", groupID)
        .eq("CreatedBy", user.id); // Ensure only the owner can delete it

    if (error) {
        console.error("Error deleting group:", error);
        return { error: "Failed to delete group" };
    }

    revalidatePath("/dashboard/groups");
    return { success: true };
}