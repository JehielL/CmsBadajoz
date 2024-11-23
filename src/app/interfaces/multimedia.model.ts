export interface Multimedia {
  identifier: number;
  addressCountry: string;
  addressRegion: string;
  addressProvince: string;
  description: string;
  availableLanguage: string[];
  addressLocality: string;
  addressLocality_id: number;
  name: string;
  latitude: number;
  longitude: number;
  image?: string; 
  extras: {
    status: boolean[];
    changed: string[];
    image_gallery?: string[];
  };
  path: {
    langcode: string;
  }[];
  ratingValue?: string;
  streetAddress?: string;
  sameAS?: string;
  type?: string[];
  type_id?: number[];
  touristType?: string[];
  touristType_id?: number[];
  telephone: string;
  email: string;
  [key: string]: any; // Índice de firma para aceptar propiedades adicionales

}
