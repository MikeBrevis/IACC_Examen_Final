// Detectar el botón con id new-project-btn
const botonAgregar = document.getElementById('new-project-btn');

// Detectar el contenedor de tarjetas (main-content)
const contenedorProyectos = document.querySelector('.main-content');

// Imprimir un mensaje de prueba al hacer clic en el botón
botonAgregar.addEventListener('click', () => {

    // Solicitar al usuario los datos del proyecto
    const idProyecto = prompt("Ingrese el ID del proyecto:");
    const nombreProyecto = prompt("Ingrese el nombre del proyecto:");
    const clienteProyecto = prompt("Ingrese el nombre del cliente:");

    // Validar que los datos no estén vacíos
    if (!idProyecto || !nombreProyecto || !clienteProyecto) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    // Crear una nueva tarjeta de proyecto
    fetch("proyectoNuevo.html")
        .then(response => response.text())
        .then(html => {
            const tarjetaProyecto = document.createElement('div');
            tarjetaProyecto.innerHTML = html;
            
            const idElement = tarjetaProyecto.querySelector('.project-id');
            const nameElement = tarjetaProyecto.querySelector('.project-name');
            const companyElement = tarjetaProyecto.querySelector('.project-company');    
            
            idElement.textContent = "ID: " + idProyecto;
            nameElement.textContent = nombreProyecto;
            companyElement.textContent = clienteProyecto;

            contenedorProyectos.appendChild(tarjetaProyecto);
            console.log('Tarjeta insertada:', tarjetaProyecto);

        })
        .catch(error => console.error('Error al cargar el HTML:', error));

});

