import { NextRequest, NextResponse } from 'next/server';
import { createPost, listPublishedPosts } from '@/app/db/repositories/PostsRepository';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')</content>