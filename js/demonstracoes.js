document.addEventListener('DOMContentLoaded', function () {
    // Animação de entrada dos elementos (comum a toda página)
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    // Animar cards de solução
    const solutionCards = document.querySelectorAll('.solution-demo-card');
    solutionCards.forEach((card, index) => {
        card.style.opacity = 0;
        animateOnScroll.observe(card);
    });

    // Animar hero section
    const heroContent = document.querySelector('.demo-hero-content');
    const heroImage = document.querySelector('.demo-hero-image');

    heroContent.style.opacity = 0;
    heroContent.style.transform = 'translateY(20px)';
    heroContent.style.transition = 'all 0.6s ease-out';

    heroImage.style.opacity = 0;
    heroImage.style.transform = 'translateY(20px)';
    heroImage.style.transition = 'all 0.6s ease-out';

    setTimeout(() => {
        heroContent.style.opacity = 1;
        heroContent.style.transform = 'translateY(0)';
        heroImage.style.opacity = 1;
        heroImage.style.transform = 'translateY(0)';
    }, 50);

    // Animar barras de métricas quando visíveis
    const metricBars = document.querySelectorAll('.metric-bar');
    const animateBars = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 100);
            }
        });
    }, { threshold: 0.5 });

    metricBars.forEach(bar => {
        animateBars.observe(bar);
    });

    // ==============================================
    // BOT DE AGENDAMENTO INTERATIVO
    // ==============================================
    const automationChat = document.querySelector('.automation-chat');
    if (automationChat) {
        const automationMessages = automationChat.querySelector('.chat-messages');
        const automationInput = automationChat.querySelector('.message-input input');
        const automationSendButton = automationChat.querySelector('.message-input .fa-paper-plane');
        const automationUserStatus = automationChat.querySelector('.user-status');

        // Estado do agendamento
        let schedulingState = {
            step: 0, // 0 = início, 1 = escolha data, 2 = escolha horário, 3 = assunto, 4 = confirmação
            date: null,
            time: null,
            subject: null
        };

        // Saudação inicial
        setTimeout(() => {
            addAutomationMessage('bot', '👋 Olá! Sou o Assistente de Agendamentos. Digite /agendar para começar ou /ajuda para ver opções.');
        }, 1000);

        // Event listeners
        automationSendButton.addEventListener('click', handleAutomationMessage);
        automationInput.addEventListener('keypress', (e) => e.key === 'Enter' && handleAutomationMessage());
        automationInput.readOnly = false; // Habilita o input para interação

        function handleAutomationMessage() {
            const message = automationInput.value.trim();
            if (!message) return;

            addAutomationMessage('user', message);
            automationInput.value = '';
            automationUserStatus.textContent = "digitando...";

            const typingIndicator = showAutomationTypingIndicator();

            setTimeout(() => {
                typingIndicator.remove();
                processAutomationResponse(message);
                automationUserStatus.textContent = "online";
            }, 1000 + Math.random() * 1000);
        }

        function processAutomationResponse(message) {
            const cmd = message.toLowerCase();

            // Resetar estado se começar novo agendamento
            if (cmd === '/agendar' || cmd === 'agendar') {
                schedulingState = { step: 1, date: null, time: null, subject: null };
                return addAutomationMessage('bot', '📅 Para qual dia você gostaria de agendar? (DD/MM/AAAA ou "hoje"/"amanhã")');
            }

            // Fluxo de agendamento
            switch (schedulingState.step) {
                case 1: // Escolha da data
                    schedulingState.date = parseDateInput(cmd);
                    if (!schedulingState.date) {
                        return addAutomationMessage('bot', '⚠️ Data inválida. Por favor, digite no formato DD/MM/AAAA ou "hoje"/"amanhã"');
                    }
                    schedulingState.step = 2;
                    return addAutomationMessage('bot', `⏰ Horários disponíveis para ${formatDate(schedulingState.date)}:\n\n🕘 09:00\n🕙 10:30\n🕑 14:00\n🕓 16:00\n\nDigite o horário desejado:`);

                case 2: // Escolha do horário
                    if (!isValidTime(cmd)) {
                        return addAutomationMessage('bot', '⚠️ Horário inválido. Por favor, escolha entre os horários listados (ex: 14:00)');
                    }
                    schedulingState.time = cmd;
                    schedulingState.step = 3;
                    return addAutomationMessage('bot', '🔍 Qual será o assunto da reunião? (Ex: Revisão de projeto, Consultoria)');

                case 3: // Informar assunto
                    schedulingState.subject = cmd;
                    schedulingState.step = 4;
                    return addAutomationMessage('bot', `📝 <b>Resumo do agendamento:</b>\n\n📅 Data: ${formatDate(schedulingState.date)}\n⏰ Horário: ${schedulingState.time}\n📌 Assunto: ${schedulingState.subject}\n\nDigite /confirmar para finalizar ou /cancelar para recomeçar`);

                case 4: // Confirmação
                    if (cmd === '/confirmar' || cmd === 'confirmar') {
                        schedulingState.step = 0;
                        return addAutomationMessage('bot', `✅ <b>Agendamento confirmado!</b>\n\nDetalhes:\n📅 ${formatDate(schedulingState.date)} às ${schedulingState.time}\n📌 ${schedulingState.subject}\n\nUm link será enviado 1 hora antes. Digite /agendar para nova marcação.`);
                    } else if (cmd === '/cancelar' || cmd === 'cancelar') {
                        schedulingState = { step: 0, date: null, time: null, subject: null };
                        return addAutomationMessage('bot', '❌ Agendamento cancelado. Digite /agendar para começar novo.');
                    } else {
                        return addAutomationMessage('bot', 'Por favor, digite /confirmar ou /cancelar');
                    }

                default: // Comandos gerais
                    if (cmd === '/ajuda' || cmd === 'ajuda') {
                        return addAutomationMessage('bot', '📋 <b>Comandos disponíveis:</b>\n\n/agendar - Iniciar novo agendamento\n/ajuda - Mostrar esta ajuda');
                    } else {
                        return addAutomationMessage('bot', 'Não entendi. Digite /agendar para marcar uma reunião ou /ajuda para ver opções.');
                    }
            }
        }

        // Funções auxiliares
        function parseDateInput(input) {
            if (input === 'hoje') return new Date();
            if (input === 'amanhã' || input === 'amanha') {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                return tomorrow;
            }

            // Verificar formato DD/MM/AAAA
            const dateParts = input.split('/');
            if (dateParts.length === 3) {
                const day = parseInt(dateParts[0]);
                const month = parseInt(dateParts[1]) - 1;
                const year = parseInt(dateParts[2]);
                const date = new Date(year, month, day);

                if (!isNaN(date.getTime())) {
                    return date;
                }
            }

            return null;
        }

        function formatDate(date) {
            const options = { weekday: 'long', day: 'numeric', month: 'long' };
            return date.toLocaleDateString('pt-BR', options);
        }

        function isValidTime(time) {
            const validTimes = ['09:00', '10:30', '14:00', '16:00'];
            return validTimes.includes(time);
        }

        function addAutomationMessage(sender, text) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', `message-${sender}`);
            messageElement.innerHTML = text.replace(/\n/g, '<br>');

            const timeElement = document.createElement('div');
            timeElement.classList.add('message-time');
            timeElement.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            messageElement.appendChild(timeElement);
            automationMessages.appendChild(messageElement);
            automationMessages.scrollTop = automationMessages.scrollHeight;
        }

        function showAutomationTypingIndicator() {
            const typingElement = document.createElement('div');
            typingElement.classList.add('typing-indicator');
            typingElement.innerHTML = `
            <div class="typing-dots">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
            <span>Digitando...</span>
        `;
            automationMessages.appendChild(typingElement);
            automationMessages.scrollTop = automationMessages.scrollHeight;
            return typingElement;
        }
    }

    // ==============================================
    // CHATBOT IA (Conversação Natural)
    // ==============================================
    const iaChat = document.querySelector('.ia-chat');
    if (iaChat) {
        const iaMessages = iaChat.querySelector('.chat-messages');
        const iaInput = iaChat.querySelector('#chat-input');
        const iaSendButton = iaChat.querySelector('#send-button');
        const iaUserStatus = iaChat.querySelector('.user-status');

        // Histórico da conversa
        let conversationHistory = [
            { role: "system", content: "Você é um assistente de IA útil, amigável e divertido. Responda de forma natural como em uma conversa humana." }
        ];

        // Saudação inicial
        setTimeout(() => {
            addIaBotMessage("Olá! 👋 Sou um assistente de IA. Como posso te ajudar hoje?");
        }, 1000);

        // Enviar mensagem
        iaSendButton.addEventListener('click', sendIaMessage);
        iaInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') sendIaMessage();
        });

        function sendIaMessage() {
            const message = iaInput.value.trim();
            if (message === '') return;

            addIaUserMessage(message);
            iaInput.value = '';
            iaUserStatus.textContent = "digitando...";
            const typingIndicator = showIaTypingIndicator();

            setTimeout(async () => {
                typingIndicator.remove();
                conversationHistory.push({ role: "user", content: message });

                try {
                    const botResponse = await simulateAIResponse(message);
                    conversationHistory.push({ role: "assistant", content: botResponse });
                    addIaBotMessage(botResponse);
                    iaUserStatus.textContent = "online";
                } catch (error) {
                    addIaBotMessage("Ops, tive um problema. Podemos tentar novamente?");
                    iaUserStatus.textContent = "online";
                }
            }, 1500 + Math.random() * 1000);
        }

        function addIaUserMessage(text) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', 'message-user');
            messageElement.textContent = text;

            const timeElement = document.createElement('div');
            timeElement.classList.add('message-time');
            timeElement.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            messageElement.appendChild(timeElement);
            iaMessages.appendChild(messageElement);
            iaMessages.scrollTop = iaMessages.scrollHeight;
        }

        function addIaBotMessage(text) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', 'message-bot');
            messageElement.innerHTML = text.replace(/\n/g, '<br>');

            const timeElement = document.createElement('div');
            timeElement.classList.add('message-time');
            timeElement.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            messageElement.appendChild(timeElement);
            iaMessages.appendChild(messageElement);
            iaMessages.scrollTop = iaMessages.scrollHeight;
        }

        function showIaTypingIndicator() {
            const typingElement = document.createElement('div');
            typingElement.classList.add('typing-indicator');
            typingElement.innerHTML = `
                <div class="typing-dots">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
                <span>Digitando...</span>
            `;
            iaMessages.appendChild(typingElement);
            iaMessages.scrollTop = iaMessages.scrollHeight;
            return typingElement;
        }

        async function simulateAIResponse(userMessage) {
            // Simular tempo de processamento
            await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

            const lastMessage = userMessage.toLowerCase();
            const now = new Date();

            // Respostas contextualizadas
            if (lastMessage.includes('oi') || lastMessage.includes('olá') || lastMessage.includes('ola')) {
                const greetings = [
                    "Oi! 😊 Como posso te ajudar hoje?",
                    "Olá! Tudo bem? No que posso ajudar?",
                    "E aí! 👋 Pronto para conversar?"
                ];
                return greetings[Math.floor(Math.random() * greetings.length)];
            }

            if (lastMessage.includes('tudo bem') || lastMessage.includes('como você está')) {
                return "Estou ótimo! Como assistente virtual, não tenho sentimentos, mas estou sempre pronto para ajudar! 😄";
            }

            if (lastMessage.includes('horas') || lastMessage.includes('hora')) {
                return `Agora são ${now.getHours()}h${now.getMinutes().toString().padStart(2, '0')}. ⏰`;
            }

            if (lastMessage.includes('piada') || lastMessage.includes('engraçado')) {
                const jokes = [
                    "Por que o livro de matemática estava triste? Porque tinha muitos problemas! 😆",
                    "Qual é o contrário de volátil? Vem cá sofrer! 🤣",
                    "O que o zero disse para o oito? - Belo cinto! 😂"
                ];
                return jokes[Math.floor(Math.random() * jokes.length)];
            }

            if (lastMessage.includes('clima') || lastMessage.includes('tempo')) {
                const weather = ["ensolarado", "chuvoso", "nublado", "com ventos fortes", "ameno"];
                return `Não tenho acesso em tempo real, mas posso chutar que está ${weather[Math.floor(Math.random() * weather.length)]}! 🌤️`;
            }

            if (lastMessage.includes('nome')) {
                return "Me chamam de Assistente IA! 🤖 Mas se quiser, pode me dar outro nome!";
            }

            if (lastMessage.includes('obrigad') || lastMessage.includes('agradeço')) {
                return "De nada! Fico feliz em ajudar. Precisa de mais alguma coisa? 😊";
            }

            if (lastMessage.includes('sabia') || lastMessage.includes('curiosidade')) {
                const facts = [
                    "Sabia que os ursos polares são canhotos? 🐻‍❄️",
                    "Uma curiosidade: o mel nunca estraga! Arqueólogos encontraram potes de mel com 3.000 anos ainda comestíveis! 🍯",
                    "Você sabia que o cérebro humano pode gerar cerca de 23 watts de energia? Isso daria para acender uma lâmpada! 💡"
                ];
                return facts[Math.floor(Math.random() * facts.length)];
            }

            if (lastMessage.includes('filme') || lastMessage.includes('série')) {
                return `Recomendo ${["Matrix", "Interestelar", "O Dilema das Redes", "Black Mirror"][Math.floor(Math.random() * 4)]}! Já assistiu? O que achou? 🎬`;
            }

            if (lastMessage.includes('comida') || lastMessage.includes('fome')) {
                return `Hmm, agora que mencionou... que tal ${["pizza", "sushi", "um bom hambúrguer", "comida tailandesa"][Math.floor(Math.random() * 4)]}? 🍕🍣`;
            }

            if (lastMessage.includes('musica') || lastMessage.includes('música')) {
                return `Estou ouvindo ${["rock clássico", "lo - fi", "MPB", "jazz"][Math.floor(Math.random() * 4)]} virtualmente! 🎵 Que estilo você prefere?`;
            }

            if (lastMessage.includes('conselho') || lastMessage.includes('dica')) {
                const tips = [
                    "Meu conselho: Nunca subestime o poder de uma boa noite de sono! 💤",
                    "Dica: Aprender algo novo todos os dias mantém a mente afiada! 🧠",
                    "Sabia que alongar-se a cada hora melhora a produtividade? Experimente! 🧘"
                ];
                return tips[Math.floor(Math.random() * tips.length)];
            }

            // Respostas para perguntas mais complexas
            if (lastMessage.includes('inteligência artificial') || lastMessage.includes('ia')) {
                return "A IA está evoluindo rápido! Posso responder perguntas, mas ainda não tenho consciência como humanos. O que mais quer saber sobre IA? 🤖";
            }

            if (lastMessage.includes('futuro') || lastMessage.includes('tecnologia')) {
                return "O futuro parece promissor! Com avanços em IA, realidade virtual e sustentabilidade. Qual área te interessa mais? 🔮";
            }

            // Resposta padrão para mensagens não reconhecidas
            const defaultResponses = [
                "Interessante! Conte-me mais sobre isso.",
                "Hmm, não tenho certeza se entendi. Poderia reformular?",
                "Vamos explorar isso juntos. O que exatamente você quer saber?",
                "Posso te ajudar com várias coisas. Me diga mais detalhes!",
                "Ótimo ponto! O que mais gostaria de saber sobre isso?"
            ];

            return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        }

        const iaObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                // Já iniciamos com a saudação automática
                iaObserver.disconnect();
            }
        }, { threshold: 0.5 });

        iaObserver.observe(document.querySelector('.ia-iphone'));
    }

    // ==============================================
    // BOT DE VENDAS INTERATIVO (Planos de Streaming) - VERSÃO CORRIGIDA
    // ==============================================
    const salesChat = document.querySelector('.sales-chat');
    if (salesChat) {
        const salesMessages = salesChat.querySelector('.chat-messages');
        const salesInput = salesChat.querySelector('#sales-input');
        const salesSendButton = salesChat.querySelector('#sales-send-button');
        const salesUserStatus = salesChat.querySelector('.user-status');

        // Produtos disponíveis
        const products = {
            'netflix': {
                name: 'Netflix Premium',
                plans: [
                    { name: 'Básico (1 tela)', price: 29.90 },
                    { name: 'Standard (2 telas)', price: 39.90 },
                    { name: 'Premium (4 telas)', price: 55.90 }
                ]
            },
            'hbo': {
                name: 'HBO Max',
                plans: [
                    { name: 'Mensal', price: 34.90 },
                    { name: 'Anual (20% off)', price: 335.00 }
                ]
            },
            'disney': {
                name: 'Disney+',
                plans: [
                    { name: 'Mensal', price: 27.90 },
                    { name: 'Anual', price: 279.90 }
                ]
            }
        };

        // Estado da conversa
        let salesState = {
            step: 0, // 0 = início, 1 = escolha serviço, 2 = escolha plano, 3 = confirmação, 4 = pagamento
            cart: [],
            currentProduct: null,
            currentPlan: null
        };

        // Saudação inicial
        setTimeout(() => {
            addSalesMessage('bot', `🎬 Olá! Sou seu assistente de assinaturas de streaming. Tenho os melhores planos para você!\n\nDigite /planos para ver nossas opções ou /ajuda para comandos.`);
        }, 1000);

        // Event listeners
        salesSendButton.addEventListener('click', handleSalesMessage);
        salesInput.addEventListener('keypress', (e) => e.key === 'Enter' && handleSalesMessage());
        salesInput.readOnly = false;

        function handleSalesMessage() {
            const message = salesInput.value.trim();
            if (!message) return;

            addSalesMessage('user', message);
            salesInput.value = '';
            salesUserStatus.textContent = "digitando...";

            const typingIndicator = showSalesTypingIndicator();

            setTimeout(() => {
                typingIndicator.remove();
                processSalesResponse(message);
                salesUserStatus.textContent = "online";
            }, 800 + Math.random() * 800);
        }

        function processSalesResponse(message) {
            const cmd = message.toLowerCase();

            // Comandos gerais
            if (cmd === '/planos' || cmd === 'planos') {
                salesState.step = 1;
                showAvailableServices();
                return;
            }

            if (cmd === '/carrinho' || cmd === 'carrinho') {
                showCart();
                return;
            }

            if (cmd === '/ajuda' || cmd === 'ajuda') {
                showHelp();
                return;
            }

            if (cmd === '/finalizar' || cmd === 'finalizar') {
                if (salesState.cart.length === 0) {
                    addSalesMessage('bot', 'Seu carrinho está vazio. Digite /planos para ver opções.');
                    return;
                }
                salesState.step = 4;
                processPayment();
                return;
            }

            // Fluxo de vendas
            switch (salesState.step) {
                case 1: // Escolha do serviço
                    if (products[cmd]) {
                        salesState.currentProduct = cmd;
                        salesState.step = 2;
                        showPlans(cmd);
                    } else {
                        addSalesMessage('bot', '⚠️ Serviço não encontrado. Por favor, escolha um dos listados:');
                        showAvailableServices();
                    }
                    break;

                case 2: // Escolha do plano
                    const planIndex = parseInt(cmd) - 1;
                    if (!isNaN(planIndex) && products[salesState.currentProduct].plans[planIndex]) {
                        salesState.currentPlan = products[salesState.currentProduct].plans[planIndex];
                        salesState.step = 3;
                        confirmPlan();
                    } else {
                        addSalesMessage('bot', '⚠️ Plano inválido. Por favor, escolha pelo número:');
                        showPlans(salesState.currentProduct);
                    }
                    break;

                case 3: // Confirmação
                    if (cmd === 'sim' || cmd === 's') {
                        addToCart();
                        salesState.step = 0;
                        addSalesMessage('bot', '✅ Adicionado ao carrinho!');
                        showCart();
                        addSalesMessage('bot', 'Deseja ver mais planos? (/planos)');
                    } else if (cmd === 'não' || cmd === 'nao' || cmd === 'n') {
                        salesState.step = 1;
                        addSalesMessage('bot', 'Sem problemas! Que outro serviço você gostaria?');
                        showAvailableServices();
                    } else {
                        addSalesMessage('bot', 'Por favor, responda "sim" ou "não"');
                        confirmPlan();
                    }
                    break;

                case 4: // Processamento de pagamento
                    const paymentOption = parseInt(cmd);
                    if ([1, 2, 3].includes(paymentOption)) {
                        const paymentMethods = ['Cartão de Crédito', 'PIX', 'Boleto Bancário'];
                        completePurchase(paymentMethods[paymentOption - 1]);
                    } else {
                        addSalesMessage('bot', 'Opção inválida. Por favor, escolha 1, 2 ou 3:');
                        processPayment();
                    }
                    break;

                default: // Mensagem não reconhecida
                    addSalesMessage('bot', 'Não entendi. Digite /planos para ver opções ou /ajuda para ajuda.');
                    break;
            }
        }

        // Funções auxiliares (todas agora são void - não retornam valores)
        function showAvailableServices() {
            let message = '📺 <b>Serviços Disponíveis:</b>\n\n';
            for (const [key, product] of Object.entries(products)) {
                message += `- <b>${product.name}</b> (digite "${key}")\n`;
            }
            message += '\nQual você deseja conhecer?';
            addSalesMessage('bot', message);
        }

        function showPlans(service) {
            const product = products[service];
            let message = `📋 <b>Planos ${product.name}:</b>\n\n`;

            product.plans.forEach((plan, index) => {
                message += `${index + 1}. ${plan.name} - R$ ${plan.price.toFixed(2)}/mês\n`;
            });

            message += '\nDigite o número do plano desejado:';
            addSalesMessage('bot', message);
        }

        function confirmPlan() {
            const product = products[salesState.currentProduct];
            const plan = salesState.currentPlan;

            addSalesMessage('bot', `📝 <b>Resumo do Plano:</b>\n\n🏷️ Serviço: ${product.name}\n📜 Plano: ${plan.name}\n💵 Preço: R$ ${plan.price.toFixed(2)}/mês\n\nDeseja adicionar ao carrinho? (sim/não)`);
        }

        function addToCart() {
            const item = {
                service: salesState.currentProduct,
                name: products[salesState.currentProduct].name,
                plan: salesState.currentPlan.name,
                price: salesState.currentPlan.price
            };
            salesState.cart.push(item);
        }

        function showCart() {
            if (salesState.cart.length === 0) {
                addSalesMessage('bot', '🛒 Seu carrinho está vazio.');
                return;
            }

            let message = '🛒 <b>Seu Carrinho:</b>\n\n';
            let total = 0;

            salesState.cart.forEach((item, index) => {
                message += `${index + 1}. ${item.name} - ${item.plan} (R$ ${item.price.toFixed(2)})\n`;
                total += item.price;
            });

            message += `\n💵 <b>Total: R$ ${total.toFixed(2)}</b>\n\n`;
            message += 'Digite /finalizar para concluir ou /planos para continuar comprando.';

            addSalesMessage('bot', message);
        }

        function showHelp() {
            const message = 'ℹ️ <b>Comandos Disponíveis:</b>\n\n' +
                '/planos - Ver serviços disponíveis\n' +
                '/carrinho - Ver seu carrinho\n' +
                '/finalizar - Concluir compra\n' +
                '/ajuda - Mostrar esta ajuda\n\n' +
                'Estamos aqui para ajudar! 😊';
            addSalesMessage('bot', message);
        }

        function processPayment() {
            let total = salesState.cart.reduce((sum, item) => sum + item.price, 0);

            let message = '💳 <b>Finalizar Compra</b>\n\n';
            message += '🛒 <b>Seu Pedido:</b>\n';

            salesState.cart.forEach((item, index) => {
                message += `- ${item.name} (${item.plan}): R$ ${item.price.toFixed(2)}\n`;
            });

            message += `\n💵 <b>Total: R$ ${total.toFixed(2)}</b>\n\n`;
            message += '📝 <b>Escolha a forma de pagamento:</b>\n';
            message += '1. Cartão de Crédito\n';
            message += '2. PIX\n';
            message += '3. Boleto Bancário\n\n';
            message += 'Digite o número da opção desejada:';

            addSalesMessage('bot', message);
        }

        function completePurchase(paymentMethod) {
            let total = salesState.cart.reduce((sum, item) => sum + item.price, 0);

            let message = '🎉 <b>Compra Finalizada!</b>\n\n';
            message += '📦 <b>Seus Planos:</b>\n';

            salesState.cart.forEach(item => {
                message += `- ${item.name} (${item.plan})\n`;
            });

            message += `\n💳 <b>Pagamento:</b> ${paymentMethod}\n`;
            message += `💵 <b>Total:</b> R$ ${total.toFixed(2)}\n\n`;
            message += '📬 Você receberá os dados de acesso em até 10 minutos.\n';
            message += 'Obrigado por sua compra! ❤️';

            addSalesMessage('bot', message);

            // Resetar carrinho e estado
            salesState = {
                step: 0,
                cart: [],
                currentProduct: null,
                currentPlan: null
            };
        }

        function addSalesMessage(sender, text) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', `message-${sender}`);
            messageElement.innerHTML = text.replace(/\n/g, '<br>');

            const timeElement = document.createElement('div');
            timeElement.classList.add('message-time');
            timeElement.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            messageElement.appendChild(timeElement);
            salesMessages.appendChild(messageElement);
            salesMessages.scrollTop = salesMessages.scrollHeight;
        }

        function showSalesTypingIndicator() {
            const typingElement = document.createElement('div');
            typingElement.classList.add('typing-indicator');
            typingElement.innerHTML = `
            <div class="typing-dots">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
            <span>Digitando...</span>
        `;
            salesMessages.appendChild(typingElement);
            salesMessages.scrollTop = salesMessages.scrollHeight;
            return typingElement;
        }
    }

    // ==============================================
    // BOT DE DIVULGAÇÃO AUTOMÁTICO
    // ==============================================
    const promoChat = document.querySelector('.promo-chat');
    if (promoChat) {
        const promoMessages = promoChat.querySelector('.chat-messages');
        const promoUserStatus = promoChat.querySelector('.user-status');

        // Conteúdos de divulgação
        const promotions = [
            {
                type: 'canal',
                title: '📢 Canal Tech News',
                content: 'Todas as novidades do mundo da tecnologia!\nÚltimas notícias, reviews e dicas.',
                link: '',
                image: 'tech-channel.png'
            },
            {
                type: 'grupo',
                title: '👥 Grupo de Investimentos',
                content: 'Comunidade de investidores iniciantes e experientes!\nDicas diárias, análises e discussões.',
                link: '',
                image: 'invest-group.png'
            },
            {
                type: 'produto',
                title: '🛍️ Curso de Fotografia',
                content: 'Aprenda fotografia profissional do zero!\nPromoção especial: 50% off hoje!',
                link: '',
                image: 'foto-course.png'
            },
            {
                type: 'serviço',
                title: '💻 Desenvolve Web',
                content: 'Precisa de um site ou aplicativo?\nSoluções personalizadas com os melhores preços!',
                link: '',
                image: 'web-dev.png'
            }
        ];

        // Simular envio de mensagens promocionais
        function sendPromotion(promo) {
            promoUserStatus.textContent = "digitando...";

            // Simular tempo de "digitação"
            setTimeout(() => {
                promoUserStatus.textContent = "online";

                // Criar mensagem
                const messageElement = document.createElement('div');
                messageElement.classList.add('message', 'message-bot');

                let messageContent = `
                <div class="promo-message">
                    <div class="promo-header" style="background-color: ${getPromoColor(promo.type)}">
                        <h3>${promo.title}</h3>
                    </div>
                    <div class="promo-body">
                        <img src="assets/images/${promo.image}" alt="${promo.title}" class="promo-image">
                        <p>${promo.content}</p>
                        <a class="promo-button">Saiba mais</a>
                    </div>
                </div>
            `;

                messageElement.innerHTML = messageContent;

                // Adicionar horário
                const timeElement = document.createElement('div');
                timeElement.classList.add('message-time');
                timeElement.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                messageElement.appendChild(timeElement);

                promoMessages.appendChild(messageElement);
                promoMessages.scrollTop = promoMessages.scrollHeight;

                // Atualizar métricas
                updateAnalytics(promo.type);

            }, 1500 + Math.random() * 1500);
        }

        // Cores por tipo de promoção
        function getPromoColor(type) {
            const colors = {
                'canal': '#4285F4',
                'grupo': '#0F9D58',
                'produto': '#DB4437',
                'serviço': '#FF7043'
            };
            return colors[type] || '#673AB7';
        }

        // // Atualizar painel de análises (simulado)
        // function updateAnalytics(type) {
        //     // Simular aumento nas métricas
        //     const metrics = document.querySelectorAll('.metric-bar');
        //     metrics.forEach(bar => {
        //         const currentWidth = parseInt(bar.style.width);
        //         const increase = Math.floor(Math.random() * 5) + 1;
        //         const newWidth = Math.min(currentWidth + increase, 100);
        //         bar.style.width = `${newWidth}%`;
        //         bar.querySelector('span').textContent = `${newWidth}%`;
        //     });
        // }

        // Iniciar envio de promoções em intervalos aleatórios
        let promoIndex = 0;
        function startPromoCycle() {
            sendPromotion(promotions[promoIndex]);
            promoIndex = (promoIndex + 1) % promotions.length;

            // Intervalo aleatório entre 5 e 15 segundos
            const nextInterval = 5000 + Math.random() * 10000;
            setTimeout(startPromoCycle, nextInterval);
        }

        // Iniciar quando o elemento estiver visível
        const promoObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                // Primeira mensagem após 2 segundos
                setTimeout(startPromoCycle, 2000);
                promoObserver.disconnect();
            }
        }, { threshold: 0.5 });

        promoObserver.observe(document.querySelector('.promo-iphone'));
    }
});