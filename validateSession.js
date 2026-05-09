validateSession();

function validateSession(){
    const user_trans = getCookie("1nf0_us3r_tr4ns");
    if(!user_trans){
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