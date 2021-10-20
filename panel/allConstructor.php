<?php
 $constructors = [
     "main" => ["name" => "Основная часть", "script" => "", "style" => "", "childs" => "none", "tag" => "main", "isLocal" => false, "attributes" => "id=content"],
     "header" => ["name" => "Шапка", "script" => "", "style" => "", "childs" => "", "tag" => "header", "isLocal" => false, "attributes" => ""],
     "footer" => ["name" => "Футер", "script" => "", "style" => "", "childs" => "", "tag" => "footer", "isLocal" => false, "attributes" => ""],
     "timeline" => ["name" => "Линия времени", "script" => "timeLine.js", "style" => "timeLine.css", "childs" => "startTime;link_time_line;endLine", "defaultPath" => "<a class=\"startTime\" data-time=\"\"><h2></h2><span></span></a><a class=\"link_time_line\" data-time=\"\"><div class=\"wrapper_line\"></div><div class=\"wrapper_link_time_line\"><div class=\"main_content_time_line\"><h2></h2><div class=\"time_line_content\"></div></div><div class=\"time_line_data\"></div></div></a><div class=\"line\"></div><a class=\"endLine\"><h2></h2><span id=\"time_date\"></span></a>", "defaultQuery" => "*NODE*:nth-child(l)", "tag" => "div", "isLocal" => true, "attributes" => "class=timeline"],
     "startTime" => ["name" => "Начало линии времени", "script" => "", "style" => "", "childs" => "", "tag" => "a", "isLocal" => false, "attributes" => "class=startTime"],
     "link_time_line" => ["name" => "Событие на линии времени", "script" => "", "style" => "", "childs" => "time_line_content_hide", "tag" => "a", "isLocal" => true, "attributes" => "class=link_time_line"],
     "time_line_content_hide" => ["name" => "Описание события на линии времени", "script" => "", "style" => "", "childs" => "none", "tag" => "div", "isLocal" => false, "attributes" => "time_line_content_hide"],
     "endLine" => ["name" => "Конец линии времени", "script" => "", "style" => "", "childs" => "", "tag" => "a", "isLocal" => false, "attributes" => "class=endLine"],
     "slider" => ["name" => "Слайдер", "script" => "slider.js", "style" => "slider.css", "childs" => "img", "defaultPath" => "<div class=\"slider\"><div class=\"button_slider_wrapper_vertical\"><div class=\"button_slider_wrapper_horizontal\"><div class=\"button_slider_wrapper\"><img class=\"no_content\" src=\"../images/arrow_left.svg\" id=\"button_slider_left\" alt=\"слайд влево\"><img class=\"no_content\" src=\"../images/arrow_right.svg\" id=\"button_slider_right\" alt=\"слайд вправо\"></div></div></div><div class=\"slider_content\"><img class=\"clickableImg\" src=\"\" alt=\"\"></div></div>", "tag" => "div", "isLocal" => true, "defaultQuery" => "div:nth-child(2)>*NODE*:nth-child(n)", "attributes" => "class=slider"],
     "item_separator" => ["name" => "Делитель", "script" => "", "style" => "", "childs" => "container", "tag" => "div", "isLocal" => false, "attributes" => "class=item_separator"],
     "item_centralizer" => ["name" => "Центратор", "script" => "", "style" => "", "childs" => "container", "tag" => "div", "isLocal" => false, "attributes" => "class=item_centralizer"],
     "container" => ["name" => "Контейнер", "script" => "", "style" => "", "childs" => "none", "tag" => "div", "isLocal" => false, "attributes" => "class=container"],
     "list" => ["name" => "Список", "script" => "", "style" => "", "childs" => "list_title;list_wrapper", "tag" => "div", "defaultPath" => "<div class=\"list_title\"></div><ul class=\"list_wrapper\"></ul>", "isLocal" => true, "attributes" => "class=list"],
     "list_title" => ["name" => "Заголовок списка", "script" => "", "style" => "", "childs" => "text_node", "tag" => "div", "isLocal" => false, "attributes" => "class=list_title"],
     "list_wrapper" => ["name" => "Контейнер списка", "script" => "", "style" => "", "childs" => "list_item","defaultPath" => "<li class=\"list_item\"></li>" , "tag" => "ul", "isLocal" => true, "attributes" => "class=list_wrapper"],
     "list_item" => ["name" => "Элемент списка", "script" => "", "style" => "", "childs" => "text_node", "tag" => "li", "isLocal" => false, "attributes" => "class=list_item"],
     "text_node" => ["name" => "Текст", "script" => "", "style" => "", "childs" => "", "tag" => "p", "isLocal" => false, "attributes" => ""],
     "img" => ["name" => "Картинка", "script" => "", "style" => "", "childs" => "", "tag" => "img", "isLocal" => false, "attributes" => "src= "]
 ];


/*
 *
 * TODO
 * Сделать функционал для кнопки ссылки и цветов
 *
 * подкрутить авторизацию к редактированию разделов
 * сделать кнопку
 * сделать отдельный блок edit для хеадера и футера
 *
 */

//404