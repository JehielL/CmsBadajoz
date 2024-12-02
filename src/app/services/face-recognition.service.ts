import { Injectable } from '@angular/core';
import * as faceapi from 'face-api.js';

@Injectable({
  providedIn: 'root'
})
export class FaceRecognitionService {
  private modelLoaded: boolean = false;

  // Cargar el modelo de face-api.js
  async loadModel(): Promise<void> {
    try {
      console.log('Cargando el modelo de detección de rostros de face-api.js...');
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/assets/models/'); // Cargar el modelo de detección de rostros
      await faceapi.nets.ageGenderNet.loadFromUri('/assets/models/'); // Cargar el modelo de edad y género
      this.modelLoaded = true;
      console.log('Modelos cargados exitosamente');
    } catch (error) {
      console.error('Error al cargar los modelos:', error);
    }
  }

  // Detectar caras y predecir edad y género usando face-api.js
  async detectFaces(videoElement: HTMLVideoElement): Promise<{ age: number, gender: string }> {
    if (!this.modelLoaded) {
      console.error('Intentando detectar caras antes de que el modelo esté cargado');
      throw new Error('El modelo no está cargado');
    }

    try {
      // Detectar caras en el video
      const detections = await faceapi.detectAllFaces(videoElement).withAgeAndGender();
      console.log('Detecciones:', detections);  // Verifica las detecciones en la consola

      if (detections.length > 0) {
        // Asumimos que el primer rostro detectado es el que analizaremos
        const { age, gender } = detections[0];
        return { age, gender };
      } else {
        console.log('No se detectaron rostros');
        return { age: 0, gender: 'unknown' }; // Devolver valores predeterminados si no se detecta ningún rostro
      }
    } catch (error) {
      console.error('Error al detectar rostros:', error);
      return { age: 0, gender: 'unknown' };  // Devolver valores predeterminados en caso de error
    }
  }
}

