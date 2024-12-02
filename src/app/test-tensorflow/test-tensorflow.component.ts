import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FaceRecognitionService } from '../services/face-recognition.service';
import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-test-tensorflow',
  standalone: true,
  imports: [],
  templateUrl: './test-tensorflow.component.html',
  styleUrls: ['./test-tensorflow.component.css']

})
export class TestTensorflowComponent implements OnInit {
  @ViewChild('video', { static: true }) video!: ElementRef<HTMLVideoElement>;
  message: string = '';
  age: string = '';
  gender: string = '';
  compliment: string = '';
  isModelLoaded: boolean = false;
  isDetecting: boolean = false;

  constructor(private faceRecognitionService: FaceRecognitionService) {}

  async ngOnInit(): Promise<void> {
  try {
    console.log('Cargando el modelo...');
    await this.faceRecognitionService.loadModel();
    this.isModelLoaded = true;
    console.log('Modelo cargado exitosamente');
    this.startCameraAndDetect();
  } catch (error) {
    console.error('Error al cargar el modelo:', error);
    this.message = 'Error al cargar el modelo';
    this.speakMessage(this.message);
  }
}

// Detectar la cara una sola vez
async detectFaces(): Promise<void> {
  if (this.isDetecting) return;
  this.isDetecting = true;

  try {
    if (this.isModelLoaded) {
      console.log('Detectando rostros...');
      const data = await this.faceRecognitionService.detectFaces(this.video.nativeElement);

      if (data.age !== 0 && data.gender !== 'unknown') {
        const roundedAge = Math.floor(data.age); // Redondear edad al entero más cercano
        this.age = `Tienes unos ${roundedAge} años`; // Solo mostrar los dos primeros números
        this.gender = `Diría que eres ${data.gender === 'male' ? 'un caballero' : 'una dama'}`;
        this.compliment = this.generateFunCompliment(data.gender, roundedAge);

        // Mensaje de bienvenida según género
        const greeting = data.gender === 'male' ? 'Bienvenido' : 'Bienvenida';
        this.message = `${greeting}, Soy el Robot Adivino Toquio. ${this.gender}, ${this.age}. ${this.compliment}`;
      } else {
        this.message = 'No pude detectar claramente tu rostro. ¡Inténtalo de nuevo!';
      }
    } else {
      this.message = 'El modelo aún no está listo';
    }
  } catch (error) {
    console.error('Error al detectar rostros:', error);
    this.message = 'Ups, algo salió mal en la detección';
  } finally {
    // Añadir mensaje de cierre
    this.message += ' Esta vez lo he hecho gratis, la próxima seguro te cobraré.';
    this.speakMessage(this.message);

    this.isDetecting = false;
    this.stopCamera();
  }
}



  // Iniciar la cámara y realizar una detección única
  startCameraAndDetect(): void {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      this.video.nativeElement.srcObject = stream;
      this.video.nativeElement.play();
      this.video.nativeElement.onloadeddata = () => {
        console.log('Video cargado. Detectando cara...');
        this.detectFaces(); // Realiza detección una sola vez
      };
    }).catch((error) => {
      console.error('Error al acceder a la cámara:', error);
      this.message = 'No se pudo acceder a la cámara';
      this.speakMessage(this.message);
    });
  }


 

  // Detener la cámara después de la detección
  stopCamera(): void {
    const stream = this.video.nativeElement.srcObject as MediaStream;
    const tracks = stream?.getTracks();
    tracks?.forEach(track => track.stop());
    this.video.nativeElement.srcObject = null;
  }

  // Convertir texto a voz
  speakMessage(message: string): void {
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      console.error('Ya se está reproduciendo un mensaje.');
      return;
    }
    if (message !== '') {
      const utterThis = new SpeechSynthesisUtterance(message);
      utterThis.onend = () => console.log('Mensaje reproducido.');
      utterThis.onerror = (event) => console.error('Error al reproducir el mensaje:', event);
      synth.speak(utterThis);
    }
  }

  // Generar cumplidos personalizados y divertidos
  generateFunCompliment(gender: string, age: number): string {
    const maleCompliments = [
      "¡Podrías ser el próximo protagonista de una película de acción!",
      "¡Esa barba o falta de ella grita estilo!",
      "¡Qué porte, digno de un modelo en la pasarela!",
    ];
    const femaleCompliments = [
      "¡Definitivamente podrías ser portada de revista!",
      "¡Tu estilo es imbatible, como siempre!",
      "¡Esa energía radiante ilumina la habitación!",
    ];
    const ageCompliments = age < 25
      ? "¡Tan joven y ya con tanto carisma!"
      : age < 40
      ? "¡En el mejor momento de la vida, sin duda!"
      : "¡Qué experiencia y elegancia se ven en tu rostro!";

    return gender === 'male'
      ? maleCompliments[Math.floor(Math.random() * maleCompliments.length)] + ' ' + ageCompliments
      : femaleCompliments[Math.floor(Math.random() * femaleCompliments.length)] + ' ' + ageCompliments;
  }
}



