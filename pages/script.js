import { ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { database } from "../environment/firebaseConfig.js";
import { deleteRow } from "../modules/tabla/deleteRow.js";
import { addEditEventListeners } from "../modules/tabla/editRow.js";
import { mostrarModal } from "../modules/mostrarModal.js";
import { initializeSearch } from "../modules/searchFunction.js";
import { initScrollButtons } from "../modules/scrollButtons.js";
import { updatePagination, currentPage, itemsPerPage } from "../modules/pagination.js";
import {
  changeSemanaSelect,
  changeEstadoSelect,
  changeLunesSelectEvent,
  changeMartesSelectEvent,
  changeMiercolesSelectEvent,
  changeJuevesSelectEvent,
  changeViernesSelectEvent,
  changeSabadoSelectEvent,
} from "../modules/tabla/changeSelectEvent.js";
import "../modules/downloadToExcel.js";
import "../modules/newRegister.js";

// Constantes y variables de estado
const tabla = document.getElementById("libreria");
let totalPages;

// Función para mostrar los datos en la tabla
export function mostrarDatos() {
  onValue(ref(database, collection), (snapshot) => {
    tabla.innerHTML = ""; // Limpia la tabla

    const data = [];
    snapshot.forEach((childSnapshot) => {
      data.push({ id: childSnapshot.key, ...childSnapshot.val() });
    });

    data.sort((a, b) => a.nombre.localeCompare(b.nombre)); // Ordena por nombre

    // Paginación
    totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, data.length);
    let filaNumero = startIndex + 1;

    // Mostrar datos de la página actual
    for (let i = startIndex; i < endIndex; i++) {
      const user = data[i];
      const row = `
        <tr>
          <td class="text-center">${filaNumero++}</td>
          <td class="text-center">${user.nombre}</td>
          <td class="text-center">
            <div class="flex-container">
              <span class="${!user.semana ? 'invisible-value' : ''}">${user.semana || ''}</span>
              <select class="form-select semana-select" data-id="${user.id}" data-field="semana">
                <option value="---" ${user.semana === "---" ? "selected" : ""}>---</option>
                ${Array.from({ length: 13 }, (_, i) => `<option value="semana ${String(i + 1).padStart(2, '0')}" ${user.semana === `semana ${String(i + 1).padStart(2, '0')}` ? "selected" : ""}>semana ${String(i + 1).padStart(2, '0')}</option>`).join('')}
              </select>
            </div>
          </td>
          <td class="text-center">
            <div class="flex-container">
              <span class="${!user.estado ? 'invisible-value' : ''}">${user.estado || ''}</span>
              <select class="form-select estado-select" data-id="${user.id}" data-field="estado">
                <option value="" ${user.estado === "" ? "selected" : ""}></option>
                <option value="Al Día" ${user.estado === "Al Día" ? "selected" : ""}>Al Día</option>
                <option value="Completado" ${user.estado === "Completado" ? "selected" : ""}>Completado</option>
                <option value="Atrasado" ${user.estado === "Atrasado" ? "selected" : ""}>Atrasado</option>
              </select>
            </div>
          </td>
          ${["lunes", "martes", "miercoles", "jueves", "viernes", "sabado"].map((dia) => `
            <td class="text-center">
              <div class="flex-container">
                <span class="${!user[dia] ? 'invisible-value' : ''}">${user[dia] || ''}</span>
                <select class="form-select pay-select" data-id="${user.id}" data-field="${dia}">
                  <option value="" ${user[dia] === "" ? "selected" : ""}></option>
                  <option value="0.00" ${user[dia] === "0.00" ? "selected" : "0.00"}></option>
                  <option value="12.00" ${user[dia] === "12.00" ? "selected" : ""}>12.00</option>
                </select>
              </div>
            </td>
          `).join('')}
          <td class="display-flex-center">
            <button class="btn btn-primary mg-05em edit-user-button" data-id="${user.id}">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-danger mg-05em delete-user-button" data-id="${user.id}">
              <i class="bi bi-eraser-fill"></i>
            </button>
          </td>
          <td class="text-center">
            <span class="${!user.userId ? 'invisible-value' : ''}">${user.userId || ''}</span>
          </td>
        </tr>
      `;
      tabla.innerHTML += row;
    }

    // Manejo de eventos para los elementos select
    const selectElements = document.querySelectorAll("select");

    selectElements.forEach((selectElement) => {
      selectElement.addEventListener("change", function () {
        const selectedValue = this.value;
        const userId = this.getAttribute("data-id");
        const field = this.getAttribute("data-field");

        // Alerta de confirmación para los días de la semana
        if (["lunes", "martes", "miercoles", "jueves", "viernes", "sabado"].includes(field)) {
          if (!confirm("¿Estás seguro de que deseas hacer este cambio?")) {
            // Si el usuario cancela, revertir el valor del select
            this.value = this.dataset.oldValue;
            return;
          }
        }

        // Actualizar el valor en Firebase
        update(ref(database, `${collection}/${userId}`), {
          [field]: selectedValue,
        });

        // Actualizar la interfaz de usuario
        if (selectedValue === "12.00" || selectedValue === "Completado") {
          this.disabled = true;
          this.closest('div.flex-container').querySelector('span').style.color = "green";
          this.closest('div.flex-container').querySelector('span').style.fontWeight = "bold";
        } else {
          this.disabled = false;
          this.closest('div.flex-container').querySelector('span').style.color = "black";
          this.closest('div.flex-container').querySelector('span').style.fontWeight = "normal";
        }
      });

      // Configuración inicial del estilo basado en el valor seleccionado
      const selectedValue = selectElement.value;
      selectElement.dataset.oldValue = selectedValue; // Guardar el valor inicial
      selectElement.disabled = selectedValue === "12.00";
      if (selectedValue === "12.00" || selectedValue === "Completado") {
        selectElement.closest('div.flex-container').querySelector('span').style.color = "green";
        selectElement.closest('div.flex-container').querySelector('span').style.fontWeight = "bold";
      }
    });

    deleteRow(database, collection); // Añade event listeners para eliminación
    updatePagination(totalPages, mostrarDatos);
    addEditEventListeners(database, collection); // Añade event listeners para edición
  });
}

// Inicializa la tabla y eventos al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#showModalButton').addEventListener('click', mostrarModal);
  mostrarDatos();
  initializeSearch(tabla);
  initScrollButtons(tabla);
  changeEstadoSelect(tabla, database, collection);
  changeSemanaSelect(tabla, database, collection);
  changeLunesSelectEvent(tabla, database, collection);
  changeMartesSelectEvent(tabla, database, collection);
  changeMiercolesSelectEvent(tabla, database, collection);
  changeJuevesSelectEvent(tabla, database, collection);
  changeViernesSelectEvent(tabla, database, collection);
  changeSabadoSelectEvent(tabla, database, collection);
});

console.log(database);
