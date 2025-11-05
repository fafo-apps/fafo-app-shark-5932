import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug } from '@/app/db/repositories/PostsRepository';

export const dynamic = 'force-dynamic';

function formatDate(iso: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post || !post.published_at) return notFound();

  return (
    <article className="min-h-screen bg-[#faf7f2] text-[#1f1b16]">
      <header className="mx-auto max-w-3xl px-6 py-10">
        <Link href="/" className="text-[#0e6ba8]">← Back</Link>
        <h1 className="mt-4 text-4xl font-semibold leading-tight">{post.title}</h1>
        <div className="mt-2 text-zinc-500">{formatDate(post.published_at)}</div>
      </header>
      {post.cover_image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.cover_image_url} alt={post.title} className="h-[420px] w-full object-cover" />
      ) : null}
      <div className="prose prose-zinc mx-auto max-w-3xl px-6 py-10">
        {post.excerpt ? <p className="text-lg text-zinc-700">{post.excerpt}</p> : null}
        {post.content.split(/\n\n+/).map((para, idx) => (
          <p key={idx} className="mt-4 leading-8 text-zinc-800">{para}</p>
        ))}
      </div>
    </article>
  );
}
