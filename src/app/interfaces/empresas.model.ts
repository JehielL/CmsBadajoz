export interface Empresa {
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
    streetAddress: string;
    latitude: number;
    longitude: number;
    email: string;
    extras: {
      facebook: string;
      image_gallery: string[];
      instagram: string;
      comer: boolean;
      dormir: boolean;
      status: boolean[];
      changed: string[];
    };
    sameAS: string;
    telephone: string;
    type: string[];
    type_id: number[];
  }
  