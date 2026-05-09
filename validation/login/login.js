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

function ValidateSession() {
  const usuario_trans = document.getElementById("usuario_trans");
  const password_trans = document.getElementById("password_trans");
  const loader = document.getElementById("loading");
  const url =
    "https://script.google.com/macros/s/AKfycbx6uVWGh0YdGDC7ZfxiWciDjRXsAP9soR4IhvSieUS6Y8OGUO7-mBegy8yzQVpqgwXd/exec";

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
      setCookie("1nf0_us3r_tr4ns", IdSession);
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
