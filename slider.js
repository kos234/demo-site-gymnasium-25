 function load() {
     setTimeout(() => {
         if(!loadScript["slider"])
             if(loadPage) {
                 setup();
                 loadScript["slider"] = true;
             }else
                 load();
     });
 }
 loadScript.push("slider", false);
 load();

function setup() {
    let maxWidth = 0;
    let maxHeight = 0;
    let breakPoint = false;
    let sizeWidth = 0;
    let itemCount = 0;
    let itemCurred = 0;
    let itemLastCount = 0;
    let buttonRight;
    let buttonLeft;
    let payloadSlide = false;

    documentSite.addEventListener("DOMContentLoaded", function() {
        window.onresize = function() {
            updateSizeSlider();
        };
    });
    slide(documentSite.querySelector(".slider"));
    documentSite.querySelector(".slider").style.height = (screenHeight - documentSite.getElementById("header").offsetHeight) + "px";
    let items = documentSite.querySelectorAll(".slider_content > img");
    let slider_content = documentSite.querySelector(".slider_content");
    let imgLast = new Image();
    imgLast.addEventListener("load", () => {
        itemCount = itemLastCount = items.length;
        items.forEach(item => {
            sizeWidth += item.offsetWidth;
            if(maxWidth < item.offsetWidth) {
                maxWidth = item.offsetWidth;
                maxHeight = item.offsetHeight
            }
        });

        Array.from(slider_content.children).forEach(child => {
            let img = documentSite.createElement("img");
            img.setAttribute("src", child.getAttribute("src"));
            img.setAttribute("class", child.getAttribute("class"));
            img.setAttribute("alt", child.getAttribute("alt"));
            slider_content.appendChild(img);
            viewImg(img);
            itemCount++;
            itemCurred++;
        });
        documentSite.querySelector(".slider_content").style.marginLeft = (-sizeWidth) + "px";

        updateSizeSlider();

    });
    imgLast.src = items[items.length - 1].src;

    buttonRight = documentSite.getElementById("button_slider_right");
    buttonLeft = documentSite.getElementById("button_slider_left");

    buttonRight.onclick = right;
    buttonLeft.onclick = left;

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        buttonRight.style.display = "none";
        buttonLeft.style.display = "none";
    }

    function right() {
        payloadSlide = true;
        buttonRight.onclick = null;
        let items = documentSite.querySelectorAll(".slider_content > img");
        items[0].style.transition = "margin-left 0.5s ease-in";

        let elementRect = items[itemCurred + 1].getBoundingClientRect(), elementRectLast = items[itemCurred].getBoundingClientRect();
        items[0].style.marginLeft = (-screenWight/2 - (elementRect.left - screenWight + items[itemCurred + 1].offsetWidth) + items[itemCurred + 1].offsetWidth/2 + elementRectLast.left) + "px";

        setTimeout(() => {
            items[1].style.transition = "margin-left 0s ease-in";
            items[1].style.marginLeft = (screenWight/2 - items[itemCurred + 1].offsetWidth/2) + "px";
            documentSite.querySelector(".slider_content").appendChild(documentSite.querySelector(".slider_content > img"));
            items[0].style.marginLeft = "0px";
            buttonRight.onclick = right;
            payloadSlide = false;
        }, 500);
    }

    function left() {
        payloadSlide = true;
        buttonLeft.onclick = null;
        let items = documentSite.querySelectorAll(".slider_content > img");
        items[0].style.transition = "margin-left 0.5s ease-in";

        let elementRect = items[itemCurred - 1].getBoundingClientRect(), elementRectLast = items[itemCurred].getBoundingClientRect();
        items[0].style.marginLeft = (screenWight/2 + (-elementRect.left - items[itemCurred - 1].offsetWidth/2) + elementRectLast.left) + "px";

        setTimeout(() => {
            payloadSlide = false;
            items[items.length - 1].style.transition = "margin-left 0s ease-in";
            items[0].style.transition = "margin-left 0s ease-in";
            documentSite.querySelector(".slider_content").insertBefore(items[items.length - 1], items[0]);
            items[items.length - 1].style.marginLeft = (screenWight/2 - items[itemCurred - 1].offsetWidth/2) + "px";
            items[0].style.marginLeft = "0px";
            buttonLeft.onclick = left;
        }, 500);
    }

    function slide(slider) {
        let newPosY = -1, lastPosY = -1, newPosX = -1, lastPosX = -1;
        let vector;
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            slider.ontouchstart = onSlideSet;
        } else {
            slider.onmousedown = onSlideSet;
        }
        slider.onselectstart = () => {return false;};

        function onSlideSet(e) {
            payload = false;
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                newPosX = -1;
                newPosY = -1;
                lastPosY = e.touches[0].clientY;
                lastPosX = e.touches[0].clientX;
                document.ontouchend = stopScroll;
                document.ontouchmove = moveSlide;
            } else {
                newPosX = -1;
                newPosY = -1;
                lastPosY = e.clientY;
                lastPosX = e.clientX;
                document.onmouseup = stopScroll;
                document.onmousemove = moveSlide;
            }
            return false;
        }

        function moveSlide(e) {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                newPosY = e.touches[0].clientY;
                newPosX = e.touches[0].clientX;
            } else {
                newPosY = e.clientY;
                newPosX = e.clientX;
            }

        }

        function stopScroll(e) {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                document.ontouchend = null;
                document.ontouchmove = null;
            } else {
                document.onmouseup = null;
                document.onmousemove = null;
            }

            if(newPosY !== -1 && newPosX !== -1 && lastPosX !== -1 && lastPosY !== -1) {
                vector = Math.sqrt(Math.pow(Math.ceil(newPosX - lastPosX), 2) + Math.pow(Math.ceil(newPosY - lastPosY), 2));
                if (vector >= screenWight / 5 && !payloadSlide) {
                    payload = true;
                    let direction = newPosX - lastPosX;
                    if (direction > 0)
                        left();
                    else
                        right();
                }
            }else{
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    if(e.target.classList.contains("clickableImg"))
                        view(e.target);
                    else if(e.target.id === "button_slider_left"){
                        left();
                    }else if(e.target.id === "button_slider_right"){
                        right();
                    }
                }
            }
        }
    }

    function updateSizeSlider() {
        screenWight = documentSite.documentElement.offsetWidth;
        if(screenWight <= maxWidth){
            let temp_obct = documentSite.querySelector(".slider");
            temp_obct.style.width = "100vw";
            temp_obct.style.height = (maxHeight * screenWight / maxWidth) + "px";
            breakPoint = true;
        }else if(breakPoint){
            let temp_obct = documentSite.querySelector(".slider");
            temp_obct.style.width = "100vw";
            temp_obct.style.height = (screenHeight - documentSite.getElementById("header").offsetHeight) + "px";
            breakPoint = false;
        }
        sizeWidth = 0;
        let items = documentSite.querySelectorAll(".slider_content > img");
        for (let i = 0; i < itemLastCount; i++){
            sizeWidth += items[i].offsetWidth;
        }

        documentSite.querySelector(".slider_content").style.marginLeft = (-sizeWidth) + "px";
        documentSite.querySelector(".slider_content > img").style.marginLeft = (screenWight/2 - documentSite.querySelectorAll(".slider_content > img")[itemCurred].offsetWidth/2) + "px";
    }
}