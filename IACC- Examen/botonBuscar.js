// Funcionalidad para buscar proyectos por número de ID (4 dígitos) usando los elementos existentes en el HTML
document.addEventListener('DOMContentLoaded', function() {
    const inputBuscar = document.getElementById('project-search'); // input para ingresar el ID
    const btnBuscar = document.getElementById('search-btn'); // botón para buscar
    const contenedorProyectos = document.querySelector('.main-content'); // contenedor de tarjetas

    if (!inputBuscar || !btnBuscar || !contenedorProyectos) return;

    // Validación en tiempo real para solo 4 números
    inputBuscar.addEventListener('input', function(e) {
        let val = inputBuscar.value.replace(/[^0-9]/g, '');
        if (val.length > 4) val = val.slice(0, 4);
        if (inputBuscar.value !== val) {
            inputBuscar.value = val;
            mostrarAdvertenciaBusqueda('Solo se permiten 4 números (0-9) para buscar.');
        } else {
            ocultarAdvertenciaBusqueda();
        }
        if (inputBuscar.value.trim() === '') {
            const tarjetas = contenedorProyectos.querySelectorAll('.project-card');
            tarjetas.forEach(card => card.style.display = '');
        }
    });

    function buscarProyecto() {
        const idBuscado = inputBuscar.value.trim();
        if (!/^\d{4}$/.test(idBuscado)) {
            mostrarAdvertenciaBusqueda('Ingrese un ID de 4 dígitos.');
            return;
        }
        ocultarAdvertenciaBusqueda();
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
            mostrarAdvertenciaBusqueda('No se encontró un proyecto con ese ID.');
        }
    }

    btnBuscar.addEventListener('click', buscarProyecto);

    inputBuscar.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            buscarProyecto();
        }
    });

    // Renderizar advertencia debajo del input de búsqueda
    function mostrarAdvertenciaBusqueda(msg) {
        let adv = document.getElementById('busquedaAdvertencia');
        if (!adv) {
            adv = document.createElement('div');
            adv.id = 'busquedaAdvertencia';
            adv.className = 'advertencia-busqueda';
            inputBuscar.parentNode.insertBefore(adv, inputBuscar.nextSibling);
        }
        adv.textContent = msg;
    }
    function ocultarAdvertenciaBusqueda() {
        let adv = document.getElementById('busquedaAdvertencia');
        if (adv) adv.textContent = '';
    }
});
