import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent implements OnInit {
  messages: { role: string, content: string }[] = []; // Arreglo para almacenar los mensajes
  apiKey: string = 'E5s6NcdrMKyVfnExcPg8nGXbXuv2ZV';
  maxMessagesToShow: number = 10;

  constructor() {}

  ngOnInit() {
    this.loadHistory(); // Cargar el historial de mensajes cuando se inicia el componente
  }

  async loadHistory() {
    try {
      const response = await fetch('https://futurachatbot.com/app2/history', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "x-contexto": "LaVictoria-context",
          'x-api-key': this.apiKey
        },
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Error en la respuesta de la API');

      const data = await response.json();
      const filteredHistory = data.history.slice(1); // Filtrar mensajes si es necesario
      this.displayMessages(filteredHistory);
    } catch (error) {
      console.error('Error al cargar el historial:', error);
    }
  }

  displayMessages(messages: any[]) {
    const messagesToShow = messages.length >= this.maxMessagesToShow ? messages.slice(-this.maxMessagesToShow) : messages;

    messagesToShow.forEach(messageData => {
      this.messages.push({ role: messageData.role, content: messageData.content });
    });
  }
  closeChat() {
    const chatBot = document.getElementById('chat-bot');
    if (chatBot) {
      chatBot.style.display = 'none'; // Ocultar el chat cuando se llama esta función
    }
  }
  
  async sendMessage(event: Event) {
    event.preventDefault();
    const messageInput = (document.getElementById('message-input') as HTMLInputElement).value;
    if (!messageInput) return;

    try {
      const response = await fetch('https://futurachatbot.com/app2/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "x-contexto": "LaVictoria-context",
          'x-api-key': this.apiKey
        },
        body: JSON.stringify({ message: messageInput }),
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Error en la respuesta de la API');

      const data = await response.json();
      this.displayMessages(data.history.slice(1));

      (document.getElementById('message-input') as HTMLInputElement).value = '';
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendMessage(event);
    }
  }

  toggleChat() {
    const chatBot = document.getElementById('chat-bot');
    if (chatBot) {
      chatBot.style.display = chatBot.style.display === 'none' || chatBot.style.display === '' ? 'block' : 'none';
    }
  }

  async resetChat() {
    try {
      const response = await fetch('https://futurachatbot.com/app2/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "x-contexto": "LaVictoria-context",
          'x-api-key': this.apiKey
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta de la API');
      }

      // Limpiar el chat al resetear
      this.messages = [];
    } catch (error) {
      console.error('Error al resetear el chat:', error);
    }
  }
}
