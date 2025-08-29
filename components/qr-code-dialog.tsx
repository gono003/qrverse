"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Printer, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import type { Dictionary } from "@/dictionaries";

type QRCodeDialogProps = {
  dict: Dictionary['qrCodeDialog'];
  children: ReactNode;
}

export function QRCodeDialog({ dict, children }: QRCodeDialogProps) {
  const [url, setUrl] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const qrImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentUrl = window.location.href;
      setUrl(currentUrl);
      setQrCodeUrl(
        `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(
          currentUrl
        )}`
      );
    }
  }, []);

  const handleCopy = () => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    toast({
      title: dict.toast.copiedTitle,
      description: dict.toast.copiedDescription,
    });
  };

  const handleDownload = async () => {
    if (!qrCodeUrl) return;
    try {
      const response = await fetch(qrCodeUrl);
      if (!response.ok) throw new Error(dict.toast.downloadError);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = downloadUrl;
      a.download = "qrverse-qrcode.png";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      a.remove();
    } catch (error) {
      toast({
        variant: "destructive",
        title: dict.toast.errorTitle,
        description: dict.toast.downloadError,
      });
    }
  };

  const handlePrint = () => {
    if (!qrImageRef.current || isLoading) return;
    
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${dict.printTitle}</title>
            <style>
              body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
              img { max-width: 100%; max-height: 100vh; }
              @page { size: auto; margin: 20mm; }
            </style>
          </head>
          <body>
            <img src="${qrImageRef.current.src}" alt="QR Code" />
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      };
    }
  };


  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dict.title}</DialogTitle>
          <DialogDescription>
            {dict.description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center p-4 bg-white rounded-lg">
          {isLoading && <Skeleton className="h-64 w-64" />}
          <img
            ref={qrImageRef}
            src={qrCodeUrl}
            alt="QR Code"
            width={256}
            height={256}
            className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setIsLoading(false)}
            style={{ display: isLoading ? 'none' : 'block' }}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Input id="link" value={url} readOnly className="text-sm" />
          <Button type="button" variant="secondary" size="icon" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
            <span className="sr-only">{dict.copyUrlButton}</span>
          </Button>
        </div>
        <DialogFooter className="sm:justify-start gap-2 flex-wrap">
          <Button type="button" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            {dict.downloadButton}
          </Button>
          <Button type="button" variant="secondary" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            {dict.printButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
