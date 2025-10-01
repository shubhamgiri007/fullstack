'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Idea {
  id: string;
  text: string;
  upvotes: number;
  created_at: string;
}

export default function IdeaBoard() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [newIdea, setNewIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Fetch ideas from API
  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/ideas`);
      if (response.ok) {
        const data = await response.json();
        setIdeas(data);
      }
    } catch (error) {
      console.error('Error fetching ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Submit new idea
  const submitIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdea.trim() || newIdea.length > 280) return;

    try {
      setSubmitting(true);
      const response = await fetch(`${API_BASE_URL}/api/ideas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newIdea.trim() }),
      });

      if (response.ok) {
        const newIdeaData = await response.json();
        setIdeas(prev => [newIdeaData, ...prev]);
        setNewIdea('');
      }
    } catch (error) {
      console.error('Error submitting idea:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Upvote an idea
  const upvoteIdea = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ideas/${id}/upvote`, {
        method: 'POST',
      });

      if (response.ok) {
        const updatedIdea = await response.json();
        setIdeas(prev => 
          prev.map(idea => 
            idea.id === id ? updatedIdea : idea
          )
        );
      }
    } catch (error) {
      console.error('Error upvoting idea:', error);
    }
  };

  // Fetch ideas on component mount
  useEffect(() => {
    fetchIdeas();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchIdeas, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                ← Back to Home
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">The Idea Board</h1>
            </div>
            <div className="text-sm text-gray-500">
              {ideas.length} ideas shared
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Submit Idea Form */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Share Your Idea
          </h2>
          <form onSubmit={submitIdea} className="space-y-4">
            <div>
              <textarea
                value={newIdea}
                onChange={(e) => setNewIdea(e.target.value)}
                placeholder="What's your brilliant idea? (max 280 characters)"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-gray-900"
                rows={3}
                maxLength={280}
                disabled={submitting}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  {newIdea.length}/280 characters
                </span>
                {newIdea.length > 280 && (
                  <span className="text-sm text-red-500">
                    Too long! Please shorten your idea.
                  </span>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={!newIdea.trim() || newIdea.length > 280 || submitting}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Sharing...' : 'Share Idea'}
            </button>
          </form>
        </div>

        {/* Ideas List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Community Ideas
            </h2>
            <button
              onClick={fetchIdeas}
              disabled={loading}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {loading && ideas.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading ideas...</p>
            </div>
          ) : ideas.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No ideas yet</h3>
              <p className="text-gray-500">Be the first to share a brilliant idea!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ideas.map((idea) => (
                <div
                  key={idea.id}
                  className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                      <p className="text-gray-900 text-lg leading-relaxed">
                        {idea.text}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(idea.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => upvoteIdea(idea.id)}
                        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V18m-7-8a2 2 0 01-2-2V5a2 2 0 012-2h2.343M11 7.06l-1.97-1.97A2 2 0 007.03 4.03L5.06 6m5.94 1.06l1.97-1.97A2 2 0 0116.97 4.03L18.94 6" />
                        </svg>
                        <span className="font-medium">{idea.upvotes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
