async function conectar() {
  try {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    const decoder = new TextDecoderStream();
    const inputDone = port.readable.pipeTo(decoder.writable);
    const inputStream = decoder.readable;
    const reader = inputStream.getReader();

    document.getElementById("estado").textContent = "Esperando datos...";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        const linea = value.trim();
        const partes = linea.split(",");
        if (partes.length === 2) {
          const porcentaje = partes[0];
          const estado = partes[1];

          document.getElementById("humedad").textContent = porcentaje + "%";
          document.getElementById("estado").textContent = estado;

          const now = new Date();
          const fecha = now.toLocaleDateString();
          const hora = now.toLocaleTimeString();

          const tabla = document.getElementById("tabla-historial");
          const fila = document.createElement("tr");
          fila.innerHTML = `<td>${fecha}</td><td>${hora}</td><td>${porcentaje}%</td>`;
          tabla.appendChild(fila);

          const userId = localStorage.getItem("id");
          const serial = localStorage.getItem("dispositivo_actual");

          if (userId && serial) {
            fetch('/guardar-humedad', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId, serial, valor: porcentaje })
            })
            .then(res => res.json())
            .then(data => console.log("Guardado en historial:", data.mensaje))
            .catch(err => console.error("Error al guardar humedad:", err));
          } else {
            console.warn("Falta userId o serial para guardar humedad.");
          }
        }
      }
    }
  } catch (err) {
    console.error(err);
    document.getElementById("estado").textContent = "Error: No se conectó ningún dispositivo";
  }
}


function toggleChatbot() {
  const chatbot = document.getElementById('chatbot');
  const isVisible = window.getComputedStyle(chatbot).display !== 'none';
  chatbot.style.display = isVisible ? 'none' : 'flex';
}
window.toggleChatbot = toggleChatbot;

function sendMessage() {
  const input = document.getElementById('user-input');
  const message = input.value.trim();
  if (!message) return;

  appendMessage('user', message);
  input.value = '';

  setTimeout(() => {
    const response = getBotResponse(message);
    appendMessage('bot', response);
  }, 500);
}

function appendMessage(sender, text) {
  const chatBox = document.getElementById('chat-box');
  const messageDiv = document.createElement('div');
  messageDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
  messageDiv.textContent = text;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function getBotResponse(input) {
  input = input.toLowerCase();

  if (input.includes('hola')) {
    return '¡Hola! ¿Tienes alguna duda sobre el sistema de riego automatizado?';
  }
  if (input.includes('que es el riego automatizado')) {
    return 'El riego automatizado es un sistema que riega las plantas de forma eficiente y sin intervención manual, utilizando sensores o programación para controlar aspersores o goteros según la hora y cantidad de agua necesarias.';
  }
  if (input.includes('como funciona')) {
    return 'Nuestro sistema detecta el porcentaje de humedad de la planta mediante un sensor de humedad y activa la bomba de riego solo cuando es necesario.';
  }
  if (
    input.includes('el sensor funciona con todo tipo de plantas') ||
    input.includes('cada cuánto')
  ) {
    return 'Si, nuestro sensor sirve para cualquier planta en la que desees utilizarlo.';
  }
  if (
    input.includes('beneficios') ||
    input.includes('ventajas')
  ) {
    return 'Mayor eficiencia en el uso del agua, ahorro económico, aumento de la producción y mejor calidad de los productos.';
  }
  if (input.includes('cada cuanto mide la humedad')) {
    return 'La humedad es medida cada 3 segundos.';
  }
  if (
    input.includes('cuanto es el porcentaje de humedad requerido para que no haya riego') ||
    input.includes('humedad')
  ) {
    return 'Si el sensor de humedad detecta mas del 60% de humedad, este no regara la planta.';
  }
  if (input.includes('no detecta el arduino')) {
    return 'Pruebe con desconectar y volver a conectar el cable del arduino.';
  }
  if (input.includes('gracias')) {
    return '¡Con mucho gusto! ¿Tienes alguna otra duda?';
  }
  if (input.includes('adios')) {
    return '¡Hasta luego!';
  }
  return 'No tengo información sobre eso aún. ¿Podrías intentar reformular tu pregunta sobre el sistema de riego automatico?';
}
