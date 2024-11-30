export interface Noticia {
    path: {
      alias: string;
      pid: number;
      langcode: string;
    }[];
    identifier: number;
    addressCountry: string;
    addressRegion: string;
    addressProvince: string;
    description: string;
    availableLanguage: string[];
    image: string;
    addressLocality: string;
    addressLocality_id: number;
    name: string;
    latitude: number;
    longitude: number;
    extras: {
      image_gallery: string[];
      status: boolean[];
      changed: string[];
    };
  }
  