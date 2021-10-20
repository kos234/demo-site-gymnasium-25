<?php

$error = "";
try {
    if (isset($_COOKIE["auth"])) {
        if ($_COOKIE["auth"] != "" && $_COOKIE["auth"] != " ") {
            try {
                include "connectToMysql.php";
                $res = $mysqli->query("SELECT * FROM `sessions` WHERE `cookie` = '" . $_COOKIE["auth"] . "'");
                if ($res) {
                    $res = $res->fetch_assoc();
                    header('Location: '. ((!empty($_SERVER['HTTPS'])) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'] .'sections');
                }
            } catch (Exception $e) {
            }
        }
    }
}catch (Exception $exception){

}

    if(isset($_POST["login"]) || isset($_POST["password"])){

        if(!isset($_POST["login"])) {
            $error = "Вы не указали логин!";
        }else if($_POST["login"] == "" || $_POST["login"] == " ") {
            $error = "Вы не указали логин!";
        }else if(!isset($_POST["password"])) {
            $error = "Вы не указали пароль!";
        }else if($_POST["password"] == "" || $_POST["password"] == " ") {
            $error = "Вы не указали пароль!";
        }
        if(!$error)
        try {
            include "connectToMysql.php";
            $res = $mysqli->query("SELECT `password` FROM `users` WHERE `login` = '" . $_POST["login"] . "'");
            if($res){
                $res = $res->fetch_assoc();
                if(password_verify($_POST["password"], $res["password"])){
                    $cookie = bin2hex(random_bytes(6));
                    setcookie("auth", $cookie, time() + 5 * 356 * 24 * 60 * 60, "/panel/", null, false, true);
                    $mysqli->query("INSERT INTO `sessions` (`login`, `cookie`,`time`) VALUES ( '". $_POST["login"] ."', '" . $cookie. "', " . time() . ") ON DUPLICATE KEY UPDATE `cookie` = '" . $cookie. "', `time` = " . time());
                    echo "<meta http-equiv=\"refresh\" content=\"0; url=". ((!empty($_SERVER['HTTPS'])) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'] ."sections\">";
                }else{
                    $error = "Неверный логин или пароль!";
                }
            }else{
                $error = "Неверный логин или пароль!";
            }
        } catch (Exception $e) {
            var_dump($e);
        }
    }

?>

<!DOCTYPE HTML>
<html lang="ru">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Панель создания</title>
    <link rel="stylesheet" type="text/css" href="style.css"/>
    <script src="main.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="stylesheet" type="text/css" href="../styleAll.css"/>
</head>

<body>

<div class="custom_scroll">
    <div class="scroll_block"></div>
</div>

<main id="content">
    <div id="swup" class="transition-fade">
        <div class="wrapper_auth">
            <div class="wrapper_fields">
                <div class="auth">

                    <?php
                    if($error != ""){
                        echo "<div class=\"error\">". $error ."</div>";
                    }
                    ?>

                    <form action="" name="auth" method="post">
                        <label class="authText">Логин</label>
                        <?php
                        if(isset($_POST["login"])) {
                            if ($_POST["login"] != "" && $_POST["login"] != " ")
                                echo "<input id=\"login\" class=\"inputForm\" type=\"text\" name=\"login\" value=\"" . $_POST["login"] . "\">";
                            else
                                echo "<input id=\"login\" class=\"inputForm\" type=\"text\" name=\"login\">";
                        }else
                            echo "<input id=\"login\" class=\"inputForm\" type=\"text\" name=\"login\">";
                        ?>
                        <label class="authText">Пароль</label>
                        <div class="wrapper_password">
                            <?php
                            if(isset($_POST["password"])) {
                                if ($_POST["password"] != "" && $_POST["password"] != " ")
                                    echo "<input id=\"password\" class=\"inputForm\" type=\"password\" name=\"password\" value=\"" . $_POST["password"] . "\">";
                                else
                                    echo "<input id=\"password\" class=\"inputForm\" type=\"password\" name=\"password\">";
                            }else
                            echo "<input id=\"password\" class=\"inputForm\" type=\"password\" name=\"password\">"
                            ?>
                            <img id="vis" onclick="clickVis()" class="visibility_off" src="images/visibility_off.svg" alt="Показать пароль" title="Показать пароль">
                        </div>
                        <input class="inputDone" type="submit" name="done" value="Авторизация">
                    </form>
                </div>
            </div>
        </div>
    </div>
</main>

<script> function clickVis() {
    let e = document.getElementById("vis");
    if(e.className === "visibility_off"){
        e.setAttribute("src", "images/visibility.svg");
        e.setAttribute("class", "visibility");
        document.getElementById("password").setAttribute("type", "text");
    }else{
        e.setAttribute("src", "images/visibility_off.svg");
        e.setAttribute("class", "visibility_off");
        document.getElementById("password").setAttribute("type", "password");
    }
}
</script>
</body>
</html>