import {z} from 'genkit';

/**
 * @fileOverview This file contains the Zod schemas and TypeScript types for the verse generation functionality.
 */

// Schema for the input of the generateVerse function.
export const GenerateVerseInputSchema = z.object({
  language: z.string().describe('The language to generate the verse in. (e.g., "English", "Portuguese", "Spanish")'),
});
export type GenerateVerseInput = z.infer<typeof GenerateVerseInputSchema>;

// Schema for the output of the generateVerse function.
export const GenerateVerseOutputSchema = z.object({
  book: z.string().describe('The book of the Bible the verse is from.'),
  chapter: z.number().describe('The chapter of the book the verse is from.'),
  verse: z.number().describe('The verse number in the chapter.'),
  text: z.string().describe('The text of the Bible verse.'),
});
export type GenerateVerseOutput = z.infer<typeof GenerateVerseOutputSchema>;


// Schema for the input of the getDailyVerse function.
export const DailyVerseInputSchema = z.object({
  language: z.string().describe('The language to generate the verse in. (e.g., "English", "Portuguese", "Spanish")'),
});
export type DailyVerseInput = z.infer<typeof DailyVerseInputSchema>;

// Schema for the output of the getDailyVerse function.
export const DailyVerseOutputSchema = z.object({
  verse: GenerateVerseOutputSchema,
  isNew: z.boolean().describe('Indicates if the verse was newly generated for the user.'),
});
export type DailyVerseOutput = z.infer<typeof DailyVerseOutputSchema>;
