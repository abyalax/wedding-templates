import type { Module } from '../main';

export class ChatBot implements Module {
  init = () => this.bindEvents();

  private bindEvents = () => {
    const form = document.getElementById('chatbot') as HTMLFormElement;
    const chatContainer = document.getElementById('chat-container') as HTMLDivElement;
    const openModalIcon = document.getElementById('openModalIcon') as HTMLDivElement;
    const modalContainer = document.getElementById('modalContainer') as HTMLDivElement;
    const modalOverlay = document.getElementById('modalOverlay') as HTMLDivElement;
    const closeModalButton = document.getElementById('closeModalButton') as HTMLButtonElement;

    let isModalOpen = false;

    const fetchPost = async () => {
      const response = await fetch('http://localhost:3000/api/1/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'Halo', guestId: 1 }),
      });
      return response.json();
    };

    fetchPost()
      .then((data) => {
        console.log(data);
      })
      .catch((e) => {
        console.log(e);
      });

    // Function to toggle modal visibility
    function toggleModal(state: boolean) {
      isModalOpen = state;
      if (isModalOpen) {
        modalContainer?.classList.remove('d-none');
      } else {
        modalContainer?.classList.add('d-none');
      }
    }

    // Event listener for opening modal
    openModalIcon.addEventListener('click', (e) => {
      e.preventDefault();
      toggleModal(!isModalOpen);
      console.log(isModalOpen);
    });

    // Event listener for closing modal (button or clicking outside)
    closeModalButton.addEventListener('click', (e) => {
      e.preventDefault();
      toggleModal(false);
      console.log(isModalOpen);
    });

    modalOverlay.addEventListener('click', (e) => {
      // Close modal only if clicking outside modal content
      if (e.target === modalOverlay) {
        toggleModal(false);
        console.log(isModalOpen);
      }
    });

    function typeText(elementId: string, text: string, speed = 100) {
      let charIndex = 0;
      const element = document.getElementById(elementId) as HTMLParagraphElement;
      if (!element) return console.error(`Element with ID "${elementId}" not found`);

      function typeEffect() {
        if (charIndex < text.length) {
          element.textContent += text.charAt(charIndex);
          charIndex++;
          setTimeout(typeEffect, speed);
        }
      }
      element.textContent = '';
      typeEffect();
    }

    function loadChatHistory() {
      const userHistoryMessage = JSON.parse(localStorage.getItem('userMessage') ?? '{}') || [];
      const botHistoryMessage = JSON.parse(localStorage.getItem('botMessage') ?? '{}') || [];

      const messages: { sender: string; textMessage: string }[] = [];
      const maxLength = Math.max(userHistoryMessage.length, botHistoryMessage.length);

      for (let i = 0; i < maxLength; i++) {
        if (i < userHistoryMessage.length) {
          messages.push({ sender: 'user', textMessage: userHistoryMessage[i] });
        }
        if (i < botHistoryMessage.length) {
          messages.push({ sender: 'bot', textMessage: botHistoryMessage[i] });
        }
      }

      // Tambahkan semua pesan ke chatContainer terlebih dahulu
      chatContainer.innerHTML = messages
        .map((msg, index) => {
          return `
            <div class="message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}">
                <div class="d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}">
                ${
                  msg.sender === 'user'
                    ? `
                <div style="width: fit-content;" class="bg-dark-subtle rounded-3 p-1">
                    <p class="text-end user-chat">${msg.textMessage}</p>
                </div>
                `
                    : `
                <div style="width: fit-content;" class="bg-success-subtle rounded-3 p-1">
                    <p id="response-chatbot-${index}" class="text-start bot-chat">${msg.textMessage}</p>
                </div>
                `
                }
                </div>
            </div>
            `;
        })
        .join('');

      // Jalankan efek mengetik hanya untuk pesan terakhir yang dikirim oleh bot
      const lastBotMessageIndex = messages.findIndex((msg) => msg.sender === 'bot');
      if (lastBotMessageIndex !== -1) {
        typeText(`response-chatbot-${lastBotMessageIndex}`, messages[lastBotMessageIndex].textMessage, 30);
      }
    }

    loadChatHistory();

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data: { [key: string]: string } = {
        prompt: '',
      };

      formData.forEach((value, key) => {
        if (typeof value === 'string') {
          data[key] = value;
        }
      });

      if (!data.prompt) {
        console.log('❌ Prompt tidak terambil');
        return;
      }

      try {
        const res = await fetch('/api/gemini', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await res.json();
        console.log(result);

        const userMessage = JSON.parse(localStorage.getItem('userMessage') ?? '{}') || [];
        const botMessage = JSON.parse(localStorage.getItem('botMessage') ?? '{}') || [];

        userMessage.push(data.prompt);
        botMessage.push(result.response);

        localStorage.setItem('userMessage', JSON.stringify(userMessage));
        localStorage.setItem('botMessage', JSON.stringify(botMessage));

        loadChatHistory();
      } catch (error) {
        console.error('❌ Error saat mengirim prompt:', error);
        const response = document.getElementById('response');
        if (response) {
          response.textContent = 'Terjadi kesalahan, coba lagi nanti.';
        }
      }
    });
  };
}
