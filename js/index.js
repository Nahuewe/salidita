const nombreInput = document.getElementById('nombre');
const ordenInput = document.getElementById('orden');
const precioInput = document.getElementById('precio');
const btnAgregar = document.getElementById('btnAgregar');
const resultadoDiv = document.getElementById('resultado');
const enviarWhatsappBtn = document.getElementById('enviarWhatsapp');

const numerosModal = document.getElementById('numerosModal');
const seleccionarNumeroButton = document.getElementById('seleccionarNumeroButton');
const closeNumerosModalButton = document.getElementById('closeNumerosModalButton');
const inputNumero = document.getElementById('inputNumero');

const eliminarModal = document.getElementById('eliminarModal');
const eliminarModalContent = document.getElementById('eliminarModalContent');
const confirmarEliminarButton = document.getElementById('confirmarEliminarButton');
const cancelarEliminarButton = document.getElementById('cancelarEliminarButton');

let pedidos = [];
let idAEliminar = null;

btnAgregar.addEventListener('click', () => {
    const nombre = nombreInput.value.trim();
    const orden = ordenInput.value.trim();
    const precio = parseFloat(precioInput.value.trim());

    if (!nombre || !orden || isNaN(precio)) {
        alert('Completá todos los campos wachín');
        return;
    }

    const nuevoPedido = {
        id: Date.now(),
        nombre,
        orden,
        precio
    };

    pedidos.push(nuevoPedido);
    renderPedidos();

    nombreInput.value = '';
    ordenInput.value = '';
    precioInput.value = '';
});

function renderPedidos() {
    resultadoDiv.innerHTML = '';
    pedidos.forEach(pedido => {
        const div = document.createElement('div');
        div.classList = 'bg-gray-100 p-4 rounded shadow flex flex-col gap-2 relative';

        const eliminarBtn = document.createElement('button');
        eliminarBtn.innerText = 'X';
        eliminarBtn.className = 'absolute top-1 right-2 text-red-600 font-bold';
        eliminarBtn.addEventListener('click', () => mostrarModalEliminar(pedido.id));

        div.innerHTML = `
            <p><strong>${pedido.nombre}</strong></p>
            <p>🍽️ ${pedido.orden}</p>
            <p>💰 $${pedido.precio.toFixed(2)}</p>
        `;

        div.appendChild(eliminarBtn);
        resultadoDiv.appendChild(div);
    });
}

function mostrarModalEliminar(id) {
    idAEliminar = id;
    const pedido = pedidos.find(p => p.id === id);
    eliminarModalContent.textContent = `¿Seguro querés eliminar a ${pedido.nombre}?`;
    eliminarModal.classList.remove('hidden');
}

confirmarEliminarButton.addEventListener('click', () => {
    pedidos = pedidos.filter(p => p.id !== idAEliminar);
    eliminarModal.classList.add('hidden');
    renderPedidos();
});

cancelarEliminarButton.addEventListener('click', () => {
    eliminarModal.classList.add('hidden');
});

enviarWhatsappBtn.addEventListener('click', () => {
    if (pedidos.length === 0) {
        alert('Agregá al menos un wachín antes de mandar la cuenta.');
        return;
    }
    numerosModal.classList.remove('hidden');
});

closeNumerosModalButton.addEventListener('click', () => {
    numerosModal.classList.add('hidden');
});

seleccionarNumeroButton.addEventListener('click', () => {
    let numeroSeleccionado = document.querySelector('input[name="numero"]:checked');
    let numero = numeroSeleccionado ? numeroSeleccionado.value : '';

    if (!numero && inputNumero.value.trim()) {
        numero = `+549${inputNumero.value.trim()}`;
    }

    if (!numero) {
        alert('Seleccioná un número o ingresá uno nuevo.');
        return;
    }

    const mensaje = generarMensajeWhatsApp();
    const link = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(link, '_blank');
});

function generarMensajeWhatsApp() {
    let mensaje = '💸 *La cuenta papá* 💸\n\n';

    pedidos.forEach(p => {
        mensaje += `👤 *${p.nombre}*\n🍔 ${p.orden}\n💵 Total: $${p.precio.toFixed(2)}\n\n`;
    });

    const total = pedidos.reduce((sum, p) => sum + p.precio, 0);
    mensaje += `🔢 Total general: $${total.toFixed(2)}`;

    return mensaje;
}
