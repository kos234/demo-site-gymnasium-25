<?php include 'checkAuth.php';?>

<!doctype html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Разделы</title>
    <link rel="stylesheet" type="text/css" href="../styleAll.css"/>
    <link rel="stylesheet" type="text/css" href="style.css"/>
    <script src="../main.js"></script>
    <script src="main.js"></script>
</head>
<body>
<div class="custom_scroll">
    <div class="scroll_block"></div>
</div>

<?php include $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . "panel" . DIRECTORY_SEPARATOR . 'header.php';?>

<div class="background">
    <div class="imgs"></div>
    <div class="fill_img_back"></div>
</div>

<main id="content">
    <div id="swup" class="transition-fade">
        <span class="styles">/panel/style.css</span>
        <span class="script">addScript("/panel/main.js"),onSections()</span>

        <div class="title">
            Разделы:
        </div>

        <ul class="mainList">

            <?php
                $sections = scandir($_SERVER['DOCUMENT_ROOT']);

            function page_title($url){
                $fp = file_get_contents($url);
                if (!$fp) return null;
                $res = preg_match("/<title>(.*)<\/title>/siU", $fp, $title_matches);
                if (!$res) return null;
                $title = preg_replace('/\s+/', ' ', $title_matches[1]); $title = trim($title);
                return $title;
            }
            $globalFlag =  $flag = getAccess($access, "/panel/sections");
            $flagEdit = ($globalFlag == "all" ? true : ($globalFlag[0] ? array_search("edit", $globalFlag[1]) : false));
            $flagDelete = ($globalFlag == "all" ? true : ($globalFlag[0] ? array_search("delete", $globalFlag[1]) : false));
            $flagCreate = ($globalFlag == "all" ? true : ($globalFlag[0] ? array_search("create", $globalFlag[1]) : false));
            createList($sections, "/", $access, $flagEdit, $flagDelete);
            function createList($sections, $dir, $access, $flagEdit, $flagDelete){
                foreach ($sections as $section){
                    if(preg_match("~.php~", $section) == 1){
                        $flag = getAccess($access, preg_replace("~.php~", "",$dir . $section));

                        if($section == "header.php")
                            echo "<li><span><span class='titleList'>Хеадер(шапка)</span> <span class='srcList'>/header</span> <span class=\"tools\">". ($flagEdit ? "<a href='editpage?page=/header'><img style='vertical-align: middle' src=\"images/create.svg\" alt=\"редактировать\"></a>" : ($flag == "all" ? "<a href='editpage?page=/header'><img style='vertical-align: middle' src=\"images/create.svg\" alt=\"редактировать\"></a>" : ($flag[0] ? ( array_search("edit", $flag[1]) != false ? "<a href='editpage?page=/header'><img style='vertical-align: middle' src=\"images/create.svg\" alt=\"редактировать\"></a>" : "") : ""))) ."</span></span></li>";
                        else if($section == "footer.php"){
                            echo "<li><span><span class='titleList'>Футер(подвал)</span> <span class='srcList'>/footer</span> <span class=\"tools\">". ($flagEdit ? "<a href='editpage?page=/footer'><img style='vertical-align: middle' src=\"images/create.svg\" alt=\"редактировать\"></a>" : ($flag == "all" ? "<a href='editpage?page=/footer'><img style='vertical-align: middle' src=\"images/create.svg\" alt=\"редактировать\"></a>" : ($flag[0] ? ( array_search("edit", $flag[1]) != false ? "<a href='editpage?page=/footer'><img style='vertical-align: middle' src=\"images/create.svg\" alt=\"редактировать\"></a>" : "") : ""))) ."</span></span></li>";
                        }else if($section == "index.php" && $dir == "/"){
                            echo "<li><span><span class='titleList'>Главная</span> <span class='srcList'>/</span> <span class=\"tools\">". ($flagEdit ? "<a href='editpage?page=/index'><img style='vertical-align: middle' src=\"images/create.svg\" alt=\"редактировать\"></a>" : ($flag == "all" ? "<a href='editpage?page=/index'><img style='vertical-align: middle' src=\"images/create.svg\" alt=\"редактировать\"></a>" : ($flag[0] ? ( array_search("edit", $flag[1]) != false ? "<a href='editpage?page=/index'><img style='vertical-align: middle' src=\"images/create.svg\" alt=\"редактировать\"></a>" : "") : ""))) ."</span></span></li>";
                        } else {
                            echo "<li><span><span class='titleList'>". page_title($_SERVER['DOCUMENT_ROOT'] . $dir . $section) ."</span> <span class='srcList'>". preg_replace("~.php~", "",$dir . $section) ."</span> <span class=\"tools\">". ($flagEdit ? "<a href='editpage?page=". preg_replace("~.php~", "",$dir . $section) ."'><img style='vertical-align: middle' src=\"images/create.svg\" alt=\"редактировать\"></a>" : ($flag == "all" ? "<a href='editpage?page=". preg_replace("~.php~", "",$dir . $section) ."'><img style='vertical-align: middle' src=\"images/create.svg\" alt=\"редактировать\"></a>" : ($flag[0] ? ( array_search("edit", $flag[1]) != false ? "<a href='editpage?page=". preg_replace("~.php~", "",$dir . $section) ."'><img style='vertical-align: middle' src=\"images/create.svg\" alt=\"редактировать\"></a>" : "") : ""))) . ($flagDelete ? "<img src=\"images/delete.svg\" class='delete_page' alt=\"удалить\">" : ($flag == "all" ? "<img src=\"images/delete.svg\" class='delete_page' alt=\"удалить\">" : ($flag[0] ? ( array_search("delete", $flag[1]) != false ? "<img src=\"images/delete.svg\" class='delete_page' alt=\"удалить\">" : "") : ""))) ."</span></span></li>";
                        }

                    }else if(preg_match("~\.~", $section) == 0 && $section != "fonts" && $section != "images" && $section != "panel"){
                        if(is_dir($_SERVER['DOCUMENT_ROOT'] . $dir . $section)){
                            echo "<li><span><span class='titleList'>". "/".$section."/" ."</span></span></li><ul class=\"childList\">";
                            createList(scandir($_SERVER['DOCUMENT_ROOT'] . $dir . $section), $dir.$section."/", $access, $flagEdit, $flagDelete);
                            echo "</ul>";
                        }
                    }
                }
            }
            echo "</ul>";
            if($flagCreate){
                echo "<div id='createNewPage' class=\"title\">Создать новый раздел</div>";
            }

            ?>

        </ul>

    </div>
</main>

<?php include $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'footer.php';?>

<script src="/swup.min.js"></script>
<script> main(<?php echo "\"" . mb_substr(explode("?", $_SERVER['REQUEST_URI'])[0], 1) . "\""; ?>);</script>
</body>
</html>