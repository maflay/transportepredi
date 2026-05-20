validateSession();

function validateSession() {
  const user_trans = getCookie("1nf0_us3r_tr4ns");
  if (!user_trans) {
    window.location.href = "/validation/login/";
  }
}

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

function renderMenu() {
  const containerHeader = document.getElementById("navItems");
  const usuario = getCookie("1nf0_us3r_tr4ns");
  const usuarioNivel = usuario.Nivel;
  if (usuarioNivel === 1) {
    if (containerHeader) {
      const a_admin = document.createElement("a");
      a_admin.href = "#admin_cargar_result";
      a_admin.textContent = "Cargar resultados";
      a_admin.classList.add("nav-link");
      containerHeader.appendChild(a_admin);
    }
  }
}

let userLog = getCookie("1nf0_us3r_tr4ns");
