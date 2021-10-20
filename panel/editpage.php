<?php
include 'checkAuth.php';
$page = "";
$title = null;

    if(isset($_GET["page"])){
        if($_GET["page"] != "" && $_GET["page"] != " "){
            try {
                $isEdit = getAccess($access, "/panel/sections");
                $flagEdit = ($isEdit == "all" ? true : ($isEdit[0] ? array_search("edit", $isEdit[1]) : false));
                if($flagEdit == false){
                    $isEdit = getAccess($access, $_GET["page"]);
                    $flagEdit = ($isEdit == "all" ? true : ($isEdit[0] ? array_search("edit", $isEdit[1]) : false));
                }
                if($flagEdit) {
                    $page = $_GET["page"];
                    if (file_exists($_SERVER['DOCUMENT_ROOT'] . $page . (preg_match("~.php~", $page) == 1 ? "" : ".php"))) {
                        $fp = file_get_contents(((!empty($_SERVER['HTTPS'])) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . $page . (preg_match("~.php~", $page) == 1 ? "" : ".php"));
                        if (!$fp) $title = null;
                        else {
                            $res = preg_match("/<title>(.*)<\/title>/siU", $fp, $title_matches);
                            if (!$res)
                                $title = null;
                            else {
                                $title = preg_replace('/\s+/', ' ', $title_matches[1]);
                                $title = trim($title);
                            }
                        }
                        if (!($title != null && $title != "" && $title != " ")) {
                            header('Location: ' . ((!empty($_SERVER['HTTPS'])) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . '/panel/sections');
                        }
                    } else
                        header('Location: ' . ((!empty($_SERVER['HTTPS'])) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . '/panel/sections');
                }else
                    header('Location: ' . ((!empty($_SERVER['HTTPS'])) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . '/panel/sections');
            }catch (Exception $e){
                header('Location: ' . ((!empty($_SERVER['HTTPS'])) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . '/panel/sections');
            }
        }else header('Location: '. ((!empty($_SERVER['HTTPS'])) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] .'/panel//sections');
    }else header('Location: '. ((!empty($_SERVER['HTTPS'])) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . '/panel//sections');


?>

<!doctype html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Редактировать раздел</title>
    <link rel="stylesheet" type="text/css" href="/styleAll.css"/>
    <link rel="stylesheet" type="text/css" href="/panel/style.css"/>
    <script src="/main.js"></script>
    <script src="/panel/main.js"></script>
</head>
<body>

<?php include  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'panel'. DIRECTORY_SEPARATOR .'header.php';?>

<div class="background">
    <div class="imgs"></div>
    <div class="fill_img_back"></div>
</div>

<main id="content">
    <div id="swup" class="transition-fade">
        <div class="titlePage" style="display: none"><?php echo $title;?></div>
        <span class="styles">/panel/style.css</span>
        <span class="script">addScript("/panel/main.js"),editPage()</span>
        <div class="soursFile">
            <div id="constructor_title" class="soursFile_title">
                Конструктор
            </div>
            <div id="HTML_title" class="soursFile_title">
                HTML
            </div>
            <div id="CSS_title" class="soursFile_title">
                CSS
            </div>
            <div id="JavaScript_title" class="soursFile_title">
                JavaScript
            </div>
        </div>

        <div class="contentTypes">
            <?php
            include 'allConstructor.php';
            $content = (file_get_contents($_SERVER['DOCUMENT_ROOT'] . $page . (preg_match("~.php~", $page) == 1 ? "" : ".php")));
            ?>
            <div id="constructor" class="soursFile_content" data-constructor-all="<? echo htmlentities(json_encode($constructors))?>">
                <div class="title_content">Заголовок:</div>
                <div class="constructor_wrapper">
                    <div class="constructor_file headers">
                        <?php
                        preg_match_all('/<link[\s]+[^>]*href[\s]*=[\s]*[\'"](.*)[\', "][.]*\/>/siU', ($content), $contentCss);
                        preg_match_all('/<script[\s]+[^>]*src[\s]*=[\s]*[\'"](.*)[\'"][.]*>[.]*<\/script>/siU', ($content), $contentJs);
                        foreach ($contentCss[1] as $item){
                                echo '<div class="constructorItem headers left"><div class="list_constructor">'. $item .'</div></div>';
                        }


                        foreach ($contentJs[1] as $item){
                                echo '<div class="constructorItem headers left"><div class="list_constructor">'. $item .'</div></div>';
                        }
                            ?>
                    </div>

                    <div class="constructor_all">
                        <?php
                        getAllTitles(scandir($_SERVER['DOCUMENT_ROOT']), "/");

                        function getAllTitles($sections, $dir){
                            foreach ($sections as $section){
                                if(preg_match("~.css~", $section) == 1){
                                    echo "<div class='constructorItem headers right css' data-type='' data-style='". $dir . $section ."'><div class=\"list_constructor\">".$dir . $section."</div></div>";
                                }else if(preg_match("~.js~", $section) == 1){
                                    echo "<div class='constructorItem headers right js' data-type='$dir . $section' data-style=''><div class=\"list_constructor\">".$dir . $section."</div></div>";
                                }else if(preg_match("~\.~", $section) == 0 && $section != "fonts" && $section != "images" && $section != ""){
                                    if(is_dir($_SERVER['DOCUMENT_ROOT'] . $dir . $section)){
                                        getAllTitles(scandir($_SERVER['DOCUMENT_ROOT'] . $dir . $section),  $dir .$section. "/");
                                    }
                                }
                            }
                        }
                        ?>
                        <div class="delete_constructor headers">
                            <img src="images/delete.svg" alt="">
                        </div>
                    </div>
                </div>
                <div class="title_content">Тело:</div>
                <div class="constructor_wrapper">
                    <div class="constructor_file body">
                        <?php
                        $mainDom = new DOMDocument();
                        libxml_use_internal_errors(true);
                        $mainDom->loadHTML(mb_convert_encoding($content, 'HTML-ENTITIES', 'UTF-8'));
                        libxml_use_internal_errors(false);
                        $mainDomX = new DOMXPath($mainDom);
                        generateConstr(returnClearItems($mainDomX->query("//body/node()")), $constructors, $mainDom);
                        function generateConstr($array, $constructors, $mainDom, $isLocal = false, $lastQuery = ""){
                            $i = 1;
                            foreach ($array as $item) {
                                if (isset($item->target) || isset($item->tagName)) {
                                    if (isset($item->target)) {
                                        if ($item->target == "php") {
                                            $i --;
                                            if (preg_match("/include\s+[\"'](.*)[\"']/", $item->textContent, $resContent)) {
                                                switch ($resContent[1]) {
                                                    case "header.php":
                                                        echo '<div class="constructorItem body left" data-type="header" data-query="' . htmlentities("\n^.*&lt;\\?php\\s+include\\s*[\"']header\\.php[\"'].*;.*\\?&gt;.*$\r\n") . '"><div class="list_constructor">' . $constructors["header"]["name"] . '</div></div>';
                                                        break;
                                                    case "footer.php":
                                                        echo '<div class="constructorItem body left" data-type="footer" data-query="' . htmlentities("\n^.*&lt;\\?php\\s+include\\s*[\"']footer\\.php[\"'].*;.*\\?&gt;.*$\r\n") . '"><div class="list_constructor">' . $constructors["footer"]["name"] . '</div></div>';
                                                        break;
                                                }
                                            }
                                        }
                                    } else {
                                        $attributes = getAttributes($item->attributes);
                                        $constructorKey = getConstructor($item, $constructors);
                                        if($attributes["class"] != "no_content")
                                        if (isset($constructorKey)) {
                                            echo '<div class="constructorItem body left' . ($isLocal ? " local" : "") . '" data-type="' . $constructorKey . '" data-item="' . htmlentities(json_encode($attributes)) . '"  data-query="' . ($lastQuery !== "" && $lastQuery !== " " ? $lastQuery . ">" : "") . $item->tagName . ($item->tagName == $constructorKey ? "" : "." . $constructorKey) . ":nth-child(". $i .")" . '"><div class="list_constructor">' . $constructors[$constructorKey]["name"] . '</div><img class="edit_page_content" data-type="' . $constructorKey . '" src="images/create.svg" alt="редактировать">';
                                            if ($constructors[$constructorKey]["childs"] == "") {
                                                echo '</div>';
                                            } else {
                                                echo "<div class=\"wrapper_ul_list_constr\">";
                                                $child = returnClearItems($item->childNodes);

                                                if (count($child) !== 0) {
                                                    if (isText($child[0])) {
                                                        $text = arrayToText($child);
                                                        preg_match("/^(\S+\s*){1,4}/iu", trim($text[1]), $temp);
                                                        echo '<div class="constructorItem body left' . ($isLocal ? " local" : "") . '" data-type="text_node" data-query="text_node" data-text="' . htmlentities($text[0]) . '"><div style="background-color: #4e78e0; color: white; border: 2px solid white;" class="list_constructor">' . htmlentities($temp[0]) . '...</div><img class="edit_page_content" data-type="text_node" src="images/create.svg" alt="редактировать"></div>';
                                                    } else {
                                                        generateConstr(returnClearItems($child), $constructors, $mainDom, $constructors[$constructorKey]["isLocal"]);
                                                    }
                                                } else {
                                                    if (trim($item->textContent) != " " && trim($item->textContent) != "") {
                                                        preg_match("/^(\S+\s*){1,4}/iu", trim($item->textContent), $temp);
                                                        var_dump($item->textContent);
                                                        echo '<div class="constructorItem body left' . ($isLocal ? " local" : "") . '" data-type="text_node" data-query="text_node" data-text="' . htmlentities($item->textContent) . '"><div class="list_constructor">' . htmlentities($temp[0]) . '...</div><img class="edit_page_content" data-type="text_node" src="images/create.svg" alt="редактировать"></div>';
                                                    } else
                                                        echo '<div class="constructorItem body left" data-type="none" data-query="none"><div style="background-color: #4e78e0; color: white; border: 2px solid white;" class="list_constructor">Этот контейнер пуст. Переместите сюда объект, чтобы добавить его</div></div>';
                                                }
                                                echo '</div></div>';
                                            }
                                        } else {
                                            $child = returnClearItems($item->childNodes);
                                            if (count($child) !== 0)
                                                generateConstr(returnClearItems($child), $constructors, $mainDom, $isLocal, ($lastQuery !== "" && $lastQuery !== " " ? $lastQuery . ">" : "") . $item->tagName . ":nth-child(" . $i . ")");
                                        }

                                    }
//                                    var_dump($item);
//                                    echo "<br>";
//                                    echo "<br>";
                                }
                                $i++;
                            }
                        }

                        function isText($node){
                            if ($node->nodeName === "div"){
                                $child = returnClearItems($node->childNodes);
                                if(count($child) !== 0){
                                    if($child[0]->nodeName === "#text")
                                        return true;
                                    else return false;
                                }else return false;
                            }else return false;
                        }

                        function getConstructor($item, $constructors){
                            $searchKey = $item->nodeName;
                            $attributes = getAttributes($item->attributes);
                            if (isset($attributes["class"])){
                                $searchKey = $attributes["class"];
                            }
                            foreach ($constructors as $key => $constructor){
                                if(preg_match("/\b". $key ."\b/", $searchKey) == 1)
                                    return $key;
                            }
                            foreach ($constructors as $key => $constructor){
                                if(preg_match("/\b". $key ."\b/", $item->nodeName) == 1)
                                    return $key;
                            }
                            return null;
                        }

                        function arrayToText($childs){
                            $returnString = "";
                            $returnStringNotHTML = "";
                            foreach ($childs as $key => $child){
                                if ($child->nodeName == "#text") {
                                    $returnString .= $child->textContent;
                                    $returnStringNotHTML .= $child->textContent . " ";
                                }else if($child->nodeName !== "br"){
                                    $text = arrayToText(returnClearItems($child->childNodes));
                                    $style = getAttributes($child->attributes)["style"];
                                    $returnString .= "<". $child->nodeName . (isset($style) ? " style=\"" .  $style . "\"" : "") . ">" . $text[0] . "</". $child->nodeName .">";
                                    $returnStringNotHTML .= $text[1] . " ";
                                }else{
                                    $returnString .= "<". $child->nodeName . ">";
                                }
                            }
                            return [$returnString, $returnStringNotHTML];
                        }

                        function getAttributes($array){
                            $returnArray = [];
                            foreach ($array as $attribute){
                                $returnArray[$attribute->name] = $attribute->value;
                            }
                            return $returnArray;
                        }

                        function returnClearItems($array){
                            $returnArray = [];
                            foreach ($array as $childNode) {
                                if (isset($childNode->target) || isset($childNode->tagName) || ($childNode->nodeName == "#text" && trim($childNode->textContent) != " " && trim($childNode->textContent) != "")) {
                                    $returnArray[] = $childNode;
                                }
                            }
                            return $returnArray;
                        }
                        ?>
                    </div>

                    <div class="constructor_all">
                        <?php
                            foreach ($constructors as $key => $constructor){
                                echo "<div class='constructorItem body right block' data-item='". attributesConstructorToData(explode(";", $constructor["attributes"])) ."' data-type='". $key ."'><div class=\"list_constructor\"". ($key == "text_node" ? "style=\"background-color: rgb(78, 120, 224); border: 2px solid white; color: white;\"" : "") ." >".$constructor["name"]."</div></div>";
                            }

                            function attributesConstructorToData($text){
                                $returnJson = [];
                                foreach ($text as $node){
                                   $nodeKeyAndValue = explode("=", $node);
                                   $returnJson[$nodeKeyAndValue[0]] = $nodeKeyAndValue[1];
                                }
                                return htmlentities(json_encode($returnJson));
                            }
                        ?>
                        <div class="delete_constructor body">
                            <img src="images/delete.svg" alt="">
                        </div>
                    </div>
                </div>
            </div>
            <div id="HTML" class="soursFile_content">
                <?php
                    echo '<div class="title_soursFile_content">'. $page .'</div>';
                    echo '<textarea class="inputEditPage">' . htmlspecialchars($content) . '</textarea>';
                    preg_match_all("/<\?php[\s]+include[\s]*['\"](.*)[', \"];[\s]*\?>/siU", $content, $contentHtml);
                    foreach ($contentHtml[1] as $item){
                        $path = "/";
                        if($item[0] == "." && $item[1] == ".") {
                            $item = mb_substr($item, 2);
                            echo '<div class="title_soursFile_content">' . $item . '</div>';
                        }else
                            if($page[strlen($page) - 1] == "/") {
                                $path = $page;
                                echo '<div class="title_soursFile_content">' . $page . $item . '</div>';
                            }else{
                                $path = explode(mb_strrchr($page, "/"), $page)[0]. "/";
                                echo '<div class="title_soursFile_content">' . $path . $item.'</div>';
                            }
                        echo '<textarea class="inputEditPage">' . htmlspecialchars(file_get_contents($_SERVER['DOCUMENT_ROOT'] . $path . $item)) . '</textarea>';
                    }
                ?>
                </div>
            <div id="CSS" class="soursFile_content">

                <?php
                foreach ($contentCss[1] as $item){
                        echo '<div class="title_soursFile_content">'. $item .'</div>';
                        echo '<textarea class="inputEditPage">' . htmlspecialchars(file_get_contents($_SERVER['DOCUMENT_ROOT'] . $item)) . '</textarea>';
                }
                ?>

            </div>
            <div id="JavaScript" class="soursFile_content">
                <?php
                foreach ($contentJs[1] as $item){
                    echo '<div class="title_soursFile_content">/'. $item .'</div>';
                    echo '<textarea class="inputEditPage">' . htmlspecialchars(file_get_contents($_SERVER['DOCUMENT_ROOT'] . $path . $item)) . '</textarea>';
                }
                ?>


            </div>
        </div>
        <div class="changeUrlPage"><span>Расположение страницы: </span><span><span style="margin-left: 20px;"><? echo ((!empty($_SERVER['HTTPS'])) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];  ?>/</span><span contenteditable="true" class="borderInput" ><? echo mb_substr($_GET["page"], 1); ?></span></div>
        <div class="save_page">Сохранить</div>
    </div>
</main>
<?php include  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'footer.php';?>

<script src="/swup.min.js"></script>
<script> main(<?php echo "\"" . mb_substr(explode("?", $_SERVER['REQUEST_URI'])[0], 1) . "\""; ?>);</script>
</body>
</html>