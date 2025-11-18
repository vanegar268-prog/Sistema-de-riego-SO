document.getElementById("formularioLogin").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("emailLogin").value.trim();
  const password = document.getElementById("passwordLogin").value;
  const resultado = document.getElementById("resultadoLogin");

  try {
    const res = await fetch("/api/usuarios");
    const usuarios = res.ok ? await res.json() : [];

    const encontrado = usuarios.find(u =>
      u.email === email && u.password === password
    );

    if (encontrado) {
      resultado.textContent = `Bienvenido, ${encontrado.nombre}`;
      resultado.style.color = "green";

      // ✅ Guardamos el ID correctamente
      localStorage.setItem("id", encontrado.id);
      localStorage.setItem("nombre", encontrado.nombre);

      setTimeout(() => {
        window.location.href = "menu.html";
      }, 1000);
    } else {
      resultado.textContent = "Credenciales incorrectas.";
      resultado.style.color = "red";
    }
  } catch (error) {
    resultado.textContent = "Error al iniciar sesión.";
    resultado.style.color = "red";
  }
});
