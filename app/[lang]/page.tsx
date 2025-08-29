import { getDailyVerse } from "@/ai/flows/get-daily-verse";
import { QRCodeDialog } from "@/components/qr-code-dialog";
import { getDictionary } from "@/dictionaries";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import type { DailyVerseOutput } from "@/types/verse";

export default async function Home({ params: { lang } }: { params: { lang: string } }) {
  let verseData: DailyVerseOutput | null = null;
  let error: string | null = null;
  
  const dict = await getDictionary(lang);

  try {
    verseData = await getDailyVerse({ language: lang });
  } catch (e) {
    console.error("Failed to generate verse:", e);
    error = dict.home.error;
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
       <header className="py-6 px-4 sm:px-8 absolute top-0 w-full z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex-1 sm:hidden"></div>
          <div className="flex-1 flex justify-center">
            <h1 className="text-center text-3xl md:text-4xl font-headline font-bold tracking-widest text-foreground drop-shadow-sm">
              QRVERSE
            </h1>
          </div>
          <div className="flex-1 flex justify-end">
            <div className="hidden sm:block">
              <QRCodeDialog dict={dict.qrCodeDialog}>
                <Button variant="default">
                  <QrCode className="mr-2 h-4 w-4" />
                  {dict.qrCodeDialog.generateButton}
                </Button>
              </QRCodeDialog>
            </div>
            <div className="sm:hidden">
              <QRCodeDialog dict={dict.qrCodeDialog}>
                <Button variant="ghost" size="icon">
                  <QrCode className="h-6 w-6" />
                </Button>
              </QRCodeDialog>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center text-center px-4">
        <div className="max-w-4xl animate-in fade-in-up duration-1000">
          {error && <p className="text-destructive text-lg">{error}</p>}
          {verseData?.isNew === false && (
              <p className="text-xl md:text-2xl text-foreground/80 mb-6 animate-in fade-in duration-500">
                  {dict.home.dailyVerseMessage}
              </p>
          )}
          {verseData && (
            <blockquote className="space-y-6">
              <p className="text-3xl md:text-5xl font-medium leading-tight md:leading-tight text-foreground">
                &ldquo;{verseData.verse.text}&rdquo;
              </p>
              <cite className="block text-xl md:text-2xl text-foreground/70 not-italic">
                {verseData.verse.book} {verseData.verse.chapter}:{verseData.verse.verse}
              </cite>
            </blockquote>
          )}
        </div>
      </main>

      <footer className="py-6 px-4 text-center text-sm text-foreground/60">
        <p>&copy; {new Date().getFullYear()} QRVerse. {dict.home.footer}</p>
      </footer>
    </div>
  );
}
