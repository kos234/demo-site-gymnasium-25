<?php
    /*
     * access:
     *
     * account:create:edit:delete,
     * sections:create,
     * history:edit:delete
     */

    $access = "none";
    $login = "none";
    if(isset($_COOKIE["auth"])){
        if($_COOKIE["auth"] != "" && $_COOKIE["auth"] != " "){
            try {
                include "connectToMysql.php";
                $res = $mysqli->query("SELECT * FROM `sessions` WHERE `cookie` = '" . $_COOKIE["auth"] . "'");
                if($res){
                    $res = $res->fetch_assoc();
                    $login = $res["login"];
                    $mysqli->query("UPDATE `sessions` SET `time` = ". time() ." WHERE `cookie` = '" . $_COOKIE["auth"] . "'");
                    $res = $mysqli->query("SELECT `access` FROM `users` WHERE `login` = '" . $login . "'");
                    if($res) {
                        $res = $res->fetch_assoc();
                        $access = explode(",", $res["access"]);
                        for($i = 0; $i < count($access); $i++){
                            $access[$i] = explode(":", $access[$i]);
                        }
                    }
                }else{
                    header('Location: '. ((!empty($_SERVER['HTTPS'])) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] .'/panel');
                }
            } catch (Exception $e) {
                header('Location: '. ((!empty($_SERVER['HTTPS'])) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] .'/panel');
            }
        }else
            header('Location: '. ((!empty($_SERVER['HTTPS'])) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] .'/panel');
    }else
        header('Location: '. ((!empty($_SERVER['HTTPS'])) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] .'/panel');

function getAccess($access, $accessType){
    $onFalse = true;
    if($access[0][0] == "all") {
        return "all";
    }else {
        for ($i = 0; $i < count($access); $i++) {
            if ($access[$i][0] == $accessType) {
                return [true, $access[$i]];
            }
        }
    }

    if($onFalse)
        return false;
}
