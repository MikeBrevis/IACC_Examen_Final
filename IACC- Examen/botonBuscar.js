// Funcionalidad para buscar proyectos por número de ID (4 dígitos) usando los elementos existentes en el HTML
document.addEventListener('DOMContentLoaded', function() {
    const inputBuscar = document.getElementById('project-search'); // input para ingresar el ID
    const btnBuscar = document.getElementById('search-btn'); // botón para buscar
    const contenedorProyectos = document.querySelector('.main-content'); // contenedor de tarjetas

    if (!inputBuscar || !btnBuscar || !contenedorProyectos) return;

    btnBuscar.addEventListener('click', function() {
        const idBuscado = inputBuscar.value.trim();
        if (!/^\d{4}$/.test(idBuscado)) {
            alert('Ingrese un ID de 4 dígitos.');
            return;
        }
        // Ocultar todos los proyectos
        const tarjetas = contenedorProyectos.querySelectorAll('.project-card');
        let encontrado = false;
        tarjetas.forEach(card => {
            const idSpan = card.querySelector('.project-id');
            if (idSpan && idSpan.textContent.replace('ID:','').trim() === idBuscado) {
                card.style.display = '';
                encontrado = true;
            } else {
                card.style.display = 'none';
            }
        });
        if (!encontrado) {
            alert('No se encontró un proyecto con ese ID.');
        }
    });

    // Mostrar todos los proyectos si el input queda vacío
    inputBuscar.addEventListener('input', function() {
        if (inputBuscar.value.trim() === '') {
            const tarjetas = contenedorProyectos.querySelectorAll('.project-card');
            tarjetas.forEach(card => card.style.display = '');
        }
    });
});
