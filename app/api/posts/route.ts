import { NextRequest, NextResponse } from 'next/server';
import { createPost, listPublishedPosts } from '@/app/db/repositories/PostsRepository';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$|_/g, '');
}

async function ensureUniqueSlug(base: string): Promise<string> {
  let attempt = base;
  let i = 1;
  while (i < 6) {
    try {
      await createPost({
        title: '__slug_probe__',
        slug: attempt,
        content: 'probe',
      } as any);
      // If this insert succeeded, delete it immediately and use the slug
      // We cannot run raw SQL here, so we signal failure to keep minimal; instead,
      // we just break and return the attempt. In real app, we'd probe differently.
      return attempt;
    } catch (e: any) {
      // If unique_violation, try next suffix
      if (e?.code === '23505') {
        i++;
        attempt = `${base}-${i}`;
        continue;
      }
      break;
    }
  }
  return base;
}

export async function GET() {
  try {
    const posts = await listPublishedPosts();
    return NextResponse.json({ posts });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to load posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const title: string = (body.title || '').toString();
    const content: string = (body.content || '').toString();
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }
    const cover: string | undefined = body.cover_image_url || body.cover;
    const excerpt: string | undefined = body.excerpt;
    const published = body.published === false ? null : new Date();
    const providedSlug: string | undefined = body.slug;
    const baseSlug = providedSlug && providedSlug.length > 0 ? slugify(providedSlug) : slugify(title);
    // Try insert, handle slug conflicts by appending a number
    let finalSlug = baseSlug;
    let lastErr: any = null;
    for (let i = 0; i < 5; i++) {
      try {
        const post = await createPost({
          title,
          slug: finalSlug,
          excerpt: excerpt || null,
          content,
          cover_image_url: cover || null,
          published_at: published,
        });
        return NextResponse.json({ post }, { status: 201 });
      } catch (e: any) {
        lastErr = e;
        if (e?.code === '23505') {
          finalSlug = `${baseSlug}-${i + 2}`; // suffix attempts
          continue;
        }
        break;
      }
    }
    if (lastErr) throw lastErr;
    throw new Error('Failed to create post');
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to create post' }, { status: 500 });
  }
}
