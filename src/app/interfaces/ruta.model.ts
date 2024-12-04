import { SafeUrl } from "@angular/platform-browser";

export interface Ruta {
    identifier: number;
    name: string;
    description: string;
    addressCountry: string;
    addressRegion: string;
    addressProvince: string;
    addressLocality: string;
    addressLocality_id: number;
    image: string;
    video?: string;
    audio?: string;
    ratingValue?: string;
    availableLanguage: string[];
    path: {
      langcode: string;
    }[];
    extras: {
      image_gallery?: string[];
      kml_une_178503?: string;
      puntosintermedios?: number[];
      puntosintermedios_une_178503?: string[];
      puntosfin?: number[];
      puntosfin_une_178503?: string[];
      puntoinicial?: number;
      puntoinicial_une_178503?: string;
      status?: boolean[];
      changed?: string[];
      [key: string]: any;
    };
    imageSafeUrl?: SafeUrl;  // Añadir esta línea

    [key: string]: any;
  }
  