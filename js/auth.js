document.addEventListener('DOMContentLoaded', function () {
    // Toggle password visibility
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');

    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function () {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Password strength indicator
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function () {
            const strengthBars = document.querySelectorAll('.strength-bar');
            const strengthText = document.querySelector('.strength-text');
            const password = this.value;
            let strength = 0;

            // Check password strength
            if (password.length > 0) strength += 1;
            if (password.length >= 8) strength += 1;
            if (/[A-Z]/.test(password)) strength += 1;
            if (/[0-9]/.test(password)) strength += 1;
            if (/[^A-Za-z0-9]/.test(password)) strength += 1;

            // Update UI
            strengthBars.forEach((bar, index) => {
                if (index < strength) {
                    bar.style.backgroundColor = getStrengthColor(strength);
                } else {
                    bar.style.backgroundColor = 'var(--light-gray)';
                }
            });

            if (strengthText) {
                strengthText.textContent = getStrengthText(strength);
                strengthText.style.color = getStrengthColor(strength);
            }
        });
    }

    function getStrengthColor(strength) {
        switch (strength) {
            case 1: return '#ef4444'; // Red
            case 2: return '#f97316'; // Orange
            case 3: return '#eab308'; // Yellow
            case 4: return '#84cc16'; // Lime
            case 5: return '#10b981'; // Green
            default: return 'var(--gray)';
        }
    }

    function getStrengthText(strength) {
        switch (strength) {
            case 1: return 'Força da senha: muito fraca';
            case 2: return 'Força da senha: fraca';
            case 3: return 'Força da senha: média';
            case 4: return 'Força da senha: forte';
            case 5: return 'Força da senha: muito forte';
            default: return 'Força da senha:';
        }
    }

    // Form validation
    const forms = document.querySelectorAll('.auth-form');

    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Check if passwords match (for register form)
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirm-password');

            if (password && confirmPassword && password.value !== confirmPassword.value) {
                alert('As senhas não coincidem!');
                return;
            }

            // Check terms checkbox (for register form)
            const terms = document.getElementById('terms');
            if (terms && !terms.checked) {
                alert('Você deve aceitar os termos de serviço!');
                return;
            }

            // Simulate form submission
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;

            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
            submitButton.disabled = true;

            // Simulate API call
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;

                // Redirect after successful "submission"
                if (form.closest('.auth-card').querySelector('h2').textContent === 'Crie sua conta') {
                    window.location.href = 'login.html?registered=true';
                } else {
                    window.location.href = 'index.html';
                }
            }, 1500);
        });
    });

    // Check for registration success
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
        alert('Cadastro realizado com sucesso! Faça login para continuar.');
    }
});