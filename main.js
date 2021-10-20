let documentSite;
let screenHeight;
let screenWight;
let historyImgSize = 1801;
let diplomImgSize = 624;
let historyWrapperSize;
let diplomWrapperSize;
let page;
let divView;
let divWrapper;
let divImg;
let close;
let payload = false;
let loadPage = false;
let loadScript = []

function addFiles() {
    let styles = documentSite.querySelector(".styles");
    if(styles !== null){
        styles.innerHTML.split(",").forEach(e => {
            addStyle(e);
        });
    }
    styles = documentSite.querySelector(".script");
    if(styles !== null){
        styles.innerHTML.split(",").forEach(e => {
            try {
                eval(e);
            }catch (e) {
                console.log(e);
            }
        });
    }
}

function main(pageIndex) {
    pageIndex = pageIndex.split(".php")[0];
    documentSite = document;
    page = pageIndex;
    const swup = new Swup();
    screenWight = documentSite.documentElement.clientWidth;
    screenHeight = documentSite.documentElement.clientHeight;
    if(page === "") {
        setImages();
        breakPoints();
        documentSite.querySelector(".main_img").style.height = (screenHeight - documentSite.getElementById("header").offsetHeight) + "px";
    }

    documentSite.addEventListener('swup:contentReplaced', (event) => {
        loadScript = [];
        goUp();
        documentSite.getElementById("burgerId").classList.remove("click");
        documentSite.getElementById("menuId").classList.remove("click");
        documentSite.querySelectorAll(".clickableImg").forEach(elements => viewImg(elements));
        Array.from(documentSite.head.children).forEach(e => {
            if(e.type === "text/css" || e.nodeName === "SCRIPT"){
                if(e.href !== documentSite.location.protocol + "//" + documentSite.location.host + "/styleAll.css" && e.src !== documentSite.location.protocol + "//" + documentSite.location.host + "/main.js"){
                    documentSite.head.removeChild(e);
                }
            }
        });
        page = documentSite.location.pathname.split("/")[1].split(".php")[0];
        addFiles();
    });

    documentSite.addEventListener("DOMContentLoaded", function() {
        window.onresize = function() {
            if(page === "") {
                updateSize();
            }
        };
    });

    customScroll();
    divView = documentSite.createElement("div");
    divWrapper = documentSite.createElement("div");
    divImg = documentSite.createElement("img");
    close = documentSite.createElement("img");
    divView.setAttribute("class", "viewImage");
    divWrapper.setAttribute("class", "viewContent");
    close.src = "../images/close.svg";
    close.onclick = () => {
        onClose(divView);
    };
    divView.addEventListener('click', function (e) {
        if (e.target.className === "viewContent") {
            onClose(divView);
        }
    });
    divWrapper.appendChild(divImg);
    divView.appendChild(divWrapper);
    divView.appendChild(close);
    documentSite.querySelector("body").appendChild(divView);
    documentSite.querySelectorAll(".clickableImg").forEach(elements => viewImg(elements));
    addFiles();
}

function onClose(divView) {
    documentSite.querySelector("body").classList.remove("bodyImg");
    divView.classList.remove("views");
    divView.style.zIndex = "100";
    divView.style.animation = "opacityImgUnView 0.2s linear forwards";
}

function viewImg(element) {
    element.onclick = (e) => {
        view(e.target);
    }
}

function view(item) {
    if(!payload) {
        divView.style.animation = "";
        divView.style.top = window.pageYOffset + "px";
        divImg.style.top = "50%";
        divImg.style.left = "50%";
        let scale = 1;
        divImg.src = item.getAttribute("src");
        divImg.style.opacity = "0";
        divImg.onload = () => {
            if (divImg.height < screenHeight)
                divImg.style.transform = divImg.style.WebkitTransform = divImg.style.MsTransform = 'translate(-50%, -50%) scale(1)';
            else {
                scale = screenHeight / divImg.height;
                if (screenWight > divImg.width * scale)
                    divImg.style.transform = divImg.style.WebkitTransform = divImg.style.MsTransform = 'translate(-50%, -50%) scale(' + scale + ')';
                else {
                    scale = screenWight / divImg.width;
                    divImg.style.transform = divImg.style.WebkitTransform = divImg.style.MsTransform = 'translate(-50%, -50%) scale(' + scale + ')';
                }

            }
            divImg.style.opacity = "1";
        }
        documentSite.querySelector("body").classList.add("bodyImg");
        divView.setAttribute("class", "viewImage views");
        move(divImg);

        function move(img) {
            let newPosY = 0, lastPosY = 0, newPosX = 0, lastPosX = 0;
            let lastVector, newVector;
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                img.ontouchstart = onScrollSet;
            } else {
                img.onmousedown = onScrollSet;
            }
            img.onselectstart = () => {
                return false;
            };

            function onScrollSet(e) {
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    if (e.touches.length > 1) {
                        lastVector = Math.sqrt(Math.pow(Math.ceil(e.touches[1].clientX - e.touches[0].clientX), 2) + Math.pow(Math.ceil(e.touches[1].clientY - e.touches[0].clientY), 2));
                    } else {
                        lastPosY = e.touches[0].clientY;
                        lastPosX = e.touches[0].clientX;
                    }
                    document.ontouchend = stopScroll;
                    document.ontouchmove = moveScroll;
                } else {
                    lastPosY = e.clientY;
                    lastPosX = e.clientX;
                    document.onmouseup = stopScroll;
                    document.onmousemove = moveScroll;
                }
                return false;
            }

            function moveScroll(e) {
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    if (e.touches.length > 1) {
                        newVector = Math.sqrt(Math.pow(Math.ceil(e.touches[1].clientX - e.touches[0].clientX), 2) + Math.pow(Math.ceil(e.touches[1].clientY - e.touches[0].clientY), 2));
                        let deltaVector = newVector - lastVector;
                        if (deltaVector > 0) {
                            scale += 0.005
                        } else if (deltaVector < 0) {
                            if (scale - 0.005 > 0)
                                scale -= 0.005
                        }
                        lastVector = Math.sqrt(Math.pow(Math.ceil(e.touches[1].clientX - e.touches[0].clientX), 2) + Math.pow(Math.ceil(e.touches[1].clientY - e.touches[0].clientY), 2));
                        divImg.style.transform = divImg.style.WebkitTransform = divImg.style.MsTransform = 'translate(-50%, -50%) scale(' + scale + ')';
                    } else {
                        newPosY = lastPosY - e.touches[0].clientY;
                        newPosX = lastPosX - e.touches[0].clientX;
                        lastPosY = e.touches[0].clientY;
                        lastPosX = e.touches[0].clientX;
                    }
                } else {
                    newPosY = lastPosY - e.clientY;
                    newPosX = lastPosX - e.clientX;
                    lastPosY = e.clientY;
                    lastPosX = e.clientX;
                }
                img.style.top = (img.offsetTop - newPosY) + "px";
                img.style.left = (img.offsetLeft - newPosX) + "px";
            }

            function stopScroll() {
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    document.ontouchend = null;
                    document.ontouchmove = null;
                } else {
                    document.onmouseup = null;
                    document.onmousemove = null;
                }
            }
        }

        function addScrollListener(elem, handler) {
            if (elem.addEventListener) {
                if ('onwheel' in document) {
                    // IE9+, FF17+
                    elem.addEventListener("wheel", handler);
                } else if ('onmousewheel' in document) {
                    // устаревший вариант события
                    elem.addEventListener("mousewheel", handler);
                } else {
                    // 3.5 <= Firefox < 17, более старое событие DOMMouseScroll пропустим
                    elem.addEventListener("MozMousePixelScroll", handler);
                }
            } else { // IE8-
                divImg.attachEvent("onmousewheel", handler);
            }
        }

        if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            addScrollListener(divImg, function (e) {

                let delta = e.deltaY || e.detail || e.wheelDelta;
                if (delta < 0) scale += 0.05;
                else if (scale > 0.05) scale -= 0.05;
                divImg.style.transform = divImg.style.WebkitTransform = divImg.style.MsTransform = 'translate(-50%, -50%) scale(' + scale + ')';

                // отменим прокрутку
                e.preventDefault();
            });
        }
    }
}

function addStyle(url) {
    let style = documentSite.createElement('link');
    style.rel   = 'stylesheet';
    style.type  = 'text/css';
    style.href  = url;
    documentSite.head.appendChild(style);
}

function addScript(url) {
    let script = documentSite.createElement('script');
    script.src  = url;
    script.type = 'text/javascript';
    documentSite.head.appendChild(script);
}

function updateSize() {
    let wightUp = screenWight - documentSite.documentElement.clientWidth < 0;
    let heightUp = screenHeight - documentSite.documentElement.clientHeight < 0;
    screenWight = documentSite.documentElement.clientWidth;
    screenHeight = documentSite.documentElement.clientHeight;
    customScroll();
    if(wightUp){
        let history_wrapper = documentSite.querySelector(".history_wrapper");
        if(history_wrapper.childElementCount !== 4 && historyWrapperSize < screenWight){
            for (let i = history_wrapper.childElementCount + 1; historyWrapperSize < screenWight && i < 5; i++){
                historyWrapperSize += historyImgSize;
                history_wrapper.prepend(createImg("images\\otkritie" + i + ".jpg"));
            }
            history_wrapper.style.marginLeft = (-1 * (historyWrapperSize - screenWight)) + "px";
        }
        let diplom_wrapper = documentSite.querySelector(".diplom_wrapper");
        if(diplom_wrapper.childElementCount !== 5 && diplomWrapperSize < screenWight){
            for (let i = diplom_wrapper.childElementCount + 1; diplomWrapperSize < screenWight && i < 6; i++){
                diplomWrapperSize += diplomImgSize;
                diplom_wrapper.prepend(createImg("images\\diplom" + i + ".jpg", false));
            }

            diplom_wrapper.style.marginLeft = (-1 * (diplomWrapperSize - screenWight)) + "px";
        }
    }
    documentSite.querySelector(".diplom_wrapper").style.marginLeft = (-1 * (diplomWrapperSize - screenWight)) + "px";
    breakPoints();
}

function breakPoints() {
    if(screenWight <= 980){
        let history_wrapper = documentSite.querySelector(".history_wrapper"), diplom_wrapper = documentSite.querySelector(".diplom_wrapper");
            historyWrapperSize = 0;
            Array.from(history_wrapper.children).forEach(e => {
                if(e.name === "img") {
                    e.style.height = "auto";
                    e.style.width = 2 * screenWight + "px";
                    historyWrapperSize += 2 * screenWight;
                }
            });
            diplomWrapperSize = 0;
            Array.from(diplom_wrapper.children).forEach(e => {
                if(e.name === "img") {
                    e.style.height = "auto";
                    e.style.width = 1 * screenWight + "px";
                    diplomWrapperSize += 1 * screenWight;
                }
            });
        history_wrapper.style.marginLeft = (-1 * (historyWrapperSize - screenWight) + 2 * screenWight * 1263/3602) + "px";
        diplom_wrapper.style.marginLeft = (-1 * (diplomWrapperSize - screenWight)) + "px";


    }else if(screenWight <= 1010){
        documentSite.querySelector(".history_wrapper").style.marginLeft = (-1 * (historyWrapperSize - screenWight) + 650) + "px";
    }else{
        documentSite.querySelector(".history_wrapper").style.marginLeft = (-1 * (historyWrapperSize - screenWight)) + "px";
    }
}

function setImages() {
    let history_wrapper = documentSite.querySelector(".history_wrapper");
    history_wrapper.prepend(createImg("images\\otkritie1.jpg"));
    historyWrapperSize = historyImgSize;
    for (let i = 2; historyWrapperSize < screenWight && i < 5; i++){
        historyWrapperSize += historyImgSize;
        history_wrapper.prepend(createImg("images\\otkritie" + i + ".jpg"));
    }
    history_wrapper.style.marginLeft = (-1 * (historyWrapperSize - screenWight)) + "px";

    let diplom_wrapper = documentSite.querySelector(".diplom_wrapper");
    diplom_wrapper.prepend(createImg("images\\diplom1.jpg", false));
    diplomWrapperSize = diplomImgSize;
    for (let i = 2; diplomWrapperSize < screenWight && i < 6; i++){
        diplomWrapperSize += diplomImgSize;
        diplom_wrapper.prepend(createImg("images\\diplom" + i + ".jpg", false));
    }

    diplom_wrapper.style.marginLeft = (-1 * (diplomWrapperSize - screenWight)) + "px";
}

function createImg(src, history = true) {
    let img = documentSite.createElement("img");
    img.setAttribute("src", src);
    img.setAttribute("name", "img");
    if(history) {
        img.style.height = "1199px";
        img.style.width = "auto";
        img.setAttribute("class", "img_history");
    }else{
        img.setAttribute("class", "img_diplom");
    }
    img.style.verticalAlign = "bottom";
    return img;
}

function onClickBurger(){
    documentSite.getElementById("burgerId").classList.toggle("click");
    documentSite.getElementById("menuId").classList.toggle("click");
}

let timeOut;
function goUp() {
    let top = Math.max(document.body.scrollTop,document.documentElement.scrollTop);
    if(top > 0) {
        window.scrollBy(0,-100);
        timeOut = setTimeout('goUp()',5);
    } else clearTimeout(timeOut);
}
let lastScroll = 0;
let goUpButton;
let visible = false;
function customScroll(scrollBlock = documentSite.querySelector(".scroll_block"), content = documentSite.querySelector("body"), blockEvent = null, screen = screenHeight) {
    if (page !== "panel") {
        goUpButton = documentSite.querySelector(".goUP");
        goUpButton.onclick = () => {
            goUp();
        };
    }
    content.onload = () => {
        loadPage = true;
        scrollBlock.style.top = (window.pageYOffset / getFullHeight(content) * (screenSize + (screenSize * screen / (getFullHeight(content) - screen)) )) + "px";
        if(screen >= getFullHeight(content)){
            scrollBlock.style.opacity  = "0";
        }else{
            scrollBlock.style.opacity  = "1";
        }
    }
    if(screen >= getFullHeight(content)){
        scrollBlock.style.opacity  = "0";
    }else{
        scrollBlock.style.opacity  = "1";
        scrollBlock.style.height = getFullHeight(content)/30 + "px";
    }

    let screenSize = screen - scrollBlock.offsetHeight;
    if(blockEvent === null)
        documentSite.addEventListener("scroll", () => {
            scrollBlock.style.top = (window.pageYOffset / getFullHeight(content) * (screenSize + (screenSize * screen / (getFullHeight(content) - screen)) )) + "px";
            if(window.pageYOffset - lastScroll < 0 && window.pageYOffset !== 0){
                goUpButton.classList.add("anim");
                visible = true;
            }else if(visible){
                goUpButton.classList.remove("anim");
                visible = false;
            }
            lastScroll = window.pageYOffset;
        });
    else {
        scrollBlock.style.top = (blockEvent.scrollTop / getFullHeight(content) * (screenSize + (screenSize * screen / (getFullHeight(content) - screen)) )) + "px";
        blockEvent.addEventListener("scroll", () => {
            scrollBlock.style.top = (blockEvent.scrollTop / getFullHeight(content) * (screenSize + (screenSize * screen / (getFullHeight(content) - screen)))) + "px";
        });
    }
    setScroll(scrollBlock, content, blockEvent);
}

function getFullHeight(elm) {
    let elmMargin;
    if(document.all) {// IE
        elmMargin = parseInt(elm.currentStyle.marginTop, 10) + parseInt(elm.currentStyle.marginBottom, 10);
    } else {// Mozilla
        elmMargin = parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-top')) + parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-bottom'));
    }
    if(isNaN(elmMargin))
        return (elm.offsetHeight);
    else
        return (elm.offsetHeight + elmMargin);
}

function setScroll(scrollBlock, content, blockEvent) {
    let newPos = 0, lastPos = 0;
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            scrollBlock.ontouchstart = onScrollSet;
        } else {
            scrollBlock.onmousedown = onScrollSet;
        }
        scrollBlock.onselectstart = () => {return false;};
    function onScrollSet(e) {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            lastPos = e.touches[0].clientY;
            document.ontouchend = stopScroll;
            document.ontouchmove = moveScroll;
        } else {
            lastPos = e.clientY;
            document.onmouseup = stopScroll;
            document.onmousemove = moveScroll;
        }
        return false;
    }

    function moveScroll(e) {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            newPos = lastPos - e.touches[0].clientY;
            lastPos = e.touches[0].clientY;
        } else {
            newPos = lastPos - e.clientY;
            lastPos = e.clientY;
        }
        if(scrollBlock.offsetTop - newPos >= 0 && scrollBlock.offsetTop - newPos <= Math.ceil(screenHeight - scrollBlock.offsetHeight)) {
            if(blockEvent === null)
                window.scrollBy(0, -newPos / screenHeight *  getFullHeight(content));
            else
                blockEvent.scrollBy(0, -newPos / screenHeight *  getFullHeight(content))
        }
    }

    function stopScroll() {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            document.ontouchend = null;
            document.ontouchmove = null;
        } else {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}