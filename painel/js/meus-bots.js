// Dados simulados recebidos do backend
const userBots = [
    {
        id: 1,
        name: "Vendas Express",
        type: "vendas",
        status: "active",
        created: "15/03/2023",
        icon: "shopping-cart"
    },
    {
        id: 2,
        name: "Atendente Virtual",
        type: "chatbot",
        status: "inactive",
        created: "10/02/2023",
        icon: "comments"
    },
    {
        id: 3,
        name: "Divulgador Pro",
        type: "divulgacao",
        status: "active",
        created: "05/04/2023",
        icon: "bullhorn"
    },
    {
        id: 4,
        name: "Automatizador",
        type: "automacao",
        status: "active",
        created: "20/01/2023",
        icon: "robot"
    },
    {
        id: 4,
        name: "Automatizador",
        type: "automacao",
        status: "active",
        created: "20/01/2023",
        icon: "robot"
    },
    {
        id: 4,
        name: "Automatizador",
        type: "automacao",
        status: "active",
        created: "20/01/2023",
        icon: "robot"
    },
    {
        id: 4,
        name: "Automatizador",
        type: "automacao",
        status: "active",
        created: "20/01/2023",
        icon: "robot"
    },
    {
        id: 4,
        name: "Automatizador",
        type: "automacao",
        status: "active",
        created: "20/01/2023",
        icon: "robot"
    },
    {
        id: 4,
        name: "Automatizador",
        type: "automacao",
        status: "active",
        created: "20/01/2023",
        icon: "robot"
    },
    {
        id: 4,
        name: "Automatizador",
        type: "automacao",
        status: "active",
        created: "20/01/2023",
        icon: "robot"
    },
    {
        id: 4,
        name: "Automatizador",
        type: "automacao",
        status: "active",
        created: "20/01/2023",
        icon: "robot"
    },
];

// Mapeamento de tipos para nomes amigáveis
const botTypeNames = {
    'vendas': 'Bot de Vendas',
    'chatbot': 'ChatBot',
    'divulgacao': 'Bot de Divulgação',
    'automacao': 'Bot de Automação',
};

document.addEventListener('DOMContentLoaded', function () {
    const botsGrid = document.querySelector('.bots-grid');

    // Limpa os exemplos estáticos
    botsGrid.innerHTML = '';

    // Renderiza cada bot dinamicamente
    userBots.forEach(bot => {
        const botCard = document.createElement('div');
        botCard.className = `bot-card status-${bot.status}`;

        // Determina o texto do status
        const statusText = bot.status === 'active' ? 'Ativo' : 'Inativo';

        botCard.innerHTML = `
            <div class="bot-header">
                <div class="bot-icon">
                    <i class="fas fa-${bot.icon}"></i>
                </div>
                <div class="bot-info">
                    <h3>${bot.name}</h3>
                    <span class="bot-type">${botTypeNames[bot.type] || bot.type}</span>
                </div>
                <div class="bot-status">
                    <span class="status-badge ${bot.status}">${statusText}</span>
                </div>
            </div>
            <div class="bot-details">
                <div class="detail-item">
                    <span>Criado em:</span>
                    <strong>${bot.created}</strong>
                </div>
            </div>
            <div class="bot-actions">
                ${bot.status === 'active' ?
                `<button class="btn-action" data-bot-id="${bot.id}">
                        <i class="fas fa-toggle-off"></i> Desativar
                    </button>` :
                `<button class="btn-action" data-bot-id="${bot.id}">
                        <i class="fas fa-toggle-on"></i> Ativar
                    </button>`
            }
            </div>
        `;

        botsGrid.appendChild(botCard);
    });

    // Adiciona event listeners para os botões
    document.querySelectorAll('.btn-action').forEach(button => {
        button.addEventListener('click', function () {
            const botId = this.getAttribute('data-bot-id');
            const action = this.querySelector('i').className.split(' ')[1];

            console.log(`Ação "${action}" no bot ${botId}`);
            // Aqui você pode adicionar a lógica para cada ação
        });
    });
});