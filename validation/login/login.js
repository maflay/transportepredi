window.addEventListener("load", () => {
  document.getElementById("loading").style.display = "none";
});

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

const loader = document.getElementById("loading");
const nombre_trans = document.getElementById("nombre_trans");
const apellido_trans = document.getElementById("apellido_trans");
const document_trans = document.getElementById("document_trans");
const password_trans = document.getElementById("password_trans");
const telefono_trans = document.getElementById("telefono_trans");
const correo_trans = document.getElementById("correo_trans");
const tipo_vehiculo = document.getElementById("tipo_vehiculo");
const placa_vehiculo = document.getElementById("placa_vehiculo");
const url =
  "https://script.google.com/macros/s/AKfycbwmqjFE_F4eNwauT70F-ERSVaYVQSX2H2MK6FOytpTEz3sNXCLIdfF9Ba70mJ9664h6/exec";

function ValidateSession() {
  const usuario_trans = document.getElementById("usuario_trans");
  const password_trans = document.getElementById("password_trans");

  if (!usuario_trans.value || !password_trans.value) {
    Swal.fire({
      icon: "warning",
      title: "Campo en Blanco",
    });
    return;
  }

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

  loader.style.display = "flex";

  fetch(
    `${url}?hoja=usuarios&usuario=${usuario_trans.value}&contra=${password_trans.value}`,
  )
    .then((res) => res.json())
    .then((data) => {
      if (!Array.isArray(data) || data.length === 0) {
        Swal.fire({
          icon: "info",
          title: "Usuario no encontrado",
        });
        loader.style.display = "none";
        return;
      }
      let IdSession = Array.from({ length: 6 }, () =>
        Math.random().toString(36).substring(2),
      ).join("");
      let dataCookie = {
        Numero: password_trans.value,
        Token: IdSession,
        Asset: url,
        Nivel: data[0].Nivel,
        Vehi: data[0].Tipo_vehiculo,
      };
      setCookie("1nf0_us3r_tr4ns", dataCookie);
      window.location.reload();
    });
}

let emptyUser = getCookie("1nf0_us3r_tr4ns");
if (emptyUser) {
  window.location.href = "/#inicio";
}

function setCookie(name, value, opts = {}) {
  const {
    hours = 2,
    path = "/",
    sameSite = "Lax",
    secure = location.protocol === "https:",
  } = opts;

  const expires = new Date(Date.now() + hours * 60 * 60 * 1000).toUTCString();
  const encoded = encodeURIComponent(JSON.stringify(value));
  let cookie = `${name}=${encoded}; Expires=${expires}; Path=${path}; SameSite=${sameSite}`;
  if (secure) cookie += `; Secure`;
  document.cookie = cookie;
}

function getCookie(name) {
  const parts = document.cookie ? document.cookie.split("; ") : [];
  for (const part of parts) {
    const [k, ...rest] = part.split("=");
    if (k === name) {
      const val = rest.join("=");
      try {
        return JSON.parse(decodeURIComponent(val));
      } catch {
        return decodeURIComponent(val);
      }
    }
  }
  return null;
}

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

  let createUser = nombre_trans.value.split(" ")[0].toLowerCase();

  let data = {
    tipo: "usuario_create",
    Hora: hora,
    Fecha: fecha,
    Nombre: nombre_trans.value,
    Apellido: apellido_trans.value,
    Numero: document_trans.value,
    Username:  document_trans.value,
    Contrasenia: document_trans.value,
    Tipo_vehiculo: tipo_vehiculo.value,
    Placa: placa_vehiculo.value,
    Nivel: "2",
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
          Tipo_vehiculo: tipo_vehiculo.value,
          Placa: placa_vehiculo.value,
        }),
      });
      fetch(url, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
          tipo: "puntajes_predi",
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
