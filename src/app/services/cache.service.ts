import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  
  async cacheImage(imageUrl: string, identifier: number): Promise<void> {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64data = reader.result?.toString();
        if (base64data) {
          await Preferences.set({
            key: `image_${identifier}`,  // Clave única para cada imagen
            value: base64data
          });
        }
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error al cachear la imagen:', error);
    }
  }

  async getCachedImage(identifier: number): Promise<string | null> {
    const { value } = await Preferences.get({ key: `image_${identifier}` });
    return value || null;
  }

  async clearCache(): Promise<void> {
    await Preferences.clear();
  }
}
