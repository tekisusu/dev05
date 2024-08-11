import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { database } from "../../environment/firebaseConfig.js";
import { deleteRow } from "../modules/tabla/deleteRow.js";
import { mostrarModal } from "../modules/mostrarModal.js";
// import { initializeSearch } from "../../modules/searchFunction.js";
import { initScrollButtons } from "../modules/scrollButtons.js";
import { updatePagination, currentPage, itemsPerPage } from "../modules/pagination.js";
import { changeEstadoSelectEvent, changeRoleSelectEvent } from "../modules/tabla/changeSelectEvent.js";
import { changeSemanaSelectEvent } from "../modules/tabla/changeSelectEvent/changeSemanaSelectEvent.js";
import { changeLunesSelectEvent } from "../modules/tabla/changeSelectEvent/change1_LunesSelectEvent.js";
import { changeMartesSelectEvent } from "../modules/tabla/changeSelectEvent/change2_MartesSelectEvent.js";
import { changeMiercolesSelectEvent } from "../modules/tabla/changeSelectEvent/change3_MiercolesSelectEvent.js";
import { changeJuevesSelectEvent } from "../modules/tabla/changeSelectEvent/change4_JuevesSelectEvent.js";
import { changeViernesSelectEvent } from "../modules/tabla/changeSelectEvent/change5_ViernesSelectEvent.js";
import { changeSabadoSelectEvent } from "../modules/tabla/changeSelectEvent/change6_SabadoSelectEvent.js";
import "../modules/downloadToExcel.js";
import "../auth/signup_Form.js";

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
              <span>${user.semana}</span>
              <select class="form-select semana-select" data-id="${user.id}">
                <option value="---" ${user.semana === "---" ? "selected" : ""}>---</option>
                <option value="semana 01" ${user.semana === "semana 01" ? "selected" : ""}>semana 01</option>
                <option value="semana 02" ${user.semana === "semana 02" ? "selected" : ""}>semana 02</option>
                <option value="semana 03" ${user.semana === "semana 03" ? "selected" : ""}>semana 03</option>
                <option value="semana 04" ${user.semana === "semana 04" ? "selected" : ""}>semana 04</option>
                <option value="semana 05" ${user.semana === "semana 05" ? "selected" : ""}>semana 05</option>
                <option value="semana 06" ${user.semana === "semana 06" ? "selected" : ""}>semana 06</option>
                <option value="semana 07" ${user.semana === "semana 07" ? "selected" : ""}>semana 07</option>
                <option value="semana 08" ${user.semana === "semana 08" ? "selected" : ""}>semana 08</option>
                <option value="semana 09" ${user.semana === "semana 09" ? "selected" : ""}>semana 09</option>
                <option value="semana 10" ${user.semana === "semana 10" ? "selected" : ""}>semana 10</option>
                <option value="semana 11" ${user.semana === "semana 11" ? "selected" : ""}>semana 11</option>
                <option value="semana 12" ${user.semana === "semana 12" ? "selected" : ""}>semana 12</option>
                <option value="semana 13" ${user.semana === "semana 13" ? "selected" : ""}>semana 13</option>
              </select>
            </div>
          </td>

          <td class="text-center lunes-col">
            <div class="flex-container">
              <span>${user.lunes}</span>
              <select class="form-select lunes-select" data-id="${user.id}">
                <option value="Ninguno" ${user.lunes === "Ninguno" ? "selected" : ""}>Ninguno</option>
                <option value="0.00" ${user.lunes === "0.00" ? "selected" : ""}>0.00</option>
                <option value="12.00" ${user.lunes === "12.00" ? "selected" : ""}>12.00</option>
                <option value="24.00" ${user.lunes === "24.00" ? "selected" : ""}>24.00</option>
                <option value="36.00" ${user.lunes === "36.00" ? "selected" : ""}>36.00</option>
                <option value="48.00" ${user.lunes === "48.00" ? "selected" : ""}>48.00</option>
                <option value="60.00" ${user.lunes === "60.00" ? "selected" : ""}>60.00</option>
                <option value="72.00" ${user.lunes === "72.00" ? "selected" : ""}>72.00</option>
              </select>
            </div>
          </td>

          <td class="text-center martes-col">
            <div class="flex-container">
              <span>${user.martes}</span>
              <select class="form-select martes-select" data-id="${user.id}">
                <option value="Ninguno" ${user.martes === "Ninguno" ? "selected" : ""}>Ninguno</option>
                <option value="0.00" ${user.martes === "0.00" ? "selected" : ""}>0.00</option>
                <option value="12.00" ${user.martes === "12.00" ? "selected" : ""}>12.00</option>
                <option value="24.00" ${user.martes === "24.00" ? "selected" : ""}>24.00</option>
                <option value="36.00" ${user.martes === "36.00" ? "selected" : ""}>36.00</option>
                <option value="48.00" ${user.martes === "48.00" ? "selected" : ""}>48.00</option>
                <option value="60.00" ${user.martes === "60.00" ? "selected" : ""}>60.00</option>
                <option value="72.00" ${user.martes === "72.00" ? "selected" : ""}>72.00</option>
              </select>
            </div>
          </td>

          <td class="text-center miercoles-col">
            <div class="flex-container">
              <span>${user.miercoles}</span>
              <select class="form-select miercoles-select" data-id="${user.id}">
                <option value="Ninguno" ${user.miercoles === "Ninguno" ? "selected" : ""}>Ninguno</option>
                <option value="0.00" ${user.miercoles === "0.00" ? "selected" : ""}>0.00</option>
                <option value="12.00" ${user.miercoles === "12.00" ? "selected" : ""}>12.00</option>
                <option value="24.00" ${user.miercoles === "24.00" ? "selected" : ""}>24.00</option>
                <option value="36.00" ${user.miercoles === "36.00" ? "selected" : ""}>36.00</option>
                <option value="48.00" ${user.miercoles === "48.00" ? "selected" : ""}>48.00</option>
                <option value="60.00" ${user.miercoles === "60.00" ? "selected" : ""}>60.00</option>
                <option value="72.00" ${user.miercoles === "72.00" ? "selected" : ""}>72.00</option>
              </select>
            </div>
          </td>

          <td class="text-center jueves-col">
            <div class="flex-container">
              <span>${user.jueves}</span>
              <select class="form-select jueves-select" data-id="${user.id}">
                <option value="Ninguno" ${user.jueves === "Ninguno" ? "selected" : ""}>Ninguno</option>
                <option value="0.00" ${user.jueves === "0.00" ? "selected" : ""}>0.00</option>
                <option value="12.00" ${user.jueves === "12.00" ? "selected" : ""}>12.00</option>
                <option value="24.00" ${user.jueves === "24.00" ? "selected" : ""}>24.00</option>
                <option value="36.00" ${user.jueves === "36.00" ? "selected" : ""}>36.00</option>
                <option value="48.00" ${user.jueves === "48.00" ? "selected" : ""}>48.00</option>
                <option value="60.00" ${user.jueves === "60.00" ? "selected" : ""}>60.00</option>
                <option value="72.00" ${user.jueves === "72.00" ? "selected" : ""}>72.00</option>
              </select>
            </div>
          </td>

          <td class="text-center viernes-col">
            <div class="flex-container">
              <span>${user.viernes}</span>
              <select class="form-select viernes-select" data-id="${user.id}">
                <option value="Ninguno" ${user.viernes === "Ninguno" ? "selected" : ""}>Ninguno</option>
                <option value="0.00" ${user.viernes === "0.00" ? "selected" : ""}>0.00</option>
                <option value="12.00" ${user.viernes === "12.00" ? "selected" : ""}>12.00</option>
                <option value="24.00" ${user.viernes === "24.00" ? "selected" : ""}>24.00</option>
                <option value="36.00" ${user.viernes === "36.00" ? "selected" : ""}>36.00</option>
                <option value="48.00" ${user.viernes === "48.00" ? "selected" : ""}>48.00</option>
                <option value="60.00" ${user.viernes === "60.00" ? "selected" : ""}>60.00</option>
                <option value="72.00" ${user.viernes === "72.00" ? "selected" : ""}>72.00</option>
              </select>
            </div>
          </td>

          <td class="text-center sabado-col">
            <div class="flex-container">
              <span>${user.sabado}</span>
              <select class="form-select sabado-select" data-id="${user.id}">
                <option value="Ninguno" ${user.sabado === "Ninguno" ? "selected" : ""}>Ninguno</option>
                <option value="0.00" ${user.sabado === "0.00" ? "selected" : ""}>0.00</option>
                <option value="12.00" ${user.sabado === "12.00" ? "selected" : ""}>12.00</option>
                <option value="24.00" ${user.sabado === "24.00" ? "selected" : ""}>24.00</option>
                <option value="36.00" ${user.sabado === "36.00" ? "selected" : ""}>36.00</option>
                <option value="48.00" ${user.sabado === "48.00" ? "selected" : ""}>48.00</option>
                <option value="60.00" ${user.sabado === "60.00" ? "selected" : ""}>60.00</option>
                <option value="72.00" ${user.sabado === "72.00" ? "selected" : ""}>72.00</option>
              </select>
            </div>
          </td>

          <td class="text-center estado-col">
            <div class="flex-container">
              <span>${user.estado}</span>
              <select class="form-select estado-select" data-id="${user.id}">
                <option value="Ninguno" ${user.estado === "Ninguno" ? "selected" : ""}>Ninguno</option>
                <option value="Al Día" ${user.estado === "Al Día" ? "selected" : ""}>Al Día</option>
                <option value="Atrasado" ${user.estado === "Atrasado" ? "selected" : ""}>Atrasado</option>
              </select>
            </div>
          </td>

          <td class="text-center role-col">
            <div class="flex-container">
              <span>${user.role}</span>
              <select class="form-select role-select" data-id="${user.id}">
                <option value="Ninguno" ${user.role === "Ninguno" ? "selected" : ""}>Ninguno</option>
                <option value="Desarrollador" ${user.role === "Desarrollador" ? "selected" : ""}>Desarrollador</option>
                <option value="Administrador" ${user.role === "Administrador" ? "selected" : ""}>Administrador</option>
                <option value="Participante" ${user.role === "Participante" ? "selected" : ""}>Participante</option>
              </select>
            </div>
          </td>

          <td>
            <button class="btn btn-danger delete-user-button" data-id="${user.id}"><i class="bi bi-eraser-fill"></i></button>
          </td>
          
          <td class="text-center">${user.email}</td>
          <td class="text-center">${user.userId}</td>
        </tr>
      `;
      tabla.innerHTML += row;
    }

    deleteRow(database, collection); // Añade event listeners para eliminación
    updatePagination(totalPages, mostrarDatos);
  });
}

// Inicializa la tabla y eventos al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#showModalButton').addEventListener('click', mostrarModal);
  mostrarDatos();
  // initializeSearch(tabla);
  initScrollButtons(tabla);
  changeRoleSelectEvent(tabla, database, collection);
  changeEstadoSelectEvent(tabla, database, collection);
  changeSemanaSelectEvent(tabla, database, collection);
  changeLunesSelectEvent(tabla, database, collection);
  changeMartesSelectEvent(tabla, database, collection);
  changeMiercolesSelectEvent(tabla, database, collection);
  changeJuevesSelectEvent(tabla, database, collection);
  changeViernesSelectEvent(tabla, database, collection);
  changeSabadoSelectEvent(tabla, database, collection);
});

console.log(database);