'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/apiClient';
import { useToast } from '@/components/ToastClient';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Hit the C# endpoint we just made
      const response = await apiFetch(`/Auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      
      // Show the green popup!
      showToast(data.message, 'success');
      setUsername(''); // Clear the input

    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
        <p className="text-gray-600 text-sm text-center mb-6">
          Enter your username and we will send you a secure link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <Link href="/login" className="text-indigo-600 hover:text-indigo-500">
            Wait, I remember it! Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}