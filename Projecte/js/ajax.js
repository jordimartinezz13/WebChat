//const { EFAULT } = require("node:constants");
//const { writeFile } = require("node:fs");

var nomsExis, nicknames, dnis, listaProvincias, listaMunicipios, map;
var butSubOpti = 0;

window.onload = function () {
    document.getElementById("botonEnviaMensaje").onclick = enviaMensaje;


    listaProvincias = document.getElementById("provincia");
    listaMunicipios = document.getElementById("municipio");
    peticionAjax("./php/cargaProvinciasJSON.php", "GET", estados);
    document.getElementById("provincia").onchange = municipios;

    nomsExis = document.getElementById('nomsExistents');
    dnis = document.getElementById('dni');
    nicknames = document.getElementById('nickname');

    nicknames.addEventListener('keyup', nickname);
    //dnis.addEventListener('change', dni);
    dnis.addEventListener('change', dni1);

    //MAPA
    //Carga la latitud y longitud del mapa
    map = L.map('map').
        //setView([41.5164900, 2.2046200],//La llagosta
        //setView([41.8003900, 1.9546700],//Artés
        setView([41.60075775, 2.283195],//Granollers
            15);
    //Carga la imagen del mapa
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
        maxZoom: 18
    }).addTo(map);
    //Añadir controles de escala (no obligatorio)
    L.control.scale().addTo(map);
    //Añadir un marcador
    L.marker([41.60075775, 2.283195], { draggable: true }).bindPopup("<b>Carles Vallbona</b><br><a href='#'>Solicita más información</a>").addTo(map);
    //FIN MAPA
}

function nickname() {
    var nickname = document.getElementById('nickname').value;
    //console.log(nickname);
    peticionAjax('./php/llistaNicknames.php?nickname=' + nickname, "POST", nicknameCompro);
}
function dni() {
    var dni = document.getElementById('dni').value;
    //console.log(nickname);
    peticionAjax('.php/dni.php?dni=' + dni, "POST", compDni);
}
function dni1() {
    gifCargaMos();
    var dni = document.getElementById('dni').value;
    $.ajax({

        url: './php/dni.php?dni=' + dni,
        success: function (respuesta) {
            document.getElementById('dnisExistents').innerHTML = respuesta;
        },
        error: function (error) {
            document.getElementById('mensajeError').innerHTML = "Error '" + $("#dnis").text() + "' " +
                error.status + ": " + error.statusText;
        }, complete: function (xhr, status) {
            //alert(contador);
            gifCargaOcul();
        }
    });
}
function procesaJSON(json) {
    resultado = "";
    json = JSON.parse(json);
    for (var valor in json) {
        resultado += "<option value='" + valor + "'>" + json[valor] + "</option>"
    }
    return resultado;
}


//================================================================

function peticionAjax(url, metodo, funcion, param) {
    var peticion_http = null;
    if (window.XMLHttpRequest) {
        peticion_http = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        peticion_http = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (peticion_http) {
        peticion_http.onreadystatechange = funcion;
        peticion_http.open(metodo, url, true);
        peticion_http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        peticion_http.send((param) ? param : null);
    }
}

function nicknameCompro() {
    gifCargaMos();
    if (this.readyState == 4) {
        if (this.status == 200) {
            gifCargaOcul();
            //alert(nomsExis.innerHTML.length);
            //alert(this.responseText);
            //if (nomsExis.innerHTML.length == 0 || nomsExis.innerHTML.length == null)
            //    nomsExis.innerHTML+="Nicks : ";
            if (this.responseText == 1) {
                butSubOpti--;
                nomsExis.innerHTML = "Ya existe el usuario : " + nicknames.value;
            }
            else if (this.responseText == 2) {
                nomsExis.innerHTML = "El nombre de usuario " + nicknames.value + " está libre";
                butSubOpti++;
            }
            else {
                nomsExis.innerHTML = "Nicks no disponibles : " + this.responseText;
                butSubOpti++;
            }
        } else {
            gifCargaOcul();
            //console.log(this)
            document.getElementById('mensajeError').innerHTML = "Error '" + $("#nickname1").text() + "' " + this.status + ": " + this.statusText;
        }
    }
}

function compDni() {
    gifCargaMos();
    if (this.readyState == 4) {
        if (this.status == 200) {
            document.getElementById('dnisExistents').innerHTML = this.responseText;
            if (this.responseText == "DNI invàlid.") {
                butSubOpti--;
            } else {
                butSubOpti++;
            }
            gifCargaOcul();
        } else {
            gifCargaOcul();
            document.getElementById('mensajeError').innerHTML = "Error '" + $("#dnis").text() + "' " + this.status + ": " + this.statusText;
        }
    }
}

function estados() {
    gifCargaMos();
    if (this.readyState == 4) {
        gifCargaOcul();
        if (this.status == 200) {
            //listaProvincias.innerHTML = "<option selected>-- Selecciona provincia --</option>";
            listaProvincias.innerHTML += procesaJSON(this.responseText);//Respuesta php del fichero provincias
        } else {
            document.getElementById('mensajeError').innerHTML = "Error '" + $("#provincias").text() + "' " + this.status + ": " + this.statusText;
        }

    }
}
function procesaJSON(json) {
    resultado = "";
    json = JSON.parse(json);
    for (var valor in json) {
        resultado += "<option value='" + valor + "'>" + json[valor] + "</option>"
    }
    return resultado;
}

function municipios() {
    //var e = document.getElementById("ddlViewBy");
    //var strUser = e.options[e.selectedIndex].value;
    var ProvSelec = listaProvincias.options[listaProvincias.selectedIndex].value;
    //alert(listaProvincias.selectedIndex);
    if (listaProvincias.selectedIndex != 0) {
        peticionAjax("./php/cargaMunicipisJSON.php", "POST", estadoMuni, "provincia=" + ProvSelec);
    } else {
        alert("Selecciona una provincia");
    }
}

function estadoMuni() {
    gifCargaMos();
    if (this.readyState == 4) {
        gifCargaOcul();
        if (this.status == 200) {
            //console.log(this.responseText);
            listaMunicipios.innerHTML = procesaJSON(this.responseText);
        } else {
            document.getElementById('mensajeError').innerHTML = "Error '" + $("#municipios").text() + "' " + this.status + ": " + this.statusText;
        }
    }
}


//=====================================================================

var direBus;
function buscarDire() {
    //$.get(location.protocol + '//nominatim.openstreetmap.org/search?format=json&q='+"Carles vallbona", function(data){
    //   console.log(data);
    //});
    var provinciaBuscar = document.getElementById('provincia');
    var municipioBuscar = document.getElementById('municipio');
    var direccionBuscar = document.getElementById('domicilio');
    var resultadosSelect = document.getElementById('resultadosSelect');
    var divBuscarResultado = document.getElementById('resultadosDiv');
    //alert(direccionBuscar.value);
    if (direccionBuscar.value != "") {
        if (provinciaBuscar.selectedIndex != 0) {
            //if(direccionBuscar.value.lenght < 1){
            //alert("Escriu la direccio");
            var strUser = provinciaBuscar.options[provinciaBuscar.selectedIndex].text;
            var strUser1 = municipioBuscar.options[municipioBuscar.selectedIndex].text;
            //console.log(direccionBuscar.value + "," + strUser1 + "," + strUser);
            direBus = direccionBuscar.value + "," + strUser1 + "," + strUser;

            //BUSCAR DIRECCION
            gifCargaMos();
            $.get(location.protocol + '//nominatim.openstreetmap.org/search?format=json&q=' + direBus, function (data) {
                console.log(data);
                resultado = '';
                //<option selected>-- Selecciona resultados --</option>
                if (data.length != 0) {
                    for (var valor in data) {
                        resultado += "<option value=" + data[valor]['lat'] + "=" + data[valor]['lon'] + ">" + data[valor]['display_name'] + "</option>";
                    }
                    divBuscarResultado.style.display = "block";
                    resultadosSelect.innerHTML = resultado;
                } else {
                    divBuscarResultado.style.display = "none";
                    alert("No encontrada dirección : " + direBus + "\nPor favor revise la dirección, municipio o provincia");
                }
            }).always(function () {
                //alert( "finished" );
                gifCargaOcul();
            });

            //}
        } else {
            alert("ERROR: Selecciona la provincia");
        }
    } else {
        alert("ERROR: Escribe el domicilio");
    }
}
var miCadena = null;
function marcarDireccion() {

    var resultadosSelect = document.getElementById('resultadosSelect');
    var nickname = document.getElementById('nickname').value;
    var nom = document.getElementById('nom').value;

    miCadena = resultadosSelect.value;
    //alert(miCadena);
    latYlon = miCadena.split("=");
    L.marker(latYlon, { draggable: true }).bindPopup("<b>Usuari: " + nom + "</b><br><a href='#'>Contactar amb " + nickname + "</a>").addTo(map);
    butSubOpti++;
}

//======================================================================
//======================== SERVIDOR CONECTAR ===========================
//======================================================================

let host = "localhost";
let url = `ws://${host}:8080/ws`;
let api = `http://${host}:8080/api`;
let socket = new WebSocket(url);
let outgoingMessage;

//======================================================================
//=========================== PUENTE CREADO ============================
//======================================================================

function enviar() {

    gifCargaMos();

    var nickname = document.getElementById('nickname').value;
    var nom = document.getElementById('nom').value;
    var dni = document.getElementById('dni').value;

    if (nickname == "" || nom == "" || dni == "" || miCadena == null) {
        if (nickname == "") {
            alert("Error nickname");
        } else if (nom == "") {
            alert("Error nombre");
        } else if (dni == "") {
            alert("Error dni");
        } else if (miCadena == null) {
            alert("Error ubicación no marcada");
        }
    } else {
        var contador = 0;
        $.ajax({
            url: './php/dni.php?dni=' + dni,
            success: function (respuesta) {
                if (respuesta == "") contador++;
                else alert("DNI ERROR");
            },
            error: function (error) {
                document.getElementById('mensajeError').innerHTML = "Error '" + $("#dnis").text() + "' " +
                    error.status + ": " + error.statusText;
            }, complete: function (xhr, status) {
                $.ajax({
                    url: './php/llistaNicknames.php?nickname=' + nickname,
                    success: function (respuesta) {
                        if (respuesta != 1) contador++;
                        else alert("Nickname ocupado");
                    },
                    error: function (error) {
                        document.getElementById('mensajeError').innerHTML = "Error '" + $("#nickname1").text() + "' " +
                            error.status + ": " + error.statusText;
                    }, complete: function (xhr, status) {
                        //alert(contador);
                        //webSocket1(contador);
                        gifCargaOcul();
                        enviarDatosPhp();
                        webSocket1(contador);
                    }
                });
            }
        });
    }
}

function enviarDatosPhp() {

    var lang = $("#lang").val();
    var nickname = $("#nickname").val();
    var nom = $("#nom").val();
    var dni = $("#dni").val();
    var provinciaBuscar = document.getElementById('provincia');
    var municipioBuscar = document.getElementById('municipio');
    var provincia = provinciaBuscar.options[provinciaBuscar.selectedIndex].text;
    var municipi = municipioBuscar.options[municipioBuscar.selectedIndex].text;
    var domicili = $("#domicilio").val();
    destinoVar = "?idioma=" + lang + "&nickname=" + nickname + "&nom=" + nom
        + "&dni=" + dni + "&provincia=" + provincia + "&municipi=" + municipi
        + "&domicili=" + domicili;

    peticionAjax('./php/mostrarInformacio.php' + destinoVar, "POST", datosUsuario);
}

function datosUsuario() {
    gifCargaMos();
    if (this.readyState == 4) {
        if (this.status == 200) {
            gifCargaOcul();
            //console.log(this.responseText);
            abrirChat(this.responseText);
        } else {
            gifCargaOcul();
            //console.log(this)
            document.getElementById('mensajeError').innerHTML = "Error 'mostrarInformacion.php' " + this.status + ": " + this.statusText;
        }
    }
}

function abrirChat(usuarioDatos) {
    $("#formularioCont").css('display', 'none');
    $("#formularioChat").css('display', 'block');
    usuarioDatos1 = JSON.parse(usuarioDatos)
    console.log(usuarioDatos1);
    var DatosUsr = "<center>";
    for (const key in usuarioDatos1) {
        const element = usuarioDatos1[key];
        DatosUsr += '| <b>' + key + '</b>: ' + element + ' |';
    }

    $("#userConect").html(DatosUsr + '</center>');
}

function gifCargaMos() {
    $('#carga').css("visibility", 'visible');
}
function gifCargaOcul() {
    $('#carga').css("visibility", 'hidden');
}


//======================================================================
//======================== SERVIDOR FUNCIONES ==========================
//======================================================================

function webSocket1(contador) {
    if (contador == 2) {
        var nickname = document.getElementById('nickname').value;
        var nom = document.getElementById('nom').value;
        var dni = document.getElementById('dni').value;
        latYlon = miCadena.split("=");
        var direccion = direBus;
        var longitud = latYlon[1];
        var latitud = latYlon[0];

        outgoingMessage = {
            tipus: "usuarioLogin",
            nickname: nickname,
            nom: nom,
            dni: dni,
            direccion: direccion,
            longitud: longitud,
            latitud: latitud

        };//`${document.forms.publish.user.value}` };
        console.log(outgoingMessage);
        socket.send(JSON.stringify(outgoingMessage));
    } else {
        document.getElementById('mensajeError').innerHTML = "Error al hacer la ejecución.<br>Tiempo de espera superior a lo habitual.";
    }
}

// muestra mensajes en div#VentanaChat
function mostrarMensajeChat(tipoMensaje, usuario, message) {
    let messageElem = document.createElement('div');

    if (tipoMensaje == "i") {
        actualizarPunterosMapa();
        messageElem.setAttribute("id", "mensajeI");
        messageElem.setAttribute("style", "font-weight: bold; padding:10px;");
    } else if (tipoMensaje == "m") {
        messageElem.setAttribute("id", "mensaje");

        messageElem.setAttribute("name", usuario);
        messageElem.addEventListener("click", mensajePrivado);
    } else if (tipoMensaje == "mp") {
        messageElem.setAttribute("id", "mensajePrivado");
        messageElem.setAttribute("style", "font-weight: bold;");
        messageElem.setAttribute("name", usuario);
        messageElem.addEventListener("click", mensajePrivado);
    } else {
        messageElem.setAttribute("id", "mensaje");
    }
    messageElem.textContent = message;
    //console.log(messageElem);
    document.getElementById('VentanaChat').prepend(messageElem);
}


function mensajePrivado() {
    mensaje = window.prompt("Mensaje privado para: " + this.getAttribute('name'));
    if (mensaje != null && mensaje != "") {
        let outgoingMessage = { tipus: "dataPrivado", de: $("#nickname").val(), para: this.getAttribute('name'), content: mensaje };
        socket.send(JSON.stringify(outgoingMessage));
    }
    return false;
}

function mensajePrivado1(usuario) {
    mensaje = window.prompt("Mensaje privado para: " + usuario);
    if (mensaje != null && mensaje != "") {
        let outgoingMessage = { tipus: "dataPrivado", de: $("#nickname").val(), para: usuario, content: mensaje };
        socket.send(JSON.stringify(outgoingMessage));
    }
    return false;
}

function actualizarPunterosMapa() {
    borrarMapa();//borra el mapa y su información
    regargarMapa();//recarga el mapa

    $.ajax({
        url: api + "/localizaciones",
        success: function (respuesta) {
            //[
            //{"nickname":"jorks","latitud":"40.1724695","longitud":"-6.719952"},
            //{"nickname":"luci","latitud":"40.216705","longitud":"-6.8783714"}
            //]
            //console.log(respuesta);
            for (const key in respuesta) {
                const elemento = respuesta[key];
                //console.log(elemento);
                latitud = elemento['latitud'];
                longitud = elemento['longitud'];
                nick = elemento['nickname'];
                L.marker([latitud, longitud], { draggable: true }).bindPopup("<b>Usuario: " + nick +
                    //"</b><br> <button name='"+nick+"' onclick='mensajePrivado("+{%=nick%}+")'> Mensaje privado a "+
                    "</b><br> <input type='button' onclick=mensajePrivado1('" + nick + "') value='Mensaje privado a " +
                    nick + "' /> ").addTo(map);
            }
        },
        error: function (error) {
            console.log("No se ha podido obtener la información");
            console.log(error);
        },
        complete: function (xhr, status) {
            //console.log(xhr);
            //console.log(status);
        }
    });
    //L.marker([41.60075775, 2.283195], { draggable: true }).bindPopup("<b>Carles Vallbona</b><br><a href='#'>Solicita más información</a>").addTo(map);
}

//ELIMINA EL MAPA
function borrarMapa() {
    delete map._layers; //Borra etiquetas
    map.remove(); //Elimina el mapa
}

// RECARGA EL MAPA
function regargarMapa() {
    //console.log("wwwwww");
    //delete map._layers; //Borra etiquetas
    //console.log(map._layers);
    //map.remove(); //Elimina el mapa
    map = L.map('map').
        //setView([41.5164900, 2.2046200],//La llagosta
        //setView([41.8003900, 1.9546700],//Artés
        //setView([41.60075775, 2.283195],//Granollers
        setView([40.4167, -3.70325], //Madrid
            6);
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
        maxZoom: 18
    }).addTo(map);
    //Añadir controles de escala (no obligatorio)
    L.control.scale().addTo(map);
}



// manejar mensajes entrantes
socket.onmessage = function (event) {
    //console.log(JSON.parse(event.data)["a"]);
    let tipoMensaje = JSON.parse(event.data)["tipo"];

    let usuario = "";
    if (tipoMensaje == "m") {
        usuario = JSON.parse(event.data)["nickname"];
    }

    //let incomingMessage = event.data;
    let incomingMessage = JSON.parse(event.data)["mensaje"];
    //let incomingMessage1 = event.a;
    mostrarMensajeChat(tipoMensaje, usuario, incomingMessage);
};

socket.onclose = event => console.log(`Closed ${event.code}`);

// Envía mensajes del form
function enviaMensaje() {
    var mensaje = $("#messageAEnviar").val();
    let outgoingMessage = { tipus: "data", content: mensaje };
    socket.send(JSON.stringify(outgoingMessage));
    return false;
};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[type=text]').forEach(node => node.addEventListener('keypress', e => {
        if (e.keyCode == 13) {
            //e.preventDefault();
            //alert();
            enviaMensaje();
            return false;
        }
    }))
});


/*FALLA QUE AL DAR A ENTER SALE DEL CHAT Y HAY QUE Poner
estilo si empieza por " o todos eso
también poner un try chatch para el servidor por si hay un error
de envío o algo no pete el servidor, que expulse al culpable.
*/