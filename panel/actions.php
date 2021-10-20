<?php
    try {
        define("ErrorNotSpecifiedLogin", "{\"errorId\" : 1, \"errorMessage\" : \"Не указан логин!\"}");
        define("ErrorNotSpecifiedPassword", "{\"errorId\" : 2, \"errorMessage\" : \"Не указан пароль!\"}");
        define("ErrorNotSpecifiedAccess", "{\"errorId\" : 3, \"errorMessage\" : \"Не указаны разрешения!\"}");
        define("ErrorLoginAlreadyExists", "{\"errorId\" : 4, \"errorMessage\" : \"Такой логин уже есть!\"}");
        define("ErrorCreateNewAccount", "{\"errorId\" : 5, \"errorMessage\" : \"Ошибка создания аккаунта!\"}");
        define("ErrorAccountExist", "{\"errorId\" : 6, \"errorMessage\" : \"Такого аккаунта не существует!\"}");
        define("ErrorAccountDataUpdate", "{\"errorId\" : 7, \"errorMessage\" : \"Ошибка обновления данных аккаунта!\"}");
        define("ErrorNotSpecifiedLastLogin", "{\"errorId\" : 8, \"errorMessage\" : \"Не указан предыдущий логин!\"}");
        define("ErrorInvalidAccountPassword", "{\"errorId\" : 9, \"errorMessage\" : \"Неверный пароль от аккаунта!\"}");
        define("ErrorNotSpecifiedSourcePage", "{\"errorId\" : 10, \"errorMessage\" : \"Не указана исходная страница!\"}");
        define("ErrorBackupInitialization", "{\"errorId\" : 11, \"errorMessage\" : \"При создании архива бекапов возникла неизвестная ошибка!\"}");
        define("ErrorAccessDenied", "{\"errorId\" : 12, \"errorMessage\" : \"Отказано в доступе!\"}");
        define("ErrorWrongCookie", "{\"errorId\" : 13, \"errorMessage\" : \"Неверный куки!\"}");
        define("ErrorNotSpecifiedFile", "{\"errorId\" : 14, \"errorMessage\" : \"Не указан файл!\"}");
        define("ErrorTypeImage", "{\"errorId\" : 15, \"errorMessage\" : \"Это не картинка!\"}");
        define("ErrorUploadFileExecutable", "{\"errorId\" : 16, \"errorMessage\" : \"Вы пытаетесь загрузить исполняемый файл!\"}");
        define("ErrorNotSpecifiedType", "{\"errorId\" : 17, \"errorMessage\" : \"Не указан тип!\"}");
        define("ErrorFileWithNameAlreadyExist", "{\"errorId\" : 18, \"errorMessage\" : \"Файл с таким именем уже существует\"}");
        define("ErrorFileNotExist", "{\"errorId\" : 19, \"errorMessage\" : \"Файл \"{FILE_NAME}\" не существует!\"}");
        define("ErrorWrongType", "{\"errorId\" : 20, \"errorMessage\" : \"Неверный тип!\"}");
        define("ErrorNotSpecifiedAction", "{\"errorId\" : 21, \"errorMessage\" : \"Не указан тип!\"}");
        define("ErrorDeleteLastPage", "{\"errorId\" : 22, \"errorMessage\" : \"Не известная ошибка удаления файла. Проверьте путь к файлу\"}");

        include "connectToMysql.php";

        if(isset($_POST["type"])){
            if ($_POST["type"] != "" && $_POST["type"] != " "){
                switch ($_POST["type"]){
                    case "account":
                        if(isset($_POST["action"]) && $_POST["action"] != "" && $_POST["action"] != " "){
                            $resCookie = $mysqli->query("SELECT `access`, `login` FROM `users` WHERE `login` = (SELECT `login` FROM `sessions` WHERE `cookie` = '". $_COOKIE['auth'] ."')");
                            $resCookie = $resCookie->fetch_assoc();
                            if (isset($resCookie["access"])){
                                $isCookieVerf = preg_match("~".$_POST["action"]."~", $resCookie["access"]) == 1;
                                if($isCookieVerf || $resCookie["access"] == "all" || (($_POST["action"] == "getdata" || $_POST["action"] == "edit") && $_POST["login"] == $resCookie["login"])){
                                    switch ($_POST["action"]){
                                        case "create":
                                            if(isset($_POST["login"]) && $_POST["login"] != "" && $_POST["login"] != " "){
                                                if(isset($_POST["password"]) && $_POST["password"] != "" && $_POST["password"] != " "){
                                                    if(isset($_POST["access"]) && $_POST["access"] != "" && $_POST["access"] != " "){
                                                        $res = $mysqli->query("SELECT `login` FROM `users` WHERE `login` = '". $_POST["login"] ."'");
                                                        $res = $res->fetch_assoc();
                                                        if(!isset($res["login"])) {
                                                            $res = $mysqli->query("INSERT INTO `users` (`login`, `password`, `access`) VALUES ('" . $_POST["login"] . "', '" . password_hash($_POST["password"], PASSWORD_DEFAULT) . "', '" . $_POST["access"] . "')");
                                                            if(!$res)
                                                                echo ErrorCreateNewAccount;
                                                        }else echo ErrorLoginAlreadyExists;
                                                    }else echo ErrorNotSpecifiedAccess;
                                                }else echo ErrorNotSpecifiedPassword;
                                            }else echo ErrorNotSpecifiedLogin;
                                            break;

                                        case "getdata":
                                            if(isset($_POST["login"]) && $_POST["login"] != "" && $_POST["login"] != " "){
                                                $res = $mysqli->query("SELECT `login`, `access` FROM `users` WHERE `login` = '". $_POST["login"] ."'");
                                                $res = $res->fetch_assoc();
                                                if(isset($res["login"])){
                                                    if(!$isCookieVerf && $_POST["login"] == $resCookie["login"])
                                                        echo json_encode(["login" => $res["login"], "access" => $res["access"], "confirmation" => true]);
                                                    else
                                                        echo json_encode(["login" => $res["login"], "access" => $res["access"], "confirmation" => false]);
                                                }else echo ErrorAccountExist;
                                            }else echo ErrorNotSpecifiedLogin;
                                            break;

                                        case "edit":
                                            if(isset($_POST["loginlast"]) && $_POST["loginlast"] != "" && $_POST["loginlast"] != " ") {
                                                if (isset($_POST["login"]) && $_POST["login"] != "" && $_POST["login"] != " ") {
                                                    if (isset($_POST["password"])) {
                                                        if (isset($_POST["access"]) && $_POST["access"] != "" && $_POST["access"] != " ") {
                                                            $res = $mysqli->query("SELECT `login` FROM `users` WHERE `login` = '" . $_POST["login"] . "'");
                                                            $res = $res->fetch_assoc();
                                                            if (!isset($res["login"]) || $res["login"] != $res["loginlast"]) {

                                                                if(!$isCookieVerf && $_POST["loginlast"] == $resCookie["login"]){
                                                                    if(isset($_POST["passwordVerf"]) && $_POST["passwordVerf"] != "" && $_POST["passwordVerf"] != " "){
                                                                        $res = $mysqli->query("SELECT `password` FROM `users` WHERE `login` = '" . $_POST["loginlast"] . "'");
                                                                        $res = $res->fetch_assoc();
                                                                        if(password_verify($_POST["passwordVerf"], $res["password"])){
                                                                            if ($_POST["password"] != "" && $_POST["password"] != " ") {
                                                                                $res = $mysqli->query("UPDATE `users` SET `password` = '" . password_hash($_POST["password"], PASSWORD_DEFAULT) . "', `login` = '" . $_POST["login"] . "', `access` = '" . $_POST["access"] . "' WHERE `login` = '" . $_POST["loginlast"] . "'");
                                                                            } else {
                                                                                $res = $mysqli->query("UPDATE `users` SET `login` = '" . $_POST["login"] . "', `access` = '" . $_POST["access"] . "' WHERE `login` = '" . $_POST["loginlast"] . "'");
                                                                            }
                                                                            if (!$res)
                                                                                echo ErrorAccountDataUpdate;
                                                                        } echo ErrorInvalidAccountPassword;
                                                                    }else echo ErrorNotSpecifiedPassword;
                                                                }else {

                                                                    if ($_POST["password"] != "" && $_POST["password"] != " ") {
                                                                        $res = $mysqli->query("UPDATE `users` SET `password` = '" . password_hash($_POST["password"], PASSWORD_DEFAULT) . "', `login` = '" . $_POST["login"] . "', `access` = '" . $_POST["access"] . "' WHERE `login` = '" . $_POST["loginlast"] . "'");
                                                                    } else {
                                                                        $res = $mysqli->query("UPDATE `users` SET `login` = '" . $_POST["login"] . "', `access` = '" . $_POST["access"] . "' WHERE `login` = '" . $_POST["loginlast"] . "'");
                                                                    }
                                                                    if (!$res)
                                                                        echo ErrorAccountDataUpdate;
                                                                }
                                                            } else echo ErrorLoginAlreadyExists;
                                                        } else echo ErrorNotSpecifiedAccess;
                                                    } else echo ErrorNotSpecifiedPassword;
                                                } else echo ErrorNotSpecifiedLogin;
                                            }else echo ErrorNotSpecifiedLastLogin;
                                            break;

                                        case "delete":
                                            if(isset($_POST["login"]) && $_POST["login"] != "" && $_POST["login"] != " "){
                                                $res = $mysqli->query("DELETE FROM `users` WHERE `login` = '". $_POST["login"] ."'");
                                                if(!$res)
                                                    echo ErrorAccountExist;
                                            }else echo ErrorNotSpecifiedLogin;
                                            break;
                                    }
                                }else echo ErrorAccessDenied;
                            }else echo ErrorWrongCookie;
                        }else echo ErrorNotSpecifiedType;
                        break;

                    case "list":
                        function page_title($url){
                            $fp = file_get_contents($url);
                            if (!$fp) return null;
                            $res = preg_match("/<title>(.*)<\/title>/siU", $fp, $title_matches);
                            if (!$res) return null;
                            $title = preg_replace('/\s+/', ' ', $title_matches[1]); $title = trim($title);
                            return $title;
                        }

                        function generateJSON($sections, $dir, $array){
                            foreach ($sections as $section){
                                if(preg_match("~.php~", $section) == 1){
                                    if($section == "header.php")
                                        $array[] = ["title" => "Хеадер(шапка)", "src" => "/header", "access" => [["title" => "редактирование", "name" => "edit"]]];
                                    else if($section == "footer.php"){
                                        $array[] = ["title" => "Хеадер(шапка)", "src" => "/footer", "access" => [["title" => "редактирование", "name" => "edit"]]];
                                    }else if($section == "index.php" && $dir == "/"){
                                        $array[] = ["title" => "Главная", "src" => "/index", "access" => [["title" => "редактирование", "name" => "edit"]]];
                                    }else {
                                        $array[] = ["title" => page_title($_SERVER['DOCUMENT_ROOT'] . $dir . $section), "src" => preg_replace("~.php~", "",$dir . $section), "access" => [["title" => "редактирование", "name" => "edit"], ["title" => "удаление", "name" => "delete"]]];
                                    }

                                }else if(preg_match("~\.~", $section) == 0 && $section != "fonts" && $section != "images" && $section != "panel"){
                                    if(is_dir($_SERVER['DOCUMENT_ROOT'] . $dir . $section)){
                                        $newArray = [];
                                        $newArray = generateJSON(scandir($_SERVER['DOCUMENT_ROOT'] . "/" . $section), "/".$section."/", $newArray);
                                        $array[] = ["title" => $section."/", "items" => $newArray];
                                    }
                                }
                            }
                            return $array;
                        }

                        $json = [];
                        $json[] = ["title" => "Аккаунты", "src" => "/panel/accounts", "access" => [["title" => "создание", "name" => "create"],["title" => "редактирование", "name" => "edit"], ["title" => "удаление", "name" => "delete"]]];
                        $json[] = ["title" => "Разделы", "src" => "/panel/sections", "access" => [["title" => "создание", "name" => "create"],["title" => "редактирование", "name" => "edit"], ["title" => "удаление", "name" => "delete"]]];
                        $json = generateJSON(scandir($_SERVER['DOCUMENT_ROOT']), "/", $json);
                        echo json_encode($json);
                        break;

                    case "get_file_content":
                        if (isset($_POST["file"]) && $_POST["file"] != "" && $_POST["file"] != " ") {
                            $resCookie = $mysqli->query("SELECT `access`, `login` FROM `users` WHERE `login` = (SELECT `login` FROM `sessions` WHERE `cookie` = '" . $_COOKIE['auth'] . "')");
                            $resCookie = $resCookie->fetch_assoc();
                            if (isset($resCookie["access"])) {
                                if(file_exists($_SERVER['DOCUMENT_ROOT'] . $_POST["file"]))
                                    echo file_get_contents($_SERVER['DOCUMENT_ROOT'] . $_POST["file"]);
                                else
                                   echo preg_replace("/{FILE_NAME}/", $_SERVER['DOCUMENT_ROOT'] . $_POST["file"], ErrorFileNotExist);
                            } else echo ErrorWrongCookie;
                        }else echo ErrorNotSpecifiedFile;
                    break;

                    case "isset_image":
                        if (isset($_POST["file"]) && $_POST["file"] != "" && $_POST["file"] != " ") {
                            if(file_exists($_SERVER['DOCUMENT_ROOT'] . $_POST["file"])){
                                preg_match("/.*\.(.+)/", $_POST["file"], $exec);
                                if(preg_match("/jpg|tiff|bmp|jpeg|jp2|j2k|jpf|jpm|jpg2|j2c|jpc|jxr|hdp|wdp|gif|eps|png|pict|pdf|pcx|ico|cdr|ai|raw|svg|webp/i", $exec[1]) == 1)
                                    echo true;
                                else
                                    echo ErrorTypeImage;
                            }else
                                echo preg_replace("/{FILE_NAME}/", $_SERVER['DOCUMENT_ROOT'] . $_POST["file"], ErrorFileNotExist);
                        }else echo ErrorNotSpecifiedFile;
                        break;

                    case "get_all_img":
                        function getImgs($files, $dir, $returnString){
                            foreach ($files as $file){
                                preg_match("/.*\.(.+)/", $dir . $file, $exec);
                                if(preg_match("/jpg|tiff|bmp|jpeg|jp2|j2k|jpf|jpm|jpg2|j2c|jpc|jxr|hdp|wdp|gif|eps|png|pict|pdf|pcx|ico|cdr|ai|raw|svg|webp/i", $exec[1]) == 1){
                                    $returnString .= $dir . $file . ";";
                                }else if(preg_match("~\.~", $file) == 0 ){
                                    $returnString = getImgs(scandir($_SERVER['DOCUMENT_ROOT'] . $dir . $file), $dir . $file . "/", $returnString);
                                }
                            }
                            return $returnString;
                        }
                        echo getImgs(scandir($_SERVER['DOCUMENT_ROOT']), "/", "");
                        break;

                    case "savePage":
                       if (isset($_POST["page"]) && $_POST["page"] != "" && $_POST["page"] != " ") {
                           $resCookie = $mysqli->query("SELECT `access`, `login` FROM `users` WHERE `login` = (SELECT `login` FROM `sessions` WHERE `cookie` = '" . $_COOKIE['auth'] . "')");
                           $resCookie = $resCookie->fetch_assoc();
                           if (isset($resCookie["access"])) {

                               $isCookieVerf = explode(",", $resCookie["access"]);
                               for ($i = 0; $i < count($isCookieVerf); $i++) {
                                   $isCookieVerf[$i] = explode(":", $isCookieVerf[$i]);
                               }

                               function getAccess($access, $accessType){
                                   $onFalse = true;
                                   if ($access[0][0] == "all") {
                                       return "all";
                                   } else {
                                       for ($i = 0; $i < count($access); $i++) {
                                           if ($access[$i][0] == $accessType) {
                                               return [true, $access[$i]];
                                           }
                                       }
                                   }

                                   if ($onFalse)
                                       return false;
                               }


                               $isCookieAcces = getAccess($isCookieVerf, $_POST["page"]);
                               if (($isCookieAcces == "all" ? true : ($isCookieAcces[0] ? array_search("edit", $isCookieAcces[1]) : ""))) {
                                   $isRemove = $_POST["newUrl"] !== $_POST["page"];
                                   $backup = new ZipArchive();
                                   if($backup->open($_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . "backupsPages.zip", ZipArchive::CREATE)) {
                                       foreach ($_POST as $key => $item) {
                                           if ($key == "type" || $key == "page") {
                                               continue;
                                           } else {
                                               if($key == "newUrl") {
                                                   $key = $item;
                                                   $item = $_POST[$_POST["page"]];
                                               }
                                               $url = preg_replace("/\//", DIRECTORY_SEPARATOR, $key);
                                               if(mb_substr($url, -1) == DIRECTORY_SEPARATOR)
                                                   $url .= "index_php";
                                               if(preg_match("/^(.+)_(.+)$/", $url, $test)){
                                                   $url = $test[1] . "." . $test[2];
                                               }else{
                                                   $url .= ".php";
                                               }
                                               if($isRemove) {
                                                   $Tempurl = preg_replace("/\//", DIRECTORY_SEPARATOR, $_POST["page"]);
                                                   if(preg_match("/^(.+)_(.+)$/", $Tempurl, $test)){
                                                       $Tempurl = $test[1] . "." . $test[2];
                                                   }else{
                                                       $Tempurl .= ".php";
                                                   }
                                                   $backup->addFile($_SERVER['DOCUMENT_ROOT'] . $Tempurl, $Tempurl . DIRECTORY_SEPARATOR . date('H:i:s d.m.Y'));
                                                   $tempFolders = explode(DIRECTORY_SEPARATOR, $url);
                                                   //echo(unlink($_SERVER['DOCUMENT_ROOT'] . $Tempurl) ? "" : ErrorDeleteLastPage);
                                                   $Tempurl = $_SERVER['DOCUMENT_ROOT'];
                                                   foreach ($tempFolders as $keyFolder => $name){
                                                       $Tempurl .= DIRECTORY_SEPARATOR . $name;
                                                       if(!file_exists($Tempurl) && count($tempFolders) != $keyFolder + 1)
                                                           mkdir($Tempurl);
                                                   }
                                               }else{
                                                   $backup->addFile($_SERVER['DOCUMENT_ROOT'] . $url, $url . DIRECTORY_SEPARATOR . date('H:i:s d.m.Y'));
                                               }
                                               var_dump($_SERVER['DOCUMENT_ROOT'] . $url);
                                               file_put_contents($_SERVER['DOCUMENT_ROOT'] . $url, $item);

                                           }
                                       }
                                       $backup->close();
                                   }else
                                       echo ErrorBackupInitialization;

                               } else echo ErrorAccessDenied;
                           } else echo ErrorWrongCookie;
                       } else echo ErrorNotSpecifiedSourcePage;
                        break;

                    default:
                        echo ErrorWrongType;
                        break;
                }
            }else echo ErrorBackupInitialization;
        }else if(isset($_FILES['uploadFile'])){
            if(preg_match("/image/", $_FILES['uploadFile']["type"]) == 1) {
                $url = $_SERVER['DOCUMENT_ROOT'];
                if(!file_exists($url . DIRECTORY_SEPARATOR . implode(DIRECTORY_SEPARATOR, explode("/", $_POST["filePath"])))) {
                    $multiPatch = explode("/", $_POST["filePath"]);
                    for ($i = 0; $i < count($multiPatch); $i++){
                        $url .= DIRECTORY_SEPARATOR . $multiPatch[$i];
                        if($i + 1 != count($multiPatch))
                            if(!file_exists($url))
                                mkdir($url);
                    }
                    if (!move_uploaded_file($_FILES['uploadFile']['tmp_name'], $url))
                        echo ErrorUploadFileExecutable;
                }else{
                    echo ErrorFileWithNameAlreadyExist;
                }
            }else{
                echo ErrorTypeImage;
            }
        }else ErrorFileWithNameAlreadyExist;

    } catch (Exception $e) {
        die($e->getMessage());
    }
?>
