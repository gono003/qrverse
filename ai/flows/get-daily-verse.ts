'use server';

/**
 * @fileOverview Manages the generation of a daily Bible verse for each user.
 * It ensures that each user (identified by IP) receives only one unique verse per day.
 *
 * - getDailyVerse - A function that handles the logic for retrieving or generating a daily verse.
 */

import { generateVerse } from './generate-verse';
import { headers } from 'next/headers';
import type { DailyVerseInput, DailyVerseOutput } from '@/types/verse';
import { unstable_cache as cache } from 'next/cache';

// This function is not a Genkit flow, but a regular server action that uses one.
export async function getDailyVerse(input: DailyVerseInput): Promise<DailyVerseOutput> {
  const forwardedFor = headers().get('x-forwarded-for');
  const vercelIp = headers().get('x-vercel-forwarded-for');
  const ip = vercelIp || (forwardedFor ? forwardedFor.split(',')[0] : headers().get('x-real-ip'));
  
  if (!ip) {
    // Fallback to generating a verse without caching if IP is not available
    const verse = await generateVerse(input);
    return { verse, isNew: true };
  }

  const getCachedVerse = cache(
    async (ipAddress: string, language: string) => {
      const verse = await generateVerse({ language });
      return { verse, isNew: true };
    },
    ['daily-verse'],
    {
      revalidate: 86400, // 24 hours in seconds
      tags: [`daily-verse-${ip}-${input.language}`],
    }
  );

  // We need to check if a verse was already generated.
  // A simple way is to use another cache entry to store a flag.
  const getIsVerseGenerated = cache(
    async (ipAddress: string, language: string) => {
      return { generated: true };
    },
    ['daily-verse-flag'],
    {
      revalidate: 86400, // 24 hours
      tags: [`daily-verse-flag-${ip}-${input.language}`],
    }
  );

  const wasGenerated = await getIsVerseGenerated(ip, input.language);
  const verseData = await getCachedVerse(ip, input.language);

  if (wasGenerated && wasGenerated.generated) {
    return { ...verseData, isNew: false };
  }

  return verseData;
}
