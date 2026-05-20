(() => {
  const btn_consulta_factura = document.getElementById("btn_consulta_factura");
  const factura_id = document.getElementById("factura_id");
  const loader = document.getElementById("loading");
  const _nombre_result_ = document.getElementById("_nombre_result_");
  const _cedula_result_ = document.getElementById("_cedula_result_");
  const _compra_result_ = document.getElementById("_compra_result_");
  const _factura_result_ = document.getElementById("_factura_result_");
  const primer_lugar = document.getElementById("primer_lugar");
  const segundo_lugar = document.getElementById("segundo_lugar");
  const tercer_lugar = document.getElementById("tercer_lugar");
  const cuarto_lugar = document.getElementById("cuarto_lugar");
  const _placa_result_ = document.getElementById("_placa_result_");
  const fecha_consulta = document.getElementById("fecha_consulta");
  const title_prediccion = document.getElementById("title_prediccion");
  const estacion_id = document.getElementById("estacion_id");
  const _content_result_factura_ = document.getElementById(
    "_content_result_factura_",
  );
  const _content_seccion_prediccion_ = document.getElementById(
    "_content_seccion_prediccion_",
  );
  const _content_seccion_consulta_ = document.getElementById(
    "_content_seccion_consulta_",
  );
  const btn_submit_predi_trans = document.getElementById(
    "btn_submit_predi_trans",
  );
  const btn_consul_trans = document.getElementById("btn_consul_trans");
  const _seccion_prediccion_ = document.getElementById("_seccion_prediccion_");
  const btn_cambiar_trans = document.getElementById("btn_cambiar_trans");
  const btn_update_pre = document.getElementById("btn_update_pre");
  const prediccionAnteriorLocalStorage = "prediCargada";
  const _content_result_original_ = document.getElementById(
    "_content_result_original_",
  );

  let _Fecha_fac_;

  const encabezados = [
    "Predi_lugar_uno",
    "Predi_lugar_dos",
    "Predi_lugar_tres",
    "Predi_lugar_cuarto",
  ];

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

  btn_consulta_factura.addEventListener("click", () => {
    if (!factura_id.value || !fecha_consulta.value) {
      Swal.fire({
        icon: "warning",
        title: "Campos en Blanco",
      });
      return;
    }
    ConsultaFactura(factura_id.value, fecha_consulta.value);
  });

  const formatoPesos_monto_efectivo = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });
  const URL_APPS_SCRIPT = userLog.Asset;
  async function ConsultaFactura(numeroDe6Digitos, fechaConsul) {
    loader.style.display = "flex";
    existBill(factura_id.value);
    try {
      const response = await fetch(URL_APPS_SCRIPT, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          tipo: "validar_referencia_factura",
          numero_factura: numeroDe6Digitos,
          fecha_con_ini: fechaConsul + " " + "00:00:00",
          fecha_con_end: fechaConsul + " " + "23:59:59",
          branch: estacion_id.value,
        }),
      });

      const res = await response.json();

      if (res.status === "ok") {
        loader.style.display = "none";
        let AllInfoBill = res.datos;
        console.log("AllInfoBill",AllInfoBill);
        _nombre_result_.textContent =
          AllInfoBill.datos.customer.first_name +
          " " +
          AllInfoBill.datos.customer.last_name;
        _cedula_result_.textContent = AllInfoBill.datos.customer.document;
        _factura_result_.textContent = AllInfoBill.datos.bill;
        _placa_result_.textContent = AllInfoBill.datos.sales[0].plate;
        _compra_result_.textContent = formatoPesos_monto_efectivo.format(
          AllInfoBill.datos.total,
        );
        _Fecha_fac_ = AllInfoBill.Fecha_fac;
        if (AllInfoBill.datos.customer.first_name == "CONSUMIDOR FINAL") {
          _placa_result_.textContent = "Sin Placa";
        }
        _content_result_factura_.style.display = "flex";
        _content_seccion_prediccion_.style.display = "flex";
        return AllInfoBill;
      } else {
        loader.style.display = "none";
        _content_result_factura_.style.display = "none";
        _content_seccion_prediccion_.style.display = "none";
        Swal.fire({
          icon: "warning",
          title: "Factura no encontrada",
        });
      }
    } catch (error) {
      loader.style.display = "none";
      console.error("Error en la comunicación:", error);
    }
  }

  btn_submit_predi_trans.addEventListener("click", () => {
    handleSubmitPrediccion();
  });

  function existBill(numBill) {
    localStorage.removeItem(prediccionAnteriorLocalStorage);
    let valToken = getCookie("1nf0_us3r_tr4ns");
    fetch(`${URL_APPS_SCRIPT}?hoja=event&token=${valToken}&factura=${numBill}`)
      .then((res) => res.json())
      .then((data) => {
        let rowInfo = data[0];
        primer_lugar.value = rowInfo.Predi_lugar_uno;
        segundo_lugar.value = rowInfo.Predi_lugar_dos;
        tercer_lugar.value = rowInfo.Predi_lugar_tres;
        cuarto_lugar.value = rowInfo.Predi_lugar_cuarto;
        title_prediccion.textContent = "Prediccion";
        _seccion_prediccion_.classList.add("item_disable");
        btn_submit_predi_trans.classList.add("item_disable");
        btn_update_pre.classList.add("item_disable");

        let prediExis = {
          primero: rowInfo.Predi_lugar_uno,
          segundo: rowInfo.Predi_lugar_dos,
          tercer: rowInfo.Predi_lugar_tres,
          cuarto: rowInfo.Predi_lugar_cuarto,
        };

        localStorage.setItem(
          prediccionAnteriorLocalStorage,
          JSON.stringify(prediExis),
        );
      })
      .catch((error) => {
        console.error("no lo encontro");
        emptyTablePredi();
      });
  }

  btn_cambiar_trans.addEventListener("click", () => {
    changePredi();
  });

  function changePredi() {
    _seccion_prediccion_.classList.remove("item_disable");
    btn_cambiar_trans.classList.add("item_disable");
    btn_consul_trans.classList.remove("item_disable");
    btn_update_pre.classList.remove("item_disable");
  }

  function handleSubmitPrediccion() {
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
    if (
      !primer_lugar.value ||
      !segundo_lugar.value ||
      !tercer_lugar.value ||
      !cuarto_lugar.value
    ) {
      Swal.fire({
        icon: "warning",
        title: "Digitá una Predicción",
      });
      return;
    }

    let data = {
      tipo: "event",
      Hora: hora,
      Fecha: fecha,
      Fecha_fac: _Fecha_fac_,
      Nombre: _nombre_result_.textContent,
      Numero: userLog.Numero,
      Factura: _factura_result_.textContent,
      Placa: _placa_result_.textContent,
      Compra: _compra_result_.textContent,
      Predi_lugar_uno: primer_lugar.value,
      Predi_lugar_dos: segundo_lugar.value,
      Predi_lugar_tres: tercer_lugar.value,
      Predi_lugar_cuarto: cuarto_lugar.value,
      Tipo_vehi: ""
    };

    loader.style.display = "flex";
    fetch(URL_APPS_SCRIPT, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(data),
    })
      .then((res) => res.text())
      .then(() => {
        // primer_lugar.value = "";
        // segundo_lugar.value = "";
        // tercer_lugar.value = "";
        // cuarto_lugar.value = "";
        loader.style.display = "none";
        _seccion_prediccion_.classList.add("item_disable");
        btn_submit_predi_trans.classList.add("item_disable");
        btn_update_pre.classList.add("item_disable");
        btn_cambiar_trans.classList.remove("item_disable");
        Swal.fire({
          icon: "success",
          title: "Envió Exitoso",
        });
      })
      .catch((err) => {
        loader.style.display = "none";
        Swal.fire({
          icon: "error",
          title: "Error en el Envió",
        });
      });
  }

  btn_update_pre.addEventListener("click", () => {
    let mainPredi = localStorage.getItem(prediccionAnteriorLocalStorage);
    let prediLocal = JSON.parse(mainPredi);

    if (
      prediLocal.primero == primer_lugar.value ||
      prediLocal.segundo == segundo_lugar.value ||
      prediLocal.tercer == tercer_lugar.value ||
      prediLocal.cuarto == cuarto_lugar.value
    ) {
      Swal.fire({
        icon: "warning",
        title: "Predicción repetida",
        html: "Algunas predicción son iguales a la anterior, ¿seguro de enviar?",
        allowOutsideClick: false,
      }).then((res) => {
        if (res.isConfirmed) {
          handleUpdatePre();
        }
      });
    } else {
      handleUpdatePre();
    }
  });

  function handleUpdatePre() {
    Swal.fire({
      title: "Seguro de Actualizar?",
      text: "Se modificará la predicción actual.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si Quiero!",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        loader.style.display = "flex";

        let data = {
          tipo: "update_predi",
          sheetName: "event",
          match: {
            Factura: _factura_result_.textContent,
          },
          updates: {
            Predi_lugar_uno: primer_lugar.value,
            Predi_lugar_dos: segundo_lugar.value,
            Predi_lugar_tres: tercer_lugar.value,
            Predi_lugar_cuarto: cuarto_lugar.value,
          },
        };

        fetch(URL_APPS_SCRIPT, {
          method: "POST",
          mode: "no-cors",
          body: JSON.stringify(data),
        })
          .then((res) => res.text())
          .then((otro) => {
            loader.style.display = "none";
            _seccion_prediccion_.classList.add("item_disable");
            btn_update_pre.classList.add("item_disable");
            Swal.fire({
              icon: "success",
              title: "Predicción Actualizada",
            });
          })
          .catch((error) => {
            loader.style.display = "none";
            console.error(error);
            Swal.fire({
              icon: "error",
              title: "Error en el Envió",
            });
          });
      }
    });
  }

  btn_consul_trans.addEventListener("click", () => {
    getDataPredi();
    getDataOriResult();
  });

  function getDataPredi() {
    const container = document.getElementById("_seccion_consulta_");
    loader.style.display = "flex";
    let token = getCookie("1nf0_us3r_tr4ns");
    fetch(
      `${URL_APPS_SCRIPT}?hoja=event&numero=${userLog.Numero}&token=${token}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) {
          container.innerHTML = "No tiene predicciones disponibles.";
          loader.style.display = "none";
          return;
        }
        loader.style.display = "none";
        _content_seccion_consulta_.style.display = "flex";

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

        container.innerHTML = `
                                <div class="table-result">
                                  <table class="styled-table">
                                    <thead>
                                      <tr>
                                        <th># Registro</th>
                                        <th>Nombre</th>
                                        <th>Fecha</th>
                                        <th>Fec. Fac</th>
                                        <th>Número</th>
                                        <th>Factura</th>
                                        <th>Compra</th>
                                        <th>Camp.</th>
                                        <th>SubCamp.</th>
                                        <th>M. Tercero</th>
                                        <th>Cuarto</th>
                                        <th>Resultado</th>
                                      </tr>
                                    </thead>

                                    <tbody>
                                      ${[...data]
                                        .reverse()
                                        .map(
                                          (registro, i) => `
                                            <tr>
                                              <td>${i + 1}</td>
                                              <td>${registro.Nombre}</td>
                                              <td>${
                                                new Date(
                                                  registro.Fecha,
                                                ).toLocaleString("es-CO", {
                                                  timeZone: "America/Bogota",
                                                  year: "numeric",
                                                  month: "2-digit",
                                                  day: "2-digit",
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                                }) || ""
                                              }</td>
                                              <td>${registro.Fecha_fac || ""}</td>
                                              <td>${registro.Numero || ""}</td>
                                              <td>${registro.Factura || ""}</td>
                                              <td>${registro.Compra || ""}</td>
                                              <td>${registro.Predi_lugar_uno || ""}</td>
                                              <td>${registro.Predi_lugar_dos || ""}</td>
                                              <td>${registro.Predi_lugar_tres || ""}</td>
                                              <td>${registro.Predi_lugar_cuarto || ""}</td>

                                              <td>
                                                ${
                                                  fecha > "19/07/2026"
                                                    ? registro.Result_final ==
                                                      ""
                                                      ? `
                                                      <button id="btn_validar_result"
                                                        data-info='${JSON.stringify(registro)}'
                                                        class="btn btn-primary btn_fila_predi"
                                                      >
                                                        Validar
                                                      </button>
                                                    `
                                                      : registro.Result_final ==
                                                          "Acerto"
                                                        ? `<p class="_acerto_">${registro.Result_final}</p>`
                                                        : `<p class="_no_acerto_">${registro.Result_final}</p>`
                                                    : `<p class="_pendiente_">Pendiente</p>`
                                                }
                                              </td>
                                            </tr>
                                          `,
                                        )
                                        .join("")}
                                    </tbody>
                                  </table>
                                </div>
                              `;

        const inputBuscar = document.getElementById("inputBuscador");

        inputBuscar.addEventListener("keyup", () => {
          const texto = inputBuscar.value.toLowerCase().trim();
          // container donde se esta dibujando la tabla
          const filas = container.querySelectorAll("tbody tr");

          const columnas = [6];

          filas.forEach((fila) => {
            const textoFila = columnas
              .map(
                (i) =>
                  fila.querySelector(`td:nth-child(${i})`)?.textContent || "",
              )
              .join(" ")
              .toLowerCase();

            fila.style.display = textoFila.includes(texto) ? "" : "none";
          });
        });

        const btn_fila_predi = document.querySelectorAll(".btn_fila_predi");
        btn_fila_predi.forEach((btn) => {
          btn.addEventListener("click", (e) => {
            if (hora >= "14:00:00") {
              const registro = JSON.parse(btn.dataset.info);
              const tr = btn.closest("tr");
              handleCargaData(registro, tr);
            } else {
              Swal.fire({
                icon: "warning",
                title: "La Final no se ha jugado",
                html: "Se jugará a las 2 p.m",
              });
            }
          });
        });
      });
  }

  async function handleCargaData(usuario_predi, tr) {
    loader.style.display = "flex";

    try {
      const [res2] = await Promise.all([
        fetch(`${userLog.Asset}?hoja=predi_final&token=${userLog.Token}`),
      ]);

      const data_resultado_cli = usuario_predi;
      const data_fase_grupo = await res2.json();

      const usuario = data_resultado_cli;
      const resultados = data_fase_grupo[0];

      const resultadoFinal = compararResultados(
        usuario,
        resultados,
        encabezados,
      );

      let data = {
        tipo: "update_predi",
        sheetName: "event",
        match: {
          Factura: data_resultado_cli.Factura,
        },
        updates: {
          Result_final: String(resultadoFinal._acerto_),
        },
      };

      fetch(userLog.Asset, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(data),
      })
        .then((res) => res.text())
        .then(() => {
          loader.style.display = "none";

          if (tr) {
            const tdOpc = tr.querySelector("td:nth-child(12)");
            if (tdOpc) tdOpc.innerHTML = String(resultadoFinal._acerto_);
          }
          Swal.fire({
            icon: "success",
            title: "Prediccion validada",
          });
        })
        .catch((error) => {
          loader.style.display = "none";
          Swal.fire({
            icon: "error",
            title: "Error en el Envió",
          });
        });
    } catch (error) {}
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

  function emptyTablePredi() {
    primer_lugar.value = "";
    primer_lugar.classList.remove("item_disable");

    segundo_lugar.value = "";
    segundo_lugar.classList.remove("item_disable");

    tercer_lugar.value = "";
    tercer_lugar.classList.remove("item_disable");

    cuarto_lugar.value = "";
    cuarto_lugar.classList.remove("item_disable");

    _seccion_prediccion_.classList.remove("item_disable");

    btn_submit_predi_trans.classList.remove("item_disable");

    btn_cambiar_trans.classList.add("item_disable");

    _content_seccion_consulta_.style.display = "none";
  }

  function getDataOriResult() {
    const primer_lugar_ori = document.getElementById("primer_lugar_ori");
    const segundo_lugar_ori = document.getElementById("segundo_lugar_ori");
    const tercer_lugar_ori = document.getElementById("tercer_lugar_ori");
    const cuarto_lugar_ori = document.getElementById("cuarto_lugar_ori");

    fetch(
      `${userLog.Asset}?hoja=predi_final&numero=824524554&token=${userLog.Token}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data[0].Predi_lugar_uno == "") {
          _content_result_original_.style.display = "none";
          return;
        } else {
          _content_result_original_.style.display = "flex";
        }
        primer_lugar_ori.textContent = "1°: " + data[0].Predi_lugar_uno;
        segundo_lugar_ori.textContent = "2°: " + data[0].Predi_lugar_dos;
        tercer_lugar_ori.textContent = "3°: " + data[0].Predi_lugar_tres;
        cuarto_lugar_ori.textContent = "4°: " + data[0].Predi_lugar_cuarto;
      });
  }
})();
