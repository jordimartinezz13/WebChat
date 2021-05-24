<?php

usleep(500000);
$dni = $_REQUEST["dni"];

$letra = substr($dni, -1);
$numeros = substr($dni, 0, -1);

if (is_numeric($numeros)){
    if (substr("TRWAGMYFPDXBNJZSQVHLCKE", $numeros % 23, 1) == $letra && strlen($letra) == 1 && strlen($numeros) == 8) {
    echo '';
    } else {
        echo 'DNI invàlid.';
    }
}else{
    echo 'Format DNI no valid (12345678A)';
}

?>