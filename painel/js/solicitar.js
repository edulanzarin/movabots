document.addEventListener('DOMContentLoaded', function () {
    // Preços base e funcionalidades específicas por tipo de bot
    const botConfigurations = {
        'automacao': {
            basePrice: 700,
            features: [
                {
                    id: 'auto-rotinas',
                    name: 'Automação de Rotinas',
                    description: 'Execução automática de tarefas programadas',
                    price: 300
                },
                {
                    id: 'auto-integracao',
                    name: 'Integração com APIs',
                    description: 'Conexão com outros sistemas e plataformas',
                    price: 400
                },
                {
                    id: 'auto-relatorios',
                    name: 'Geração de Relatórios',
                    description: 'Cria relatórios automáticos em vários formatos',
                    price: 250
                },
                {
                    id: 'auto-notificacoes',
                    name: 'Sistema de Notificações',
                    description: 'Alertas e notificações automáticas',
                    price: 200
                }
            ]
        },
        'vendas': {
            basePrice: 800,
            features: [
                {
                    id: 'vendas-catalogo',
                    name: 'Catálogo de Produtos Interativo',
                    description: 'Exibição de produtos com fotos, preços e descrições',
                    price: 250
                },
                {
                    id: 'vendas-checkout',
                    name: 'Checkout Integrado',
                    description: 'Processamento de pagamentos com múltiplos gateways',
                    price: 400
                },
                {
                    id: 'vendas-carrinho',
                    name: 'Carrinho de Compras',
                    description: 'Salvar itens e finalizar compra posteriormente',
                    price: 200
                },
                {
                    id: 'vendas-cupons',
                    name: 'Sistema de Cupons',
                    description: 'Crie e gerencie cupons de desconto',
                    price: 150
                }
            ]
        },
        'chatbot': {
            basePrice: 900,
            features: [
                {
                    id: 'chat-faq',
                    name: 'Sistema de FAQ Automático',
                    description: 'Respostas automáticas para perguntas frequentes',
                    price: 300
                },
                {
                    id: 'chat-transferencia',
                    name: 'Transferência para Humano',
                    description: 'Encaminha para atendente quando necessário',
                    price: 350
                },
                {
                    id: 'chat-ia',
                    name: 'Respostas com IA',
                    description: 'Respostas inteligentes baseadas em contexto',
                    price: 500
                },
                {
                    id: 'chat-historico',
                    name: 'Histórico de Conversas',
                    description: 'Armazena todo o histórico de atendimento',
                    price: 250
                }
            ]
        },
        'divulgacao': {
            basePrice: 600,
            features: [
                {
                    id: 'div-agendamento',
                    name: 'Agendamento de Posts',
                    description: 'Programe mensagens para datas e horários específicos',
                    price: 300
                },
                {
                    id: 'div-segmentacao',
                    name: 'Segmentação de Público',
                    description: 'Envie mensagens para grupos específicos',
                    price: 400
                },
                {
                    id: 'div-analytics',
                    name: 'Painel de Analytics',
                    description: 'Métricas de abertura, cliques e conversões',
                    price: 350
                },
                {
                    id: 'div-multiplataforma',
                    name: 'Multiplataforma',
                    description: 'Divulgação simultânea no Telegram e WhatsApp',
                    price: 450
                }
            ]
        }
    };

    // Elementos
    const botTypeOptions = document.querySelectorAll('.bot-type-option');
    const featuresContainer = document.getElementById('specific-features-container');
    const featuresSummary = document.getElementById('features-summary');
    const basePriceElement = document.getElementById('base-price');
    const totalPriceElement = document.getElementById('total-price');
    const submitButton = document.getElementById('submit-order');

    // Estado
    let currentBotType = null;
    let currentBasePrice = 0;
    let selectedFeatures = [];
    let totalPrice = 0;

    // Selecionar tipo de bot
    botTypeOptions.forEach(option => {
        option.addEventListener('click', function () {
            // Remove seleção anterior
            botTypeOptions.forEach(opt => opt.classList.remove('selected'));

            // Adiciona seleção atual
            this.classList.add('selected');
            currentBotType = this.dataset.type;

            // Carrega configurações específicas
            loadBotConfiguration(currentBotType);
        });
    });

    // Carrega configurações específicas do bot selecionado
    function loadBotConfiguration(botType) {
        const config = botConfigurations[botType];

        if (!config) return;

        currentBasePrice = config.basePrice;
        totalPrice = currentBasePrice;

        // Atualiza preço base no resumo
        basePriceElement.innerHTML = `
            <span>Bot ${getBotTypeName(botType)} (Base)</span>
            <span>R$ ${currentBasePrice.toFixed(2)}</span>
        `;

        // Limpa features anteriores
        featuresContainer.innerHTML = '';
        featuresSummary.innerHTML = '';
        selectedFeatures = [];

        // Adiciona título das funcionalidades
        const featuresTitle = document.createElement('label');
        featuresTitle.textContent = `Funcionalidades para Bot ${getBotTypeName(botType)}`;
        featuresContainer.appendChild(featuresTitle);

        // Cria container para a lista
        const featuresList = document.createElement('div');
        featuresList.className = 'features-list';
        featuresContainer.appendChild(featuresList);

        // Adiciona cada funcionalidade
        config.features.forEach(feature => {
            const featureItem = document.createElement('div');
            featureItem.className = 'feature-item';
            featureItem.innerHTML = `
                <div class="feature-info">
                    <input type="checkbox" class="feature-checkbox" id="${feature.id}" data-price="${feature.price}">
                    <div>
                        <label for="${feature.id}">${feature.name}</label>
                        <p class="feature-description">${feature.description}</p>
                    </div>
                </div>
                <span class="feature-price">+ R$ ${feature.price.toFixed(2)}</span>
            `;
            featuresList.appendChild(featureItem);

            // Adiciona event listener para o checkbox
            const checkbox = featureItem.querySelector('.feature-checkbox');
            checkbox.addEventListener('change', function () {
                if (this.checked) {
                    selectedFeatures.push({
                        id: this.id,
                        name: feature.name,
                        price: feature.price
                    });
                } else {
                    selectedFeatures = selectedFeatures.filter(f => f.id !== this.id);
                }

                updateFeaturesSummary();
                updateTotalPrice();
            });
        });

        updateTotalPrice();
    }

    // Atualizar resumo de funcionalidades
    function updateFeaturesSummary() {
        featuresSummary.innerHTML = '';

        selectedFeatures.forEach(feature => {
            const featureElement = document.createElement('div');
            featureElement.className = 'order-item';
            featureElement.innerHTML = `
            <span>${feature.name}</span>
            <span>+ R$ ${feature.price.toFixed(2)}</span>
        `;
            featuresSummary.appendChild(featureElement);
        });
    }

    // Atualizar preço total
    function updateTotalPrice() {
        const featuresTotal = selectedFeatures.reduce((sum, feature) => sum + feature.price, 0);
        totalPrice = currentBasePrice + featuresTotal;

        totalPriceElement.textContent = `R$ ${totalPrice.toFixed(2)}`;
    }

    // Obter nome formatado do tipo de bot
    function getBotTypeName(type) {
        const names = {
            'automacao': 'de Automação',
            'vendas': 'de Vendas',
            'chatbot': 'ChatBot',
            'divulgacao': 'de Divulgação'
        };
        return names[type] || 'Personalizado';
    }

    // Enviar pedido
    submitButton.addEventListener('click', function () {
        if (!currentBotType) {
            showErrorNotification('Por favor, selecione um tipo de bot antes de continuar.');
            return;
        }

        // Simular envio
        const botName = document.getElementById('bot-name').value || 'Meu Bot';

        // Notificação de sucesso
        showSuccessNotification(`Bot "${botName}" solicitado com sucesso!`);

        // Ou em caso de erro:
        // showErrorNotification('Falha ao enviar solicitação');
    });
});