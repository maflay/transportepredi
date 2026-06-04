(() => {
    const btn_salir_home = document.getElementById("btn_salir_home");

    btn_salir_home.addEventListener("click", () => {
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
    });
})();