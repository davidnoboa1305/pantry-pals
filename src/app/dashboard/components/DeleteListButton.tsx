"use client";
import { useState } from "react";
import { deleteList } from "@/actions/listActions";
import { useRouter } from "next/navigation";

export default function DeleteListButton({ listID }: { listID: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    async function handleDelete(e: React.MouseEvent) {
        e.stopPropagation();
        setIsDeleting(true);
        const formData = new FormData();
        formData.append("listID", listID);
        await deleteList(formData);
        router.push("/dashboard"); // Reset URL
        setIsDeleting(false);
    }

    return (
        <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1.5 rounded-full hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
            title="Delete list"
        >
            {isDeleting ? (
                <span className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin block"></span>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            )}
        </button>
    );
}