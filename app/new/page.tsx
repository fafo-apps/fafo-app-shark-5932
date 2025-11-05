'use client';

import { useState } from 'react';

export default function NewPostPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: payload.title,
          excerpt: payload.excerpt,
          content: payload.content,
          cover_image_url: payload.cover_image_url,
          published: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create post');
      setSuccess('Post published!');
      form.reset();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1f1b16]">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-semibold">Write a new story</h1>
        <p className="mt-2 text-zinc-600">Add your Morocco memories. Title and story are required. Cover image is optional.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input name="title" required className="mt-1 w-full rounded-lg border border-zinc-300 bg-white p-3 outline-none focus:ring-2 focus:ring-[#0e6ba8]" />
          </div>
          <div>
            <label className="block text-sm font-medium">Short summary</label>
            <input name="excerpt" className="mt-1 w-full rounded-lg border border-zinc-300 bg-white p-3" />
          </div>
          <div>
            <label className="block text-sm font-medium">Cover image URL</label>
            <input name="cover_image_url" className="mt-1 w-full rounded-lg border border-zinc-300 bg-white p-3" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm font-medium">Story</label>
            <textarea name="content" required rows={10} className="mt-1 w-full rounded-lg border border-zinc-300 bg-white p-3" placeholder={'Day 1 in Marrakech...\n\nWhat we ate...\n\nHighlights...'} />
          </div>
          <div className="flex items-center gap-3">
            <button disabled={loading} className="inline-flex rounded-full bg-[#0e6ba8] px-5 py-2.5 text-white hover:bg-[#0b5b8f] disabled:opacity-50">{loading ? 'Publishing...' : 'Publish'}</button>
            {error ? <span className="text-sm text-red-600">{error}</span> : null}
            {success ? <span className="text-sm text-emerald-700">{success}</span> : null}
          </div>
        </form>
      </div>
    </div>
  );
}
