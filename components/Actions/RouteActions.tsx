"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/apiClient";
import { useToast } from "@/components/ToastClient";

export default function RouteActions({ routeId }: { routeId: number }) {
  const router = useRouter();
  const [canDelete, setCanDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    // Safe to use localStorage here because this is a client component
    const checkLoginState = localStorage.getItem('isLoggedIn') === 'true';
    const userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
    const hasPermission = userRoles.includes('SuperAdmin') || userRoles.includes('RouteManager');
    setIsLoggedIn(checkLoginState);
    setCanDelete(hasPermission);
  }, []);

  const handleDelete = async () => {
    // 1. Add a safety confirmation so users don't accidentally delete routes
    if (!confirm("Are you sure you want to delete this route? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);

    const token = sessionStorage.getItem('csrf_token');

    try {
      // 2. Send the DELETE request to your C# backend
      const res = await apiFetch(`/TransitRoutes/${routeId}`, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": token || ""
        },
        credentials: "include"
      });

      showToast("Route deleted successfully!", "success");
      // 3. Force Next.js to re-fetch the server component data to remove the item from the screen
      router.refresh();
    } catch (error) {
      console.error(error);
      showToast("An error occurred while deleting the route.", "error");
      setIsDeleting(false); // Only reset if it fails, otherwise let it unmount
    }
  };

  return (
    <div className="flex gap-3 pt-4 border-t border-slate-100 justify-end">
      {isLoggedIn && (
        <Link 
          href={`/routes/edit/${routeId}`}
          className="p-2.5 rounded-xl text-amber-500 bg-amber-50 hover:bg-amber-500 hover:text-white transition-all shadow-sm hover:shadow-md focus:ring-2 focus:ring-amber-400 focus:outline-none"
          aria-label="Edit route"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </Link>
      )}

      {canDelete && (
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className={`p-2.5 rounded-xl transition-all shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-none ${
            isDeleting 
              ? "text-slate-400 bg-slate-100 cursor-wait" 
              : "text-rose-500 bg-rose-50 hover:bg-rose-500 hover:text-white hover:shadow-md"
          }`}
          aria-label="Delete route"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </div>
  );
}