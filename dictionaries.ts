import 'server-only';

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  'pt-BR': () => import('./dictionaries/pt-BR.json').then((module) => module.default),
  es: () => import('./dictionaries/es.json').then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
    switch (locale) {
        case 'en':
            return dictionaries.en();
        case 'pt-BR':
            return dictionaries['pt-BR']();
        case 'es':
            return dictionaries.es();
        default:
            return dictionaries.en();
    }
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
