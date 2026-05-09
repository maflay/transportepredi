window.addEventListener("load", () => {
  document.getElementById("loading").style.display = "none";
});

const loader = document.getElementById("loading");
const nombre_trans = document.getElementById("nombre_trans");
const document_trans = document.getElementById("document_trans");
const password_trans = document.getElementById("password_trans");
const telefono_trans = document.getElementById("telefono_trans");
const correo_trans = document.getElementById("correo_trans");
const tipo_vehiculo = document.getElementById("tipo_vehiculo");
const placa_vehiculo = document.getElementById("placa_vehiculo");
const url =
  "https://script.google.com/macros/s/AKfycbx6uVWGh0YdGDC7ZfxiWciDjRXsAP9soR4IhvSieUS6Y8OGUO7-mBegy8yzQVpqgwXd/exec";

function registerTrans() {
  const fechaCompleta = new Date().toLocaleString("es-CO", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const [fecha, hora] = fechaCompleta.split(", ");

  let createUser = nombre_trans.value.split(" ")[0];

  let data = {
    tipo: "usuario_create",
    Hora: hora,
    Fecha: fecha,
    Nombre: nombre_trans.value,
    Numero: document_trans.value,
    Username: createUser,
    Contrasenia: document_trans.value,
    Tipo_vehiculo: tipo_vehiculo.value,
    Placa: placa_vehiculo.value,
  };

  loader.style.display = "flex";
  fetch(url, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(data),
  })
    .then((res) => res.text())
    .then(() => {
      fetch(url, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
          tipo: "event",
          Hora: hora,
          Fecha: fecha,
          Nombre: nombre_trans.value,
          Numero: document_trans.value,
          Placa: placa_vehiculo.value,
        }),
      });
      nombre_trans.value = "";
      document_trans.value = "";
      password_trans.value = "";
      telefono_trans.value = "";
      correo_trans.value = "";
      loader.style.display = "none";
      Swal.fire({
        icon: "success",
        title: "Usuario creado",
        allowOutsideClick: false,
      }).then((act) => {
        if (act.isConfirmed) {
          window.location.href = "/validation/login/";
        }
      });
    })
    .catch((error) => {
      loader.style.display = "none";
      Swal.fire({
        icon: "error",
        title: "Error en el Envió",
      });
    });
}

(() => {
  let tiempo;

  function resetearTemporizador() {
    clearTimeout(tiempo);
    tiempo = setTimeout(accionInactividad, 1200000);
  }

  function accionInactividad() {
    window.location.href = "/validation/login/";
  }

  // Escuchamos los eventos para reiniciar el conteo
  window.onload = resetearTemporizador;
  document.onmousemove = resetearTemporizador;
  document.onkeypress = resetearTemporizador;
  document.onscroll = resetearTemporizador;
  document.onclick = resetearTemporizador;
})();
