// Funções compartilhadas entre todas as páginas
document.addEventListener('DOMContentLoaded', function () {
    // Menu Mobile
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenuContainer = document.querySelector('.nav-menu-container');

    if (mobileMenuToggle && navMenuContainer) {
        mobileMenuToggle.addEventListener('click', function () {
            navMenuContainer.classList.toggle('active');
            const icon = this.querySelector('i');

            if (navMenuContainer.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Elementos
    const supportLink = document.querySelector('.nav-item a[href="suporte.html"]');
    const notificationDot = document.querySelector('.notification-dot');

    // Simulação: tem notificação (true/false)
    const hasNotification = true;

    // Mostra ou esconde a bolinha
    function toggleNotificationDot(show) {
        if (notificationDot) {
            notificationDot.classList.toggle('hidden', !show);
        }
    }

    // Inicializa
    toggleNotificationDot(hasNotification);

    // Remove ao clicar no suporte
    supportLink?.addEventListener('click', function () {
        toggleNotificationDot(false);
    });

    // Simulação: nova notificação após 15 segundos
    setTimeout(() => {
        if (notificationDot?.classList.contains('hidden')) {
            toggleNotificationDot(true);
            showNotification('Nova mensagem do suporte', 'info');
        }
    }, 15000);
});