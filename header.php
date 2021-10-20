<div class="custom_scroll">
    <div class="scroll_block"></div>
</div>

<div class="img_block">
    <img class="block_content" src="/images/otkritie1.jpg" alt="Открытие">
    <div class="fill_img"></div>
</div>

<header id="header">
    <a href="/" class="wrapper_head_text">
        <div class="wrapper_logo">
            <img src="/images/logo.png" alt="Логотип">
        </div>
        <div class="wrapper_head_text_item">МБОУ Гимназия №25 г. Иркутска</div>
    </a>

    <div id="burgerId" class="headerBurger" onclick="onClickBurger()">
        <span></span>
    </div>

    <?php
        $mysqli = new mysqli("127.0.0.1", "mysql", "mysql", "gymn"); //Подключаемся
        if ($mysqli->connect_error) {//проверка подключились ли мы
            die('Ошибка подключения (' . $mysqli->connect_errno . ') ' . $mysqli->connect_error); //если нет выводим ошибку и выходим из кода
        } else {
            $mysqli->query("SET NAMES 'utf8'");//Устанавливаем кодировку
            $res = $mysqli->query("SELECT * FROM `tabs`");
            if($res){
                $resTabs = $res->fetch_assoc();
                $resLinks = $res->fetch_assoc();
                $links = [];
                foreach ($resLinks as $key => $value) {
                    $arr = explode(";", $value);
                    foreach ($arr as $v) {
                        $links[$key][] = "$v";
                    }
                }
                $data = [];
                foreach ($resTabs as $key => $value) {
                    $arr = explode(";", $value);
                    foreach ($arr as $k => $v) {
                        $data[$key] .= "<a href=\"" . $links[$key][$k] . "\">" . $v . "</a>";
                    }
                }
            }
        }
    ?>

    <nav id="menuId" class="headerMenu">
        <ul class="headerList">
            <li>
                <a id="main" class="buttonAct" href="/">Главная</a>
            </li>

            <li>
                <a id="news" class="buttonAct" href="/">Новости</a>
            </li>

            <li>
                <div id="info" class="buttonAct">О школе</div>
                <div class="wrapper_button_more">
                    <?php
                        echo $data["school"];
                    ?>
                </div>
            </li>

            <li>
                <a class="buttonAct" href="/">Поступить</a>
                <div class="wrapper_button_more">
                    <?php
                    echo $data["join"];
                    ?>
                </div>
            </li>

            <li>
                <a class="buttonAct" href="/achievements">Достижения</a>
            </li>

            <li>
                <a class="buttonAct" href="/">Родителям</a>
                <div class="wrapper_button_more">
                    <?php
                        echo $data["parents"];
                    ?>
                </div>
            </li>

            <li>
                <a class="buttonAct" href="/">Ученикам</a>
                <div class="wrapper_button_more">
                    <?php
                        echo $data["students"];
                    ?>
                </div>
            </li>
        </ul>
    </nav>
</header>