const userId = localStorage.getItem("id");
const serial = localStorage.getItem("dispositivo_actual");
const mensaje = document.getElementById("mensaje");
const tabla = document.getElementById("tabla-historial");

console.log("ID cargado desde localStorage:", userId);
console.log("Serial seleccionado:", serial);

if (!userId || !serial) {
  mensaje.textContent = "Esperando...";
} else {
  fetch(`/obtener-historial/${userId}/${serial}`)
    .then(res => {
      if (!res.ok) throw new Error("Error al obtener historial del servidor");
      return res.json();
    })
    .then(data => {
      if (data.length === 0) {
        mensaje.textContent = "No hay registros de humedad para este dispositivo.";
      } else {
        data.forEach(d => {
          const fila = `<tr>
            <td>${d.fecha}</td>
            <td>${d.hora}</td>
            <td>${d.valor}%</td>
          </tr>`;
          tabla.innerHTML += fila;
        });
      }
    })
    .catch(error => {
      console.error("Error al cargar historial:", error);
      mensaje.textContent = "No se pudo cargar el historial. Intenta más tarde.";
    });
}