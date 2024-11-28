export interface Oferta {
    path: Array<{
      langcode: string;
    }>;
    identifier: number;
    addressCountry: string;
    addressRegion: string;
    addressProvince: string;
    description: string;
    availableLanguage: string[];
    availabilityStarts: string;
    availabilityEnds: string;
    image: string;
    addressLocality: string;
    addressLocality_id: number;
    name: string;
    extras: {
      empresa_une_178503: string[];
      empresa: number[];
      status: boolean[];
      changed: string[];
    };
  }
  