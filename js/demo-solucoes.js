document.addEventListener('DOMContentLoaded', function () {
    // Animação de entrada dos elementos
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
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease-out ${index * 0.1}s`;
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
    heroImage.style.transition = 'all 0.6s ease-out 0.2s';

    setTimeout(() => {
        heroContent.style.opacity = 1;
        heroContent.style.transform = 'translateY(0)';
        heroImage.style.opacity = 1;
        heroImage.style.transform = 'translateY(0)';
    }, 300);

    // Efeito de hover 3D nos cards
    // solutionCards.forEach(card => {
    //     card.addEventListener('mousemove', (e) => {
    //         const rect = card.getBoundingClientRect();
    //         const x = e.clientX - rect.left;
    //         const y = e.clientY - rect.top;

    //         const centerX = rect.width / 2;
    //         const centerY = rect.height / 2;

    //         const angleX = (y - centerY) / 20;
    //         const angleY = (centerX - x) / 20;

    //         card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-5px)`;
    //     });

    //     card.addEventListener('mouseleave', () => {
    //         card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(-5px)';
    //     });
    // });

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

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
});

// Inicializar part