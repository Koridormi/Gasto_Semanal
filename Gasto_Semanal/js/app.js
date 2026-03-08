// variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');



// events
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded',preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);

};

// classes
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }
    nuevoGasto(gasto) {
        this.gastos = [...this.gastos,gasto];
        this.calcularRestante();
    }
    calcularRestante() {
        const gastado = this.gastos.reduce((total,gasto) => total + gasto.cantidad, 0); // {} <---- puede causar fallos...
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }
};

class UI {
    insertarPresupuesto(cantidad) {
        // extrayendo valores
        const {presupuesto,restante} = cantidad;
        // agregando al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje,tipo) {
        // crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center','alert');
        if(tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }
        // mensaje de error
        divMensaje.textContent = mensaje;
        // insert HTML
        document.querySelector('.primario').insertBefore(divMensaje,formulario);
        setTimeout(() => {
            divMensaje.remove();
        },3000);
    }

    mostrarGastos(gastos) {
        // iterando
        limpiarHTML(); // limpieza previa al HTML
        gastos.forEach((gasto) => {
            const {cantidad,nombre,id} = gasto;
            // LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;
            // agregar HTML del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad} </span>`;
            // borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn','btn-danger','borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times';
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);
            // agregar HTML
            gastoListado.appendChild(nuevoGasto);
        })
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoColor) {
        const {presupuesto,restante} = presupuestoColor;
        const restanteDiv = document.querySelector('.restante');
        // comprobar porcentajes
        if((presupuesto / 4) >= restante) {
            restanteDiv.classList.remove('alert-success','alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if ((presupuesto / 2) >= restante) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger','alert-warning');
            restanteDiv.classList.add('alert-success');
        }
        // si el total es 0 o menor
        if(restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado','error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
};

// instance
const ui = new UI();
let presupuesto;  // let let let.. nota mental

// functions
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('Cual es tu presupuesto?');
    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();
    }
    // presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);
    ui.insertarPresupuesto(presupuesto);
};

// agrega gastos
function agregarGasto(event) {
    event.preventDefault();

    // leer datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);
    // validar
    if(nombre === '' || cantidad === '') {
        ui.imprimirAlerta('Ambos campos son obligatorios','error');
        return;
    } else if(cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad no valida','error');
        return;
    }
    // object de gastos
    const gasto = {nombre,cantidad,id : Date.now()};
    // agrega un nuevo gasto
    presupuesto.nuevoGasto(gasto);
    // mensaje de OK!
    ui.imprimirAlerta('Gasto Agregado Correctamente');
    // imprimir los gastos
    const {gastos, restante} = presupuesto
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
    // reinicia el formulario
    formulario.reset();
};

// eliminar eliminar el gasto seleccionado
function eliminarGasto(id) {
    // elimina del objeto
    presupuesto.eliminarGasto(id);
    // elimina del HTML
    const {gastos,restante} = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
};

// limpia el HTML
function limpiarHTML() {
    while(gastoListado.firstChild) {
        gastoListado.removeChild(gastoListado.firstChild);
    }
};