import { getPool } from '@/app/db/pool';

export type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  published_at: string | null; // ISO string
  created_at: string; // ISO string
};

export async function listPublishedPosts(): Promise<Post[]> {
  const pool = getPool();
  const { rows } = await pool.query(
    `select id, title, slug, excerpt, content, cover_image_url,
            to_char(published_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as published_at,
            to_char(created_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
       from posts
      where published_at is not null
      order by published_at desc nulls last, created_at desc`
  );
  return rows as Post[];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const pool = getPool();
  const { rows } = await pool.query(
    `select id, title, slug, excerpt, content, cover_image_url,
            to_char(published_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as published_at,
            to_char(created_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
       from posts
      where slug = $1
      limit 1`,
    [slug]
  );
  return rows[0] || null;
}

export type CreatePostInput = {
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  cover_image_url?: string | null;
  published_at?: Date | null;
};

export async function createPost(input: CreatePostInput): Promise<Post> {
  const pool = getPool();
  const { title, slug, excerpt, content, cover_image_url, published_at } = input;
  const { rows } = await pool.query(
    `insert into posts (title, slug, excerpt, content, cover_image_url, published_at)
     values ($1, $2, $3, $4, $5, $6)
     returning id, title, slug, excerpt, content, cover_image_url,
               to_char(published_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as published_at,
               to_char(created_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at`,
    [title, slug, excerpt ?? null, content, cover_image_url ?? null, published_at ?? null]
  );
  return rows[0] as Post;
}
