'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/apiClient';
import { useToast } from '@/components/ToastClient';

// 1. The actual form component that reads the URL
function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  
  // Grab the token from the URL automatically!
  const token = searchParams.get('token'); 

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Security check on the frontend before bothering the server
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match!", "error");
      return;
    }

    if (!token) {
      showToast("Missing reset token. Please click the link in your email again.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // Send the token and the new password to C#
      const response = await apiFetch(`/Auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      showToast(data.message, 'success');
      
      // Kick them back to login so they can use their new password
      router.push('/login');

    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If someone just goes to /reset-password without a token in the URL
  if (!token) {
    return <div className="text-center text-red-600 font-bold">Invalid or missing token.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">New Password</label>
        <input
          type="password"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
        <input
          type="password"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Resetting...' : 'Save New Password'}
      </button>
    </form>
  );
}

// 2. The main page wrapper
export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Create New Password</h2>
        
        {/* Suspense is required by Next.js when reading URL parameters */}
        <Suspense fallback={<div className="text-center">Loading secure form...</div>}>
          <ResetPasswordForm />
        </Suspense>
        
      </div>
    </div>
  );
}