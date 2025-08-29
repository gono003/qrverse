"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Languages, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: "en", name: "English" },
  { code: "pt-BR", name: "Português (Brasil)" },
  { code: "es", name: "Español" },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = pathname.split("/")[1] || 'pt-BR';

  const switchLanguage = (lang: string) => {
    const newPath = `/${lang}${pathname.substring(currentLang.length + 1)}`;
    router.push(newPath);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon">
            <Languages className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onSelect={() => switchLanguage(lang.code)}
              className="flex justify-between items-center"
            >
              <span>{lang.name}</span>
              {currentLang === lang.code && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
