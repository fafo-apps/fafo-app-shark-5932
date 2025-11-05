import Link from 'next/link';
import { listPublishedPosts } from '@/app/db/repositories/PostsRepository';

export const dynamic = 'force-dynamic';

function formatDate(iso: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function Home() {
  let posts = [] as Awaited<ReturnType<typeof listPublishedPosts>>;
  try {
    posts = await listPublishedPosts();
  } catch (e) {
    // ignore for empty state
  }

  const hero = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1f1b16]">
      <header className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Morocco Travel Journal</h1>
        <p className="mt-2 text-zinc-600">Stories and photos from your journey through Marrakech, the Atlas Mountains, and the Sahara.</p>
        <div className="mt-4">
          <Link href="/new" className="inline-flex rounded-full bg-[#d96846] px-5 py-2.5 text-white hover:bg-[#c3563a] transition-colors">Write a post</Link>
        </div>
      </header>

      {hero ? (
        <section className="mx-auto max-w-5xl px-6">
          <Link href={`/posts/${hero.slug}`} className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
            {hero.cover_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={hero.cover_image_url} alt={hero.title} className="h-72 w-full object-cover transition-transform group-hover:scale-[1.02]" />
            ) : null}
            <div className="p-6">
              <div className="text-sm text-zinc-500">{formatDate(hero.published_at)}</div>
              <h2 className="mt-1 text-2xl font-semibold">{hero.title}</h2>
              {hero.excerpt ? <p className="mt-2 text-zinc-600">{hero.excerpt}</p> : null}
              <div className="mt-4 inline-flex items-center gap-2 text-[#0e6ba8]">Read story<span aria-hidden>→</span></div>
            </div>
          </Link>
        </section>
      ) : (
        <section className="mx-auto max-w-5xl px-6">
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-600">No posts yet. Click "Write a post" to publish your first Morocco story.</div>
        </section>
      )}

      {rest.length > 0 && (
        <section className="mx-auto max-w-5xl px-6">
          <h3 className="mt-10 mb-4 text-xl font-semibold">Latest posts</h3>
          <ul className="grid gap-6 sm:grid-cols-2">
            {rest.map((p) => (
              <li key={p.id} className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
                <Link href={`/posts/${p.slug}`} className="block">
                  {p.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.cover_image_url} alt={p.title} className="h-44 w-full object-cover" />
                  ) : null}
                  <div className="p-5">
                    <div className="text-sm text-zinc-500">{formatDate(p.published_at)}</div>
                    <h4 className="mt-1 text-lg font-semibold">{p.title}</h4>
                    {p.excerpt ? <p className="mt-1 line-clamp-2 text-zinc-600">{p.excerpt}</p> : null}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="mt-16 border-t border-zinc-200 bg-[#f4efe8] py-8 text-center text-sm text-zinc-600">
        © {new Date().getFullYear()} Your Morocco Travel Journal
      </footer>
    </div>
  );
}
