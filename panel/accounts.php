<?php include 'checkAuth.php';?>

<!doctype html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Аккаунты</title>
    <link rel="stylesheet" type="text/css" href="../styleAll.css"/>
    <link rel="stylesheet" type="text/css" href="style.css"/>
    <script src="../main.js"></script>
    <script src="main.js"></script>
</head>
<body>
<div class="custom_scroll">
    <div class="scroll_block"></div>
</div>

<?php include $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . "panel". DIRECTORY_SEPARATOR .'header.php';?>

<div class="background">
    <div class="imgs"></div>
    <div class="fill_img_back"></div>
</div>

<main id="content">
    <div id="swup" class="transition-fade">
        <span class="styles">/panel/style.css</span>
        <span class="script">addScript("/panel/main.js"),onAccount()</span>

        <div class="title">Аккаунты:</div>

        <ul class="mainList">

            <?php
                try {
                    include "connectToMysql.php";
                    $res = $mysqli->query("SELECT `login` FROM `users`");
                    $flagCreate = false;$flagEdit = false; $flagDelete = false;
                    $flag = getAccess($access, "/panel/accounts");
                     if($flag == "all"){
                        $flagCreate = true; $flagEdit = true; $flagDelete = true;
                    }else if($flag[0]){
                        for ($i = 1; $i < count($flag); $i++){
                            switch ($flag[1][$i]){
                                case "create":
                                    $flagCreate = true;
                                    break;
                                case "edit":
                                    $flagEdit = true;
                                    break;
                                case "delete":
                                    $flagDelete = true;
                                    break;
                            }
                        }
                    }
                    if($res) {
                        while (($account = $res->fetch_assoc()) != null){
                            echo '<li><span><span class="account_name">'. $account["login"] .'</span> <span class="tools">'. ($flagEdit || $account["login"] == $login ? '<img class="edit" src="images/create.svg" alt="редактировать">' : '') . ($flagDelete ? '<img class="delete" src="images/delete.svg" alt="удалить">' : '') .'</span></span></li>';
                        }
                    }
                    echo "</ul>";
                    echo $flagCreate ? " <div id='createNewAccount' class=\"title\">Создать новый аккаунт</div>" : '';
                } catch (Exception $e) {
                    echo $e->getMessage();
                }
            ?>

    </div>
</main>

<?php include  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'footer.php';?>

<script src="/swup.min.js"></script>
<script> main(<?php echo "\"" . mb_substr(explode("?", $_SERVER['REQUEST_URI'])[0], 1) . "\""; ?>);</script>
</body>
</html>