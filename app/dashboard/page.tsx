'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import type { Note } from '@/types';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [noteData, setNoteData] = useState<Partial<Note>>({
    title: '',
    type: 'text', // default type
    transcript: '',
    summary: '',
  });
  const [noteId, setNoteId] = useState('');
  const [result, setResult] = useState<{ type: string; data?: Note; error?: any } | null>(null);

  const createNote = async () => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });
      const data = await response.json();
      setResult({ type: 'create', data });
      if (data.id) {
        setNoteId(data.id);
      }
    } catch (error) {
      setResult({ type: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  const fetchNote = async () => {
    if (!noteId) return;
    try {
      const response = await fetch(`/api/notes/${noteId}`);
      const data = await response.json();
      setResult({ type: 'fetch', data });
    } catch (error) {
      setResult({ type: 'error', error });
    }
  };

  if (!session) {
    return <div>Please sign in to continue</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Test Notes API</h1>
        
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={noteData.title || ''}
              onChange={(e) => setNoteData(prev => ({ ...prev, title: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={noteData.type || 'text'}
              onChange={(e) => setNoteData(prev => ({ ...prev, type: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            >
              <option value="text">Text</option>
              <option value="audio">Audio</option>
              <option value="video">Video</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Transcript</label>
            <textarea
              value={noteData.transcript || ''}
              onChange={(e) => setNoteData(prev => ({ ...prev, transcript: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Summary</label>
            <textarea
              value={noteData.summary || ''}
              onChange={(e) => setNoteData(prev => ({ ...prev, summary: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
              rows={2}
            />
          </div>
          
          <button
            onClick={createNote}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Note
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Note ID</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={noteId}
                onChange={(e) => setNoteId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                onClick={fetchNote}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Fetch Note
              </button>
            </div>
          </div>
        </div>

        {result && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">Result:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
