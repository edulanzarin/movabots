document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const urlParams = new URLSearchParams(window.location.search);

    // Verifica se veio de um redirecionamento de sucesso
    if (urlParams.has('success')) {
        showSuccessMessage();
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnIcon = submitBtn.querySelector('.btn-icon i');

            // Mostrar estado de carregamento
            btnText.textContent = 'Enviando...';
            btnIcon.classList.remove('fa-paper-plane');
            btnIcon.classList.add('fa-spinner', 'fa-spin');
            submitBtn.disabled = true;

            // Coletar dados do formulário
            const formData = new FormData(this);

            // Enviar para o FormSubmit
            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
                .then(response => {
                    if (response.ok) {
                        // Mostrar mensagem de sucesso
                        showSuccessMessage();
                        contactForm.reset();

                        // Atualizar botão para estado de sucesso
                        btnText.textContent = 'Mensagem Enviada!';
                        btnIcon.classList.remove('fa-spinner', 'fa-spin');
                        btnIcon.classList.add('fa-check');

                        // Resetar botão após 3 segundos
                        setTimeout(() => {
                            btnText.textContent = 'Enviar Mensagem';
                            btnIcon.classList.remove('fa-check');
                            btnIcon.classList.add('fa-paper-plane');
                            submitBtn.disabled = false;
                        }, 3000);
                    } else {
                        throw new Error('Erro no envio');
                    }
                })
                .catch(error => {
                    // Mostrar mensagem de erro
                    alert('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.');
                    console.error('Error:', error);

                    // Resetar botão imediatamente em caso de erro
                    btnText.textContent = 'Enviar Mensagem';
                    btnIcon.classList.remove('fa-spinner', 'fa-spin');
                    btnIcon.classList.add('fa-paper-plane');
                    submitBtn.disabled = false;
                });
        });
    }

    function showSuccessMessage() {
        if (!successMessage) return;

        successMessage.classList.remove('hidden');

        // Rolagem suave para a mensagem
        successMessage.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        // Esconder após alguns segundos
        setTimeout(() => {
            successMessage.classList.add('hidden');
        }, 10000);
    }

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