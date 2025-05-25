// Sistema de Notificações Reutilizável
class NotificationSystem {
    constructor() {
        this.activeNotifications = [];
        this.setupContainer();
    }

    setupContainer() {
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        document.body.appendChild(this.container);
    }

    showNotification(message, type = 'success', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.setProperty('--duration', `${duration}ms`);

        const icon = this.getIconForType(type);

        notification.innerHTML = `
            <div class="notification-icon">${icon}</div>
            <div class="notification-content">${message}</div>
            <div class="notification-close">&times;</div>
            <div class="notification-progress animate"></div>
        `;

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.closeNotification(notification));

        this.container.appendChild(notification);
        this.activeNotifications.push(notification);

        // Força o reflow para acionar a animação
        void notification.offsetWidth;
        notification.classList.add('show');

        // Fecha automaticamente após a duração
        const timeoutId = setTimeout(() => {
            if (notification.parentNode) {
                this.closeNotification(notification);
            }
        }, duration);

        // Armazena o timeoutId para poder cancelar se o usuário fechar manualmente
        notification.timeoutId = timeoutId;
    }

    closeNotification(notification) {
        // Cancela o timeout se existir
        if (notification.timeoutId) {
            clearTimeout(notification.timeoutId);
        }

        notification.classList.remove('show');
        notification.classList.add('hide');

        notification.addEventListener('transitionend', () => {
            if (notification.parentNode) {
                notification.remove();

                // Remove a notificação da lista de ativas
                this.activeNotifications = this.activeNotifications.filter(n => n !== notification);

                // Reorganiza as notificações restantes
                this.repositionNotifications();
            }
        }, { once: true });
    }

    repositionNotifications() {
        // Atualiza a posição de todas as notificações ativas
        this.activeNotifications.forEach((notification, index) => {
            // Adiciona um pequeno delay para a animação ser suave
            setTimeout(() => {
                notification.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    getIconForType(type) {
        const icons = {
            success: '<i class="fas fa-check-circle"></i>',
            error: '<i class="fas fa-exclamation-circle"></i>',
            warning: '<i class="fas fa-exclamation-triangle"></i>'
        };
        return icons[type] || icons.success;
    }
}

// Cria uma instância global do sistema de notificações
window.notifications = new NotificationSystem();

// Métodos de conveniência para tipos comuns
window.showSuccessNotification = (message, duration) => {
    notifications.showNotification(message, 'success', duration);
};

window.showErrorNotification = (message, duration) => {
    notifications.showNotification(message, 'error', duration);
};

window.showWarningNotification = (message, duration) => {
    notifications.showNotification(message, 'warning', duration);
};