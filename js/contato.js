document.addEventListener('DOMContentLoaded', function () {
    // Inicialização do mapa
    const map = L.map('map').setView([-23.5632, -46.6544], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Marcador personalizado
    const customIcon = L.divIcon({
        html: '<i class="fas fa-map-marker-alt"></i>',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        className: 'map-marker-icon'
    });

    L.marker([-23.5632, -46.6544], { icon: customIcon }).addTo(map)
        .bindPopup('Movabots<br>Av. Paulista, 1000')
        .openPopup();

    // Adicionando estilo ao marcador
    const style = document.createElement('style');
    style.textContent = `
        .map-marker-icon {
            color: var(--primary);
            font-size: 2rem;
            text-shadow: 0 0 10px rgba(123, 97, 255, 0.7);
            transform: translateY(-20px);
        }
        
        .leaflet-popup-content {
            color: var(--dark);
            font-family: 'Lexend Deca', sans-serif;
        }
        
        .leaflet-popup-content-wrapper {
            border-radius: 8px;
        }
    `;
    document.head.appendChild(style);

    // Animação dos cards de informação
    const infoCards = document.querySelectorAll('.info-card');

    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    infoCards.forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease-out';
        animateOnScroll.observe(card);
    });

    // Validação do formulário
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnIcon = submitBtn.querySelector('.btn-icon i');

            // Simular envio
            btnText.textContent = 'Enviando...';
            btnIcon.classList.remove('fa-paper-plane');
            btnIcon.classList.add('fa-spinner', 'fa-spin');
            submitBtn.disabled = true;

            // Simular resposta após 2 segundos
            setTimeout(() => {
                btnText.textContent = 'Mensagem Enviada!';
                btnIcon.classList.remove('fa-spinner', 'fa-spin');
                btnIcon.classList.add('fa-check');

                // Resetar formulário após 3 segundos
                setTimeout(() => {
                    this.reset();
                    btnText.textContent = 'Enviar Mensagem';
                    btnIcon.classList.remove('fa-check');
                    btnIcon.classList.add('fa-paper-plane');
                    submitBtn.disabled = false;

                    // Mostrar mensagem de sucesso
                    const successMsg = document.createElement('div');
                    successMsg.className = 'form-success';
                    successMsg.innerHTML = `
                        <i class="fas fa-check-circle"></i>
                        <p>Sua mensagem foi enviada com sucesso! Entraremos em contato em breve.</p>
                    `;
                    this.appendChild(successMsg);

                    // Remover mensagem após 5 segundos
                    setTimeout(() => {
                        successMsg.remove();
                    }, 5000);
                }, 3000);
            }, 2000);
        });
    }

    // Animação de aparecimento do hero
    const animateHeroOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    // Observar elementos do hero
    document.querySelectorAll('.contact-hero-content, .contact-hero-image').forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        animateHeroOnScroll.observe(el);
    });
});