<?php
$mysqli = new mysqli("127.0.0.1", "mysql", "mysql", "gymn"); //Подключаемся
if ($mysqli->connect_error) //проверка подключились ли мы
    throw new Exception("Ошибка подключения (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
    $mysqli->query("SET NAMES 'utf8'");