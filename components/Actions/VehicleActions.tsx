'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/apiClient';
import Link from 'next/link';
import { useToast } from "@/components/ToastClient";

export const dynamic = 'force-dynamic';

export default function VehicleActions({ id, vehicleName }: { id: number, vehicleName: string }) {
  const [canDelete, setCanDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Safe to use localStorage here because this is a client component
    const checkLoginState = localStorage.getItem('isLoggedIn') === 'true';
    const userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
    const hasPermission = userRoles.includes('SuperAdmin') || userRoles.includes('RouteManager');
    setIsLoggedIn(checkLoginState);
    setCanDelete(hasPermission);
  }, []);

  const handleDelete = async () => {
    const confirmed = window.confirm(`Are you sure you want to delete the "${vehicleName}" vehicle?\n\nWarning: Depending on your database rules, this might also delete all associated data!`);
    if (!confirmed) return;

    setIsDeleting(true);
    const token = sessionStorage.getItem('csrf_token');
    
    try {
      const response = await apiFetch(`/Vehicle/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'X-CSRF-Token': token || '' }
      });

      showToast('Vehicle deleted successfully!', 'success');

      router.refresh(); 
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
      {isLoggedIn && (
        <Link 
          href={`/vehicles/edit/${id}`} 
          className="flex-1 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-lg text-sm font-bold text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition-all text-center"
        >
          Edit
        </Link>
      )}
      {canDelete && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex-1 px-4 py-2 bg-rose-50 border border-rose-200 rounded-lg text-sm font-bold text-rose-700 hover:bg-rose-100 hover:border-rose-300 transition-all disabled:opacity-50"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      )}
    </div>
  );
}