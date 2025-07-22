// Detectar el botón con id new-project-btn
const botonAgregar = document.getElementById('new-project-btn');

// Detectar el contenedor de tarjetas (main-content)
const contenedorProyectos = document.querySelector('.main-content');


// Detectar elementos
const modal = document.getElementById('modal');
const formulario = document.getElementById('formularioProyecto');
const inputId = document.getElementById('inputId');
const inputNombre = document.getElementById('inputNombre');
const inputCliente = document.getElementById('inputCliente');

// Función para abrir el modal
botonAgregar.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });

// formulario del modal
formulario.addEventListener('submit', (e) => {
    e.preventDefault();
  
    const idProyecto = inputId.value.trim();
    const nombreProyecto = inputNombre.value.trim();
    const clienteProyecto = inputCliente.value.trim();
  
    if (!idProyecto || !nombreProyecto || !clienteProyecto) {
      alert('Todos los campos son obligatorios.');
      return;
    }
  
    fetch('proyectoNuevo.html')
      .then(response => response.text())
      .then(html => {
        const tarjetaProyecto = document.createElement('div');
        tarjetaProyecto.innerHTML = html;
  
        tarjetaProyecto.querySelector('.project-id').textContent = 'ID: ' + idProyecto;
        tarjetaProyecto.querySelector('.project-name').textContent = nombreProyecto;
        tarjetaProyecto.querySelector('.project-company').textContent = clienteProyecto;
  
        contenedorProyectos.appendChild(tarjetaProyecto);
  
        // Limpiar y cerrar
        formulario.reset();
        modal.classList.add('hidden');
      });
  });


  
