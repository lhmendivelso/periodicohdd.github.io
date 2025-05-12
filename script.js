const codigosPermitidos = {
    "ABC123": "Luis Mendivelso",
    "XYZ789": "Edwar Mozuca",
    "HDD2025": "Invitado"
};

let usuarioAutenticado = null;

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("form-publicar").style.display = "none";
    document.getElementById("botones-publicacion").style.display = "none";

    document.getElementById("toggleCodigo").addEventListener("click", function () {
        let inputCodigo = document.getElementById("codigo");
        inputCodigo.type = inputCodigo.type === "password" ? "text" : "password";
    });

    document.getElementById("toggleUsuario").addEventListener("click", function () {
        let inputUsuario = document.getElementById("usuario");
        inputUsuario.type = inputUsuario.type === "password" ? "text" : "password";
    });

    document.getElementById("boton-login").addEventListener("click", iniciarSesion);

    document.getElementById("form-publicar").addEventListener("submit", function (event) {
        event.preventDefault();

        if (!usuarioAutenticado) {
            alert("❌ La sesión ha finalizado. Debes iniciar sesión nuevamente.");
            return;
        }

        let botonEnviar = document.querySelector("#form-publicar button[type='submit']");
        botonEnviar.disabled = true;

        let contenido = document.getElementById("contenido").value.trim();
        let categoria = document.getElementById("categoria").value;
        let autor = document.getElementById("autor").value.trim();
        let imagenInput = document.getElementById("imagen").files[0];
        let videoUrl = document.getElementById("video").value.trim();

        if (contenido === "" || autor === "") {
            alert("Por favor, ingresa contenido y el nombre del autor antes de enviar.");
            botonEnviar.disabled = false;
            return;
        }

        const idCategoria = {
            "actualidad": "contenedor-noticias",
            "editorial": "contenedor-editorial",
            "eventos-deportivos": "contenedor-eventos",
            "eventos-academicos": "contenedor-eventos",
            "eventos-culturales": "contenedor-eventos"
        };

        const nombresCategorias = {
            "eventos-deportivos": "Eventos Deportivos",
            "eventos-academicos": "Eventos Académicos",
            "eventos-culturales": "Eventos Culturales"
        };

        let contenedorCategoria = document.getElementById(idCategoria[categoria]);

        if (!contenedorCategoria) {
            console.error("⚠️ Error: No se encontró el contenedor de la categoría seleccionada.");
            botonEnviar.disabled = false;
            return;
        }

        let nuevaPublicacion = document.createElement("article");
        nuevaPublicacion.setAttribute("data-autor", usuarioAutenticado);

        // 🟢 CORREGIDO: solo se muestra una vez el autor
        let textoAutor = categoria.includes("eventos")
            ? `<p><strong>Autor: ${autor} - ${nombresCategorias[categoria]}</strong></p>`
            : `<p><strong>Autor: ${autor}</strong></p>`;

        let contenidoHtml = textoAutor + `<p class="contenido-publicacion">${contenido}</p>`;

        if (imagenInput) {
            let imagenUrl = URL.createObjectURL(imagenInput);
            contenidoHtml += `<img src="${imagenUrl}" alt="Imagen de la publicación" style="max-width: 100%;">`;
        }

        if (videoUrl) {
            contenidoHtml += `<p><a href="${videoUrl}" target="_blank">Ver video</a></p>`;
        }

        contenidoHtml += `<button class="editar-publicacion">Editar</button>`;
        nuevaPublicacion.innerHTML = contenidoHtml;
        contenedorCategoria.insertBefore(nuevaPublicacion, contenedorCategoria.firstChild);

        nuevaPublicacion.querySelector(".editar-publicacion").addEventListener("click", function () {
            if (nuevaPublicacion.getAttribute("data-autor") === usuarioAutenticado) {
                editarPublicacion(nuevaPublicacion);
            } else {
                alert("❌ No puedes editar publicaciones de otros usuarios.");
            }
        });

        document.getElementById("botones-publicacion").style.display = "block";

        setTimeout(() => {
            botonEnviar.disabled = false;
        }, 2000);
    });

    document.getElementById("finalizar-publicacion").addEventListener("click", function () {
        cerrarSesion("✅ Publicación finalizada. Debes iniciar sesión nuevamente.");
    });

    document.getElementById("agregar-publicacion").addEventListener("click", function () {
        alert("Puedes agregar más contenido.");
    });
});

function editarPublicacion(publicacion) {
    let contenidoActual = publicacion.querySelector(".contenido-publicacion").textContent;
    document.getElementById("contenido").value = contenidoActual;
    publicacion.remove();
}

function iniciarSesion() {
    let codigoIngresado = document.getElementById("codigo").value.trim();
    let usuarioIngresado = document.getElementById("usuario").value.trim();

    if (codigosPermitidos[codigoIngresado] === usuarioIngresado) {
        usuarioAutenticado = usuarioIngresado;

        alert("✅ Acceso concedido. Ahora puedes publicar contenido.");
        document.getElementById("boton-login").style.display = "none";
        document.getElementById("form-publicar").style.display = "block";
        document.getElementById("usuario-autenticado").textContent = `Usuario autenticado: ${usuarioAutenticado}`;
        document.getElementById("botones-publicacion").style.display = "block";
    } else {
        alert("❌ Código o usuario incorrecto. No tienes permisos para publicar.");
    }
}

function cerrarSesion(mensaje) {
    alert(mensaje);
    usuarioAutenticado = null;

    const form = document.getElementById("form-publicar");
    form.style.display = "none";
    form.reset();

    document.getElementById("botones-publicacion").style.display = "none";
    document.getElementById("boton-login").style.display = "block";
    document.getElementById("codigo").value = "";
    document.getElementById("usuario").value = "";
    document.getElementById("usuario-autenticado").textContent = "";

    const botonEnviar = document.querySelector("#form-publicar button[type='submit']");
    if (botonEnviar) botonEnviar.disabled = false;
}
