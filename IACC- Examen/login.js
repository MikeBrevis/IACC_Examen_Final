// Validación de login con usuarios determinados

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.login-form');
    const inputUser = document.getElementById('username');
    const inputPass = document.getElementById('password');

    // Usuarios válidos
    const usuarios = [
        { usuario: 'concepcion', pass: '123' },
        { usuario: 'santiago', pass: '456' }
    ];


    // Referencia al modal de advertencia ya creado en el HTML
    const modal = document.getElementById('loginErrorModal');
    const cerrarBtn = document.getElementById('cerrarLoginError');
    if (cerrarBtn && modal) {
        cerrarBtn.onclick = function() {
            modal.style.display = 'none';
        };
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const user = inputUser.value.trim();
        const pass = inputPass.value.trim();
        const valido = usuarios.some(u => u.usuario === user && u.pass === pass);
        if (valido) {
            form.reset();
            // Mostrar modal de bienvenida
            const welcomeModal = document.getElementById('loginWelcomeModal');
            const welcomeMsg = document.getElementById('loginWelcomeMsg');
            if (welcomeMsg) welcomeMsg.textContent = '¡Bienvenido, ' + user + '!';
            if (welcomeModal) {
                welcomeModal.style.display = 'flex';
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                window.location.href = 'index.html';
            }
        } else {
            form.reset();
            inputUser.focus();
            if (modal) modal.style.display = 'flex';
        }
    });
});
