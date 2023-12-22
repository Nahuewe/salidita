const datosGuardados = {};

// Cambios en el evento change del input 'nombre'

document.getElementById('nombre').addEventListener('change', function () {
    const nombreInput = document.getElementById('nombre');
    const nombreInvitadoInput = document.getElementById('nombreInvitado');

    if (nombreInput.value === 'Invitado') {
        // Mostrar el input para el nombre del invitado y ocultar el select
        nombreInput.classList.add('hidden');
        nombreInvitadoInput.classList.remove('hidden');
        nombreInvitadoInput.focus(); // Hacer focus en el nuevo input
    } else {
        // Mostrar el select y ocultar el input para el nombre del invitado
        nombreInput.classList.remove('hidden');
        nombreInvitadoInput.classList.add('hidden');
    }
});

// Expresion regular hecha para que no se puedan ingresar numeros u caracteres especiales en los input

function validarTexto() {
    const input = document.getElementById('nombreInvitado');
    input.value = input.value.replace(/[^A-Za-z]/g, ''); // Solo permite letras, elimina todo lo que no sea una letra
}

// Agregar el borrachin y el precio de todo

document.getElementById('btnAgregar').addEventListener('click', function () {
    let nombre = document.getElementById('nombre').value;
    const orden = document.getElementById('orden').value; // Cambiar esta línea
    const precio = parseInt(document.getElementById('precio').value);
    const nombreInput = document.getElementById('nombre');
    const nombreInvitadoInput = document.getElementById('nombreInvitado');

    if (nombreInput.value === 'Invitado') {
        // Si se selecciona "Invitado", usar el valor del nuevo input
        nombre = nombreInvitadoInput.value.trim();

        // Restaurar el select como opción predeterminada después de haber utilizado "Invitado"
        nombreInput.classList.remove('hidden');
        nombreInvitadoInput.classList.add('hidden');
        nombreInput.value = ''; // Limpiar el valor de Invitado para que el select aparezca vacío
    } else {
        // Si se selecciona otra opción, usar el valor del select original
        nombre = nombreInput.value;
    }

    if (nombre && orden && !isNaN(precio) && precio > 0) {
        if (!datosGuardados[nombre]) {
            datosGuardados[nombre] = [];
        }

        // Verificar si ya existe la misma orden para el usuario
        const ordenExistente = datosGuardados[nombre].find(item => item.orden === orden);

        if (ordenExistente) {
            // Si existe, sumar el precio
            ordenExistente.precio += precio;
        } else {
            // Si no existe, agregar una nueva entrada
            datosGuardados[nombre].push({
                orden: orden,
                precio: precio
            });
        }

        nombreInput.classList.remove('hidden');
        mostrarDatosGuardados();

        // Hace scroll en vista mobile hacia las cards creadas
        const mediaQuery = window.matchMedia('(max-width: 640px)');
        if (mediaQuery.matches) {
            const resultadoDiv = document.getElementById('resultado');
            const lastCard = resultadoDiv.lastElementChild;
            if (lastCard) {
                lastCard.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
            }
        }
    } else {
        alert('Te faltó rellenar los campos');
    }
});

// Elimina la orden completa

function eliminarOrden(nombre, indice) {
    const eliminarModal = document.getElementById('eliminarModal');
    const eliminarModalContent = document.getElementById('eliminarModalContent');

    eliminarModalContent.textContent = `¿Te confundiste de precio?`;
    eliminarModal.classList.remove('hidden');

    const confirmarEliminarButton = document.getElementById('confirmarEliminarButton');
    const cancelarEliminarButton = document.getElementById('cancelarEliminarButton');

    confirmarEliminarButton.onclick = function () {
        datosGuardados[nombre].splice(indice, 1);
        mostrarDatosGuardados();
        eliminarModal.classList.add('hidden');
    };

    cancelarEliminarButton.onclick = function () {
        eliminarModal.classList.add('hidden');
    };
}

// Función que elimina al borrachin

function eliminarTarjeta(nombre) {
    const eliminarModal = document.getElementById('eliminarModal');
    const eliminarModalContent = document.getElementById('eliminarModalContent');

    eliminarModalContent.textContent = `¿${nombre} se equivoco de chupi?`;
    eliminarModal.classList.remove('hidden');

    const confirmarEliminarButton = document.getElementById('confirmarEliminarButton');
    const cancelarEliminarButton = document.getElementById('cancelarEliminarButton');

    confirmarEliminarButton.onclick = function () {
        delete datosGuardados[nombre];
        mostrarDatosGuardados();
        eliminarModal.classList.add('hidden');
    };

    cancelarEliminarButton.onclick = function () {
        eliminarModal.classList.add('hidden');
    };
}

// Calcular el precio total de la orden

function calcularPrecioTotal(nombre, resultadoCalculoDiv) {
    const ordenes = datosGuardados[nombre];

    if (ordenes && ordenes.length > 0) {
        let precioTotal = 0;

        ordenes.forEach(orden => {
            if (!isNaN(orden.precio) && orden.precio > 0) {
                precioTotal += orden.precio;
            }
        });

        resultadoCalculoDiv.innerText = `Total: $${precioTotal}`;
    } else {
        resultadoCalculoDiv.innerText = 'No hay órdenes para calcular el precio';
    }
}

// Funcion para crear las cards

function mostrarDatosGuardados() {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = '';

    for (const nombre in datosGuardados) {
        const ordenes = datosGuardados[nombre];
        const tarjetaDiv = document.createElement('div');
        tarjetaDiv.className = 'bg-white p-4 rounded-lg shadow-md flex flex-col';

        const tituloDiv = document.createElement('div');
        tituloDiv.innerHTML = `<h2 class="text-xl font-bold mb-2 capitalize">${nombre}</h2>`;
        tarjetaDiv.appendChild(tituloDiv);

        const resultadoCalculoDiv = document.createElement('div');
        resultadoCalculoDiv.className = 'mt-4 text-lg font-bold text-gray-700';
        tarjetaDiv.appendChild(resultadoCalculoDiv);

        ordenes.forEach((orden, index) => {
            const ordenDiv = document.createElement('div');
            ordenDiv.className = 'mb-2';
            ordenDiv.innerHTML = `
                <p class="text-gray-700">Orden: <span class="font-bold">${orden.orden}</span></p>
                <p class="text-gray-700">Precio: <span class="font-bold">$${orden.precio}</span></p>
            `;

            const botonEliminarOrden = document.createElement('button');
            botonEliminarOrden.className = 'bg-red-500 text-white px-2 rounded hover:bg-red-700 focus:outline-none';
            botonEliminarOrden.textContent = 'Eliminar orden';
            botonEliminarOrden.onclick = function () {
                eliminarOrden(nombre, index);
            };

            ordenDiv.appendChild(botonEliminarOrden);
            tarjetaDiv.appendChild(ordenDiv);
        });

        // Botones "Eliminar" y "Calcular" por tarjeta
        const botonesDiv = document.createElement('div');
        botonesDiv.className = 'flex items-center mt-2';

        const botonEliminar = document.createElement('button');
        botonEliminar.className = 'bg-red-500 text-white px-4 py-2 w-full rounded hover:bg-red-700 focus:outline-none ml-2';
        botonEliminar.innerText = 'Eliminar';
        botonEliminar.onclick = function () {
            eliminarTarjeta(nombre);
        };
        botonesDiv.appendChild(botonEliminar);

        tarjetaDiv.appendChild(botonesDiv);
        resultadoDiv.appendChild(tarjetaDiv);
        calcularPrecioTotal(nombre, resultadoCalculoDiv);
    }
}

// Al hacer clic en "mandar guarap" se abre un modal en el que se elige la sucursal a donde enviar el mensaje

function enviarWhatsapp(numero) {
    let mensaje = "las ordenes y precio son:\n\n";

    for (const nombre in datosGuardados) {
        mensaje += `Borrachin: ${nombre}\n`;
        mensaje += "Ordenes:\n";

        datosGuardados[nombre].forEach(orden => {
            mensaje += `${orden.orden} - $${orden.precio}\n`;
        });

        const precioTotal = calcularPrecioTotalGeneral();
        mensaje += `\nPrecio total de ${nombre}: $${precioTotal}\n\n`;
    }

    const url = "https://api.whatsapp.com/send?phone=" + numero + "&text=" + encodeURIComponent(mensaje);
    window.open(url, "_blank");
}

function calcularPrecioTotalGeneral() {
    let precioTotalGeneral = 0;

    for (const nombre in datosGuardados) {
        datosGuardados[nombre].forEach(orden => {
            if (!isNaN(orden.precio) && orden.precio > 0) {
                precioTotalGeneral += orden.precio;
            }
        });
    }

    return precioTotalGeneral;
}

// Abre el modal

document.getElementById("enviarWhatsapp").addEventListener("click", function () {
    const numerosModal = document.getElementById('numerosModal');
    numerosModal.classList.remove('hidden');
});

// Cierra el modal

document.getElementById("closeNumerosModalButton").addEventListener("click", function () {
    const numerosModal = document.getElementById('numerosModal');
    numerosModal.classList.add('hidden');
});

// Elegis la sucursal a donde queres enviar el mensaje

document.getElementById("seleccionarNumeroButton").addEventListener("click", function () {
    const selectedNumero = document.querySelector('input[name="numero"]:checked');
    let numero;

    if (selectedNumero) {
        numero = selectedNumero.value;
    } else {
        // Obtener el input del número
        const inputNumero = document.getElementById('inputNumero');
        if (inputNumero && inputNumero.value.trim() !== '') {
            numero = inputNumero.value.trim();
        }
    }

    if (numero) {
        enviarWhatsapp(numero);

        const numerosModal = document.getElementById('numerosModal');
        numerosModal.classList.add('hidden');
    } else {
        alert('Por favor, seleccioná a quien mandarle los precios o ingresa un número');
    }
});