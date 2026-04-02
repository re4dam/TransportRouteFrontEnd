'use client';

// 🚨 1. Import useRef
import { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/apiClient';
import { useToast } from '@/components/ToastClient';

function VerifyEmailLogic() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('Verifying your email...');
  
  // 🚨 2. Create the execution shield
  const hasAttempted = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus('Invalid or missing token.');
      return;
    }

    // 🚨 3. If we already fired the request, stop immediately!
    if (hasAttempted.current) return;
    hasAttempted.current = true; // Lock the shield

    const verify = async () => {
      try {
        const response = await apiFetch(`/Auth/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();
        showToast(data.message, 'success');
        
        // Add a slight delay so the user can read the success message before teleporting
        setTimeout(() => {
            router.push('/login');
        }, 2000);
        
      } catch (err: any) {
        setStatus(err.message);
        showToast(err.message, 'error');
      }
    };

    verify();
    
    // 🚨 4. Remove router and showToast from the dependency array 
    // to prevent React from getting confused
  }, [token]); 

  return <div className="text-center font-bold text-lg mt-10">{status}</div>;
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailLogic />
      </Suspense>
    </div>
  );
}