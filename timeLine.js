function load() {
    setTimeout(() => {
        if(!loadScript["timeline"])
            if(loadPage) {
                setupTimeLine();
                loadScript["timeline"] = true;
            }else
                load();
    }, );
}
loadScript.push("timeline", false);
load();

function setupTimeLine() {
    const tenYear = 120; //px
    let offset = 0;
    let lastPos = "right";
    let lastTime = 1992;
    let offsetOne = 0;
    let wrapperItem = documentSite.querySelector(".link_time_line").parentNode;
    let items = documentSite.querySelectorAll(".link_time_line");
    let date = {years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0};
    let timerHandler;
    let startTimeBlock = documentSite.querySelector(".startTime");

    function getHourOffset(firstDate, lastDate) {
        let firstDateInSeconds = new Date([(typeof firstDate[5] !== "undefined" ? firstDate[5] : null), (typeof firstDate[4] !== "undefined" ? firstDate[4] : null), (typeof firstDate[3] !== "undefined" ? firstDate[2] : null), (typeof firstDate[2] !== "undefined" ? firstDate[2] : null), (typeof firstDate[1] !== "undefined" ? firstDate[1] : null), (typeof firstDate[0] !== "undefined" ? firstDate[0] : null)]).getTime();
        let lastDateInSeconds = new Date([(typeof lastDate[5] !== "undefined" ? lastDate[5] : null), (typeof lastDate[4] !== "undefined" ? lastDate[4] : null), (typeof lastDate[3] !== "undefined" ? lastDate[2] : null), (typeof lastDate[2] !== "undefined" ? lastDate[2] : null), (typeof lastDate[1] !== "undefined" ? lastDate[1] : null), (typeof lastDate[0] !== "undefined" ? lastDate[0] : null)]).getTime();
        return tenYear * ((lastDateInSeconds - firstDateInSeconds) / new Date(1971, 0).getTime()) / 10;
    }

    for(let i = 0; i < 2; i++){
        let item = items[i];
        let sizeText = item.querySelector(".time_line_content").offsetHeight + 10;
        item.querySelector(".wrapper_line").style.transform = "translateY(-" + sizeText + "px)";
        if (i === 0){
            lastTime = item.getAttribute("data-time").split(":");
            offsetOne = getHourOffset(startTimeBlock.getAttribute("data-time").split(":"), lastTime)
            item.style.marginTop = offsetOne + "px";
            item.classList += " left";
            offset += offsetOne;
        }else if(i === 1){
            item.querySelector(".time_line_header").insertBefore(item.querySelector(".time_line_data"), item.querySelector(".time_line_header > h2"));
            offset += getHourOffset(lastTime, item.getAttribute("data-time").split(":"));
            lastTime = item.getAttribute("data-time").split(":");
            item.style.marginTop = offset + "px";

            item.classList += " right";
            item.querySelector(".wrapper_link_time_line").className += " right";
            item.querySelector(".time_line_content").className += " right";
            item.querySelector(".wrapper_line").className += " right";
            item.querySelector(".time_line_data").className += " right";
         }
        item.style.opacity = "1";
    }

    checkLoad();
    function checkLoad() {
        setTimeout(() => {
            let rect = getAbsoluteReact(items[0]);
            if(rect.left === 0)
                checkLoad();
            else {
                loadMoreBlock();
            }
        }, 1);
    }

    function loadMoreBlock() {
        let mainOffset = getAbsoluteReact(items[0]).top - offsetOne;
        for (let i = 2; i < items.length; i++) {
            let item = items[i];
            offset += getHourOffset(lastTime, item.getAttribute("data-time").split(":"));
            lastTime = item.getAttribute("data-time").split(":");

            let tempArray = wrapperItem.querySelectorAll(".link_time_line." + (lastPos === "right" ? "left" : "right"));
            let rect = getAbsoluteReact(tempArray[tempArray.length - 1]);
            let sizeText = item.querySelector(".time_line_content").offsetHeight + 10;
            item.querySelector(".wrapper_line").style.transform = "translateY(-" + sizeText + "px)";

            if (lastPos === "right") {
                if (rect.top + rect.height < offset + mainOffset) {
                    lastPos = "left";
                } else {
                    tempArray = wrapperItem.querySelectorAll(".link_time_line.right");
                    let rectTwo = getAbsoluteReact(tempArray[tempArray.length - 1]);
                    if (rectTwo.top + rectTwo.height < offset + mainOffset) {
                        item.querySelector(".time_line_header").insertBefore(item.querySelector(".time_line_data"), item.querySelector(".time_line_header > h2"));
                        item.querySelector(".wrapper_link_time_line").className += " right";
                        item.querySelector(".time_line_content").className += " right";
                        item.querySelector(".wrapper_line").className += " right";
                        item.querySelector(".time_line_data").className += " right";
                        item.classList += " right";
                        lastPos = "right";
                    } else {
                        if (rect.top + rect.height > rectTwo.top + rectTwo.height) {
                            offset = rectTwo.top + rectTwo.height + 20 - mainOffset;
                            item.querySelector(".time_line_header").insertBefore(item.querySelector(".time_line_data"), item.querySelector(".time_line_header > h2"));
                            item.querySelector(".wrapper_link_time_line").className += " right";
                            item.querySelector(".time_line_content").className += " right";
                            item.querySelector(".wrapper_line").className += " right";
                            item.querySelector(".time_line_data").className += " right";
                            lastPos = "right";
                        } else {
                            offset = rect.top + rect.height + 20 - mainOffset;
                            lastPos = "left";

                        }
                    }
                }
            } else {
                if (rect.top + rect.height < offset + mainOffset) {
                    item.querySelector(".time_line_header").insertBefore(item.querySelector(".time_line_data"), item.querySelector(".time_line_header > h2"));
                    item.querySelector(".wrapper_link_time_line").className += " right";
                    item.querySelector(".time_line_content").className += " right";
                    item.querySelector(".wrapper_line").className += " right";
                    item.querySelector(".time_line_data").className += " right";
                    lastPos = "right";
                } else {
                    tempArray = wrapperItem.querySelectorAll(".link_time_line.left");
                    let rectTwo = getAbsoluteReact(tempArray[tempArray.length - 1]);
                    if (rectTwo.top + rectTwo.height < offset + mainOffset) {
                        lastPos = "left";
                    } else {
                        if (rect.top + rect.height > rectTwo.top + rectTwo.height) {
                            offset = rectTwo.top + rectTwo.height + 20 - mainOffset;
                            lastPos = "left";
                        } else {
                            offset = rect.top + rect.height + 20 - mainOffset;
                            item.querySelector(".time_line_header").insertBefore(item.querySelector(".time_line_data"), item.querySelector(".time_line_header > h2"));
                            item.querySelector(".wrapper_link_time_line").className += " right";
                            item.querySelector(".time_line_content").className += " right";
                            item.querySelector(".wrapper_line").className += " right";
                            item.querySelector(".time_line_data").className += " right";
                            lastPos = "right";

                        }
                    }
                }
            }

            let rectLast = getAbsoluteReact(items[i - 1]);
            if (offset - rectLast.top - mainOffset < 30) {
                offset += 30;
            }
            item.style.opacity = "1";
            item.style.marginTop = offset + "px";
            item.classList += " " + lastPos;
        }

        wrapperItem.querySelector(".line").style.height = (offset + items[items.length - 1].offsetHeight) + "px";
        let dataTemp = new Date();
        let timeBlock = documentSite.querySelector("#time_date");
        if(timeBlock.innerHTML === "" || timeBlock.innerHTML === " ") {
            let startTime = startTimeBlock.getAttribute("data-time").split(":");
            date.seconds += dataTemp.getSeconds() - (typeof startTime[5] !== "undefined" ? parseInt(startTime[5]) : 0); //6
            if (date.seconds <= 0) {
                date.minutes--;
                date.seconds = 60 + date.seconds;
            }
            date.minutes += dataTemp.getMinutes() - (typeof startTime[4] !== "undefined" ? parseInt(startTime[4]) : 0); //5
            if (date.minutes <= 0) {
                date.hours--;
                date.minutes = 60 + date.minutes;
            }
            date.hours += dataTemp.getHours() - (typeof startTime[3] !== "undefined" ? parseInt(startTime[3]) : 0); //4
            if (date.hours <= 0) {
                date.days--;
                date.hours = 24 + date.hours;
            }
            date.days += dataTemp.getDate() - (typeof startTime[2] !== "undefined" ? parseInt(startTime[2]) : 0); //2
            if (date.days <= 0) {
                date.months--;
                date.days = new Date(dataTemp.getFullYear(), dataTemp.getMonth() - 1, 0).getDate() + date.days;
            }
            date.months += dataTemp.getMonth() + 1 - (typeof startTime[1] !== "undefined" ? parseInt(startTime[1]) : 0); //1
            if (date.months <= 0) {
                date.years--;
                date.months = 12 + date.months;
            }
            date.years += dataTemp.getFullYear() - (typeof startTime[0] !== "undefined" ? parseInt(startTime[0]) : 0); //0
            if (date.years <= 0) {
                date.years = 404;
            }
            timeBlock.innerHTML = getDateName(date);
            timerHandler = setInterval(setTime, 1000);
        }
        documentSite.querySelector("#swup").innerHTML += "<div class=\"view_hide_content\"><img src=\"images/close.svg\" alt=\"закрыть\"><div class=\"custom_scroll time_line\"><div class=\"scroll_block_content\"></div></div></div>";

        documentSite.querySelectorAll(".time_line_content_hide").forEach(e => {
            e.parentNode.parentNode.parentNode.onclick = () => clickHideContent(e);
        });
    }

    function clickHideContent(e) {
        let contentDivView = documentSite.querySelector(".view_hide_content");
        let close = documentSite.querySelector(".view_hide_content > img");
        let scrollBlock = contentDivView.querySelector(".scroll_block_content");
        close.onclick = () => {
            onClose(contentDivView);
        };
        contentDivView.addEventListener('click', function (e) {
            if (e.target.className === "view_hide_content views") {
                onClose(contentDivView);
            }
        });

        scrollBlock.style.opacity = "1";
        contentDivView.style.animation = "";
        contentDivView.style.top = (window.pageYOffset - documentSite.querySelector("header").offsetHeight) + "px";
        let wrapperContent = documentSite.createElement("div");
        wrapperContent.setAttribute("class", "wrapper_content_time_line");
        let content = e.cloneNode(true);
        wrapperContent.appendChild(content);
        content.insertBefore(e.parentNode.querySelector("h2").cloneNode(true), content.childNodes[0])
        content.style.display = "flex";
        try{
            contentDivView.removeChild(contentDivView.querySelector(".wrapper_content_time_line"));
        }catch (e) {

        }
        contentDivView.appendChild(wrapperContent);
        documentSite.querySelector("body").classList.add("bodyImg");
        contentDivView.className += " views";
        customScroll(scrollBlock, content, wrapperContent);
    }

    function setTime() {
        date.seconds++;
        if(date.seconds >= 60){
            date.seconds = 0;
            date.minutes++;
            if(date.minutes >= 60){
                date.minutes = 0;
                date.hours ++;
                if(date.hours >= 23){
                    date.hours = 0;
                    date.days ++;
                    if(date.days >= new Date(date.years, date.months, 0).getDate()){
                        date.days = 1;
                        date.months ++;
                        if(date.months >= 12){
                            date.months = 1;
                            date.years++;
                        }
                    }
                }
            }
        }
        /*
        * Я знаю, что постоянное обращение к древу элемента и поиск там среди кучи блоков одного единственого блока, - это край идиотизма.
        * Но так уж вышло, что функции setTimeout и setInterval по не понятной причине создают ДУБЛИКАТ ГЛОБАЛЬНОЙ ПЕРЕМЕННОЙ и не обновляют текст в ней.
        * Хотя, когда я только написал эту функцию все работало прекрасно. И судя по гуглу я не один такой.
        * Если ты читаешь это и знаешь в чем я ошибся, тоооооо... На напиши мне хоть, если конечно этот сайт пройдет и у меня будет к нему доступ -> https://vk.com/codename_kos
        */
        documentSite.querySelector("#time_date").innerHTML = getDateName(date);
    }

    function getDateName(date) {
        let returnString = date.years;
        if((date.years >= 11 && date.years <= 19) || (endNumber(date.years) >= 5 && endNumber(date.years) <= 9) || endNumber(date.years) === 0){
            returnString += " лет, ";
        }else if(endNumber(date.years) === 1){
            returnString += " год, ";
        }else if(endNumber(date.years) >= 2 && endNumber(date.years) <= 4){
            returnString += " года, ";
        }
        returnString += date.months
        if((date.months >= 11 && date.months <= 19) || (endNumber(date.months) >= 5 && endNumber(date.months) <= 9) || endNumber(date.months) === 0){
            returnString += " месяцев, ";
        }else if(endNumber(date.months) === 1){
            returnString += " месяц, ";
        }else if(endNumber(date.months) >= 2 && endNumber(date.months) <= 4){
            returnString += " месяца, ";
        }

        returnString += date.days
        if((date.days >= 11 && date.days <= 19) || (endNumber(date.days) >= 5 && endNumber(date.days) <= 9) || endNumber(date.days) === 0){
            returnString += " дней, ";
        }else if(endNumber(date.days) === 1){
            returnString += " день, ";
        }else if(endNumber(date.days) >= 2 && endNumber(date.days) <= 4){
            returnString += " дня, ";
        }

        returnString += date.hours
        if((date.hours >= 11 && date.hours <= 19) || (endNumber(date.hours) >= 5 && endNumber(date.hours) <= 9) || endNumber(date.hours) === 0){
            returnString += " часов, ";
        }else if(endNumber(date.hours) === 1){
            returnString += " час, ";
        }else if(endNumber(date.hours) >= 2 && endNumber(date.hours) <= 4){
            returnString += " часа, ";
        }

        returnString += date.minutes
        if((date.minutes >= 11 && date.minutes <= 19) || (endNumber(date.minutes) >= 5 && endNumber(date.minutes) <= 9) || endNumber(date.minutes) === 0){
            returnString += " минут и ";
        }else if(endNumber(date.minutes) === 1){
            returnString += " минута и ";
        }else if(endNumber(date.minutes) >= 2 && endNumber(date.minutes) <= 4){
            returnString += " минуты и ";
        }

        returnString += date.seconds
        if((date.seconds >= 11 && date.seconds <= 19) || (endNumber(date.seconds) >= 5 && endNumber(date.seconds) <= 9) || endNumber(date.seconds) === 0){
            returnString += " секунд";
        }else if(endNumber(date.seconds) === 1){
            returnString += " секунду";
        }else if(endNumber(date.seconds) >= 2 && endNumber(date.seconds) <= 4){
            returnString += " секунды";
        }

        return returnString;
    }

    function endNumber(number) {
        let charArray = number + "";
        return parseInt(charArray[charArray.length - 1]);
    }

    function getAbsoluteReact(item) {
        let react = item.getBoundingClientRect();
        return {
            left: react.left + window.scrollX,
            top: react.top + window.scrollY,
            height: react.height
        }
    }
}