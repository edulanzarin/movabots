document.addEventListener('DOMContentLoaded', function () {
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-message');

    // Auto-ajuste da altura do textarea
    messageInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Enviar mensagem ao clicar no botão ou pressionar Enter
    function sendMessage() {
        const messageText = messageInput.value.trim();
        if (messageText === '') return;

        // Adiciona mensagem do usuário
        addMessage(messageText, 'user');
        messageInput.value = '';
        messageInput.style.height = 'auto';

        // Simula resposta do atendente após 1-3 segundos
        setTimeout(() => {
            const responses = [
                "Entendi sua dúvida. Vou verificar aqui...",
                "Poderia me dar mais detalhes sobre o problema?",
                "Já estou analisando seu caso.",
                "Isso normalmente acontece quando...",
                "Vou te ajudar com isso!"
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage(randomResponse, 'attendant');
        }, 1000 + Math.random() * 2000);
    }

    sendButton.addEventListener('click', sendMessage);

    messageInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Função para adicionar mensagem ao chat
    function addMessage(text, sender) {
        const now = new Date();
        const timeString = now.getHours().toString().padStart(2, '0') + ':' +
            now.getMinutes().toString().padStart(2, '0');

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">${timeString}</span>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Simula mensagem inicial do atendente se não houver mensagens
    if (chatMessages.children.length === 0) {
        setTimeout(() => {
            addMessage("Olá! Sou o atendente virtual da Movabots. Como posso te ajudar hoje?", 'attendant');
        }, 500);
    }
});