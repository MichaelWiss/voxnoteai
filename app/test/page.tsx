'use client';

import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';

export default function TestPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log('Session status:', status);
    console.log('Session data:', session);
  }, [session, status]);

  if (status === 'loading') {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Session Test</h1>
      <div className="space-y-4">
        <div>
          <strong>Status:</strong> {status}
        </div>
        
        {status === 'unauthenticated' && (
          <button
            onClick={() => signIn('google')}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Sign in with Google
          </button>
        )}

        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  );
}
