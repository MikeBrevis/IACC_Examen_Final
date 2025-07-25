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

// Función para abrir el modal principal (nuevo proyecto)
botonAgregar.addEventListener('click', () => {
    modal.classList.remove('hidden');
});

// --- MODAL EMERGENTE PARA BOTÓN AGREGAR DE CADA PROYECTO ---
// SheetJS (xlsx) CDN para leer archivos Excel en el navegador
const scriptSheetJS = document.createElement('script');
scriptSheetJS.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
document.head.appendChild(scriptSheetJS);

// Creamos el modal emergente una sola vez y lo agregamos al body
const modalEmergente = document.createElement('div');
modalEmergente.id = 'modalEmergente';
modalEmergente.className = 'modal hidden';
modalEmergente.innerHTML = `
  <div class="modal-content">
    <h2>Cargar archivo Excel</h2>
    <form id="formExcelUpload">
      <input type="file" id="inputExcel" accept=".xlsx,.xls" required />
      <div id="mensajeArchivo" style="margin:10px 0;color:green;"></div>
      <button type="submit">Cargar</button>
      <button type="button" id="cerrarEmergenteBtn">Cerrar</button>
    </form>
  </div>
`;
document.body.appendChild(modalEmergente);

// Objeto para almacenar los datos de componentes por proyecto
const componentesPorProyecto = new Map();
// Objeto para almacenar los envíos por proyecto
const enviosPorProyecto = new Map();

// Lógica para mostrar mensaje al seleccionar archivo y evitar recarga
modalEmergente.addEventListener('change', (e) => {
    if (e.target.id === 'inputExcel') {
        const mensaje = document.getElementById('mensajeArchivo');
        if (e.target.files.length > 0) {
            mensaje.textContent = `Archivo seleccionado: ${e.target.files[0].name}`;
        } else {
            mensaje.textContent = '';
        }
    }
});

// Lógica para manejar el submit del formulario de carga
modalEmergente.addEventListener('submit', async (e) => {
    if (e.target.id === 'formExcelUpload') {
        e.preventDefault();
        const input = document.getElementById('inputExcel');
        const mensaje = document.getElementById('mensajeArchivo');
        if (input.files.length > 0) {
            const archivo = input.files[0];
            const reader = new FileReader();
            reader.onload = function(evt) {
                const data = new Uint8Array(evt.target.result);
                const workbook = window.XLSX.read(data, {type: 'array'});
                // Tomar la primera hoja
                const firstSheet = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheet];
                const json = window.XLSX.utils.sheet_to_json(worksheet, {header:1});
                // Guardar los datos en el mapa usando el id del proyecto activo
                if (modalEmergente.dataset.proyectoId) {
                    componentesPorProyecto.set(modalEmergente.dataset.proyectoId, json);
                }
                mensaje.textContent = `¡Archivo ${archivo.name} cargado correctamente!`;
            };
            reader.readAsArrayBuffer(archivo);
        } else {
            mensaje.textContent = 'Por favor selecciona un archivo.';
        }
    }
});

// Delegación de eventos para los botones de cada tarjeta
contenedorProyectos.addEventListener('click', (e) => {
    // Botón agregar componente (cargar excel) - solo si es el botón de componentes
    if (
        e.target.classList.contains('btn-agregar') &&
        e.target.textContent.trim().toLowerCase() === 'agregar'
    ) {
        // Buscar el id del proyecto asociado a la tarjeta
        const card = e.target.closest('.project-card');
        let idProyecto = '';
        if (card) {
            const idSpan = card.querySelector('.project-id');
            if (idSpan) {
                idProyecto = idSpan.textContent.replace('ID:','').trim();
            }
        }
        modalEmergente.dataset.proyectoId = idProyecto;
        modalEmergente.classList.remove('hidden');
    }
    // Botón total: mostrar los datos cargados en un modal con tabla
    if (e.target.classList.contains('btn-total')) {
        const card = e.target.closest('.project-card');
        let idProyecto = '';
        if (card) {
            const idSpan = card.querySelector('.project-id');
            if (idSpan) {
                idProyecto = idSpan.textContent.replace('ID:','').trim();
            }
        }
        const datos = componentesPorProyecto.get(idProyecto);
        // Crear modal para mostrar la tabla si no existe
        let modalTabla = document.getElementById('modalTablaComponentes');
        if (!modalTabla) {
            modalTabla = document.createElement('div');
            modalTabla.id = 'modalTablaComponentes';
            modalTabla.className = 'modal hidden';
            modalTabla.innerHTML = `
                <div class="modal-content" style="max-width:90vw;max-height:80vh;overflow:auto;">
                    <h2>Componentes cargados</h2>
                    <div id="tablaComponentesContainer"></div>
                    <button id="cerrarTablaComponentesBtn">Cerrar</button>
                </div>
            `;
            document.body.appendChild(modalTabla);
            // Cerrar modal
            modalTabla.addEventListener('click', (ev) => {
                if (ev.target.id === 'cerrarTablaComponentesBtn' || ev.target === modalTabla) {
                    modalTabla.classList.add('hidden');
                }
            });
        }
        const contenedorTabla = modalTabla.querySelector('#tablaComponentesContainer');
        if (datos && datos.length > 0) {
            // Construir tabla HTML
            let tabla = '<table border="1" style="border-collapse:collapse;width:100%;text-align:left;">';
            datos.forEach((row, idx) => {
                tabla += '<tr>';
                row.forEach(cell => {
                    if (idx === 0) {
                        tabla += `<th style='background:#f0f0f0;padding:6px;'>${cell}</th>`;
                    } else {
                        tabla += `<td style='padding:6px;'>${cell}</td>`;
                    }
                });
                tabla += '</tr>';
            });
            tabla += '</table>';
            contenedorTabla.innerHTML = tabla;
        } else {
            contenedorTabla.innerHTML = '<p>No hay componentes cargados para este proyecto.</p>';
        }
        modalTabla.classList.remove('hidden');
    }
    // Botón listado de envíos
    if (
        e.target.classList.contains('btn-agregar') &&
        e.target.textContent.trim().toLowerCase() === 'listado de envios'
    ) {
        const card = e.target.closest('.project-card');
        let idProyecto = '';
        if (card) {
            const idSpan = card.querySelector('.project-id');
            if (idSpan) {
                idProyecto = idSpan.textContent.replace('ID:','').trim();
            }
        }
        // Modal para mostrar los envíos
        let modalEnvios = document.getElementById('modalEnviosProyecto');
        if (!modalEnvios) {
            modalEnvios = document.createElement('div');
            modalEnvios.id = 'modalEnviosProyecto';
            modalEnvios.className = 'modal hidden';
            modalEnvios.innerHTML = `
                <div class="modal-content" style="max-width:600px;max-height:80vh;overflow:auto;">
                    <h2>Listado de envíos</h2>
                    <div id="enviosProyectoContainer"></div>
                    <button id="nuevoEnvioBtn">Nuevo envío</button>
                    <button id="cerrarEnviosBtn">Cerrar</button>
                </div>
            `;
            document.body.appendChild(modalEnvios);
            // Cerrar modal
            modalEnvios.addEventListener('click', (ev) => {
                if (ev.target.id === 'cerrarEnviosBtn' || ev.target === modalEnvios) {
                    modalEnvios.classList.add('hidden');
                }
            });
        }
        // Renderizar lista de envíos
        function renderEnvios() {
            const envios = enviosPorProyecto.get(idProyecto) || [];
            const cont = modalEnvios.querySelector('#enviosProyectoContainer');
            if (envios.length === 0) {
                cont.innerHTML = '<p>No hay envíos registrados para este proyecto.</p>';
            } else {
                let html = '<ul style="list-style:none;padding:0;">';
                envios.forEach((envio, idx) => {
                    html += `<li style='margin-bottom:10px;'>
                        <button class='toggle-componentes' data-idx='${idx}' style='margin-bottom:4px;'>Envío #${idx+1} (${envio.fecha}) <br><span style='font-size:0.9em;color:#888;'>Archivo: ${envio.archivo}</span></button>
                        <div class='componentes-envio' id='componentes-envio-${idx}' style='display:none;margin-left:20px;'>`;
                    // Mostrar componentes en tabla
                    if (envio.componentes.length > 0) {
                        html += `<table border="1" style="border-collapse:collapse;width:100%;text-align:left;">`;
                        envio.componentes.forEach((comp, cidx) => {
                            html += '<tr>';
                            // Si el componente tiene separadores, mostrar en celdas
                            if (comp.includes('|')) {
                                const celdas = comp.split('|').map(c => c.trim());
                                celdas.forEach(cell => {
                                    if (cidx === 0) {
                                        html += `<th style='background:#f0f0f0;padding:6px;'>${cell}</th>`;
                                    } else {
                                        html += `<td style='padding:6px;'>${cell}</td>`;
                                    }
                                });
                            } else {
                                if (cidx === 0) {
                                    html += `<th style='background:#f0f0f0;padding:6px;'>${comp}</th>`;
                                } else {
                                    html += `<td style='padding:6px;'>${comp}</td>`;
                                }
                            }
                            html += '</tr>';
                        });
                        html += '</table>';
                    } else {
                        html += '<p>No hay componentes en este envío.</p>';
                    }
                    html += `</div>
                    </li>`;
                });
                html += '</ul>';
                cont.innerHTML = html;
            }
        }
        renderEnvios();
        // Toggle para mostrar componentes de cada envío
        modalEnvios.querySelector('#enviosProyectoContainer').onclick = function(ev) {
            if (ev.target.classList.contains('toggle-componentes')) {
                const idx = ev.target.getAttribute('data-idx');
                const div = modalEnvios.querySelector(`#componentes-envio-${idx}`);
                if (div) {
                    div.style.display = div.style.display === 'none' ? 'block' : 'none';
                }
            }
        };
        // Nuevo envío: permite adjuntar archivo Excel por envío
        modalEnvios.querySelector('#nuevoEnvioBtn').onclick = function() {
            let formHtml = `<form id='formNuevoEnvioExcel'>
                <p>Adjunta el archivo Excel con los componentes enviados:</p>
                <input type='file' id='inputEnvioExcel' accept='.xlsx,.xls' required />
                <div id='mensajeEnvioExcel' style='margin:10px 0;color:green;'></div>
                <button type='submit'>Registrar envío</button>
                <button type='button' id='cancelarEnvioBtn'>Cancelar</button>
            </form>`;
            modalEnvios.querySelector('#enviosProyectoContainer').innerHTML = formHtml;
            // Cancelar
            modalEnvios.querySelector('#cancelarEnvioBtn').onclick = function() {
                renderEnvios();
            };
            // Mostrar nombre de archivo seleccionado
            modalEnvios.querySelector('#inputEnvioExcel').onchange = function(ev) {
                const mensaje = modalEnvios.querySelector('#mensajeEnvioExcel');
                if (ev.target.files.length > 0) {
                    mensaje.textContent = `Archivo seleccionado: ${ev.target.files[0].name}`;
                } else {
                    mensaje.textContent = '';
                }
            };
            // Registrar envío leyendo el Excel
            modalEnvios.querySelector('#formNuevoEnvioExcel').onsubmit = function(ev) {
                ev.preventDefault();
                const input = modalEnvios.querySelector('#inputEnvioExcel');
                const mensaje = modalEnvios.querySelector('#mensajeEnvioExcel');
                if (input.files.length > 0) {
                    const archivo = input.files[0];
                    const reader = new FileReader();
                    reader.onload = function(evt) {
                        const data = new Uint8Array(evt.target.result);
                        const workbook = window.XLSX.read(data, {type: 'array'});
                        const firstSheet = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[firstSheet];
                        const json = window.XLSX.utils.sheet_to_json(worksheet, {header:1});
                        // Tomar los componentes del archivo (todas las filas menos la cabecera)
                        const componentes = json.slice(1).map(row => row.join(' | '));
                        if (componentes.length === 0) {
                            mensaje.textContent = 'El archivo no contiene componentes.';
                            return;
                        }
                        const fecha = new Date().toLocaleString();
                        const envios = enviosPorProyecto.get(idProyecto) || [];
                        envios.push({fecha, componentes, archivo: archivo.name});
                        enviosPorProyecto.set(idProyecto, envios);
                        renderEnvios();
                    };
                    reader.readAsArrayBuffer(archivo);
                } else {
                    mensaje.textContent = 'Por favor selecciona un archivo.';
                }
            };
        };
        modalEnvios.classList.remove('hidden');
    }
});

// Evento para cerrar el modal emergente
modalEmergente.addEventListener('click', (e) => {
    if (e.target.id === 'cerrarEmergenteBtn' || e.target === modalEmergente) {
        modalEmergente.classList.add('hidden');
    }
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

// Modal de confirmación
const confirmModal = document.getElementById('confirmModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

let proyectoAEliminar = null;

// Delegación de eventos para el botón borrar
contenedorProyectos.addEventListener('click', (e) => {
    if (e.target.closest('.btn-delete')) {
        proyectoAEliminar = e.target.closest('.project-card');
        confirmModal.classList.remove('hidden');
    }
});

// Confirmar eliminación
confirmDeleteBtn.addEventListener('click', () => {
    if (proyectoAEliminar) {
        proyectoAEliminar.remove();
        proyectoAEliminar = null;
    }
    confirmModal.classList.add('hidden');
});

// Cancelar eliminación
cancelDeleteBtn.addEventListener('click', () => {
    proyectoAEliminar = null;
    confirmModal.classList.add('hidden');
});



