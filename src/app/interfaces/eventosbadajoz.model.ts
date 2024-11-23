import { SafeUrl, SafeHtml } from '@angular/platform-browser';


export interface EventosBadajoz {
    identifier: number;
    name: string;
    description:  String ; // Puedes cambiar a SafeHtml si prefieres
    path: { langcode: string }[];
    addressCountry: string;
    addressRegion: string;
    addressProvince: string;
    addressLocality: string;
    addressLocality_id: number;
    streetAddress: string;
    latitude?: number; // Opcional si no todos tienen este dato
    longitude?: number; // Opcional si no todos tienen este dato
    startDate: string; // Puedes cambiar a Date si lo prefieres
    endDate: string; // Puedes cambiar a Date si lo prefieres
    image?: string; // Opcional si no todos tienen imagen
    availableLanguage: string[];
    extras: {
      status: boolean[];
      changed: string[];
      comment?: {
        cid: number;
        uid: string;
        created: string; // Puedes cambiar a Date si lo parseas
        changed: string; // Puedes cambiar a Date si lo parseas
        status: string;
        langcode: string;
        title: string;
        comment_body: string;
        comment_body_format: string;
      }[];
    };
  }
  