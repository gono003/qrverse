'use server';

/**
 * @fileOverview Generates a unique Bible verse using the Gemini API.
 *
 * - generateVerse - A function that generates a random bible verse.
 */

import {ai} from '@/ai/genkit';
import { GenerateVerseInputSchema, GenerateVerseOutputSchema, type GenerateVerseInput, type GenerateVerseOutput } from '@/types/verse';

export async function generateVerse(input: GenerateVerseInput): Promise<GenerateVerseOutput> {
  return generateVerseFlow(input);
}

const versePrompt = ai.definePrompt({
  name: 'versePrompt',
  input: {schema: GenerateVerseInputSchema},
  output: {schema: GenerateVerseOutputSchema},
  prompt: `You are a helpful assistant designed to provide inspiration through Bible verses.

  Respond with a single, randomly selected Bible verse.
  The verse must be in the following language: {{{language}}}.
  Include the book, chapter, verse number, and the verse text.
  The output should be in JSON format.
  `,
});

const generateVerseFlow = ai.defineFlow(
  {
    name: 'generateVerseFlow',
    inputSchema: GenerateVerseInputSchema,
    outputSchema: GenerateVerseOutputSchema,
  },
  async input => {
    const {output} = await versePrompt(input);
    return output!;
  }
);
