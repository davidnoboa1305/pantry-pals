"use client";
import { deleteGroup } from "@/actions/groupActions";

export default function DeleteGroupButton({ groupID }: { groupID: string }) {

    async function handleDelete(e: React.MouseEvent) {
        e.stopPropagation();
        const formData = new FormData();
        formData.append("groupID", groupID);
        await deleteGroup(formData);
    }

    return (
        <button 
            onClick={handleDelete}
            className="text-xs text-[#677D6A] hover:text-[#1A3636] font-bold underline"
        >
            Delete
        </button>
    );
}