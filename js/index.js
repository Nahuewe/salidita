const datosGuardados = {};

function capitalizarTexto(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

document.getElementById('nombre').addEventListener('change', function () {
    const nombreInput = document.getElementById('nombre');
    const nombreInvitadoInput = document.getElementById('nombreInvitado');

    if (nombreInput.value === 'Invitado') {
        nombreInput.classList.add('hidden');
        nombreInvitadoInput.classList.remove('hidden');
        nombreInvitadoInput.focus();

        const nuevoNombre = nombreInvitadoInput.value.trim();
        if (nuevoNombre) {
            if (!datosGuardados[nuevoNombre]) {
                datosGuardados[nuevoNombre] = [];
            }

            const select = document.getElementById('nombre');
            const option = document.createElement('option');
            option.value = nuevoNombre;
            option.text = nuevoNombre;
            select.appendChild(option);
            select.value = nuevoNombre;
        }
    } else {
        nombreInput.classList.remove('hidden');
        nombreInvitadoInput.classList.add('hidden');
    }
});

function validarTexto() {
    const input = document.getElementById('nombreInvitado');
    input.value = input.value.replace(/[^A-Za-z]/g, '');
}

function soloNumeros(event) {
    const input = event.target;
    input.value = input.value.replace(/[^0-9]/g, '');
}

document.getElementById('nombre').addEventListener('input', function () {
    const nombreInput = document.getElementById('nombre');

    if (nombreInput.value.trim() === 'Invitado') {
        nombreInput.value = '';
        nombreInput.placeholder = 'Nombre del invitado';
    } else {
        nombreInput.placeholder = 'Nombre del borrachin';
    }
});

// Agregar el borrachin y el precio de todo

document.getElementById('btnAgregar').addEventListener('click', function () {
    let nombre = document.getElementById('nombre').value.trim();
    const orden = document.getElementById('orden').value.trim();
    const precio = parseInt(document.getElementById('precio').value.trim());

    if (nombre && orden && !isNaN(precio) && precio > 0) {
        if (!datosGuardados[nombre]) {
            datosGuardados[nombre] = [];
        }

        const ordenExistente = datosGuardados[nombre].find(item => item.orden === orden);

        if (ordenExistente) {
            ordenExistente.precio += precio;
        } else {
            datosGuardados[nombre].push({
                orden: orden,
                precio: precio
            });
        }

        mostrarDatosGuardados();

        const mediaQuery = window.matchMedia('(max-width: 640px)');
        if (mediaQuery.matches) {
            const resultadoDiv = document.getElementById('resultado');
            const lastCard = resultadoDiv.lastElementChild;
            if (lastCard) {
                lastCard.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
            }
        }
    } else {
        alert('Che wachin, te faltó rellenar los campos correctamente');
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

    const nombreCapitalizado = nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
    eliminarModalContent.textContent = `¿${nombreCapitalizado} se equivocó de chupi?`;
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
        resultadoCalculoDiv.className = 'mb-4 text-lg font-bold text-gray-700';
        tarjetaDiv.appendChild(resultadoCalculoDiv);

        ordenes.forEach((orden, index) => {
            const ordenDiv = document.createElement('div');
            ordenDiv.className = 'mb-2';
            ordenDiv.innerHTML = `
                <p class="text-gray-700">Orden: <span class="font-bold capitalize">${orden.orden}</span></p>
                <p class="text-gray-700">Precio: <span class="font-bold">$${orden.precio}</span></p>
            `;

            const botonEliminarOrden = document.createElement('button');
            botonEliminarOrden.className = 'bg-purple-500 text-white px-2 rounded hover:bg-purple-700 focus:outline-none';
            botonEliminarOrden.textContent = 'Eliminar orden';
            botonEliminarOrden.onclick = function () {
                eliminarOrden(nombre, index);
            };

            ordenDiv.appendChild(botonEliminarOrden);
            tarjetaDiv.appendChild(ordenDiv);
        });

        const botonesDiv = document.createElement('div');
        botonesDiv.className = 'flex items-center mt-2';

        const botonEliminar = document.createElement('button');
        botonEliminar.className = 'bg-red-500 text-white px-4 py-2 w-full rounded hover:bg-red-700 focus:outline-none';
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

function capitalize(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
        .join(' ');
}

// Al hacer clic en "mandar guarap" se abre un modal en el que se elige la sucursal a donde enviar el mensaje

function enviarWhatsapp(numero) {
    let mensaje = " *Resumen de Pedidos* \n\n";

    for (const nombre in datosGuardados) {
        mensaje += `*${capitalizarTexto(nombre)}*\n`;
        mensaje += "Órdenes:\n";

        let precioTotalPorPersona = 0;

        datosGuardados[nombre].forEach(orden => {
            mensaje += `• ${capitalizarTexto(orden.orden)} - $${orden.precio}\n`;
            precioTotalPorPersona += orden.precio;
        });

        mensaje += `*Total de ${capitalizarTexto(nombre)}:* $${precioTotalPorPersona}\n\n`;
    }

    const totalGeneral = calcularPrecioTotalGeneral();
    mensaje += `*Total General:* $${totalGeneral}`;

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

// Elegis la persona a la que queres enviar el mensaje

document.getElementById("seleccionarNumeroButton").addEventListener("click", function () {
    const selectedNumero = document.querySelector('input[name="numero"]:checked');
    let numero;

    if (selectedNumero) {
        numero = selectedNumero.value;
    } else {
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
        alert('Ingresa un número de teléfono valido');
    }
});
