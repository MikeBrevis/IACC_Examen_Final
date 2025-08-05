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
            // Redirigir o mostrar éxito
            form.reset();
            alert('¡Bienvenido, ' + user + '!');
            // window.location.href = 'index.html'; // Descomentar para redirigir
        } else {
            form.reset();
            inputUser.focus();
            if (modal) modal.style.display = 'flex';
        }
    });
});
