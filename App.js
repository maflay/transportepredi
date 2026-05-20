window.addEventListener("load", function () {
  const loading = document.getElementById("loading");
  setTimeout(() => {
    loading.style.display = "none";
  }, 550);
});

function cargarEstiloVista(cssUrls) {
  const oldLinks = document.querySelectorAll("link[data-vista-css]");
  oldLinks.forEach((link) => link.remove());

  const addCss = (url, i = 0) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = withVersion(url);
    link.setAttribute("data-vista-css", `vista-css-${i}`);
    document.head.appendChild(link);
  };

  // Cargar nuevos estilos
  if (Array.isArray(cssUrls)) {
    cssUrls.forEach((url, i) => addCss(url, i));
  } else if (cssUrls) {
    addCss(cssUrls);
  }
}

function cargarScriptVista(scriptUrls) {
  const oldScripts = document.querySelectorAll("script[data-vista-script]");
  oldScripts.forEach((script) => script.remove());

  const addScript = (url, i = 0, isModule = false) => {
    const script = document.createElement("script");
    if (isModule) script.type = "module";
    script.src = withVersion(url);
    script.defer = true;
    script.setAttribute("data-vista-script", `vista-script-${i}`);
    document.body.appendChild(script);
  };

  if (Array.isArray(scriptUrls)) {
    scriptUrls.forEach((url, i) => {
      addScript(url, i, true);
    });
  } else if (scriptUrls) {
    addScript(scriptUrls, 0, false);
  }
}

const APP_VERSION = Date.now();

function withVersion(url) {
  if (!APP_VERSION) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}v=${APP_VERSION}`;
}

const PageLoader = {
  cargarPagina: function (clave, contenedorId = "content-area") {
    const loading = document.getElementById("loading");
    const mainContent = document.getElementById(contenedorId);
    // loading.style.display = "flex";
    window.scrollTo(0, 0);
    const ruta = rutasLimpias[clave];
    if (!ruta) {
      mainContent.innerHTML = `<p>Ruta no encontrada: ${clave}</p>`;
      loading.style.display = "none";
      return;
    }

    sessionStorage.clear();
    fetch(withVersion(ruta.html), { cache: "no-store" })
      .then((response) => response.text())
      .then((html) => {
        if (ruta.css) cargarEstiloVista(ruta.css);
        if (ruta.js) cargarScriptVista(ruta.js);

        const images = mainContent.querySelectorAll("img");
        const total = images.length;
        let loaded = 0;
        mainContent.innerHTML = html;

        const iniciarAnimaciones = () => {
          animarScrollConObserver(".titulo", "y");
          animarScrollConObserver(".titulor", "x-right");
          animarScrollConObserver(".titulol", "x-left");
          loading.style.display = "none";
        };

        if (total === 0) {
          requestAnimationFrame(() => setTimeout(iniciarAnimaciones, 50));
        } else {
          images.forEach((img) => {
            if (img.complete) {
              loaded++;
              if (loaded === total) iniciarAnimaciones();
            } else {
              img.addEventListener("load", () => {
                loaded++;
                if (loaded === total) iniciarAnimaciones();
              });
              img.addEventListener("error", () => {
                loaded++;
                if (loaded === total) iniciarAnimaciones();
              });
            }
          });
        }
      })
      .catch((error) => {
        mainContent.innerHTML = "<p>Error al cargar la página.</p>";
        console.error("Error al cargar la página:", error);
      });
  },
};

function navegarA(valor) {
  const clave = valor.split("?")[0];

  if (!rutasLimpias[clave]) {
    console.error("Ruta no definida:", clave);
    return;
  }
  window.location.hash = valor;
}

window.addEventListener("hashchange", () => {
  const hash = window.location.hash.slice(1);
  const [clave, query] = hash.split("?");

  PageLoader.cargarPagina(clave);

  if (query) {
    const params = new URLSearchParams(query);
    const seccionId = params.get("id");

    if (seccionId) {
      setTimeout(() => {
        const elemento = document.getElementById(seccionId);
        if (elemento) {
          elemento.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  cargarHeaderYFooter();
  const loading = document.getElementById("loading");

  if (!window.location.hash) {
    navegarA("inicio");
  }
});

function animarScrollConObserver(selector, direccion = "y") {
  const elements = document.querySelectorAll(selector);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        const id = el.dataset.id;

        if (entry.isIntersecting && !el.dataset.animated) {
          el.style.opacity = 1;

          let transform = "";
          if (direccion === "y") {
            transform = "translateY(0)";
          } else if (direccion === "x-right") {
            transform = "translateX(0)";
          } else if (direccion === "x-left") {
            transform = "translateX(0)";
          }

          el.style.transform = transform;
          el.dataset.animated = "true";
          sessionStorage.setItem(id, "true");
          observer.unobserve(el);
        }
      });
    },
    {
      threshold: 0.2, // visible al 20%
    },
  );

  elements.forEach((el, index) => {
    el.dataset.id = el.dataset.id || `anim-${selector}-${index}`;
    if (sessionStorage.getItem(el.dataset.id) === "true") {
      el.style.opacity = 1;
      el.style.transform = "translate(0, 0)";
      el.dataset.animated = "true";
    } else {
      if (direccion === "y") {
        el.style.transform = "translateY(40px)";
      } else if (direccion === "x-right") {
        el.style.transform = "translateX(40px)";
      } else if (direccion === "x-left") {
        el.style.transform = "translateX(-40px)";
      }

      observer.observe(el);
    }
  });
}

function cargarHeaderYFooter() {
  const mainFooter = document.getElementById("main-footer");
  const hash = window.location.hash.slice(1) || "inicio";
  const clave = hash.split("?")[0];

  fetch("/components/header/header.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("main-header").innerHTML = html;
      const navToggle = document.getElementById("navToggle");
      const navItems = document.getElementById("navItems");

      if (navToggle && navItems) {
        navToggle.addEventListener("click", () => {
          navToggle.classList.toggle("open");
          navItems.classList.toggle("open");
        });
      }
      renderMenu();

      document
        .getElementById("btn_cerrar_session")
        .addEventListener("click", () => {
          OlvidarUsuario();
        });

      document.getElementById("logo-menu").addEventListener("click", () => {
        window.location.hash = "inicio";
      });

      window.addEventListener("scroll", function () {
        const navbar = document.querySelector(".Navbar");
        if (navbar) {
          if (window.scrollY > 0) {
            navbar.classList.add("navbar-scrolled");
          } else {
            navbar.classList.remove("navbar-scrolled");
          }
        }
      });

      const navLinks = document.querySelectorAll(".nav-link");

      navLinks.forEach((link) => {
        link.addEventListener("click", function () {
          navLinks.forEach((l) => l.classList.remove("active"));
          this.classList.add("active");

          if (navItems.classList.contains("open")) {
            navToggle.classList.remove("open");
            navItems.classList.remove("open");
            document.body.style.overflow = "";
          }
        });
      });
    })
    .catch((error) => {
      console.error("Error al cargar el header:", error);
      document.getElementById("main-header").innerHTML =
        "<p>Error al cargar el menú.</p>";
    });

  fetch("/components/footer/footer.html")
    .then((response) => response.text())
    .then((html) => {
      mainFooter.innerHTML = html;
      const footerScripts = mainFooter.querySelectorAll("script");
      footerScripts.forEach((script) => {
        const newScript = document.createElement("script");
        if (script.src) {
          newScript.src = script.src;
        }
        newScript.textContent = script.textContent;
        document.body.appendChild(newScript);
      });
    })
    .catch((error) => {
      console.error("Error al cargar el footer:", error);
      mainFooter.innerHTML = "<p>Error al cargar el footer.</p>";
    });
  document.addEventListener("click", (event) => {
    const link = event.target.closest(".Navbar .nav-items a[data-target]");
    if (link) {
      event.preventDefault();
      const ruta = link.getAttribute("data-target");
      window.location.hash = ruta;
    }
  });
  PageLoader.cargarPagina(clave);
}

function toRegister() {
  window.scrollTo(0, 0);
  navegarA(`contacto`);
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

function OlvidarUsuario() {
  Swal.fire({
    title: "Seguro de salir?",
    text: "Se olvidara el usuario y la contraseña",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si Quiero!",
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Exito!",
        text: "Tu usuario has sido olvidado.",
        icon: "success",
        allowOutsideClick: false,
      }).then((res) => {
        if (res.isConfirmed) {
          document.cookie = "1nf0_us3r_tr4ns=; max-age=0; path=/;";
          window.location.hash = "/validation/login/";
          location.reload();
        }
      });
    }
  });
}
