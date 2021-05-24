var x;
x = $(document);
x.ready(inicializarEventos);
//var valorInicial = -1;

function inicializarEventos() {

    //$("#holaCaracola").load("http://www.google.es");//http://localhost:8080");;//.header('Access-Control-Allow-Origin: *');

$('#lang').change(function () {
    $.getJSON('./php/idiomes.php?idioma=' + $("#lang").val(), function (response) {
        //console.log(response);
        for (var valor in response) {
            resultado += "<option value='" + valor + "'>" + response[valor] + "</option>"
            switch (valor) {
                case 'idioma':
                    //alert(response[valor]);
                    $("#idioma").text(response[valor]);
                    break;
                case 'nickname':
                    //alert(response[valor]);
                    $("#nickname1").text(response[valor]);
                    break;
                case 'nom':
                    //alert(response[valor]);
                    $("#nom1").text(response[valor]);
                    break;
                case 'dni':
                    //alert(response[valor]);
                    $("#dnis").text(response[valor]);
                    break;
                case 'provincia':
                    //alert(response[valor]);
                    $("#provincias").text(response[valor]);
                    break;
                case 'municipi':
                    //alert(response[valor]);
                    $("#municipios").text(response[valor]);
                    break;
                case 'domicili':
                    //alert(response[valor]);
                    $("#domicili").text(response[valor]);
                    break;
                case 'ubicacio':
                    //alert(response[valor]);
                    $("#ubicacion").text(response[valor]);
                    break;
                case 'ruta':
                    //alert(response[valor]);
                    //$("#ubicacion").text(response[valor]);
                    break;
                default:
                    console.log('Error en' + valor + '.');
                    break;
            }
        }
    }).error(function (error){
        document.getElementById('mensajeError').innerHTML = "Error '"+ $("#idioma").text() +"' "+error.status+": " + error.statusText;
    });
});





/*
    $('#provincia').ready(function () {
        $.getJSON('./php/cargaProvinciasJSON.php', function (response) {
            resultado = "<option value='0'>-- Selecciona provincia --</option>";
            //console.log(response);
            for (var valor in response) {

                resultado += "<option value='" + valor + "'>" + response[valor] + "</option>"
            }
            //return resultado
            $('#provincia').html(resultado);
        }).done(function () {
            console.log("Cargadas Provincias");
        }).fail(function () {
            //alert("Error al cargar las provincias");
            $('#mensajeError').html($('#mensajeError').text() + '<br>Error al cargar las provincias.');
        }).always(function () {
            //alert("siempre se ejecuta");
        });
    });


    $("#provincia").change(function () {
        //$("#provincia").val(); //valor de provincia seleccionado
        //alert($("#provincia")[0].selectedIndex);
        if ($("#provincia")[0].selectedIndex != 0) {
            $.getJSON('./php/cargaMunicipisJSON.php?provincia=' + $("#provincia").val(), function (response) {
                resultado = "";
                //console.log(response);
                for (var valor in response) {
                    resultado += "<option value='" + valor + "'>" + response[valor] + "</option>"
                }
                //return resultado
                $('#municipio').html(resultado);
            }).done(function () {
                console.log("Cargados Municipios");
            }).fail(function () {
                //alert("Error al cargar los municipios");
                $('#mensajeError').html($('#mensajeError').text() + '<br>Error al cargar los municipios.');
            }).always(function () {
                //alert("siempre se ejecuta");
            });
        } else {
            alert("Selecciona una provincia");
        }
    });
    */
}