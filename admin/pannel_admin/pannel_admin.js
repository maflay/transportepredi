(() => {
  const primer_lugar = document.getElementById("primer_lugar");
  const segundo_lugar = document.getElementById("segundo_lugar");
  const tercer_lugar = document.getElementById("tercer_lugar");
  const cuarto_lugar = document.getElementById("cuarto_lugar");

  const primer_lugar_label = document.getElementById("primer_lugar_label");
  const segundo_lugar_label = document.getElementById("segundo_lugar_label");
  const tercer_lugar_label = document.getElementById("tercer_lugar_label");
  const cuarto_lugar_label = document.getElementById("cuarto_lugar_label");

  const loader = document.getElementById("loading");

  const btn_cargar_adata = document.getElementById("btn_cargar_adata");
  const btn_send_resultado_admin = document.getElementById(
    "btn_send_resultado_admin",
  );
  const btn_actualizar_admin = document.getElementById("btn_actualizar_admin");

  const encabezados = [
    "Predi_lugar_uno",
    "Predi_lugar_dos",
    "Predi_lugar_tres",
    "Predi_lugar_cuarto",
  ];

  btn_send_resultado_admin.addEventListener("click", () => {
    handleResultAdmin();
  });

  function handleResultAdmin() {
    if (
      !primer_lugar.value ||
      !segundo_lugar.value ||
      !tercer_lugar.value ||
      !cuarto_lugar.value
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos en Blanco",
      });
      return;
    }

    let data = {
      tipo: "predi_final",
      Predi_lugar_uno: primer_lugar.value,
      Predi_lugar_dos: segundo_lugar.value,
      Predi_lugar_tres: tercer_lugar.value,
      Predi_lugar_cuarto: cuarto_lugar.value,
    };

    loader.style.display = "flex";

    fetch(userLog.Asset, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(data),
    })
      .then((res) => res.text())
      .then(() => {
        loader.style.display = "none";
        primer_lugar.value = "";
        segundo_lugar.value = "";
        tercer_lugar.value = "";
        cuarto_lugar.value = "";
        Swal.fire({
          icon: "success",
          title: "Envió Exitoso",
        });
      })
      .catch((error) => {
        loader.style.display = "none";
        Swal.fire({
          icon: "error",
          title: "Error en el envió",
          html: `${error}`,
        });
      });
  }

  validateLastResult();

  function validateLastResult() {
    primer_lugar_label.textContent = "Cargando...";
    segundo_lugar_label.textContent = "Cargando...";
    tercer_lugar_label.textContent = "Cargando...";
    cuarto_lugar_label.textContent = "Cargando...";

    fetch(
      `${userLog.Asset}?hoja=predi_final&numero=824524554&token=${userLog.Token}`,
    )
      .then((res) => res.json())
      .then((data) => {
        primer_lugar_label.textContent = data[0].Predi_lugar_uno || "Sin Datos";
        segundo_lugar_label.textContent = data[0].Predi_lugar_dos || "Sin Datos";
        tercer_lugar_label.textContent = data[0].Predi_lugar_tres || "Sin Datos";
        cuarto_lugar_label.textContent = data[0].Predi_lugar_cuarto || "Sin Datos";
      });
  }

  btn_cargar_adata.addEventListener("click", () => {
    handleCargaData();
  });

  async function handleCargaData() {
    loader.style.display = "flex";

    try {
      const [res1, res2] = await Promise.all([
        fetch(`${userLog.Asset}?hoja=event&token=${userLog.Token}`),
        fetch(`${userLog.Asset}?hoja=predi_final&token=${userLog.Token}`),
      ]);

      const data_resultado_cli = await res1.json();
      const data_fase_grupo = await res2.json();

      const usuario = data_resultado_cli[0];
      const resultados = data_fase_grupo[0];

      console.log(usuario);
      console.log(resultados);

      const resultadoFinal = compararResultados(
        usuario,
        resultados,
        encabezados,
      );
      console.log(resultadoFinal);

      const ranking = data_resultado_cli.map((usuario) => {
        const res = compararResultados(usuario, resultados, encabezados);

        return {
          nombre: usuario.Nombre,
          numero: usuario.Numero,
          factura: usuario.Factura,
          ...res,
        };
      });

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

      for (const user of ranking) {
        console.log(user);
      }

      // console.log(usuario);
      return;
    } catch (error) {
      console.error("Error en las peticiones", error);
    }
  }

  function compararResultados(usuario, resultados, encabezados) {
    let _acerto_ = "";
    encabezados.forEach((key) => {
      const valorUsuario = usuario[key];
      const valorReal = resultados[key];

      if (valorUsuario === undefined) return;
      if (valorReal === undefined) return;

      if (valorUsuario === valorReal) {
        _acerto_ = "Acerto";
      } else {
        _acerto_ = "No acerto";
      }
    });

    return { _acerto_ };
  }
})();
