/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
var valor = document.getElementById('valor')
var boton = document.getElementById('boton')
var boton2 = document.getElementById('guardar')
var boton3 = document.getElementById('consultar')
var respuesta = document.getElementById('respuesta')

boton.addEventListener('click', function (evento) {
    evento.preventDefault();
    respuesta.innerHTML = ''
    respuesta.innerHTML += '<table class="table table-striped">' +
        '<thead>' +
        '<tr>'
        '<th scope="col">Nombre</th>' +
        '<th scope="col">Mejor Trabajo</th>' +
        '<th scope="col">Fecha de fallecimiento</th>' +
        '<th scope="col">Codigo de registro</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody id="contenedor" class="contenedor texto">' +
        '</tbody>' +
        '</table>'
    var contenedor = document.getElementById('contenedor')
    if (valor.value != '') {
        fetch('https://openlibrary.org/search/authors.json?q=' + valor.value)
            .then((response) => response.json())
            .then((restJson) => {
                console.log(restJson)
                restJson['docs'].forEach(element => {
                    var registro = element

                    if (registro.death_date == undefined) {
                        registro.death_date = "Sin registro"
                    }

                    contenedor.innerHTML +=
                        "<tr>" +
                        "<td>" + registro.name + "</td>" +
                        "<td>" + registro.top_work + "</td>" +
                        "<td>" + registro.death_date + "</td>" +
                        "<td><a href='https://openlibrary.org/authors/" + registro.key + "'>" + registro.key + "</a></td>" +
                        "</tr>"
                });
            });
    } else {
        alert('Ingrese el parametro para busqueda')
    }
})

boton2.addEventListener('click', function (evento) {
    evento.preventDefault();
    if (valor.value != '' && contenedor.value != '') {
        window.comunicacion.grabarConsulta([valor.value, contenedor.innerHTML])
        respuesta.innerHTML = ""
    } else {
        alert('Ingrese el parametro para busqueda y realizar primero una consulta')
    }
})

boton3.addEventListener('click', function (evento) {
    evento.preventDefault();
    window.consulta.enviar()
    window.consulta.recibir('respuesta', function (event, args) {
        var id = 0;
        respuesta.innerHTML = ''
        args.forEach(element => {
            if (element.resultado_busqueda != null) {
                respuesta.innerHTML += '<table class="table table-striped">' +
                    '<thead>' +
                    '<tr>' +
                    '<th scope="col">ID BUSQUEDA: ' + (++id) + '</th>' +
                    '<th scope="col">FECHA: ' + element.fecha_hora + '</th>' +
                    '<th scope="col">PARAMETRO: ' + element.parametro_busqueda + '</th>' +
                    '</tr>' +
                    '<tr>' +
                    '<th scope="col">Nombre</th>' +
                    '<th scope="col">Mejor Trabajo</th>' +
                    '<th scope="col">Fecha de fallecimiento</th>' +
                    '<th scope="col">Codigo de registro</th>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody id="contenedor" class="contenedor texto">' + element.resultado_busqueda +
                    '</tbody>' +
                    '</table>'
            } else {
                respuesta.innerHTML += '<table class="table table-striped">' +
                    '<thead>' +
                    '<tr>' +
                    '<th scope="col">ID BUSQUEDA: ' + (++id) + '</th>' +
                    '<th scope="col">FECHA: ' + element.fecha_hora + '</th>' +
                    '<th scope="col">PARAMETRO: ' + element.parametro_busqueda + '</th>' +
                    '</tr>' +
                    '<tr>' +
                    '<th scope="col">Nombre</th>' +
                    '<th scope="col">Mejor Trabajo</th>' +
                    '<th scope="col">Fecha de fallecimiento</th>' +
                    '<th scope="col">Codigo de registro</th>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody id="contenedor" class="contenedor texto"><tr><td>SIN RESULTADOS</td></tr>' +
                    '</tbody>' +
                    '</table>'
            }
        });
    })
})