import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { ClienteData } from '../interfaces/cliente.model';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  messages: { role: string, content: string }[] = [];
  apiKey: string = 'E5s6NcdrMKyVfnExcPg8nGXbXuv2ZV';
  maxMessagesToShow: number = 10;
  isLoading = false;
  historyLoaded: boolean = false;
  hasStartedChatbot: boolean = false;
  displayedMessages: Set<string> = new Set();

  ngOnInit() {
    this.loadHistory();
  }

  async loadHistory() {
    if (this.historyLoaded) return;

    try {
      const response = await fetch('https://futurachatbot.com/app2/history', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "x-contexto": "badajoz-context",
          'x-api-key': this.apiKey
        },
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Error en la respuesta de la API');

      const data = await response.json();
      const filteredHistory = data.history.slice(1); // Excluye el primer mensaje
      this.displayMessages(filteredHistory);
      this.historyLoaded = true;
    } catch (error) {
      console.error('Error al cargar el historial:', error);
    }
  }

  displayMessages(messages: any[]) {
    const messagesToShow = messages.length >= this.maxMessagesToShow ? messages.slice(-this.maxMessagesToShow) : messages;

    messagesToShow.forEach(messageData => {
      if (!this.displayedMessages.has(messageData.content)) {
        this.messages.push({ role: messageData.role, content: messageData.content });
        this.displayedMessages.add(messageData.content); // Marca este mensaje como mostrado
      }
    });
  }

  closeChat() {
    const chatBot = document.getElementById('chat-bot');
    if (chatBot) {
      chatBot.style.display = 'none';
    }
  }

  async sendMessage(event: Event) {
    event.preventDefault();
    const messageInput = (document.getElementById('message-input') as HTMLInputElement).value;
    if (!messageInput) return;

    // Evitar agregar el mismo mensaje repetido
    if (this.messages.length > 0 && this.messages[this.messages.length - 1].content === messageInput) {
      return;
    }

    if (!this.displayedMessages.has(messageInput)) {
      this.messages.push({ role: 'user', content: messageInput });
      this.displayedMessages.add(messageInput); // Marca el mensaje como mostrado
    }

    // Activa el loader antes de enviar el mensaje al chatbot
    this.isLoading = true;
    await this.sendMessageToChatbot(messageInput);

    (document.getElementById('message-input') as HTMLInputElement).value = '';
  }

  async sendMessageToChatbot(userMessage: string) {
    try {
      const response = await fetch('https://futurachatbot.com/app2/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "x-contexto": "badajoz-context",
          'x-api-key': this.apiKey
        },
        body: JSON.stringify({ message: userMessage }),
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Error en la respuesta de la API');

      const data = await response.json();
      const chatbotMessages = data.history.slice(1); // Excluye el primer mensaje de la respuesta

      chatbotMessages.forEach((messageData: { role: string, content: string }) => {
        if (!this.displayedMessages.has(messageData.content)) {
          this.messages.push({ role: messageData.role, content: messageData.content });
          this.displayedMessages.add(messageData.content); // Marca el mensaje como mostrado
        }
      });
    } catch (error) {
      console.error('Error al enviar el mensaje al chatbot:', error);
    } finally {
      // Desactiva el loader después de recibir la respuesta
      setTimeout(() => { this.isLoading = false; }, 2000);
    }
  }

  startChatbotInteraction() {
    throw new Error('Method not implemented.');
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendMessage(event);
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
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
          "x-contexto": "badajoz-context",
          'x-api-key': this.apiKey
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta de la API');
      }

      this.messages = [];
      this.historyLoaded = false;
      this.displayedMessages.clear(); // Limpiar los mensajes mostrados

      this.loadHistory();
    } catch (error) {
      console.error('Error al resetear el chat:', error);
    }
  }
}

