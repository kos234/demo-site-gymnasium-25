function actions(params, flag = true){
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open("POST",  "actions");
        if (flag) {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.response = "json";
        }

        xhr.onload = () => {
            if(xhr.status >= 400)
                reject(xhr.response);
            else
                resolve(xhr.response);
        }

        xhr.onerror = () => {
            reject(xhr.response);
        }
        xhr.send(params);
    });
}

function onAccount() {
    documentSite.querySelectorAll(".delete").forEach(element => {
        element.onclick = e => {
            actions("type=account&action=delete&login=" + e.target.parentNode.parentNode.parentNode.querySelector(".account_name").innerText).then(response => {
                if (response !== "" && response !== " "){
                    console.log(response);
                 alert(response);
                }else{
                    documentSite.querySelector(".mainList").removeChild(e.target.parentNode.parentNode.parentNode);
                }
            });
        };
    });

    documentSite.querySelectorAll(".edit").forEach(element => {
        element.onclick = e => {
            actions("type=account&action=getdata&login=" + e.target.parentNode.parentNode.parentNode.querySelector(".account_name").innerText).then(response => {
                response = JSON.parse(response);
                if (typeof response.login === "undefined") {
                    console.log(response);
                    alert(response);
                }else{
                    createAccountLayout(false, response);
                }
            });
        };
    });


    try {
        documentSite.getElementById("createNewAccount").onclick = ev => {
            createAccountLayout();
        };
    }catch (e) {

    }
}

function onSections() {

}

function createAccountLayout(isCreate = true, data = {}) {
    let mainWrapper = documentSite.querySelector(".wrapper_dialog_vertical");
    mainWrapper.classList.add("active");
    mainWrapper.style.animation = "opacityDialogOn 0.2s linear forwards";
    mainWrapper.style.top = window.pageYOffset + "px";
    let form = documentSite.createElement("form"),
        labelName = documentSite.createElement("label"), labelPassword = documentSite.createElement("label");
    let inputName = documentSite.createElement("input"), inputPassword = documentSite.createElement("input"),
        div_vertical_radio = documentSite.createElement("div"),
        div_horizontal = documentSite.createElement("div");
    labelName.setAttribute("class", "authText font");
    labelName.appendChild(documentSite.createTextNode("Логин"));
    labelPassword.setAttribute("class", "authText font");
    labelPassword.appendChild(documentSite.createTextNode("Пароль"));
    inputName.setAttribute("id", "login");
    inputName.setAttribute("class", "inputForm font");
    inputName.setAttribute("type", "text");
    inputName.setAttribute("name", "login");
    if(!isCreate)
        inputName.setAttribute("value", data.login);
    inputPassword.setAttribute("id", "password");
    inputPassword.setAttribute("class", "inputForm font");
    inputPassword.setAttribute("type", "text");
    inputPassword.setAttribute("name", "password");
    if(!isCreate)
        inputPassword.setAttribute("placeholder", "Оставьте пустым, если не хотите менять пароль");
    form.setAttribute("action", "");
    form.setAttribute("name", "createAccount");
    form.setAttribute("method", "post");
    div_vertical_radio.setAttribute("class", "vertical_radio");
    div_horizontal.setAttribute("class", "horizontal_radio");
    form.appendChild(labelName);
    form.appendChild(inputName);
    form.appendChild(labelPassword);
    form.appendChild(inputPassword);
    let labelPasswordVerf, inputPasswordVerf;
    if(!isCreate){
        if(data.confirmation){
            labelPasswordVerf = documentSite.createElement("label");
            inputPasswordVerf = documentSite.createElement("input");
            labelPasswordVerf.setAttribute("class", "authText font");
            labelPasswordVerf.appendChild(documentSite.createTextNode("Пароль от вашего аккаунта"));
            inputPasswordVerf.setAttribute("id", "password");
            inputPasswordVerf.setAttribute("class", "inputForm font");
            inputPasswordVerf.setAttribute("type", "text");
            inputPasswordVerf.setAttribute("name", "password");
            form.appendChild(labelPasswordVerf);
            form.appendChild(inputPasswordVerf);
        }
    }

    let wrapperScroll = documentSite.createElement("div");
    wrapperScroll.setAttribute("class", "wrapperScroll");
    wrapperScroll.innerHTML = "<div class=\"custom_scroll wrapper\"> <div class=\"scroll_block\"></div> </div>";
    let scrollBlock = wrapperScroll.querySelector(".scroll_block");
    let accessList = documentSite.createElement("ul");
    let onList = true
    if(!isCreate) {
        onList = !data.confirmation;
    }
    if(onList) {
        accessList.setAttribute("class", "mainList access");
        setTimeout(() => {
            customScroll(scrollBlock, wrapperScroll, accessList, wrapperScroll.offsetHeight);
            //Скролл не адаптирован под область которая по высоте равна блоку
        }, 1000);

        actions("type=list").then(response => {
            let accessCheck = [[""]];
            if (!isCreate) {
                accessCheck = data.access.split(",");
                for (let i = 0; i < accessCheck.length; i++) {
                    accessCheck[i] = accessCheck[i].split(":");
                }
            }

            function getAccess(accessCheck, access) {
                let map = new Map([]);
                if (accessCheck[0][0] === "all") {
                    map.set("create", true);
                    map.set("edit", true);
                    map.set("delete", true);
                } else for (let i = 0; i < accessCheck.length; i++) {
                    if (accessCheck[i][0].indexOf(access) !== -1) {
                        for (let l = 1; l < accessCheck[i].length; l++) {
                            map.set(accessCheck[i][l], true);
                        }
                    }
                }
                return map;
            }

            function generate(responseJson) {
                for (let i = 0; i < responseJson.length; i++) {
                    let json = responseJson[i];
                    if (typeof responseJson[i].items === "undefined") {
                        let accessMap = getAccess(accessCheck, json.src);
                        let html = "<li><span><span class='titleList'>" + json.title + "</span> <span class='srcList'>" + json.src + "</span></span> <div class='accessWrapper'>";
                        json.access.forEach(item => {
                            html += "<div datatype='" + item.name + "' datasrc='" + json.src + "' class='wrapperRadioAccess' > <span>" + item.title + "</span> <div class='vertical_radio'><div class='horizontal_radio'>" + (typeof accessMap.get(item.name) === "undefined" ? "<div class='radio'>" : "<div class='radio active'>") + "</div></div></div> </div>";
                        })
                        html += "</div></li>";
                        accessList.innerHTML += html;
                    } else {
                        generate(json.items);
                    }
                }
            }

            response = JSON.parse(response);
            accessList.innerHTML += "<li><div id='all' class='wrapperRadioAccess all'> <span class='accessAll'>Полный доступ</span> <div class='vertical_radio'><div class='horizontal_radio'>" + (accessCheck[0][0] === "all" ? "<div class='radio active'>" : "<div class='radio'>") + "</div></div></div> </div></li>";
            generate(response);

            accessList.querySelectorAll(".wrapperRadioAccess").forEach(e => {
                e.onclick = () => {
                    e.querySelector(".radio").classList.toggle("active");
                };
            });
            accessList.querySelector(".wrapperRadioAccess.all").onclick = ev => {
                if (ev.target.classList.contains("active")) {
                    accessList.querySelectorAll(".wrapperRadioAccess").forEach(e => {
                        e.querySelector(".radio").classList.remove("active");
                    });
                } else {
                    accessList.querySelectorAll(".wrapperRadioAccess").forEach(e => {
                        let item = e.querySelector(".radio");
                        if (!item.classList.contains("active"))
                            item.classList.add("active");
                    });
                }
            };
        });

        let titleAccess = documentSite.createElement("div");
        titleAccess.setAttribute("class", "titleAccess");
        titleAccess.appendChild(documentSite.createTextNode("Разрешения:"));
        form.appendChild(titleAccess);
    }
    wrapperScroll.appendChild(accessList);
    form.appendChild(wrapperScroll);

    let dialog = documentSite.querySelector(".dialog"), title = documentSite.createElement("div");
    title.setAttribute("class", "title_dialog");
    title.appendChild(documentSite.createTextNode("Создание нового аккаунта"));

    let buttonYes = documentSite.createElement("div"), buttonNo = documentSite.createElement("div"),
        wrapperButton = documentSite.createElement("div");
    buttonNo.setAttribute("class", "dialog_buttons");
    buttonNo.appendChild(documentSite.createTextNode("Отмена"));
    buttonNo.onclick = click => {
        mainWrapper.classList.remove("active");
        mainWrapper.style.animation = "opacityDialogOff 0.2s linear forwards";
    }
    buttonYes.setAttribute("class", "dialog_buttons");
    buttonYes.appendChild(documentSite.createTextNode("Создать"));
    buttonYes.onclick = ev1 => {
        inputName.style.border = "2px solid lightblue";
        inputPassword.style.border = "2px solid lightblue";
        accessList.style.border = "none";
        error.innerHTML = "";
        if (inputName.value === "" || inputName.value === " ") {
            inputName.style.border = "2px solid red";
            error.innerHTML = "Вы не ввели логин";
        } else if ((inputPassword.value === "" || inputPassword.value === " ") && isCreate) {
            inputPassword.style.border = "2px solid red";
            error.innerHTML = "Вы не ввели пароль";
        } else if (inputName.value.length > 255) {
            inputName.style.border = "2px solid red";
            error.innerHTML = "Длина логина должна быть меньше 255 символов";
        } else if (inputPassword.value.length > 255) {
            inputPassword.style.border = "2px solid red";
            error.innerHTML = "Длина логина должна быть меньше 255 символов";
        } else {
            //нет ошибки
            let access = [];
            if(accessList.querySelector(".wrapperRadioAccess.all").querySelector(".radio").classList.contains("active"))
                access = ["all"];
            else
            accessList.querySelectorAll(".radio.active").forEach(ev1 => {
                let item = ev1.parentNode.parentNode.parentNode, unWrite = true;
                for (let i = 0; i < access.length; i++) {
                    if (access[i].indexOf(item.getAttribute("datasrc")) >= 0) {
                        access[i] += ":" + ev1.parentNode.parentNode.parentNode.getAttribute("datatype");
                        unWrite = false;
                        break;
                    }
                }

                if (unWrite) {
                    access.push(item.getAttribute("datasrc") + ":" + item.getAttribute("datatype"));
                }
            });

            if(isCreate) {
                actions("type=account&action=create&login=" + inputName.value + "&password=" + inputPassword.value + "&passwordVerf=" + (data.confirmation ? inputPasswordVerf.innerText : "none") + "&access=" + access.join()).then(responseCreate => {
                    if (responseCreate !== " " && responseCreate !== "") {
                        responseCreate = JSON.parse(responseCreate);
                        switch (responseCreate.errorId) {
                            case 1:
                            case 4:
                                inputName.style.border = "2px solid red";
                                break;
                            case 2:
                                inputPassword.style.border = "2px solid red";
                                break;
                            case 3:
                                accessList.style.border = "2px solid red";
                                break;
                            case 9:
                                inputPasswordVerf.style.border = "2px solid red";
                                break;
                        }
                        inputPassword.style.border = "2px solid red";
                        error.innerHTML = responseCreate.errorMessage;
                    } else {
                        mainWrapper.classList.remove("active");
                        mainWrapper.style.animation = "opacityDialogOff 0.2s linear forwards";
                        let list = documentSite.querySelector(".mainList");
                        let copyItem = list.querySelector("li").cloneNode(true);
                        copyItem.querySelector(".account_name").innerHTML = inputName.value;
                        list.appendChild(copyItem);
                    }
                });
            }else{
                actions("type=account&action=edit&loginlast="+ data.login +"&login=" + inputName.value + "&password=" + inputPassword.value + "&access=" + access.join()).then(responseCreate => {
                    if (responseCreate !== " " && responseCreate !== "") {
                        responseCreate = JSON.parse(responseCreate);
                        switch (responseCreate.errorId) {
                            case 1:
                            case 4:
                                inputName.style.border = "2px solid red";
                                break;
                            case 2:
                                inputPassword.style.border = "2px solid red";
                                break;
                            case 3:
                                accessList.style.border = "2px solid red";
                                break;
                        }
                        inputPassword.style.border = "2px solid red";
                        error.innerHTML = responseCreate.errorMessage;
                    } else {
                        mainWrapper.classList.remove("active");
                        mainWrapper.style.animation = "opacityDialogOff 0.2s linear forwards";
                    }
                });
            }
        }
        error.style.top = (-error.offsetHeight -50) + "px";
    }
    wrapperButton.setAttribute("class", "dialog_wrapper_button");
    wrapperButton.appendChild(buttonNo);
    wrapperButton.appendChild(buttonYes);
    dialog.innerHTML = "";
    dialog.appendChild(title);
    dialog.appendChild(form);
    dialog.appendChild(wrapperButton);
    mainWrapper.querySelector(".closeImg").onclick = () => {
        if(confirm("Вы действительно хотите закрыть окно?")){
            mainWrapper.classList.remove("active");
            mainWrapper.style.animation = "opacityDialogOff 0.2s linear forwards";
        }
    }

    let error = documentSite.createElement("div");
    error.setAttribute("class", "error");
    dialog.appendChild(error);
}

function editPage() {
    function saveContent(innerContent, doc){
        innerContent.innerHTML = doc.documentElement.outerHTML.replace(/<!--\?(php.*)\?-->/mg, "<?$1?>").replace(/[\r\n]{3,}/g, "\r\n\r\n");
        if (!/\A&lt;!DOCTYPE HTML&gt;/mi.test(innerContent.innerHTML)){
            innerContent.innerHTML = "&lt;!DOCTYPE HTML&gt;\r\n" + innerContent.innerHTML;
        }
        // let execCode = null;
        // while ((execCode = /^((.*?)&lt;(.).+?&gt;)[^a-z0-9-_а-я\n\r]*?(&lt;(.).*)$/m.exec(innerContent.innerHTML)) !== null){
        //     if(!(execCode[3] !== "/" && execCode[5] === "/")) {
        //         innerContent.innerHTML = innerContent.innerHTML.replace(/^((.*?)&lt;(.).+?&gt;)[^a-z0-9-_а-я\n\r]*?(&lt;(.).*)$/m, execCode[1] + ">\n<" + execCode[2] + (execCode[3] !== "/" ? "\t" : "") + execCode[4]);
        //     }
        // }
    }

    documentSite.querySelector(".wrapper_head_text_item").innerHTML = documentSite.querySelector(".titlePage").innerHTML;
    let lastBlock = "constructor";
    documentSite.getElementById(lastBlock + "_title").style.backgroundColor = "#3868de";
    documentSite.querySelectorAll(".soursFile_title").forEach(e => {
       e.onclick = (click) => {
           let title = click.target.innerText;
           let newBlock
           if(title === "Конструктор"){
               newBlock = "constructor";
           }else newBlock = title;
           if(lastBlock !== newBlock){
               let newBlockHTML = documentSite.getElementById(newBlock);
               newBlockHTML.style.position = "relative";
               newBlockHTML.style.display = "block";
               newBlockHTML.querySelectorAll(".inputEditPage").forEach(e => {
                   e.style.height = e.scrollHeight + "px";
               });
               setTimeout(() => {
                   newBlockHTML.style.opacity = "1";
               }, 1);
               let lastBlockHTML = documentSite.getElementById(lastBlock);
               lastBlockHTML.style.opacity = "0";
               lastBlockHTML.style.position = "absolute";
               lastBlockHTML.style.top = "0";
               setTimeout(() => {
                   lastBlockHTML.style.display = "none";
               }, 200);
               click.target.style.backgroundColor = "#3868de";
               documentSite.getElementById(lastBlock + "_title").style.backgroundColor = "";
               lastBlock = newBlock;
           }
        }
    });
    documentSite.querySelectorAll(".edit_page_content").forEach(el => {
        el.onclick = () => {
            editContent([el]);
        };
    });

    documentSite.querySelectorAll(".list_constructor").forEach(e => {
        setScroll(e.parentNode);
    });

    let urlInput = documentSite.querySelector(".changeUrlPage .borderInput");
    urlInput.oninput = () => {
        if(urlInput.innerHTML.substring(0, 1) === "/"){
            urlInput.innerHTML = urlInput.innerHTML.substring(1);
        }
    }

    let loadFiles = new Map();
    documentSite.querySelectorAll(".title_soursFile_content").forEach(e => {
        let child = Array.from(e.parentNode.children);
       loadFiles.set(e.textContent, child[child.indexOf(e) + 1].value);
    });

    documentSite.querySelectorAll(".borderInput").forEach(el => setInputNotPaste(el));

    function setInputNotPaste(input) {
        input.onpaste = (e) => {
            console.log("paste");
            let clipboardData, pastedData;
            e.stopPropagation();
            e.preventDefault();

            clipboardData = e.clipboardData || window.clipboardData;
            pastedData = clipboardData.getData('Text');
            let ranges = getSelection().getRangeAt(0);
            if(input.innerHTML === "" || input.innerHTML === " "){
                input.innerHTML = pastedData;
            }else
            if(ranges.startContainer === ranges.endContainer){
                ranges.startContainer.parentNode.innerHTML = ranges.startContainer.parentNode.innerHTML.substring(0, ranges.startOffset) + pastedData + ranges.startContainer.parentNode.innerHTML.substring(ranges.endOffset + 1);
            }else{
                ranges.startContainer.parentNode.innerHTML = ranges.startContainer.parentNode.innerHTML.substring(0, ranges.startOffset) + pastedData;
                ranges.endContainer.parentNode.innerHTML = ranges.endContainer.parentNode.innerHTML.substring(ranges.endOffset + 1);
            }
        }
    }

    documentSite.querySelector(".save_page").onclick = () => {
        if(confirm("Вы действительно хотите сохранить изменения?")){
            let uploadString = [];
            let newUrl = documentSite.querySelector(".changeUrlPage .borderInput").textContent;
            let page = documentSite.querySelector("#HTML > .title_soursFile_content").textContent;

            documentSite.querySelectorAll(".title_soursFile_content").forEach(e => {
                let child = Array.from(e.parentNode.children);
                let contentCode = child[child.indexOf(e) + 1].value;
                if(loadFiles.get(e.textContent) !== contentCode) {
                    uploadString.push(e.textContent + "=" + contentCode);
                    loadFiles.set(e.textContent, contentCode);
                }
                if(uploadString.length === 0 && newUrl !== page){
                    uploadString.push(page + "=" + documentSite.querySelector("#HTML > .inputEditPage").textContent);
                }
            });
            console.log(newUrl);
            console.log(uploadString);
            actions("type=savePage&page="+ page +"&newUrl=/" + newUrl + "&" + uploadString.join("&")).then(response => {
               console.log(response);
            });
        }
    }

    function editContent(arrayEvents, isNotSkipSave = false) {
        let e = arrayEvents[0];
        let type = e.getAttribute("data-type");
        let mainWrapper = documentSite.querySelector(".wrapper_dialog_vertical");
        let dialog = documentSite.querySelector(".dialog"),title = documentSite.createElement("div");
        title.appendChild(documentSite.createTextNode(e.parentNode.querySelector(".list_constructor").textContent));
        title.setAttribute("class", "title_dialog");
        let content = documentSite.createElement("div");
        if(/\btext_node\b/.test(type)){
            title.innerHTML = e.parentNode.parentNode.parentNode.querySelector(".list_constructor").innerText;
            let carriage = [content];
            let selectBlocks = null;
            let lastContentsUndo = [];
            let lastContentsRedo = [];
            let wrapperTools = documentSite.createElement("div"), wrapperText = documentSite.createElement("div"), bold = documentSite.createElement("div"), italic = documentSite.createElement("div"), lineThrough = documentSite.createElement("div"), overLine = documentSite.createElement("div"), underLine = documentSite.createElement("div"), link = documentSite.createElement("div"), colorFont = documentSite.createElement("div"), colorBackground = documentSite.createElement("div"), centerAlign = documentSite.createElement("img"), rightAlign = documentSite.createElement("img"), leftAlign = documentSite.createElement("img");
            let buttonRedo = documentSite.createElement("img"), buttonUndo = documentSite.createElement("img");
            wrapperText.setAttribute("class", "wrapper_text_edit");
            buttonRedo.setAttribute("class", "text_tools undo");
            buttonRedo.setAttribute("src", "images/redo.svg");
            buttonRedo.style.opacity = "0.5";
            buttonRedo.onclick = () => {
                if(lastContentsRedo.length !== 0){
                    if(lastContentsUndo.length === 0)
                        buttonUndo.style.opacity = "1";
                    lastContentsUndo.push(wrapperText.innerHTML);
                    wrapperText.innerHTML = lastContentsRedo[lastContentsRedo.length - 1];
                    if(lastContentsRedo.length - 1 === 0)
                        buttonRedo.style.opacity = "0.5";
                    lastContentsRedo.splice(lastContentsRedo.length - 1, 1);
                }
            }
            buttonUndo.setAttribute("src", "images/undo.svg");
            buttonUndo.style.opacity = "0.5";
            buttonUndo.setAttribute("class", "text_tools undo");
            buttonUndo.onclick = () => {
                if(lastContentsUndo.length !== 0){
                    if(lastContentsRedo.length === 0)
                        buttonRedo.style.opacity = "1";
                    lastContentsRedo.push(wrapperText.innerHTML);
                    wrapperText.innerHTML = lastContentsUndo[lastContentsUndo.length - 1];
                    if(lastContentsUndo.length - 1 === 0)
                        buttonUndo.style.opacity = "0.5";
                    lastContentsUndo.splice(lastContentsUndo.length - 1, 1);
                }
            }
            wrapperTools.setAttribute("class", "wrapper_tools_text");
            bold.setAttribute("class", "text_tools");
            bold.style.fontWeight = "bold";
            bold.appendChild(documentSite.createTextNode("Жирный"));
            bold.onclick = () => {
                setDecorText(bold, "bold");
            }
            italic.setAttribute("class", "text_tools");
            italic.appendChild(documentSite.createTextNode("Курсив"));
            italic.style.fontStyle = "italic";
            italic.onclick = () => {
                setDecorText(italic, "italic");
            }
            lineThrough.setAttribute("class", "text_tools");
            lineThrough.appendChild(documentSite.createTextNode("Зачеркнутый"));
            lineThrough.style.textDecoration = "line-through";
            lineThrough.onclick = () => {
                setDecorText(lineThrough, "line-through");
            }
            overLine.setAttribute("class", "text_tools");
            overLine.appendChild(documentSite.createTextNode("Надчеркнутый"));
            overLine.style.textDecoration = "overline";
            overLine.onclick = () => {
                setDecorText(overLine, "overline");
            }
            underLine.setAttribute("class", "text_tools");
            underLine.appendChild(documentSite.createTextNode("Подчеркнутый"));
            underLine.style.textDecoration = "underLine";
            underLine.onclick = () => {
                setDecorText(underLine, "underLine");
            }

            link.setAttribute("class", "text_tools");
            link.appendChild(documentSite.createTextNode("Ссылка"));
            link.onclick = () => {
                setDecorText(link, "link");
            }

            colorFont.setAttribute("class", "text_tools");
            colorFont.appendChild(documentSite.createTextNode("A"));
            colorFont.style.color = "red";
            colorFont.onclick = () => {
                setDecorText(colorFont, "color");
            }

            colorBackground.setAttribute("class", "text_tools");
            colorBackground.appendChild(documentSite.createTextNode("A"));
            colorBackground.style.backgroundColor = "red";
            colorBackground.style.color = "white";
            colorBackground.onclick = () => {
                setDecorText(colorBackground, "colorBackground");
            }

            centerAlign.setAttribute("class", "text_tools img");
            centerAlign.setAttribute("src", "images/centerAlign.svg");
            centerAlign.onclick = () => {
                setDecorText(centerAlign, "centerAlign");
            }
            leftAlign.setAttribute("class", "text_tools img");
            leftAlign.setAttribute("src", "images/leftAlign.svg");
            leftAlign.onclick = () => {
                setDecorText(leftAlign, "leftAlign");
            }
            rightAlign.setAttribute("class", "text_tools img");
            rightAlign.setAttribute("src", "images/rightAlign.svg");
            rightAlign.onclick = () => {
                setDecorText(rightAlign, "rightAlign");
            }
            content.style.cursor = "pointer";
            wrapperText.onclick = (e) => {
                carriage = [e.target];
                if (wrapperText.firstChild !== null) {
                    if (carriage[0] === wrapperText) {
                        if (wrapperText.firstChild.nodeName === "#text") {
                            wrapperText.innerHTML = "<div>" + wrapperText.innerHTML + "</div>";
                        }
                        carriage = [wrapperText.firstChild];
                    }
                    reloadTools(carriage);
                }
            }

            document.onclick = () => {
                selectBlocks = window.getSelection().getRangeAt(0);
            }

            wrapperText.oninput = () => {
                if(wrapperText.firstChild !== null){
                    if(wrapperText.firstChild.nodeName === "#text"){
                        wrapperText.innerHTML = "<div>" + wrapperText.innerHTML + "</div>";
                        let range = document.createRange();
                        let sel = window.getSelection();
                        range.setStart(wrapperText.firstChild, 1);
                        range.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(range);
                        wrapperText.focus();
                    }
                }
            }

            wrapperText.onpaste = (e) => {
                let clipboardData, pastedData;
                e.stopPropagation();
                e.preventDefault();

                clipboardData = e.clipboardData || window.clipboardData;
                pastedData = clipboardData.getData('Text');
                let ranges = getSelection().getRangeAt(0);
                if(wrapperText.innerHTML === "" || wrapperText.innerHTML === " "){
                    wrapperText.innerHTML = pastedData;
                }else
                    if(ranges.startContainer === ranges.endContainer){
                        ranges.startContainer.parentNode.innerHTML = ranges.startContainer.parentNode.innerHTML.substring(0, ranges.startOffset) + pastedData + ranges.startContainer.parentNode.innerHTML.substring(ranges.endContainer + 1);
                    }else{
                        ranges.startContainer.parentNode.innerHTML = ranges.startContainer.parentNode.innerHTML.substring(0, ranges.startOffset) + pastedData;
                        ranges.endContainer.parentNode.innerHTML = ranges.endContainer.parentNode.innerHTML.substring(ranges.endOffset + 1);
                    }
            }


            function reloadTools(target) {
                target = target[0]
                let style = target.style.cssText;
                if(/font-size/.test(style))
                    inputLocal.innerText = target.style.fontSize.replace(/em/, "");
                else
                    inputLocal.innerText = "1";
                if(/font-weight\s*:\s*bold/.test(style)){
                    bold.className += " active_tools";
                }else{
                    bold.classList.remove("active_tools");
                }
                if(/font-style\s*:\s*italic/.test(style)){
                    italic.className += " active_tools";
                }else{
                    italic.classList.remove("active_tools");
                }
                if(/text-decoration\s*:\s*line-through/.test(style)){
                    lineThrough.className += " active_tools";
                }else{
                    lineThrough.classList.remove("active_tools");
                }
                if(/text-decoration\s*:\s*overline/.test(style)){
                    overLine.className += " active_tools";
                }else{
                    overLine.classList.remove("active_tools");
                }
                if(/text-decoration\s*:\s*underline/.test(style)){
                    underLine.className += " active_tools";
                }else{
                    underLine.classList.remove("active_tools");
                }

                if(/display\s*:\s*block/.test(style)){
                    leftAlign.setAttribute("src", "images/leftAlign.svg");
                    leftAlign.classList.remove("active_tools");
                    if(/text-align\s*:\s*center/.test(style)){
                        centerAlign.setAttribute("src", "images/centerAlignActive.svg");
                        centerAlign.className += " active_tools";
                    }else{
                        centerAlign.setAttribute("src", "images/centerAlign.svg");
                        centerAlign.classList.remove("active_tools");
                    }
                    if(/text-align\s*:\s*right/.test(style)){
                        rightAlign.setAttribute("src", "images/leftAlignActive.svg");
                        rightAlign.className += " active_tools";
                    }else{
                        rightAlign.setAttribute("src", "images/leftAlign.svg");
                        rightAlign.classList.remove("active_tools");
                    }
                }else{
                    centerAlign.setAttribute("src", "images/centerAlign.svg");
                    centerAlign.classList.remove("active_tools");
                    rightAlign.setAttribute("src", "images/leftAlign.svg");
                    rightAlign.classList.remove("active_tools");
                    leftAlign.setAttribute("src", "images/leftAlignActive.svg");
                    leftAlign.className += " active_tools";
                }
            }
            function setDecorText(tool, toolName){
                if(lastContentsUndo.length === 0)
                    buttonUndo.style.opacity = "1";
                lastContentsUndo.push(wrapperText.innerHTML);
                let isInsert;
                if(toolName !== "font-size") {
                    isInsert = !/active_tools/.test(tool.className);
                    if (isInsert) {
                        tool.className += " active_tools";
                    } else {
                        tool.classList.remove("active_tools");
                    }
                }
                let contentInsertRemove = "";
                if(selectBlocks !== null)
                if(selectBlocks.toString() !== " " && selectBlocks.toString() !== ""){
                    let firstBlock = selectBlocks.startContainer;
                    let lastBlock = selectBlocks.endContainer;
                    if(firstBlock.parentNode === lastBlock.parentNode){
                        if(toolName === "font-size") {
                            let textParentBlock = firstBlock.parentNode.style.fontSize;
                            if(textParentBlock !== "")
                                tool = tool - /^.*\.[^em]{0,2}/.exec(textParentBlock)[0] + 1;
                        }
                        if(firstBlock.data === lastBlock.data){
                            if(firstBlock.data === selectBlocks.toString())
                                carriage = [firstBlock.parentNode];
                            else{
                                wrapperText.innerHTML = wrapperText.innerHTML.replace(new RegExp(selectBlocks.toString()), "<span class='temp_query_tools_text'>" + selectBlocks.toString() + "</span>")
                                carriage = [wrapperText.querySelector(".temp_query_tools_text")];
                                carriage.forEach(e => {e.removeAttribute("class")});
                            }
                        }else{
                            if(new RegExp("(" + new RegExp(".{" + selectBlocks.startOffset + "}(.*)").exec(firstBlock.data)[1] + ".*" + new RegExp("(.{" + selectBlocks.endOffset + "})").exec(lastBlock.data)[1] + ")").exec(wrapperText.innerHTML)[0] === firstBlock.parentNode.innerHTML){
                                carriage = [firstBlock.parentNode];
                            }else{
                                wrapperText.innerHTML = wrapperText.innerHTML.replace(new RegExp("(" + new RegExp(".{" + selectBlocks.startOffset + "}(.*)").exec(firstBlock.data)[1] + ".*" + new RegExp("(.{" + selectBlocks.endOffset + "})").exec(lastBlock.data)[1] + ")"), "<span class='temp_query_tools_text'>$1</span>")
                                carriage = [wrapperText.querySelector(".temp_query_tools_text")];
                                carriage.forEach(e => {e.removeAttribute("class")});
                            }
                        }
                    }else{
                        if (Array.from(lastBlock.parentNode.children).indexOf(firstBlock.parentNode) !== -1){
                            if(toolName === "font-size")
                                tool = tool -  /^.*\.[^em]{0,2}/.exec(lastBlock.parentNode.style.fontSize)[0] + 1;
                            if(selectBlocks.startOffset === 0){
                                let content = new RegExp("(" + firstBlock.parentNode.outerHTML + ".*" + new RegExp("^(.){" + selectBlocks.endOffset + "}").exec(lastBlock.data)[0] + ")").exec(wrapperText.innerHTML);
                                if(content[1] === lastBlock.parentNode.innerHTML)
                                    carriage = [lastBlock.parentNode];
                                else {
                                    wrapperText.innerHTML = wrapperText.innerHTML.replace(new RegExp(content[1]), "<span class='temp_query_tools_text'>"+ content[1] +"</span>");
                                    carriage = [wrapperText.querySelector(".temp_query_tools_text")];
                                    carriage.forEach(e => {e.removeAttribute("class")});
                                }
                            }
                        }else if(Array.from(firstBlock.parentNode.children).indexOf(lastBlock.parentNode) !== -1){
                            if(toolName === "font-size")
                                tool = tool -  /^.*\.[^em]{0,2}/.exec(firstBlock.parentNode.style.fontSize)[0] + 1;
                            if(selectBlocks.endOffset === lastBlock.data.length){
                                let content = new RegExp("(" + new RegExp("^.{" + selectBlocks.startOffset + "}(.*)").exec(firstBlock.data)[1] + ".*" + lastBlock.parentNode.outerHTML + ")").exec(wrapperText.innerHTML);
                                if(content[1] === firstBlock.parentNode.innerHTML){
                                    carriage = [firstBlock.parentNode];
                                }else {
                                    wrapperText.innerHTML = wrapperText.innerHTML.replace(new RegExp(content[1]), "<span class='temp_query_tools_text'>" + content[1] + "</span>");
                                    carriage = [wrapperText.querySelector(".temp_query_tools_text")];
                                    carriage.forEach(e => {e.removeAttribute("class")});
                                }
                            }
                        }else{
                            if(selectBlocks.startOffset === 0 && selectBlocks.endOffset === lastBlock.data.length){
                                let content = new RegExp("(" + firstBlock.parentNode.outerHTML + ".*" + lastBlock.parentNode.outerHTML + ")").exec(wrapperText.innerHTML);
                                if(toolName === "font-size")
                                    tool = tool -  /^.*\.[^em]{0,2}/.exec(firstBlock.parentNode.parentNode.style.fontSize)[0] + 1;
                                if(firstBlock.parentNode.parentNode === lastBlock.parentNode.parentNode && content[1] === firstBlock.parentNode.parentNode.innerHTML){
                                    if(firstBlock.parentNode.parentNode === wrapperText){
                                        let childTemp = Array.from(firstBlock.parentNode.parentNode.children);
                                        carriage = [];
                                        for(let i = childTemp.indexOf(firstBlock.parentNode); i <= childTemp.indexOf(lastBlock.parentNode); i++){
                                            carriage.push(childTemp[i])
                                        }
                                    }else
                                        carriage = [firstBlock.parentNode.parentNode];
                                }else {
                                    if (firstBlock.parentNode.parentNode.nodeName === "DIV" && lastBlock.parentNode.parentNode.nodeName === "DIV"){
                                        if(firstBlock.parentNode.parentNode === wrapperText){
                                            let childTemp = Array.from(firstBlock.parentNode.parentNode.children);
                                            carriage = [];
                                            for(let i = childTemp.indexOf(firstBlock.parentNode); i <= childTemp.indexOf(lastBlock.parentNode); i++){
                                                carriage.push(childTemp[i])
                                            }
                                        }else
                                            carriage = [firstBlock.parentNode.parentNode];
                                    }else {
                                        wrapperText.innerHTML = wrapperText.innerHTML.replace(new RegExp(content[1]), "<span class='temp_query_tools_text'>" + content[1] + "</span>");
                                        carriage = [wrapperText.querySelector(".temp_query_tools_text")];
                                        carriage.forEach(e => {
                                            e.removeAttribute("class")
                                        });
                                    }
                                }
                            }else{
                                firstBlock.parentNode.innerHTML = firstBlock.parentNode.innerHTML.replace(new RegExp(firstBlock.parentNode.innerHTML.substring(selectBlocks.startOffset)), "<span class='temp_query_tools_text'>"+ firstBlock.parentNode.innerHTML.substring(selectBlocks.startOffset) + "</span>");
                                lastBlock.parentNode.innerHTML = lastBlock.parentNode.innerHTML.replace(new RegExp(lastBlock.parentNode.innerHTML.substring(0, selectBlocks.endOffset)), "<span class='temp_query_tools_text'>"+ lastBlock.parentNode.innerHTML.substring(0, selectBlocks.endOffset) + "</span>");
                                carriage = Array.from(wrapperText.querySelectorAll(".temp_query_tools_text"));
                                carriage.forEach(e => {
                                    e.removeAttribute("class")
                                });
                            }
                        }
                    }
                }

                switch (toolName) {
                    case "bold":
                        contentInsertRemove = isInsert ? "font-weight: bold;" : ["font-weight"];
                        break;
                    case "italic":
                        contentInsertRemove = isInsert ? "font-style: italic;" : ["font-style"];
                        break;
                    case "line-through":
                        contentInsertRemove = isInsert ? "text-decoration: line-through;" : ["text-decoration"];
                        break;
                    case "overline":
                        contentInsertRemove = isInsert ? "text-decoration: overline;" : ["text-decoration"];
                        break;
                    case "underLine":
                        contentInsertRemove = isInsert ? "text-decoration: underLine;" : ["text-decoration"];
                        break;
                    case "rightAlign":
                        contentInsertRemove = isInsert ? "text-align: right; display: block;" : ["text-align", "display"];
                        break;
                    case "centerAlign":
                        contentInsertRemove = isInsert ? "text-align: center; display: block;" : ["text-align", "display"];
                        break;
                    case "leftAlign":
                        isInsert = false;
                        contentInsertRemove = ["text-align", "display"];
                        break;
                    case "font-size":
                        isInsert = true;
                        contentInsertRemove = "font-size: " + tool + "em;";
                        break;
                }
                for(let carriagePos of carriage) {
                    if (isInsert) {
                        if (new RegExp(/^(.*?):/.exec(contentInsertRemove)[1]).test(carriagePos.style.cssText)) {
                            let styleType = /^(.*?):/.exec(contentInsertRemove)[1];

                            switch (new RegExp(styleType + "\s*:\s*(.*?);").exec(carriagePos.style.cssText)[1]) {
                                case "center":
                                    centerAlign.classList.remove("active_tools");
                                    break;
                                case "right":
                                    rightAlign.classList.remove("active_tools");
                                    break;
                                case "overline":
                                    overLine.classList.remove("active_tools");
                                    break;
                                case "underLine":
                                    underLine.classList.remove("active_tools");
                                    break;
                                case "line-through":
                                    lineThrough.classList.remove("active_tools");
                                    break;
                            }
                            carriagePos.style.removeProperty(styleType);
                        }
                        carriagePos.style.cssText += contentInsertRemove;
                    } else {
                        for (let item of contentInsertRemove) {
                            carriagePos.style.removeProperty(item);
                        }
                        if (carriagePos.style.cssText === "" || carriagePos.style.cssText === " ") {
                            carriagePos.parentNode.insertBefore(documentSite.createTextNode(carriagePos.innerText), carriagePos);
                            carriagePos.parentNode.removeChild(carriagePos);
                        }
                    }
                }
            }

            let wrapperLocalFontSize = documentSite.createElement("div"), inputLocal = documentSite.createElement("div");
            let textSize = documentSite.createElement("span"), textEm  = documentSite.createElement("span");
            textSize.style.color = "#4e78e0";
            textSize.style.transform = "translateY(calc(1em / 3))";
            textEm.style.cssText = textSize.style.cssText;
            textSize.appendChild(documentSite.createTextNode("Размер шрифта: "));
            textEm.appendChild(documentSite.createTextNode("em"));
            wrapperLocalFontSize.appendChild(textSize);
            let wrapperCustomInput = documentSite.createElement("div"), wrapperButtonsCustomInput = documentSite.createElement("div"), buttonCustomInputTop = documentSite.createElement("img"), buttonCustomInputBottom = documentSite.createElement("img");
            buttonCustomInputTop.setAttribute("src", "images/arrow_top.svg");
            buttonCustomInputBottom.setAttribute("src", "images/arrow_bottom.svg");
            wrapperButtonsCustomInput.style.display = "inline-flex";
            wrapperButtonsCustomInput.style.flexDirection = "column";
            wrapperButtonsCustomInput.appendChild(buttonCustomInputTop);
            wrapperButtonsCustomInput.appendChild(buttonCustomInputBottom);
            buttonCustomInputBottom.onload = () => {
                buttonCustomInputTop.style.height = textSize.offsetHeight/2 + "px";
                buttonCustomInputBottom.style.height = textSize.offsetHeight/2 + "px";
            }
            buttonCustomInputBottom.onclick = () => {
                if(inputLocal.innerText !== "0.01"){
                    if(lastContentsUndo.length === 0)
                        buttonUndo.style.opacity = "1";
                    lastContentsUndo.push(wrapperText.innerHTML);
                    let ins = /^([0-9]*\.?[0-9]{0,2})/.exec((parseFloat(inputLocal.innerText) - 0.01).toString());
                    inputLocal.innerText = ins[1];
                    setDecorText(ins[1], "font-size");
                }
            }
            buttonCustomInputTop.onclick = () => {
                if(lastContentsUndo.length === 0)
                    buttonUndo.style.opacity = "1";
                lastContentsUndo.push(wrapperText.innerHTML);
                let ins = /^([0-9]*\.?[0-9]{0,2})/.exec((parseFloat(inputLocal.innerText) + 0.01).toString());
                inputLocal.innerText = ins[1];
                setDecorText(ins[1], "font-size");
            }
            inputLocal.oninput = () => {
                if(lastContentsUndo.length === 0)
                    buttonUndo.style.opacity = "1";
                lastContentsUndo.push(wrapperText.innerHTML);
                let ins = /^([0-9]*\.?[0-9]{0,2})/.exec(inputLocal.innerText.replace(/[^0-9.]/g, ""));
                if(/[^0-9.]/.test(inputLocal.innerText)){
                    inputLocal.innerText = ins[1];
                }
                setDecorText(ins[1], "font-size");
            }
            inputLocal.setAttribute("contenteditable", "true");
            inputLocal.setAttribute("class", "inputFontSize");
            inputLocal.style.fontSize = "1em";
            inputLocal.style.color = "#4e78e0";
            inputLocal.style.transform = "translateY(calc(1em / 3))";
            inputLocal.appendChild(documentSite.createTextNode("1"));
            wrapperCustomInput.appendChild(inputLocal);
            wrapperCustomInput.appendChild(wrapperButtonsCustomInput);
            wrapperCustomInput.style.display = "inline-flex";
            wrapperCustomInput.style.flexDirection = "row";
            wrapperLocalFontSize.appendChild(wrapperCustomInput);
            wrapperLocalFontSize.appendChild(textEm);
            wrapperLocalFontSize.style.margin = "5px";
            wrapperLocalFontSize.style.display = "flex";
            wrapperLocalFontSize.style.color = "#4e78e0";
            let wrapperDecTools = documentSite.createElement("div");
            let wrapperDec = documentSite.createElement("div");
            wrapperDecTools.setAttribute("class", "wrapper_center_text");
            wrapperDec.setAttribute("class", "wrapper_center_text");
            wrapperDecTools.appendChild(bold);
            wrapperDecTools.appendChild(italic);
            wrapperDecTools.appendChild(lineThrough);
            wrapperDecTools.appendChild(overLine);
            wrapperDecTools.appendChild(underLine);
            wrapperDecTools.appendChild(link);
            wrapperDecTools.appendChild(colorFont);
            wrapperDecTools.appendChild(colorBackground);
            wrapperDecTools.appendChild(leftAlign);
            wrapperDecTools.appendChild(centerAlign);
            wrapperDecTools.appendChild(rightAlign);
            wrapperDec.appendChild(buttonUndo);
            wrapperDec.appendChild(buttonRedo);
            wrapperDec.appendChild(wrapperLocalFontSize);
            wrapperTools.appendChild(wrapperDecTools);
            wrapperTools.appendChild(wrapperDec);
            wrapperText.innerHTML = e.parentNode.getAttribute("data-text");
            wrapperText.style.padding = "10px";
            wrapperText.setAttribute("contenteditable", "true");
            content.appendChild(wrapperTools);
            content.appendChild(wrapperText);
            content.setAttribute("class", "content_text");
        }else if(/\bimg\b/.test(type)){
            let wrapperEdit = documentSite.createElement("div"), wrapperImg = documentSite.createElement('div'), wrapperEditUrl = documentSite.createElement("div"), wrapperAllImages = documentSite.createElement("div"), wrapperContent = documentSite.createElement("div"), wrapperAlt = documentSite.createElement("div"), wrapperView = documentSite.createElement("div");
            wrapperEdit.style.display = "inline-flex";
            wrapperEdit.style.flexDirection = "column";
            let data = JSON.parse(e.parentNode.getAttribute("data-item"));
            if(data.src !== " " && data.src !== "")
                wrapperImg.innerHTML = "<img class=\"view_img_file\" style=\"display: table-cell; vertical-align: middle; height: 200px;\" src='"+  data.src + "' alt='view'>";
            else
                wrapperImg.innerHTML = "<img class=\"view_img_file\" style=\"display: none; vertical-align: middle; height: 200px;\" src='' alt='view'>";

            wrapperEditUrl.innerHTML = "<span style='margin: 0 10px; padding: 5px'>Путь к картинке:</span><span class='content_edit_url borderInput' contenteditable='true'>" + data.src+ "</span>";
            wrapperEditUrl.innerHTML += "<span class='wrapper_file_chooser'><span style='display: flex'><input accept=\"image/*\" name=\"file\" type=\"file\" id=\"input_file\"><label for='input_file' class='file_label'><span><img src='images/file_upload.svg' alt='загрузить картинку'></span><span>Загрузить картинку</span></label></span></span>"
            let inputFile = wrapperEditUrl.querySelector("#input_file");
            inputFile.addEventListener("change", evt => {
                if(/jpg|tiff|bmp|jpeg|jp2|j2k|jpf|jpm|jpg2|j2c|jpc|jxr|hdp|wdp|gif|eps|png|pict|pdf|pcx|ico|cdr|ai|raw|svg|webp/.test(/.*\.(.+)/.exec(inputFile.files[0].name)[1])){
                    let fr = new FileReader();

                    fr.addEventListener("load", function () {
                        wrapperImg.setAttribute("onUploadImg", "true");
                        wrapperImg.innerHTML = "<img class=\"view_img_file\" style=\"display: table-cell; vertical-align: middle; height: 200px;\" src='"+ fr.result +"' alt='view'><span style='display: table-cell; vertical-align: middle; padding: 0 10px;'>Путь к картинке на сайте:</span><span style='display: table-cell; vertical-align: middle; padding: 0 10px;'><span>"+ documentSite.location.protocol +"//"+ document.location.host +"/</span><span id='new_img_url_id' class='borderInput' contenteditable='true'>images/"+ inputFile.files[0].name +"</span></span>";
                        let inputUrl = wrapperImg.querySelector("#new_img_url_id");
                        absoluteUrl.innerHTML = inputUrl.innerHTML;
                        inputUrl.oninput = () => {
                            absoluteUrl.innerHTML = inputUrl.innerHTML;
                        }
                    }, false);

                    fr.readAsDataURL(inputFile.files[0]);
                }else{
                    wrapperContent.style.display = "inline-block";
                    wrapperContent.innerHTML = "<div style='color: red; padding: 5px; margin: 10px'>Вы выбрали не картинку!</div>";
                }
            });
            let buttonCheck = documentSite.createElement("span"), buttonAll = documentSite.createElement("span");
            buttonCheck.appendChild(documentSite.createTextNode("Проверить существование картинки"));
            buttonAll.appendChild(documentSite.createTextNode("Показать список всех картинок на сайте"));
            buttonCheck.style.padding = "5px";
            buttonCheck.style.margin = "10px";
            buttonCheck.style.borderRadius = "10px";
            buttonCheck.style.backgroundColor = "white";
            buttonCheck.style.cursor = "pointer";
            buttonCheck.style.color = "#4e78e0";
            buttonCheck.onclick = () => {
                let textUrl = wrapperEditUrl.querySelector(".content_edit_url").innerText;
                actions("type=isset_image&file=" + (/^\//.test(textUrl) ? "" : "/") + textUrl).then(response => {
                    if (/errorId/.test(response)) {
                        response = JSON.parse(response);
                        wrapperContent.style.display = "inline-block";
                        wrapperContent.innerHTML = "<div style='color: red; padding: 5px; margin: 10px'>"+ response.errorMessage +"</div>";
                    } else {
                        wrapperContent.style.display = "inline-block";
                        wrapperContent.innerHTML = "<div style='padding: 5px; margin: 10px'>Картинка существует!</div>";
                    }
                });
            }
            buttonAll.style.cssText = buttonCheck.style.cssText;
            buttonAll.onclick = () => {
                actions("type=get_all_img").then(response => {
                    wrapperContent.style.display = "block";
                    wrapperContent.innerHTML = "<div class=\"list\"><div class='list_title'>Все картинки на сайте:</div><ul class='list_wrapper'>"
                    for (let img of response.split(";")){
                        wrapperContent.innerHTML += "<li class='list_item'><a target=\"_blank\" href='"+ img +"'>"+ img +"</a></li>"
                    }
                    wrapperContent.innerHTML += "</ul></div>";
                });
            }
            wrapperEditUrl.style.margin = "20px 0";
            wrapperEditUrl.style.display = "flex";
            wrapperAlt.style.cssText = wrapperContent.style.cssText = wrapperImg.style.cssText = wrapperAllImages.style.cssText = wrapperView.style.cssText = wrapperEditUrl.style.cssText;
            wrapperAlt.innerHTML = "<span style='margin: 0 10px; padding: 5px'>Описание картинки. Этот текст покажется до того как картинка прогрузится:</span><span class='content_edit_alt' contenteditable='true' style='min-width: 10px; border-radius: 10px; padding: 5px; border: 2px solid white;'>" + data.alt + "</span>";
            let wrapperRadio = documentSite.createElement("div"), spanText = documentSite.createElement("span"),
                radio = documentSite.createElement("div"), div_vertical_radio = documentSite.createElement("div"),
                div_horizontal = documentSite.createElement("div");
            div_vertical_radio.setAttribute("class", "vertical_radio");
            div_horizontal.setAttribute("class", "horizontal_radio");
            radio.setAttribute("class", "radio" + (/clickableImg/.test(data.class) ? " active" : ""));
            wrapperRadio.setAttribute("class", "wrapperRadio");

            wrapperRadio.onclick = ev1 => {
                radio.classList.toggle("active");
            }
            div_horizontal.appendChild(radio);
            div_vertical_radio.appendChild(div_horizontal);
            spanText.appendChild(documentSite.createTextNode("Увелечение по нажатию"));
            wrapperRadio.appendChild(spanText);
            wrapperRadio.appendChild(div_vertical_radio);
            wrapperRadio.style.margin = "0 15px";
            wrapperRadio.style.fontSize = "1em";
            wrapperView.appendChild(wrapperRadio);
            wrapperContent.style.display = "none";
            wrapperContent.setAttribute("class", "error_edit");
            wrapperImg.style.display = "table";

            wrapperAllImages.appendChild(buttonCheck);
            wrapperAllImages.appendChild(buttonAll);
            wrapperEdit.appendChild(wrapperEditUrl);
            wrapperEdit.appendChild(wrapperImg);
            wrapperEdit.appendChild(wrapperAllImages);
            wrapperEdit.appendChild(wrapperContent);
            wrapperEdit.appendChild(wrapperAlt);
            wrapperEdit.appendChild(wrapperView);
            content.appendChild(wrapperEdit);
            let absoluteUrl = wrapperEditUrl.querySelector(".borderInput");
            wrapperImg.setAttribute("onUploadImg", "false");
            let view_img_file = wrapperImg.querySelector(".view_img_file");
            absoluteUrl.oninput = () =>{
                if(wrapperImg.getAttribute("onUploadImg") === "false")
                    view_img_file.setAttribute("src", "/" + absoluteUrl.innerHTML);
            }
        }else if(/\bitem_separator\b/.test(type)){
            let wrapperSeparatorContent = documentSite.createElement("div");
            wrapperSeparatorContent.style.display = "flex";
            wrapperSeparatorContent.style.flexDirection = "column";
            wrapperSeparatorContent.style.marginTop = "20px";
            wrapperSeparatorContent.innerHTML += "<div>Распределение занимаемого пространства</div>";
            let childs = e.parentNode.querySelector(".wrapper_ul_list_constr").children;
            for(let child of childs){
                let style = JSON.parse(child.getAttribute("data-item")).style;
                let inputWrapper = documentSite.createElement("div"), input = documentSite.createElement("span");
                input.setAttribute("contenteditable", "true");
                input.setAttribute("data-query", child.getAttribute("data-query"));
                let width = /width:\s*([0-9.]+)%/.exec(style);
                if(width !== null)
                    input.innerText = width[1];
                else
                    input.innerText = "0";
                input.oninput = () => {
                    if(/[^0-9.]/.test(input.innerText)){
                        input.innerText = input.innerText.replace(/[^0-9.]/g, "");
                    }
                }
                input.className = "borderInput separator_items";
                inputWrapper.innerHTML += "<span style='margin-right: 10px'>"+ child.querySelector(".list_constructor").textContent +":</span>";
                inputWrapper.appendChild(input);
                inputWrapper.innerHTML += "<span style='margin-left: 5px'>%</span>";
                inputWrapper.style.margin = "10px 0 10px 20px";
                wrapperSeparatorContent.appendChild(inputWrapper);
            }
            content.appendChild(wrapperSeparatorContent);
            setMarginsLayouts();
        }else if(/\bstartTime\b/.test(type)){
            let htmlDoc = new DOMParser().parseFromString(documentSite.querySelector("#HTML > .inputEditPage").textContent, "text/html");
            let blocks = htmlDoc.querySelector(getQuery(e.parentNode)).children;
            let time = blocks[0].parentNode.getAttribute("data-time");
            let link = JSON.parse(e.parentNode.getAttribute("data-item")).href;
            content.innerHTML += "<div style='display: flex; flex-direction: column; margin-top: 20px;'>" +
                "<div>Начальное событие:</div>" +
                "<div style=\"margin: 10px 0px 10px 20px;\"><span style=\"margin-right: 10px\">Название:</span><span contenteditable=\"true\" class=\"borderInput start_time_line\">" + blocks[0].textContent + "</span></div>" +
                "<div style=\"margin: 10px 0px 10px 20px;\"><span style=\"margin-right: 10px\">Текст даты:</span><span contenteditable=\"true\" class=\"borderInput start_time_line\">" + blocks[1].textContent + "</span></div>" +
                "<div class='temp_query_end_line' style=\"margin: 10px 0px 10px 20px;\"><span style=\"margin-right: 10px\">Форматированная дата:</span>";
            let inputDate = documentSite.createElement("span");
            inputDate.setAttribute("class", "borderInput start_time_line");
            inputDate.setAttribute("contenteditable", "true");
            inputDate.appendChild(documentSite.createTextNode((time !== null ? time : "" )));
            inputDate.oninput = () => {
                if (/[^0-9:]/.test(inputDate.innerText)) {
                    inputDate.innerText = inputDate.innerText.replace(/[^0-9:]/g, "");
                }
                if (inputDate.innerText !== "") {
                    let check = inputDate.innerText.split(":");
                    for (let i = 0; i < check.length; i++) {
                        if (check[i] !== "")
                            check[i] = parseInt(check[i]);
                        else
                            check[i] = -1;
                    }
                    if (typeof check[5] !== "undefined") {
                        if (check[5] === -1)
                            check[5] = "";
                        else if (check[5] >= 60) {
                            check[4] += Math.floor(check[5] / 60);
                            check[5] = check[5] % 60;
                        }
                    }
                    if (typeof check[4] !== "undefined") {
                        if (check[4] === -1)
                            check[4] = "";
                        else if (check[4] >= 60) {
                            check[3] += Math.floor(check[4] / 60);
                            check[4] = check[4] % 60;
                        }
                    }
                    if (typeof check[3] !== "undefined") {
                        if (check[3] === -1)
                            check[3] = "";
                        else if (check[3] >= 24) {
                            check[2] += Math.floor(check[3] / 24);
                            check[3] = check[3] % 24;
                        }
                    }
                    if (typeof check[2] !== "undefined") {
                        let dayInMouth = new Date(new Date().getFullYear(), check[1], 0).getDate()
                        if (check[2] === -1)
                            check[2] = "";
                        else if (check[2] >= dayInMouth) {
                            check[1] += Math.floor(check[2] / dayInMouth);
                            check[2] = check[2] % dayInMouth;
                        }
                    }
                    if (typeof check[1] !== "undefined") {
                        if (check[1] === -1)
                            check[1] = "";
                        else if (check[1] >= 12) {
                            check[0] += Math.floor(check[1] / 12);
                            check[1] = check[1] % 12;
                        }
                    }
                    if (check.join(":") !== inputDate.textContent)
                        inputDate.textContent = check.join(":");
                }
            }
            content.innerHTML += "<div style=\"margin: 10px 0px 10px 20px;\"><span style=\"margin-right: 10px\">Формат даты: <span style='font-weight: bold'>ГОД:МЕСЯЦ:ДЕНЬ:ЧАС:МИНУТА:СЕКУНДА</span>. Не обязательно указывать всё. Пример: <span style='font-weight: bold'>1982:9:1</span> - 1 сентрября 1982 года</span></div>" +
                "<div style=\"margin: 10px 0px;\"><span style='margin-right: 10px'>Ссылка(необязательно):</span><span contenteditable=\"true\" class=\"borderInput start_time_line\">" + (typeof link !== "undefined" ? link : "") + "</span></div>" +
                "</div>";
            content.querySelector(".temp_query_end_line").appendChild(inputDate);
        }else if(/\blink_time_line\b/.test(type)){
            let htmlDoc = new DOMParser().parseFromString(documentSite.querySelector("#HTML > .inputEditPage").textContent, "text/html");
            let blockMain = htmlDoc.querySelector(getQuery(e.parentNode));
            let time = blockMain.getAttribute("data-time");
            let link = JSON.parse(e.parentNode.getAttribute("data-item")).href;
            content.innerHTML += "<div style='display: flex; flex-direction: column; margin-top: 20px;'>" +
                "<div>Событие:</div>" +
                "<div style=\"margin: 10px 0px 10px 20px;\"><span style=\"margin-right: 10px\">Название:</span><span contenteditable=\"true\" class=\"borderInput link_time_line_edit\">" + blockMain.querySelector(".wrapper_link_time_line > .main_content_time_line > h2").textContent + "</span></div>" +
                "<div style=\"margin: 10px 0px 10px 20px;\"><span style=\"margin-right: 10px\">Краткое описание:</span><span contenteditable=\"true\" class=\"borderInput link_time_line_edit\">" + blockMain.querySelector(".wrapper_link_time_line > .main_content_time_line > .time_line_content").textContent + "</span></div>" +
                "<div style=\"margin: 10px 0px 10px 20px;\"><span style=\"margin-right: 10px\">Текст даты:</span><span contenteditable=\"true\" class=\"borderInput link_time_line_edit\">" + blockMain.querySelector(".wrapper_link_time_line > .time_line_data").textContent + "</span></div>" +
                "<div class='temp_query_end_line' style=\"margin: 10px 0px 10px 20px;\"><span style=\"margin-right: 10px\">Форматированная дата:</span>";
            let inputDate = documentSite.createElement("span");
            inputDate.setAttribute("class", "borderInput link_time_line_edit");
            inputDate.setAttribute("contenteditable", "true");
            inputDate.appendChild(documentSite.createTextNode((time !== null ? time : "" )));
            inputDate.oninput = () => {
                if (/[^0-9:]/.test(inputDate.innerText)) {
                    inputDate.innerText = inputDate.innerText.replace(/[^0-9:]/g, "");
                }
                if (inputDate.innerText !== "") {
                    let check = inputDate.innerText.split(":");
                    for (let i = 0; i < check.length; i++) {
                        if (check[i] !== "")
                            check[i] = parseInt(check[i]);
                        else
                            check[i] = -1;
                    }
                    if (typeof check[5] !== "undefined") {
                        if (check[5] === -1)
                            check[5] = "";
                        else if (check[5] >= 60) {
                            check[4] += Math.floor(check[5] / 60);
                            check[5] = check[5] % 60;
                        }
                    }
                    if (typeof check[4] !== "undefined") {
                        if (check[4] === -1)
                            check[4] = "";
                        else if (check[4] >= 60) {
                            check[3] += Math.floor(check[4] / 60);
                            check[4] = check[4] % 60;
                        }
                    }
                    if (typeof check[3] !== "undefined") {
                        if (check[3] === -1)
                            check[3] = "";
                        else if (check[3] >= 24) {
                            check[2] += Math.floor(check[3] / 24);
                            check[3] = check[3] % 24;
                        }
                    }
                    if (typeof check[2] !== "undefined") {
                        let dayInMouth = new Date(new Date().getFullYear(), check[1], 0).getDate()
                        if (check[2] === -1)
                            check[2] = "";
                        else if (check[2] >= dayInMouth) {
                            check[1] += Math.floor(check[2] / dayInMouth);
                            check[2] = check[2] % dayInMouth;
                        }
                    }
                    if (typeof check[1] !== "undefined") {
                        if (check[1] === -1)
                            check[1] = "";
                        else if (check[1] >= 12) {
                            check[0] += Math.floor(check[1] / 12);
                            check[1] = check[1] % 12;
                        }
                    }
                    if (check.join(":") !== inputDate.textContent)
                        inputDate.textContent = check.join(":");
                }
            }
            content.innerHTML += "<div style=\"margin: 10px 0px 10px 20px;\"><span style=\"margin-right: 10px\">Формат даты: <span style='font-weight: bold'>ГОД:МЕСЯЦ:ДЕНЬ:ЧАС:МИНУТА:СЕКУНДА</span>. Не обязательно указывать всё. Пример: <span style='font-weight: bold'>1982:9:1</span> - 1 сентрября 1982 года</span></div>" +
                "<div style=\"margin: 10px 0px;\"><span style=\"margin-right: 10px\">Ссылка(необязательно):</span><span contenteditable=\"true\" class=\"borderInput link_time_line_edit\">" + (typeof link !== "undefined" ? link : "") + "</span><span style='margin-left: 10px' class=\"wrapperRadioAccess\"> <span>или подробное описание</span> <div class=\"vertical_radio\"><div class=\"horizontal_radio\"><div class=\"radio" + (blockMain.querySelector(".wrapper_link_time_line > .main_content_time_line > .time_line_content_hide") !== null ? " active" : "") + "\"></div></div></div> </span></div>" +
                "<div style=\"margin: 10px 0px;\"><span style='margin-right: 10px' class=\"wrapperRadioAccess\"> <span>Добавить картинку(необязательно)</span> <div class=\"vertical_radio\"><div class=\"horizontal_radio\"><div class=\"radio" + (blockMain.querySelector(".wrapper_link_time_line > .main_content_time_line > .time_line_content > img") !== null ? " active" : "") + "\"></div></div></div> </span></div>" +
                "</div>";
            content.querySelector(".temp_query_end_line").appendChild(inputDate);

            let wrapperRadio = content.querySelectorAll(".wrapperRadioAccess");
            let radio = content.querySelectorAll(".radio");
            let linkInput = wrapperRadio[0].parentNode.querySelector(".borderInput");
            if(/active/.test(radio.className)){
                linkInput.setAttribute("contenteditable", "false");
                linkInput.style.cssText = "background-color: rgba(0, 0, 0, 0.3); border: 2px solid lightgrey;";
            }
            wrapperRadio[0].onclick = () => {
                radio[0].classList.toggle("active");
                if(/active/.test(radio[0].className)){
                    linkInput.setAttribute("contenteditable", "false");
                    linkInput.style.cssText = "background-color: rgba(0, 0, 0, 0.3); border: 2px solid lightgrey;";
                }else{
                    linkInput.setAttribute("contenteditable", "true");
                    linkInput.style.cssText = "";
                }
            }
            wrapperRadio[1].onclick = () => {
                radio[1].classList.toggle("active");
            }
        }else if(/\bendLine\b/.test(type)){
            let htmlDoc = new DOMParser().parseFromString(documentSite.querySelector("#HTML > .inputEditPage").textContent, "text/html");
            let blocks = htmlDoc.querySelector(getQuery(e.parentNode)).children;
            let link = JSON.parse(e.parentNode.getAttribute("data-item")).href;
            content.innerHTML += "<div style='display: flex; flex-direction: column; margin-top: 20px;'>" +
                "<div>Конечное событие:</div>" +
                "<div style=\"margin: 10px 0px 10px 20px;\"><span style=\"margin-right: 10px\">Название:</span><span contenteditable=\"true\" class=\"borderInput end_time_line\">" + blocks[0].textContent + "</span></div>" +
                "<div>Если событие заверешено</div>" +
                "<div style=\"margin: 10px 0px 10px 20px;\"><span style=\"margin-right: 10px\">Дата:</span><span contenteditable=\"true\" class=\"borderInput end_time_line\">" + (blocks[1].textContent !== " " && blocks[1].textContent !== "" ? blocks[1].textContent : "" ) + "</span></div>" +
                "<div>Если событие не заверешено, оставьте поле сверху пустым</div>" +
                "<div style=\"margin: 10px 0px;\"><span style='margin-right: 10px'>Ссылка(необязательно):</span><span contenteditable=\"true\" class=\"borderInput end_time_line\">" + (typeof link !== "undefined" ? link : "") + "</span></div>" +
                "</div>";
        }else{
            setMarginsLayouts();
        }
        function setMarginsLayouts(){
            let wrapperMargin = documentSite.createElement("div"), wrapperPadding = documentSite.createElement("div");
            wrapperMargin.style.display = "flex";
            wrapperMargin.style.flexDirection = "column";
            wrapperMargin.style.marginTop = "20px";
            wrapperPadding.style.cssText = wrapperMargin.style.cssText;
            wrapperMargin.innerHTML += "<div>Внешний отступ</div>";
            wrapperPadding.innerHTML += "<div>Внутрений отступ</div>";
            let parentStyle = JSON.parse(e.parentNode.getAttribute("data-item")).style;
            if(typeof parentStyle !== "undefined") {
                let margin = ["0", "0", "0", "0"];
                let marginsReg = /margin:\s*(.*?)\s*;/.exec(parentStyle);
                if (marginsReg !== null) {
                    marginsReg = marginsReg[1].split(" ");
                    if (marginsReg.length === 4) {
                        margin = [marginsReg[0], marginsReg[1], marginsReg[2], marginsReg[3]];
                    } else if (marginsReg.length === 2) {
                        margin = [marginsReg[0], marginsReg[1], marginsReg[0], marginsReg[1]];
                    } else {
                        margin = [marginsReg[0], marginsReg[0], marginsReg[0], marginsReg[0]];
                    }
                }
                marginsReg = /margin-top:\s*(.*?)\s*;/.exec(parentStyle);
                if (marginsReg !== null) {
                    margin[0] = marginsReg[1];
                }
                marginsReg = /margin-bottom:\s*(.*?)\s*;/.exec(parentStyle);
                if (marginsReg !== null) {
                    margin[2] = marginsReg[1];
                }
                marginsReg = /margin-left:\s*(.*?)\s*;/.exec(parentStyle);
                if (marginsReg !== null) {
                    margin[3] = marginsReg[1];
                }
                marginsReg = /margin-right:\s*(.*?)\s*;/.exec(parentStyle);
                if (marginsReg !== null) {
                    margin[1] = marginsReg[1];
                }

                generateMarginLayout(margin[0], margin[1], margin[2], margin[3], wrapperMargin);

                margin = ["0", "0", "0", "0"];
                marginsReg = /padding:\s*(.*)\s*;/.exec(parentStyle);
                if (marginsReg !== null) {
                    marginsReg = marginsReg[1].split(" ");
                    if (marginsReg.length === 4) {
                        margin = [marginsReg[0], marginsReg[1], marginsReg[2], marginsReg[3]];
                    } else if (marginsReg.length === 2) {
                        margin = [marginsReg[0], marginsReg[1], marginsReg[0], marginsReg[1]];
                    } else {
                        margin = [marginsReg[0], marginsReg[0], marginsReg[0], marginsReg[0]];
                    }
                }
                marginsReg = /padding-top:\s*(.*)\s*;/.exec(parentStyle);
                if (marginsReg !== null) {
                    margin[0] = marginsReg[1];
                }
                marginsReg = /padding-bottom:\s*(.*)\s*;/.exec(parentStyle);
                if (marginsReg !== null) {
                    margin[2] = marginsReg[1];
                }
                marginsReg = /padding-left:\s*(.*)\s*;/.exec(parentStyle);
                if (marginsReg !== null) {
                    margin[3] = marginsReg[1];
                }
                marginsReg = /padding-right:\s*(.*)\s*;/.exec(parentStyle);
                if (marginsReg !== null) {
                    margin[1] = marginsReg[1];
                }

                generateMarginLayout(margin[0], margin[1], margin[2], margin[3], wrapperPadding);
            }else{
                generateMarginLayout("0", "0", "0", "0", wrapperMargin);
                generateMarginLayout("0", "0", "0", "0", wrapperPadding);
            }

            function generateMarginLayout(top, right, bottom, left, parentNode){
                for (let i = 0; i < 4; i++){
                    let inputWrapper = documentSite.createElement("div"), input = documentSite.createElement("span");
                    input.setAttribute("contenteditable", "true");
                    switch (i) {
                        case 0:
                            inputWrapper.innerHTML += "<span style='margin-right: 10px'>Сверху:</span>";
                            input.innerText = top.replace(/[^0-9.]/g, "");
                            break;
                        case 1:
                            inputWrapper.innerHTML += "<span style='margin-right: 10px'>Справа:</span>";
                            input.innerText = right.replace(/[^0-9.]/g, "");
                            break;
                        case 2:
                            inputWrapper.innerHTML += "<span style='margin-right: 10px'>Снизу:</span>";
                            input.innerText = bottom.replace(/[^0-9.]/g, "");
                            break;
                        case 3:
                            inputWrapper.innerHTML += "<span style='margin-right: 10px'>Слева:</span>";
                            input.innerText = left.replace(/[^0-9.]/g, "");
                            break;
                    }
                    input.oninput = () => {
                        input.innerText = input.innerText.replace(/[^0-9.]/g, "");
                    }
                    input.className = "borderInput margins_item";
                    inputWrapper.appendChild(input);
                    inputWrapper.innerHTML += "<span style='margin-left: 5px'>px</span>";
                    inputWrapper.style.margin = "10px 0 10px 20px";
                    parentNode.appendChild(inputWrapper);
                }
            }

            content.appendChild(wrapperMargin);
            content.appendChild(wrapperPadding);
        }

        mainWrapper.querySelector(".closeImg").onclick = () => {
            if(confirm("Вы действительно хотите выйти из режима редактирования?")){
                if (confirm("Вы хотите сохранить внесённые изменения в макет?")){
                    if (/\btext_node\b/.test(type)){
                        let htmlDoc = new DOMParser().parseFromString(documentSite.querySelector("#HTML > .inputEditPage").textContent, "text/html");
                        let block = htmlDoc.querySelector(getQuery(e.parentNode.parentNode.parentNode));
                        block.childNodes.forEach(e => {
                            block.removeChild(e);
                        });
                        let textNode = content.querySelector(".wrapper_text_edit");
                        block.innerHTML = textNode.innerHTML;
                        e.parentNode.querySelector(".list_constructor").innerText = /^(\S+\s*){1,4}/iu.exec(block.textContent)[0] + "...";
                        e.parentNode.setAttribute("data-text", textNode.innerHTML);
                        saveContent(documentSite.querySelector("#HTML > .inputEditPage"), htmlDoc)
                        closeDialog();
                    }else if(/\bimg\b/.test(type)){
                        let newImg =  documentSite.querySelector("#new_img_url_id");
                        let textAbsoluteUrl = content.querySelector(".content_edit_url").innerText;
                        if(newImg !== null) {
                            let file = document.querySelector("#input_file").files[0];
                            if(file !== null) {
                                if (/jpg|tiff|bmp|jpeg|jp2|j2k|jpf|jpm|jpg2|j2c|jpc|jxr|hdp|wdp|gif|eps|png|pict|pdf|pcx|ico|cdr|ai|raw|svg|webp/.test(/.*\.(.+)/.exec(newImg.innerText)[1])) {
                                    let textUrl = newImg.innerText;
                                    if(textAbsoluteUrl !== textUrl)
                                        uploadImgForUrl(textAbsoluteUrl)
                                    else {
                                        let formData = new FormData();
                                        formData.append("uploadFile", file, /^(.*\/)*(.+)$/.exec(textUrl)[2]);
                                        formData.append("filePath", textUrl);
                                        actions(formData, false).then(response => {
                                            if (/errorMessage/.test(response)) {
                                                response = JSON.parse(response);
                                                if (content.querySelector(".temp_error") === null)
                                                    content.querySelector(".error_edit").innerHTML += "<div class='temp_error' style='color: red; padding: 5px; margin: 10px'>" + response.errorMessage + "</div>";
                                                else
                                                    content.querySelector(".temp_error").innerHTML = response.errorMessage;
                                            } else {
                                                setUploadSlider(textUrl);
                                            }
                                        });
                                    }
                                } else {
                                    content.querySelector(".error_edit").style.display = "inline-block";
                                    content.querySelector(".error_edit").innerHTML = "<div style='color: red; padding: 5px; margin: 10px'>Указан не картинный формат!</div>";
                                }
                            }else{
                                content.querySelector(".error_edit").style.display = "inline-block";
                                content.querySelector(".error_edit").innerHTML = "<div style='color: red; padding: 5px; margin: 10px'>Загрузите файл заново!</div>";
                            }
                        }else{
                            if(/^http/.test(textAbsoluteUrl))
                                setUploadSlider(textAbsoluteUrl);
                            else
                                uploadImgForUrl(textAbsoluteUrl);
                        }
                        function uploadImgForUrl(textUrl) {
                            actions("type=isset_image&file=" + (/^\//.test(textUrl) ? "" : "/") + textUrl).then(response => {
                                if (/errorId/.test(response)) {
                                    response = JSON.parse(response);
                                    content.querySelector(".error_edit").style.display = "inline-block";
                                    content.querySelector(".error_edit").innerHTML = "<div style='color: red; padding: 5px; margin: 10px'>"+ response.errorMessage +"</div>";
                                } else {
                                    setUploadSlider(textUrl);
                                }
                            });
                        }
                        function setUploadSlider(textUrl) {
                            let htmlDoc = new DOMParser().parseFromString(documentSite.querySelector("#HTML > .inputEditPage").textContent, "text/html");
                            let block = htmlDoc.querySelector(getQuery(e.parentNode));
                            let data = {"class": (/active/.test(content.querySelector(".radio").className) ? "clickableImg" : ""), "alt": content.querySelector(".content_edit_alt").innerText, "src": textUrl}
                            block.setAttribute("class", data.class);
                            block.setAttribute("alt", data.alt);
                            block.setAttribute("src", data.src);
                            e.parentNode.setAttribute("data-item", "{" + Object.entries(data).map(([k,v])=>`"${k}": "${v}"`).join(', ') + "}");
                            e.parentNode.setAttribute("data-query", "img" + Object.entries(data).map(([k,v])=>`[${k}: "${v}"]`).join(""));
                            saveContent(documentSite.querySelector("#HTML > .inputEditPage"), htmlDoc);
                            closeDialog();
                        }
                    }else if(/\bitem_separator\b/.test(type)){
                        let parentNodeQuery = getQuery(e.parentNode);
                        let separatorItems = content.querySelectorAll(".separator_items");
                        let htmlDoc = new DOMParser().parseFromString(documentSite.querySelector("#HTML > .inputEditPage").textContent, "text/html");
                        let separatorItemsConstr = e.parentNode.querySelector(".wrapper_ul_list_constr").children;
                        for (let i = 0; i < separatorItems.length; i++){
                            let block = htmlDoc.querySelector(parentNodeQuery + " " + separatorItems[i].getAttribute("data-query"));
                            block.style.width = separatorItems[i].textContent + "%";
                            separatorItemsConstr[i].setAttribute("data-item", separatorItemsConstr[i].getAttribute("data-item").replace(/width:\s*([0-9.]+)%/, "width: " + separatorItems[i].textContent + "%"))
                        }
                        saveContent(documentSite.querySelector("#HTML > .inputEditPage"), htmlDoc);
                        saveMargins();
                        closeDialog();
                    }else if(/\bstartTime\b/.test(type)){
                        let data = content.querySelectorAll(".start_time_line");
                        let htmlDoc = new DOMParser().parseFromString(documentSite.querySelector("#HTML > .inputEditPage").textContent, "text/html");

                        if(data[0].textContent !== "" && data[0].textContent !== " " && data[1].textContent !== "" && data[1].textContent !== " " && data[2].textContent !== "" && data[2].textContent !== " "){
                            let block = htmlDoc.querySelector(getQuery(e.parentNode));
                            block.querySelector("h2").textContent = data[0].textContent;
                            block.querySelector("span").textContent = data[1].textContent;
                            block.setAttribute("data-time", data[2].textContent);

                            if(data[3].textContent !== "" && data[3].textContent !== " "){
                                block.setAttribute("href", data[3].textContent);
                                let json = e.parentNode.getAttribute("data-item");
                                let href = json.replace(/"href"\s*:\s*"(.+?)"/, "\"href\":\""+ data[3].textContent  +"\"");
                                if(href !== json)
                                    e.parentNode.setAttribute("data-item", href);
                                else
                                    e.parentNode.setAttribute("data-item", "{\"href\":\""+ data[3].textContent +"\"," + json.substring(1));
                            }else{
                                block.removeAttribute("href");
                                e.parentNode.setAttribute("data-item", e.parentNode.getAttribute("data-item").replace(/"href"\s*:\s*"(.+?)"/, ""));
                            }
                            saveContent(documentSite.querySelector("#HTML > .inputEditPage"), htmlDoc);
                            closeDialog();
                        }else{
                            let error = content.querySelector(".error_msg");
                            if(error === null)
                                content.innerHTML += "<div class='error_msg' style='color: red; padding: 5px; margin: 10px'>Первые два поля не могут быть пустыми!</div>";
                            else
                                error.innerHTML = "Первые два поля не могут быть пустыми!";
                        }
                    }else if(/\bendLine\b/.test(type)){
                        let dataBlocks = content.querySelectorAll(".end_time_line");
                        if(dataBlocks[0].textContent !== " " && dataBlocks[0].textContent !== " "){
                            let htmlDoc = new DOMParser().parseFromString(documentSite.querySelector("#HTML > .inputEditPage").textContent, "text/html");
                            let block = htmlDoc.querySelector(getQuery(e.parentNode));
                            block.querySelector("h2").textContent = dataBlocks[0].textContent;

                            block.querySelector("span").textContent = dataBlocks[1].textContent;

                            if(dataBlocks[2].textContent !== "" && dataBlocks[2].textContent !== " "){
                                block.setAttribute("href", dataBlocks[2].textContent);
                                let json = e.parentNode.getAttribute("data-item");
                                let href = json.replace(/"href"\s*:\s*"(.+?)"/, "\"href\":\""+ dataBlocks[2].textContent  +"\"");
                                if(href !== json)
                                    e.parentNode.setAttribute("data-item", href);
                                else
                                    e.parentNode.setAttribute("data-item", "{\"href\":\""+ dataBlocks[2].textContent +"\"," + json.substring(1));
                            }else{
                                block.removeAttribute("href");
                                e.parentNode.setAttribute("data-item", e.parentNode.getAttribute("data-item").replace(/"href"\s*:\s*"(.+?)"/, ""));
                            }
                            saveContent(documentSite.querySelector("#HTML > .inputEditPage"), htmlDoc);
                            closeDialog();
                        }else{
                            let error = content.querySelector(".error_msg");
                            if(error === null)
                                content.innerHTML += "<div class='error_msg' style='color: red; padding: 5px; margin: 10px'>Название не может быть пустым!</div>";
                            else
                                error.innerHTML = "Название не может быть пустым!";
                        }
                    }else if(/\blink_time_line\b/.test(type)){
                        let data = content.querySelectorAll(".link_time_line_edit");
                        if(data[0].textContent !== "" && data[0].textContent !== " " && data[1].textContent !== "" && data[1].textContent !== " " && data[2].textContent !== "" && data[2].textContent !== " " && data[3].textContent !== "" && data[3].textContent !== " "){
                            let radio = content.querySelectorAll(".radio");
                            let list = e.parentNode.querySelector(".wrapper_ul_list_constr");
                            if(list === null){
                                list = documentSite.createElement("div");
                                list.setAttribute("class", "wrapper_ul_list_constr");
                                e.parentNode.appendChild(list);
                            }
                            let htmlDoc = new DOMParser().parseFromString(documentSite.querySelector("#HTML > .inputEditPage").textContent, "text/html");
                            let block = htmlDoc.querySelector(getQuery(e.parentNode));
                            block.setAttribute("data-time", data[2].textContent);

                            block.querySelector(".wrapper_link_time_line > .main_content_time_line > h2").textContent = data[0].textContent;
                            block.querySelector(".wrapper_link_time_line > .main_content_time_line > .time_line_content").textContent = data[1].textContent;
                            block.querySelector(".wrapper_link_time_line > .time_line_data").textContent = data[2].textContent;
                            
                            if(/active/.test(radio[0].className)){
                                block.removeAttribute("href");
                                block.setAttribute("title", "Нажмите, чтобы развернуть");
                                e.parentNode.setAttribute("data-item", e.parentNode.getAttribute("data-item").replace(/"href"\s*:\s*"(.+?)"/, ""));
                                list.innerHTML += "<div class=\"constructorItem body left local\" data-type=\"time_line_content_hide\" data-item=\"{&quot;class&quot;:&quot;time_line_content_hide&quot;}\" data-query=\"div.time_line_content_hide:nth-child(3)\"><div class=\"list_constructor\">Описание события на линии времени</div><img class=\"edit_page_content\" data-type=\"time_line_content_hide\" src=\"images/create.svg\" alt=\"редактировать\"><div class=\"wrapper_ul_list_constr\"><div class=\"constructorItem body left\" data-type=\"none\" data-query=\"none\"><div style=\"background-color: #4e78e0; color: white; border: 2px solid white;\" class=\"list_constructor\">Этот контейнер пуст. Переместите сюда объект, чтобы добавить его</div></div></div></div>";
                            }else{
                                let hideContent = list.querySelector(".constructorItem[data-type=\"time_line_content_hide\"]");
                                if(hideContent !== null)
                                    hideContent.parentNode.removeChild(hideContent);
                                let item = list.querySelector(".constructorItem body left local");
                                if(item !== null)
                                    list.removeChild(item);
                                if(data[4].textContent !== "" && data[4].textContent !== " "){
                                    block.setAttribute("href", data[4].textContent);
                                    let json = e.parentNode.getAttribute("data-item");
                                    let href = json.replace(/"href"\s*:\s*"(.+?)"/, "\"href\":\""+ data[4].textContent  +"\"");
                                    if(href !== json)
                                        e.parentNode.setAttribute("data-item", href);
                                    else
                                        e.parentNode.setAttribute("data-item", "{\"href\":\""+ data[4].textContent +"\"," + json.substring(1));
                                }else{
                                    block.removeAttribute("href");
                                    e.parentNode.setAttribute("data-item", e.parentNode.getAttribute("data-item").replace(/"href"\s*:\s*"(.+?)"/, ""));
                                }
                            }

                            if(/active/.test(radio[1].className)){
                                list.innerHTML += "<div class=\"constructorItem body left local\" data-type=\"img\" data-item=\"{&quot;class&quot;:&quot;img_time_line_min&quot;,&quot;src&quot;:&quot;&quot;,&quot;alt&quot;:&quot;\u0434\u0438\u043f\u043b\u043e\u043c&quot;}\" data-query=\"img:nth-child(2)\" style=\"\"><div class=\"list_constructor\">Картинка</div><img class=\"edit_page_content\" data-type=\"img\" src=\"images/create.svg\" alt=\"редактировать\"></div>";
                                arrayEvents.push(list.querySelector("[class=\"edit_page_content\"][data-type=\"img\"]"));
                                isNotSkipSave = true;
                            }else{
                                let hideContent = list.querySelector(".constructorItem[data-type=\"img\"]");
                                if(hideContent !== null)
                                    hideContent.parentNode.removeChild(hideContent);
                            }
                            closeDialog();
                        }else{
                            let error = content.querySelector(".error_msg");
                            if(error === null)
                                content.innerHTML += "<div class='error_msg' style='color: red; padding: 5px; margin: 10px'>Название, описание или дата не могут быть пустыми!</div>";
                            else
                                error.innerHTML = "Название, описание или дата не могут быть пустыми!";
                        }
                    }else{
                        saveMargins();
                        closeDialog();
                    }

                    function saveMargins() {
                        let margins = content.querySelectorAll(".margins_item");
                        let htmlDoc = new DOMParser().parseFromString(documentSite.querySelector("#HTML > .inputEditPage").textContent, "text/html");
                        let block = htmlDoc.querySelector(getQuery(e.parentNode));
                        if(block.style !== null) {
                            block.style.removeProperty("margin");
                            block.style.removeProperty("margin-top");
                            block.style.removeProperty("margin-left");
                            block.style.removeProperty("margin-right");
                            block.style.removeProperty("margin-bottom");
                            block.style.removeProperty("padding");
                            block.style.removeProperty("padding-top");
                            block.style.removeProperty("padding-left");
                            block.style.removeProperty("padding-right");
                            block.style.removeProperty("padding-bottom");
                        }
                        block.style.margin = (margins[0].textContent !== "" && margins[0].textContent !== " " ? margins[0].textContent : "0") + margins[0].parentNode.children[2] + " " + (margins[1].textContent !== "" && margins[1].textContent !== " " ? margins[1].textContent : "0") + margins[1].parentNode.children[2] + " " + (margins[2].textContent !== "" && margins[2].textContent !== " " ? margins[2].textContent : "0") + margins[2].parentNode.children[2] + " " + (margins[0].textContent !== "" && margins[3].textContent !== " " ? margins[3].textContent : "0") + margins[3].parentNode.children[2];
                        block.style.padding = (margins[4].textContent !== "" && margins[4].textContent !== " " ? margins[4].textContent : "0") + margins[4].parentNode.children[2] + " " + (margins[5].textContent !== "" && margins[5].textContent !== " " ? margins[5].textContent : "0") + margins[5].parentNode.children[2] + " " + (margins[6].textContent !== "" && margins[6].textContent !== " " ? margins[6].textContent : "0") + margins[6].parentNode.children[2] + " " + (margins[7].textContent !== "" && margins[7].textContent !== " " ? margins[7].textContent : "0") + margins[7].parentNode.children[2] + " ";
                        saveContent(documentSite.querySelector("#HTML > .inputEditPage"), htmlDoc);
                    }
                }else if(isNotSkipSave){
                    alert("Сейчас нельзя закрыть этот диалог не сохранив изменения!");
                } else closeDialog();
                function closeDialog() {
                    mainWrapper.classList.remove("active");
                    mainWrapper.style.animation = "opacityDialogOff 0.2s linear forwards";
                    documentSite.querySelector("body").style.removeProperty("overflow");
                    arrayEvents.splice(0, 1);
                    if(arrayEvents.length !== 0)
                        editContent(arrayEvents, isNotSkipSave);
                }
            }
        }
        dialog.innerHTML = "";
        dialog.appendChild(title);
        dialog.appendChild(content);
        dialog.style.width = "90vw";
        dialog.style.fontSize = "1.5em";
        mainWrapper.className += " active";
        mainWrapper.style.animation = "opacityDialogOn 0.2s linear forwards";
        documentSite.querySelector("body").style.overflow = "hidden";
        let scrollBlock = documentSite.querySelector(".wrapper_dialog_horizontal > .custom_scroll > .scroll_block");
        scrollBlock.style.opacity = "1";
        customScroll(scrollBlock, dialog, dialog.parentNode);
        dialog.querySelectorAll(".borderInput").forEach(el => setInputNotPaste(el));
    }

    function getQuery(mainQuery) {
        let returnString = mainQuery.getAttribute("data-query");
        let elemQuery = mainQuery;
        if(!/\bheader\b|\bfooter\b|\btext_node\b/.test(mainQuery.getAttribute("data-type"))) {
            while ((elemQuery = elemQuery.parentNode.parentNode) !== null) {
                if (!/constructor_wrapper|constructor_file/.test(elemQuery.getAttribute("class")))
                    returnString = elemQuery.getAttribute("data-query") + ">" + returnString;
                else
                    break;
            }
            return "body>" + returnString;
        }else{
            return returnString;
        }
    }

    function getAbsoluteReact(item) {
        let react = item.getBoundingClientRect();
        return {
            left: react.left + window.scrollX,
            top: react.top + window.scrollY,
            width: react.width,
            height: react.height
        }
    }

let constructors = JSON.parse(documentSite.querySelector("#constructor").getAttribute("data-constructor-all"));

function setScroll(moveBlock) {
    let newPosX = 0, lastPosX = 0, newPosY = 0, lastPosY = 0, posY = 0, posX = 0, firstPosX = 0, firstPosY = 0;
    let newBlock, reg;
    let ranges = [];
    let rangesBlock;
    let deleteBlock;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        moveBlock.children[0].ontouchstart = onScrollSet;
    } else {
        moveBlock.children[0].onmousedown = onScrollSet;
    }
    moveBlock.onselectstart = () => {return false;};

    function deleteBlockInArray(array, deleteArray) {
        deleteArray.forEach(e => {
            if(array.indexOf(e) !== -1){
                array.splice(array.indexOf(e), 1);
            }
        });
        return array;
    }
    function onScrollSet(e) {
        documentSite.querySelector("body").style.overflow = "hidden";
        let pos = getAbsoluteReact(moveBlock);
        reg = moveBlock.className.split(" ");
        let parent = documentSite.querySelector(".constructor_file." + reg[1]).parentNode;
        let posParent = getAbsoluteReact(parent);

        function isBelongsChild(moveBlock){
            let returnArray = null;
            let type = moveBlock.getAttribute("data-type");
            if(type !== "text_node") {
                if (reg[2] === "right") {
                    for (const [key, constructor] of Object.entries(constructors)) {
                        if(constructor["childs"] !== "") {
                            if(constructor["childs"] === "none"){
                                if (returnArray === null)
                                    returnArray = [];
                                documentSite.querySelectorAll(".constructorItem.body.left[data-type=\"" + key + "\"] > .wrapper_ul_list_constr").forEach(e => {
                                    if(e.firstChild.getAttribute("data-type") !== "text_node")
                                        for (let temp of e.children) {
                                            returnArray.push(temp);
                                        }
                                });
                            }else {
                                let tempChilds = constructor["childs"].split(";");
                                for (let childsOr of tempChilds) {
                                    let childs = childsOr.split("|");
                                    if (childs.indexOf(type) !== -1) {
                                        if (returnArray === null)
                                            returnArray = [];
                                        documentSite.querySelectorAll(".constructorItem.body.left[data-type=\"" + key + "\"] > .wrapper_ul_list_constr").forEach(e => {
                                            if(e.firstChild.getAttribute("data-type") !== "text_node")
                                                for (let temp of e.children) {
                                                    returnArray.push(temp);
                                                }
                                        });
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }else{
                for (const [key, constructor] of Object.entries(constructors)) {
                    if(constructor["childs"] !== "") {
                        if(constructor["childs"] === "none"){
                            if (returnArray === null)
                                returnArray = [];
                            documentSite.querySelectorAll(".constructorItem.body.left[data-type=\"" + key + "\"] > .wrapper_ul_list_constr").forEach(e => {
                                if (e.firstChild.getAttribute("data-type") === "none")
                                    returnArray.push(e.firstChild);
                            });
                        }else {
                            let tempChilds = constructor["childs"].split(";");
                            for (let childsOr of tempChilds) {
                                let childs = childsOr.split("|");
                                if (childs.indexOf(type) !== -1) {
                                    if (returnArray === null)
                                        returnArray = [];
                                    documentSite.querySelectorAll(".constructorItem.body.left[data-type=\"" + key + "\"] > .wrapper_ul_list_constr").forEach(e => {
                                        if (e.firstChild.getAttribute("data-type") === "none")
                                            returnArray.push(e.firstChild);
                                    });
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            return returnArray;
        }

        ranges = [];
        if((rangesBlock = isBelongsChild(moveBlock)) !== null){
            Array.from(documentSite.querySelectorAll(".constructorItem." + reg[1] + ".left")).forEach(e => {
                if (rangesBlock.indexOf(e) === -1)
                    e.querySelector(".list_constructor").style.opacity = "0.5";
            });
            rangesBlock.forEach(e => {
                let adjust = getAbsoluteReact(e);
                ranges.push([adjust.top - 10, adjust.top + 10, adjust.left, e, adjust.left + e.offsetWidth + 10, true]);
                let array = Array.from(e.parentNode.children);
                if (array.length === array.indexOf(e) + 1) {
                    adjust = getAbsoluteReact(e);
                    ranges.push([adjust.top + adjust.height - 10, adjust.top + adjust.height + 10, adjust.left, e, adjust.left + e.offsetWidth + 10, false]);
                }
            });
        }else{
            rangesBlock = Array.from(documentSite.querySelectorAll(".constructorItem." + reg[1] + ".left"));
            try {
                let isSkip = false;
                rangesBlock.forEach(e => {
                    if(e.getAttribute("data-type") !== "text_node") {
                        if (!/local/.test(moveBlock.className)) {
                            if (!/local/.test(e.className)) {
                                if (isSkip) {
                                    isSkip = false;
                                } else if (moveBlock !== e) {
                                    let adjust = getAbsoluteReact(e);
                                    ranges.push([adjust.top - 10, adjust.top + 10, adjust.left, e, adjust.left + e.offsetWidth + 10, true]);
                                    let array = Array.from(e.parentNode.children);
                                    if (array.length === array.indexOf(e) + 1) {
                                        adjust = getAbsoluteReact(e);
                                        ranges.push([adjust.top + adjust.height - 10, adjust.top + adjust.height + 10, adjust.left, e, adjust.left + e.offsetWidth + 10, false]);
                                    }
                                } else {
                                    isSkip = true;
                                    rangesBlock = deleteBlockInArray(rangesBlock, moveBlock.querySelectorAll(".constructorItem." + reg[1] + ".left"));
                                }
                            } else {
                                e.querySelector(".list_constructor").style.opacity = "0.5";
                            }
                        } else {
                            rangesBlock = deleteBlockInArray(rangesBlock, Array.from(moveBlock.parentNode.children));
                            rangesBlock.forEach(el => {
                                el.querySelector(".list_constructor").style.opacity = "0.5";
                            })
                            rangesBlock = Array.from(moveBlock.parentNode.children);
                            rangesBlock.forEach(el => {
                                if (isSkip) {
                                    isSkip = false;
                                } else if (moveBlock !== el) {
                                    let adjust = getAbsoluteReact(el);
                                    ranges.push([adjust.top - 10, adjust.top + 10, adjust.left, el, adjust.left + el.offsetWidth + 10, true]);
                                    let array = Array.from(el.parentNode.children);
                                    if (array.length === array.indexOf(el) + 1) {
                                        adjust = getAbsoluteReact(el);
                                        ranges.push([adjust.top + adjust.height - 10, adjust.top + adjust.height + 10, adjust.left, el, adjust.left + el.offsetWidth + 10, false]);
                                    }
                                } else {
                                    isSkip = true;
                                    rangesBlock = deleteBlockInArray(rangesBlock, moveBlock.querySelectorAll(".constructorItem." + reg[1] + ".left"));
                                }
                            });
                            throw {
                                reason: "it's not shit code!"
                            }
                        }
                    }else
                        e.querySelector(".list_constructor").style.opacity = "0.5";
                });
            } catch (e) {
            }
        }

        newBlock = moveBlock.cloneNode(true);
        parent.appendChild(newBlock);
        if(reg[2] !== "right"){
            moveBlock.style.opacity = "0";
            deleteBlock = documentSite.querySelector(".delete_constructor." + reg[1]);
            deleteBlock.style.display = "block";
            setTimeout(() => {
                deleteBlock.style.opacity = "1";
            }, 10);
        }

        newBlock.style.position = "absolute";
        posY = firstPosY = pos.top - posParent.top - 2;
        posX = firstPosX = pos.left - posParent.left - 2;
        newBlock.style.top = posY + "px";
        newBlock.style.left = posX + "px";
        newBlock.style.zIndex = "10";

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            lastPosY = e.touches[0].clientY;
            lastPosX = e.touches[0].clientX;
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
    let move = null;
    function moveScroll(e) {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            newPosY = lastPosY - e.touches[0].clientY;
            newPosX = lastPosX - e.touches[0].clientX;
            lastPosY = e.touches[0].clientY;
            lastPosX = e.touches[0].clientX;
        } else {
            newPosY = lastPosY - e.clientY;
            newPosX = lastPosX - e.clientX;
            lastPosY = e.clientY;
            lastPosX = e.clientX;
        }
        posX = posX - newPosX;
        posY = posY - newPosY;
        for(let i = 0; i < ranges.length; i++){
            if(ranges[i][0] <= lastPosY + window.pageYOffset && lastPosY + window.pageYOffset <= ranges[i][1] && lastPosX >= ranges[i][2] && lastPosX <= ranges[i][4]){
                if(ranges[i][5])
                    ranges[i][3].style.marginTop = (newBlock.offsetHeight) + "px";
                else
                    ranges[i][3].style.marginBottom = (newBlock.offsetHeight) + "px";

            }else{
                if(ranges[i][5]){
                    ranges[i][3].style.removeProperty("margin-top");
                }else{
                    ranges[i][3].style.removeProperty("margin-bottom");
                }
            }
        }

        if(reg[2] !== "right"){
            let posDelete = deleteBlock.getBoundingClientRect();
            if(lastPosX >= posDelete.left && lastPosX <= posDelete.width + posDelete.left && lastPosY <= posDelete.top + posDelete.height && lastPosY >= posDelete.top){
                deleteBlock.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
            }else{
                deleteBlock.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
            }
        }

        if (lastPosY <= 20){
            if(move === null){
                move = setInterval(() => {
                    window.scrollBy(0, -20);
                    posY -= 20;
                    newBlock.style.top = (posY) + "px";
                }, 25);
            }
        }else if(screenHeight - lastPosY <= 20){
            if(move === null){
                move = setInterval(() => {
                    window.scrollBy(0, 20);
                    posY += 20;
                    newBlock.style.top = (posY) + "px";
                }, 25);
            }
        }else{
            if (move !== null) {
                clearInterval(move);
                move = null;
            }
        }

        newBlock.style.top = (posY) + "px";
        newBlock.style.left = (posX) + "px";
    }

    function deleteAnimBlock(block) {
        block.style.transition = "all 0.2s linear";
        block.style.height = block.offsetHeight + 'px';
        block.style.display = "block";
        block.style.overflow = "hidden";
        block.style.zoom = "1";
        setTimeout(() => {
            block.style.height = "0px";
        }, 10);
        blockDelete(block);
        function blockDelete(block) {
            setTimeout(() => {
                block.parentNode.removeChild(block);
            }, 210);
        }
    }

    function onCreateInsert(block, i, position, ranges) {
        setTimeout(() => {
            let parent;
            parent = ranges[i][3].parentNode;
            ranges[i][3].className += " no-transition";
            if(!ranges[i][5]) {
                ranges[i][3].style.removeProperty("margin-bottom");
                parent.appendChild(block);
            }else{
                ranges[i][3].style.removeProperty("margin-top");
                parent.insertBefore(block, ranges[i][3]);
            }
            setTr(ranges[i][3]);
            function setTr(elem) {
                setTimeout(() => {
                    elem.className = elem.className.replace(/\sno-transition/, "");
                }, 10);
            }

            let testBlock = parent.querySelector("[data-type = \"none\"][data-query = \"none\"]");
            if(testBlock !== null){
                deleteAnimBlock(testBlock);
            }
            let arrayOfDialog = [];
            if(position[2] !== "right") {
                moveBlockType(moveBlock, i, ranges, block);
                if(moveBlock.parentNode.children.length === 1) {
                    let parentNode = documentSite.createElement("div"), list = documentSite.createElement("div");
                    parentNode.setAttribute("class", "constructorItem body left");
                    parentNode.setAttribute("data-type", "none");
                    parentNode.setAttribute("data-query", "none");
                    list.setAttribute("class", "list_constructor");
                    list.appendChild(documentSite.createTextNode("Этот контейнер пуст. Переместите сюда объект, чтобы добавить его"));
                    list.style.cssText = "background-color: rgb(78, 120, 224); border: 2px solid white; color: white;";
                    parentNode.appendChild(list);
                    moveBlock.parentNode.appendChild(parentNode);
                }
                deleteAnimBlock(moveBlock);
            }else{
                block.className = block.className.replace(/right/, "left");
                arrayOfDialog = createBlockType(block, i, ranges);
            }
            block.style.removeProperty("position");
            block.style.removeProperty("z-index");
            block.style.removeProperty("top");
            block.style.removeProperty("transition");
            block.style.removeProperty("left");
            setScroll(block);
            if (parent.parentNode.getAttribute("data-type") === "item_separator") {
                arrayOfDialog.push(parent.parentNode.querySelector(".edit_page_content"));
            }
            if(arrayOfDialog.length !== 0)
                editContent(arrayOfDialog, true);
        }, 500);
    }

    function stopScroll() {
        documentSite.querySelector("body").style.removeProperty("overflow");
        if (move !== null) {
            clearInterval(move);
            move = null;
        }
        newBlock.style.transition = "all 0.5s linear";
        let isInsertBlock = false;
        for(let i = 0; i < ranges.length; i++){
            if(ranges[i][0] <= lastPosY + window.pageYOffset && lastPosY + window.pageYOffset <= ranges[i][1] && lastPosX >= ranges[i][2] && lastPosX <= ranges[i][4]){
                isInsertBlock = i;
                break;
            }
        }

        if(reg[2] !== "right"){
            deleteBlock.style.opacity = "0";
            setTimeout(() => {
                deleteBlock.style.display = "none";
            }, 200);

            let posDelete = deleteBlock.getBoundingClientRect();
            if(lastPosX >= posDelete.left && lastPosX <= posDelete.width + posDelete.left && lastPosY <= posDelete.top + posDelete.height && lastPosY >= posDelete.top){
                isInsertBlock = "delete";
            }
        }
        Array.from(documentSite.querySelectorAll(".constructorItem.body.left")).forEach(e => {
            e.querySelector(".list_constructor").style.removeProperty("opacity");
        });
        function noDelete() {
            newBlock.style.top = firstPosY + "px";
            newBlock.style.left = firstPosX + "px";
            checkDelete(newBlock);
            function checkDelete(block) {
                setTimeout(() => {
                    moveBlock.style.removeProperty("opacity");
                    block.parentNode.removeChild(block);
                }, 500);
            }
        }
        if(isInsertBlock === false){
            noDelete();
        }else if(isInsertBlock === "delete"){
            if(deleteBlockType(moveBlock)){
                let childrens = Array.from(moveBlock.parentNode.children);
                let p = moveBlock.parentNode;
                let b = childrens.length === 1;
                deleteAnimBlock(moveBlock);
                newBlock.parentNode.removeChild(newBlock);
                if(b){
                    let wrapper_none = documentSite.createElement("div");
                    wrapper_none.setAttribute("class", "constructorItem body left");
                    wrapper_none.setAttribute("class", "constructorItem body left");
                    wrapper_none.setAttribute("data-type", "none");
                    wrapper_none.setAttribute("data-query", "none");
                    let none_item = documentSite.createElement("div");
                    none_item.style.backgroundColor = "#4e78e0";
                    none_item.style.border = "2px solid white";
                    none_item.style.color = "white";
                    none_item.setAttribute("class", "list_constructor");
                    none_item.appendChild(documentSite.createTextNode("Этот контейнер пуст. Переместите сюда объект, чтобы добавить его"));
                    wrapper_none.appendChild(none_item);
                    p.appendChild(wrapper_none);
                }
            }else{
                noDelete();
                alert("Нельзя удалить последний необходимы этому блоку элемент такого типа!");
            }
        }else{
            let positions, posParent;
            if(ranges[isInsertBlock][5]) {
                positions = getAbsoluteReact(ranges[isInsertBlock][3]);
                posParent = getAbsoluteReact(documentSite.querySelector(".constructor_file." + reg[1]));
                newBlock.style.top = (positions.top - posParent.top - moveBlock.offsetHeight + 20) + "px";
            }else {
                positions = getAbsoluteReact(ranges[isInsertBlock][3]);
                posParent = getAbsoluteReact(documentSite.querySelector(".constructor_file." + reg[1]));
                newBlock.style.top = (positions.top - posParent.top  + positions.height + 20) + "px";
            }
            if(reg[2] === "right") {
                newBlock.style.left = (positions.left - posParent.left + 20) + "px";
            }else{
                newBlock.style.left = (positions.left - posParent.left + 20) + "px";
            }

            onCreateInsert(newBlock, isInsertBlock, reg, ranges);
        }
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            document.ontouchend = null;
            document.ontouchmove = null;
        } else {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}
    function createBlockType(block, i, array) {
        let arrayOfDialog = [];
        let content = block.children[0].innerText;
        let code = documentSite.querySelector("#HTML > .inputEditPage");
        let insertBefore = true
        if (array.length - 1 <= i){
            insertBefore = false;
        }

        if(/css/.test(content)){
            let beforeContent = array[i][3].innerText;
            let text;
            if(/css/.test(beforeContent)){
                text = new RegExp("\n^(.*)&lt;link.*href\s*=['\"]\s*" + beforeContent +"\s*['\"]\s*.*\/&gt;.*$", "m").exec(code.innerHTML);
                code.innerHTML = code.innerHTML.replace(new RegExp("\n^.*&lt;link.*href\s*=['\"]\s*" + beforeContent + "\s*['\"]\s*.*\/&gt;.*$", "m"), insertBefore ? ("\n" + text[1] + "&lt;link rel=\"stylesheet\" type=\"text/css\" href=\"" + content + "\"\/&gt;" + text[0]) : (text[0] + "\n" + text[1] + "&lt;link rel=\"stylesheet\" type=\"text/css\" href=\"" + content + "\"\/&gt;"));
            }else{
                text = new RegExp("\n^(.*)&lt;script.*src\s*=['\"]\s*" + beforeContent +"\s*['\"]\s*.*\/script&gt;.*$", "m").exec(code.innerHTML);
                code.innerHTML = code.innerHTML.replace(new RegExp("\n^.*&lt;script.*src\s*=['\"]\s*" + beforeContent + "\s*['\"]\s*.*\/script&gt;.*$", "m"), insertBefore ? ("\n" + text[1] + "&lt;link rel=\"stylesheet\" type=\"text/css\" href=\"" + content + "\"\/&gt;" + text[0]) : (text[0] + "\n" + text[1] + "&lt;link rel=\"stylesheet\" type=\"text/css\" href=\"" + content + "\"\/&gt;"));
            }

            actions("type=get_file_content&file=" + block.children[0].innerText).then(response => {
                if(/errorId/.test(response)){
                    alert(response)
                }else{
                    let insertElement = null;
                    code = documentSite.querySelector("#CSS");
                    let childArray = Array.from(code.children);
                    let textInfo = array[i][3].children[0].innerText;
                    if(!/css/.test(beforeContent)){
                        let todo = -1;
                        for (let l = i - 1; l > todo; l--) {
                            if (/css/.test(array[l][3].children[0].innerText)) {
                                textInfo = array[l][3].children[0].innerText;
                                break;
                            }
                            if(l === todo + 1 && textInfo === array[i][3].children[0].innerText){
                                todo = i;
                                l = array.length - 1;
                            }
                        }
                    }

                    childArray.forEach(e => {
                        if(e.className === "title_soursFile_content")
                            if(e.innerText === textInfo){
                                insertElement = e;
                            }
                    });

                    let titleElement = documentSite.createElement("div"), textAreaElement = documentSite.createElement("textarea");
                    titleElement.setAttribute("class", "title_soursFile_content");
                    titleElement.appendChild(documentSite.createTextNode(block.children[0].innerText));
                    textAreaElement.setAttribute("class", "inputEditPage");
                    textAreaElement.appendChild(documentSite.createTextNode(response));
                    if(insertBefore){
                        code.insertBefore(titleElement, insertElement);
                        code.insertBefore(textAreaElement, insertElement);
                    }else{
                        code.appendChild(titleElement);
                        code.appendChild(textAreaElement);
                    }
                    loadFiles.set(block.children[0].innerText, response);
                }
            });
        }else if(/js/.test(content)){
            let beforeContent = array[i][3].children[0].innerText;
            let text;
            if(/css/.test(beforeContent)){
                text = new RegExp("\n^(.*)&lt;link.*href\s*=['\"]\s*" + beforeContent +"\s*['\"]\s*.*\/&gt;.*$", "m").exec(code.innerHTML);
                code.innerHTML = code.innerHTML.replace(new RegExp("\n^.*&lt;link.*href\s*=['\"]\s*" + beforeContent + "\s*['\"]\s*.*\/&gt;.*$", "m"), insertBefore ? ("\n" + text[1] + "&lt;script src=\"" + content + "\"&gt;&lt;\/script&gt;" + text[0]) : (text[0] + "\n" + text[1] + "&lt;script src=\"" + content + "\"&gt;&lt;\/script&gt;"));
            }else{
                text = new RegExp("\n^(.*)&lt;script.*src\s*=['\"]\s*" + beforeContent +"\s*['\"]\s*.*\/script&gt;.*$", "m").exec(code.innerHTML);
                code.innerHTML = code.innerHTML.replace(new RegExp("\n^.*&lt;script.*src\s*=['\"]\s*" + beforeContent + "\s*['\"]\s*.*\/script&gt;.*$", "m"), insertBefore ? ("\n" + text[1] + "&lt;script src=\"" + content + "\"&gt;&lt;\/script&gt;" + text[0]) : (text[0] + "\n" + text[1] + "&lt;script src=\"" + content + "\"&gt;&lt;\/script&gt;"));
            }

            actions("type=get_file_content&file=" + block.innerText).then(response => {
                if(/errorId/.test(response)){
                    alert(response)
                }else{
                    let insertElement = null;
                    code = documentSite.querySelector("#JavaScript");
                    let childArray = Array.from(code.children);
                    let textInfo = array[i][3].children[0].innerText;
                    if(/css/.test(beforeContent)){
                        let todo = -1;
                        for (let l = i - 1; l > todo; l--) {
                            if (/js/.test(array[l][3].children[0].innerText)) {
                                textInfo = array[l][3].children[0].innerText;
                                break;
                            }
                            if(l === todo + 1 && textInfo === array[i][3].children[0].innerText){
                                todo = i;
                                l = array.length - 1;
                            }
                        }
                    }

                    childArray.forEach(e => {
                        if(e.className === "title_soursFile_content")
                            if(e.innerText === textInfo){
                                insertElement = e;
                            }
                    });

                    let titleElement = documentSite.createElement("div"), textAreaElement = documentSite.createElement("textarea");
                    titleElement.setAttribute("class", "title_soursFile_content");
                    titleElement.appendChild(documentSite.createTextNode(block.children[0].innerText));
                    textAreaElement.setAttribute("class", "inputEditPage");
                    textAreaElement.appendChild(documentSite.createTextNode(response));
                    if(insertBefore){
                        code.insertBefore(titleElement, insertElement);
                        code.insertBefore(textAreaElement, insertElement);
                    }else{
                        code.appendChild(titleElement);
                        code.appendChild(textAreaElement);
                    }
                    loadFiles.set(block.children[0].innerText, response);
                }
            });
        }else{
            let scriptType = block.getAttribute("data-type");
            if(scriptType !== null) {
                let query = getQuery(block);
                if (typeof constructors[scriptType] !== "undefined") {

                    let htmlDoc = new DOMParser().parseFromString(code.textContent, "text/html");
                    let insertContent = null, beforeBlock = htmlDoc.querySelector(getQuery(array[i][3]));
                        if (/\bheader\b|\bfooter\b/.test(scriptType)) {
                            let cont = new RegExp(query, "m").exec(code.innerHTML);
                            insertContent = htmlDoc.createTextNode(cont[0].replace(/&lt;/, "<").replace(/&gt;/, ">") + "\r\n");
                        }else if(/\btext_node\b/.test(scriptType)){
                            let edit = documentSite.createElement("img");
                            edit.setAttribute("alt", "редактировать");
                            edit.setAttribute("src", "images/create.svg");
                            edit.setAttribute("class", "edit_page_content");
                            edit.setAttribute("data-type", "text_node");
                            block.appendChild(edit);
                            edit.onclick = () => {
                                editContent([edit]);
                            }
                            arrayOfDialog.push(edit);
                        }else {
                            insertContent = htmlDoc.createElement(constructors[scriptType]["tag"]);
                            let attributes = constructors[scriptType]["attributes"].split(";");
                            for (let attribute of attributes) {
                                attribute = attribute.split("=");
                                insertContent.setAttribute(attribute[0], attribute[1]);
                            }
                            if(array[i][3].getAttribute("data-type") !== "none") {
                                let beforeQuery = array[i][3].getAttribute("data-query").split(">");
                                beforeQuery[beforeQuery.length - 1] = constructors[scriptType]["tag"] + (constructors[scriptType]["tag"] === scriptType ? "" : "." + scriptType) + ":nth-child(" + parseInt(/nth-child\((.*)\)/.exec(beforeQuery[beforeQuery.length - 1])[1]) + ")";
                                block.setAttribute("data-query", beforeQuery.join(">"));
                                let childQuery = Array.from(block.parentNode.children);
                                for (let index = childQuery.indexOf(block) + 1; index < childQuery.length; index++) {
                                    childQuery[index].setAttribute("data-query", childQuery[index].getAttribute("data-query").replace(/(.+)nth-child\(.*?\)/, "$1nth-child(" + (parseInt(/.+nth-child\((.*?)\)/.exec(childQuery[index].getAttribute("data-query"))[1]) + 1) + ")"));
                                }
                            }else{
                                block.setAttribute("data-query", constructors[scriptType]["tag"] + (constructors[scriptType]["tag"] !== scriptType ? "." + scriptType : "") + ":nth-child(1)");
                            }
                            block.innerHTML += "<img class=\"edit_page_content\" data-type=\"" + scriptType + "\" src=\"images/create.svg\" alt=\"редактировать\">" + (constructors[scriptType]["childs"] === "" ? "" : "<div class=\"wrapper_ul_list_constr\">" + (constructors[scriptType]["childs"] === "none" ? "<div class=\"constructorItem body left\" data-type=\"none\" data-query=\"none\"><div class=\"list_constructor\" style=\"background-color: rgb(78, 120, 224); border: 2px solid white; color: white;\">Этот контейнер пуст. Переместите сюда объект, чтобы добавить его</div></div>" : "") + "</div></div>");
                            if (constructors[scriptType]["childs"] !== "none" && constructors[scriptType]["childs"] !== "") {
                                createChild(insertContent, scriptType, block.querySelector(".wrapper_ul_list_constr"));
                            }

                            function createChild(insertContent, scriptType, wrapperChildren) {
                                insertContent.innerHTML = constructors[scriptType]["defaultPath"];
                                let childs = constructors[scriptType]["childs"].split(";");
                                let typeName;
                                for (let count = 1; typeof (typeName = childs[count - 1]) !== "undefined"; count++) {
                                    let mainContainer = documentSite.createElement("div"), listConstructor = documentSite.createElement("div"), edit = documentSite.createElement("img");
                                    mainContainer.setAttribute("class", "constructorItem body left" + (constructors[scriptType]["isLocal"] ? " local" : ""));
                                    listConstructor.setAttribute("class", "list_constructor");
                                    edit.setAttribute("alt", "редактировать");
                                    edit.setAttribute("src", "images/create.svg");
                                    edit.setAttribute("class", "edit_page_content");
                                    mainContainer.appendChild(listConstructor);
                                    setScroll(mainContainer);
                                    mainContainer.appendChild(edit);
                                    wrapperChildren.appendChild(mainContainer);
                                    if (/\|/.test(typeName)) {
                                        mainContainer.setAttribute("data-type", "none");
                                        mainContainer.setAttribute("data-query", "none");
                                        listConstructor.appendChild(documentSite.createTextNode("Этот контейнер пуст. Переместите сюда объект, чтобы добавить его"));
                                        listConstructor.style.cssText = "background-color: rgb(78, 120, 224); border: 2px solid white; color: white;";
                                        mainContainer.removeChild(edit);
                                        break;
                                    }if(typeName === "text_node") {
                                        wrapperChildren.removeChild(mainContainer);
                                        createTextNode(wrapperChildren);
                                        edit.onclick = () => {
                                            editContent([edit]);
                                        }
                                        arrayOfDialog.push(edit);
                                    }else {
                                        listConstructor.appendChild(documentSite.createTextNode(constructors[typeName]["name"]));
                                        mainContainer.setAttribute("data-type", typeName);
                                        edit.setAttribute("data-type", typeName);
                                        mainContainer.setAttribute("data-item", attributesConstructorToData(constructors[typeName]["attributes"].split(";")));
                                        if (typeof constructors[scriptType]["defaultQuery"] !== "undefined") {
                                            if (/\(n\)/.test(constructors[scriptType]["defaultQuery"])) {
                                                mainContainer.setAttribute("data-query", constructors[scriptType]["defaultQuery"].replace(/\*NODE\*/, constructors[typeName]["tag"] + (constructors[typeName]["tag"] === typeName ? "" : "." + typeName)).replace(/\(n\)/, "(" + count.toString() + ")"));
                                            } else if (/\(l\)/.test(constructors[scriptType]["defaultQuery"])) {
                                                mainContainer.setAttribute("data-query", constructors[scriptType]["defaultQuery"].replace(/\*NODE\*/, constructors[typeName]["tag"] + (constructors[typeName]["tag"] === typeName ? "" : "." + typeName)).replace(/\(l\)/, "(" + (count === childs.length ? (count + 1).toString() : count.toString()) + ")"));
                                            }
                                        } else {
                                            mainContainer.setAttribute("data-query", constructors[typeName]["tag"] + (constructors[typeName]["tag"] === typeName ? "" : "." + typeName) + ":nth-child(" + count + ")");
                                        }
                                        edit.onclick = () => {
                                            editContent([edit]);
                                        }
                                        if(/\bendLine\b|\blink_time_line\b|\bstartTime\b|\bitem_separator\b|\bimg\b|\btext_node\b/.test(typeName))
                                            arrayOfDialog.push(edit);
                                        if (constructors[typeName]["childs"] !== "") {
                                            let wrapperUlList = documentSite.createElement("div");
                                            mainContainer.appendChild(wrapperUlList);
                                            wrapperUlList.setAttribute("class", "wrapper_ul_list_constr");
                                            if(constructors[typeName]["childs"] === "none"){
                                                let nullMain = documentSite.createElement("div"), nullList = documentSite.createElement("div");
                                                nullMain.setAttribute("class", "constructorItem body left" + (constructors[typeName]["isLocal"] ? " local" : ""));
                                                nullList.setAttribute("class", "list_constructor");
                                                nullMain.setAttribute("data-type", "none");
                                                nullMain.setAttribute("data-query", "none");
                                                nullList.appendChild(documentSite.createTextNode("Этот контейнер пуст. Переместите сюда объект, чтобы добавить его"));
                                                nullList.style.cssText = "background-color: rgb(78, 120, 224); border: 2px solid white; color: white;";
                                                nullMain.appendChild(nullList);
                                                wrapperUlList.appendChild(nullMain);
                                                setScroll(nullMain);
                                            }else if(constructors[typeName]["childs"] === "text_node") {
                                                createTextNode(wrapperUlList);
                                            }else{
                                                createChild(insertContent.querySelector(constructors[typeName]["tag"] + (constructors[typeName]["tag"] !== typeName ? "." + typeName : "")), typeName, wrapperUlList);
                                            }
                                        }

                                    }

                                }

                                function attributesConstructorToData(attributes) {
                                    let returnJson = [];
                                    for (let node of attributes) {
                                        let nodeKeyAndValue = node.split("=");
                                        returnJson.push("\"" + nodeKeyAndValue[0] + "\":\"" + nodeKeyAndValue[1] + "\"")
                                    }
                                    return ("{" + returnJson.join(", ") + "}");
                                }
                                function createTextNode(wrapperUlList) {
                                    let nullMain = documentSite.createElement("div"), nullList = documentSite.createElement("div"), imfEdit = documentSite.createElement("img");
                                    nullMain.setAttribute("class", "constructorItem body left" + (constructors[typeName]["isLocal"] ? " local" : ""));
                                    nullList.setAttribute("class", "list_constructor");
                                    nullMain.setAttribute("data-type", "text_node");
                                    imfEdit.setAttribute("data-type", "text_node");
                                    nullMain.setAttribute("data-query", "text_node");
                                    nullMain.setAttribute("data-text", "");
                                    nullList.appendChild(documentSite.createTextNode("..."));
                                    nullList.style.cssText = "background-color: rgb(78, 120, 224); color: white; border: 2px solid white;";
                                    imfEdit.setAttribute("alt", "редактировать");
                                    imfEdit.setAttribute("src", "images/create.svg");
                                    imfEdit.setAttribute("class", "edit_page_content");
                                    nullMain.appendChild(nullList);
                                    setScroll(nullMain);
                                    nullMain.appendChild(imfEdit);
                                    wrapperUlList.appendChild(nullMain);
                                    arrayOfDialog.push(imfEdit);
                                    imfEdit.onclick = () => {
                                        editContent([imfEdit]);
                                    }
                                }
                            }

                            if (constructors[scriptType]["script"] !== "" && constructors[scriptType]["style"] !== ""){
                                let isScript = false, isStyle = false;
                                documentSite.querySelectorAll(".constructorItem.headers.left > .list_constructor").forEach(e => {
                                    if(e.textContent === constructors[scriptType]["script"])
                                        isScript = true;
                                    if(e.textContent === constructors[scriptType]["style"])
                                        isStyle = true;
                                });
                                if(!isScript){
                                    documentSite.querySelector(".constructor_file.headers").innerHTML += "<div class=\"constructorItem headers left\"><div class=\"list_constructor\">/"+ constructors[scriptType]["script"] +"</div></div>";
                                    let tempBlock = htmlDoc.createElement("script");
                                    tempBlock.setAttribute("src", "/" + constructors[scriptType]["script"]);
                                    htmlDoc.querySelector("head").appendChild(tempBlock);
                                    if(htmlDoc.querySelector(".script").innerText === ""){
                                        htmlDoc.querySelector(".script").innerText = "addScript(\""+ constructors[scriptType]["script"] +"\")";
                                    }else{
                                        htmlDoc.querySelector(".script").innerText += ";addScript(\""+ constructors[scriptType]["script"] +"\")";
                                    }
                                    addFile(constructors[scriptType]["script"], documentSite.querySelector("#JavaScript"));
                                }
                                if(!isStyle){
                                    documentSite.querySelector(".constructor_file.headers").innerHTML += "<div class=\"constructorItem headers left\"><div class=\"list_constructor\">/"+ constructors[scriptType]["style"] +"</div></div>";
                                    let tempBlock = htmlDoc.createElement("link");
                                    tempBlock.setAttribute("src", "/" + constructors[scriptType]["style"]);
                                    tempBlock.setAttribute("rel", "stylesheet");
                                    tempBlock.setAttribute("type", "text/css");
                                    tempBlock.setAttribute("href", "/" + constructors[scriptType]["style"]);
                                    htmlDoc.querySelector("head").appendChild(tempBlock);
                                    if(htmlDoc.querySelector(".styles").innerText === ""){
                                        htmlDoc.querySelector(".styles").innerText = constructors[scriptType]["style"];
                                    }else{
                                        htmlDoc.querySelector(".styles").innerText += ";"+ constructors[scriptType]["style"];
                                    }
                                    addFile(constructors[scriptType]["script"], documentSite.querySelector("#CSS"));
                                }

                                function addFile(name, code) {
                                    actions("type=get_file_content&file=/" + name).then(response => {
                                        if(/errorId/.test(response)){
                                            alert(response)
                                        }else{
                                            let titleElement = documentSite.createElement("div"), textAreaElement = documentSite.createElement("textarea");
                                            titleElement.setAttribute("class", "title_soursFile_content");
                                            titleElement.appendChild(documentSite.createTextNode(block.children[0].innerText));
                                            textAreaElement.setAttribute("class", "inputEditPage");
                                            textAreaElement.appendChild(documentSite.createTextNode(response));
                                            code.appendChild(titleElement);
                                            code.appendChild(textAreaElement);
                                            loadFiles.set(block.children[0].innerText, response);
                                        }
                                    });
                                }
                            }

                        }

                        if (beforeBlock !== null) {
                            if (insertBefore) {
                                beforeBlock.parentNode.insertBefore(insertContent, beforeBlock);
                            } else {
                                beforeBlock.parentNode.appendChild(insertContent);
                            }
                        } else {
                            if(insertContent !== null) {
                                htmlDoc.querySelector(getQuery(array[i][3].parentNode.parentNode)).appendChild(insertContent);
                            }
                        }
                    saveContent(code, htmlDoc)

                        if (/header|footer/.test(scriptType))
                            code.innerHTML = code.innerHTML.replace(new RegExp(query, "m"), "");


                }
            }
        }
        return arrayOfDialog;
    }

    function moveBlockType(block, i, array, insertBlockInArray) {
        let content = block.children[0].innerText;
        let code = documentSite.querySelector("#HTML > .inputEditPage");
        let insertBefore = array[i][5];
        if(/css/.test(content)){
            let beforeContent = array[i][3].children[0].innerText;
            let text, textMove;
            textMove = new RegExp("\n^(.*)&lt;link.*href\s*=['\"]\s*" + content +"\s*['\"]\s*.*\/&gt;.*$", "m").exec(code.innerHTML);
            code.innerHTML = code.innerHTML.replace(new RegExp("\n^(.*)&lt;link.*href\s*=['\"]\s*" + content +"\s*['\"]\s*.*\/&gt;.*$", "m"), "");
            if(/css/.test(beforeContent)){
                text = new RegExp("\n^(.*)&lt;link.*href\s*=['\"]\s*" + beforeContent +"\s*['\"]\s*.*\/&gt;.*$", "m").exec(code.innerHTML);
                code.innerHTML = code.innerHTML.replace(new RegExp("\n^.*&lt;link.*href\s*=['\"]\s*" + beforeContent + "\s*['\"]\s*.*\/&gt;.*$", "m"), insertBefore ? (textMove[0] + text[0]) : (text[0] + textMove[0]));
            }else{
                text = new RegExp("\n^(.*)&lt;script.*src\s*=['\"]\s*" + beforeContent +"\s*['\"]\s*.*\/script&gt;.*$", "m").exec(code.innerHTML);
                code.innerHTML = code.innerHTML.replace(new RegExp("\n^.*&lt;script.*src\s*=['\"]\s*" + beforeContent + "\s*['\"]\s*.*\/script&gt;.*$", "m"), insertBefore ? (textMove[0] + text[0]) : (text[0] + textMove[0]));
            }
                    let insertElement = null;
                    code = documentSite.querySelector("#CSS");
                    let childArray = Array.from(code.children);
                    let textInfo = array[i][3].children[0].innerText;
                    if(!/css/.test(beforeContent)){
                        let todo = -1;
                        for (let l = i - 1; l > todo; l--) {
                            if (/css/.test(array[l][3].children[0].innerText)) {
                                textInfo = array[l][3].children[0].innerText;
                                break;
                            }
                            if(l === todo + 1 && textInfo === array[i][3].children[0].innerText){
                                todo = i;
                                l = array.length - 1;
                            }
                        }
                    }
                    let titleElement = null, textAreaElement = null;
                    childArray.forEach(e => {
                        if(e.className === "title_soursFile_content")
                            if(e.innerText === textInfo){
                                insertElement = e;
                            }else if(e.innerText === block.children[0].innerText){
                                titleElement = e;
                            }
                    });
                    textAreaElement = childArray[childArray.indexOf(titleElement) + 1];
                    if(insertBefore){
                        code.insertBefore(titleElement, insertElement);
                        code.insertBefore(textAreaElement, insertElement);
                    }else{
                        code.appendChild(titleElement);
                        code.appendChild(textAreaElement);
                    }
        }else if(/js/.test(content)){
            let beforeContent = array[i][3].children[0].innerText;
            let text, textMove;
            textMove = new RegExp("\n^(.*)&lt;script.*src\s*=['\"]\s*" + content +"\s*['\"]\s*.*\/script&gt;.*$", "m").exec(code.innerHTML);
            code.innerHTML = code.innerHTML.replace(new RegExp("\n^(.*)&lt;script.*src\s*=['\"]\s*" + content +"\s*['\"]\s*.*\/script&gt;.*$", "m"), "");
            if(/css/.test(beforeContent)){
                text = new RegExp("\n^(.*)&lt;link.*href\s*=['\"]\s*" + beforeContent +"\s*['\"]\s*.*\/&gt;.*$", "m").exec(code.innerHTML);
                code.innerHTML = code.innerHTML.replace(new RegExp("\n^.*&lt;link.*href\s*=['\"]\s*" + beforeContent + "\s*['\"]\s*.*\/&gt;.*$", "m"), insertBefore ? (textMove[0] + text[0]) : (text[0] + textMove[0]));
            }else{
                text = new RegExp("\n^(.*)&lt;script.*src\s*=['\"]\s*" + beforeContent +"\s*['\"]\s*.*\/script&gt;.*$", "m").exec(code.innerHTML);
                code.innerHTML = code.innerHTML.replace(new RegExp("\n^.*&lt;script.*src\s*=['\"]\s*" + beforeContent + "\s*['\"]\s*.*\/script&gt;.*$", "m"), insertBefore ? (textMove[0] + text[0]) : (text[0] + textMove[0]));
            }
            let insertElement = null;
            code = documentSite.querySelector("#JavaScript");
            let childArray = Array.from(code.children);
            let textInfo = array[i][3].children[0].innerText;
            if(/css/.test(beforeContent)){
                let todo = -1;
                for (let l = i - 1; l > todo; l--) {
                    if (/js/.test(array[l][3].children[0].innerText)) {
                        textInfo = array[l][3].children[0].innerText;
                        break;
                    }
                    if(l === todo + 1 && textInfo === array[i][3].children[0].innerText){
                        todo = i;
                        l = array.length - 1;
                    }
                }
            }
            let titleElement = null, textAreaElement = null;
            childArray.forEach(e => {
                if(e.className === "title_soursFile_content") {
                    if (e.innerText === textInfo) {
                        insertElement = e;
                    } else if (e.innerText === block.children[0].innerText) {
                        titleElement = e;
                    }
                }
            });
            textAreaElement = childArray[childArray.indexOf(titleElement) + 1];
            if(insertBefore){
                code.insertBefore(titleElement, insertElement);
                code.insertBefore(textAreaElement, insertElement);
            }else{
                code.appendChild(titleElement);
                code.appendChild(textAreaElement);
            }
        }else {
            try {
                let scriptType = block.getAttribute("data-type");
                let query = getQuery(block);
                if (typeof constructors[scriptType] !== "undefined") {
                    let htmlDoc = new DOMParser().parseFromString(code.textContent, "text/html");
                    let insertContent = null, beforeBlock = htmlDoc.querySelector(getQuery(array[i][3]));
                    if (/header|footer/.test(scriptType)) {
                        let cont = new RegExp(query, "m").exec(code.innerHTML);
                        insertContent = htmlDoc.createTextNode(cont[0].replace(/&lt;/, "<").replace(/&gt;/, ">") + "\r\n");
                    } else if(scriptType === "text_node"){
                        let insertContentText = htmlDoc.querySelector(getQuery(block.parentNode.parentNode));
                        insertContentText.innerText = "";
                        insertContentText = htmlDoc.querySelector(getQuery(insertBlockInArray.parentNode.parentNode));
                        insertContentText.innerText = insertBlockInArray.getAttribute("data-text");
                    }else{
                        insertContent = htmlDoc.querySelector(query);
                        let childQuery = Array.from(block.parentNode.children);
                        if(array[i][3].getAttribute("data-type") !== "none") {
                            insertBlockInArray.setAttribute("data-query", array[i][3].getAttribute("data-query").replace(/nth-child\(.*\)/, "nth-child(" + (/nth-child\((.*)\)/.exec(array[i][3].getAttribute("data-query"))[1]) + ")"));
                            for (let index = childQuery.indexOf(block) + 1; index < childQuery.length; index++) {
                                childQuery[index].setAttribute("data-query", childQuery[index].getAttribute("data-query").replace(/nth-child\(.*\)/, "nth-child(" + (parseInt(/nth-child\((.*)\)/.exec(childQuery[index].getAttribute("data-query"))[1]) - 1) + ")"));
                            }

                            childQuery = Array.from(insertBlockInArray.parentNode.children);
                            for (let index = childQuery.indexOf(insertBlockInArray) + 1; index < childQuery.length; index++) {
                                childQuery[index].setAttribute("data-query", childQuery[index].getAttribute("data-query").replace(/nth-child\(.*\)/, "nth-child(" + (parseInt(/nth-child\((.*)\)/.exec(childQuery[index].getAttribute("data-query"))[1]) + 1) + ")"));
                            }
                        }else
                            insertBlockInArray.setAttribute("data-query", constructors[scriptType]["tag"] + (constructors[scriptType]["tag"] !== scriptType ? "." + scriptType : "") + ":nth-child(1)");
                    }
                    if(beforeBlock !== null) {
                        if (insertBefore) {
                            beforeBlock.parentNode.insertBefore(insertContent, beforeBlock);
                        } else {
                            beforeBlock.parentNode.appendChild(insertContent);
                        }
                    }else{
                        if(insertContent !== null) {
                            htmlDoc.querySelector(getQuery(array[i][3].parentNode.parentNode)).appendChild(insertContent);
                        }
                        // if(insertContent !== null) {
                        //     array[i][3].parentNode.appendChild(insertContent);
                        //     array[i][3].parentNode.removeChild(array[i][3]);
                        // }
                    }
                    saveContent(code, htmlDoc);
                    if (/header|footer/.test(scriptType))
                        code.innerHTML = code.innerHTML.replace(new RegExp(query, "m"), "");
                }
            }catch (e) {
                alert(e);
            }
        }
    }

    function deleteBlockType(block) {
        let content = block.children[0].innerText;
        let scriptType = block.getAttribute("data-type");
        let code = documentSite.querySelector("#HTML > .inputEditPage");
        let removeBlock = block.children[0].innerText;
        if(/css/.test(content)){
            code.innerHTML = code.innerHTML.replace(new RegExp("\n^.*&lt;link.*href\s*=['\"]\s*" + content +"\s*['\"]\s*.*\/&gt;.*$", "m"), "");
            code = documentSite.querySelector("#CSS");
        }else if(/js/.test(content)){
            code.innerHTML = code.innerHTML.replace(new RegExp("\n^.*&lt;script.*src\s*=['\"]\s*" + content +"\s*['\"]\s*.*\/script&gt;.*$", "m"), "");
            code = documentSite.querySelector("#JavaScript");
        }else if(typeof constructors[scriptType] !== "undefined"){
            if(/header|footer/.test(scriptType)){
                code.innerHTML = code.innerHTML.replace(new RegExp(query, "m"), "");
                code = documentSite.querySelector("#HTML");
                removeBlock = "/" + scriptType + ".php";
            }else if(scriptType === "text_node"){
                let htmlDoc = new DOMParser().parseFromString(code.textContent, "text/html");
                let removeDom = htmlDoc.querySelector(getQuery(block.parentNode.parentNode));
                removeDom.innerHTML = "";
                saveContent(code, htmlDoc);
            }else{
                let parentType = block.parentNode.parentNode.getAttribute("data-type");
                if (parentType !== null) {
                    if (constructors[parentType]["childs"] !== "" && constructors[parentType]["childs"] !== "none")
                        if (block.parentNode.parentNode.querySelectorAll("div[data-type=\"" + scriptType + "\"]").length === 1) {
                            return false
                        }

                    let htmlDoc = new DOMParser().parseFromString(code.textContent, "text/html");
                    let removeDom = htmlDoc.querySelector(getQuery(block));
                    //setLastQuery
                    let childQuery = Array.from(block.parentNode.children);
                    for (let i = childQuery.indexOf(block) + 1; i < childQuery.length; i++) {
                        childQuery[i].setAttribute("data-query", childQuery[i].getAttribute("data-query").replace(/nth-child\(.*\)/, "nth-child(" + (parseInt(/nth-child\((.*)\)/.exec(childQuery[i].getAttribute("data-query"))[1]) - 1) + ")"));
                    }
                    removeDom.parentNode.removeChild(removeDom);
                    saveContent(code, htmlDoc);
                    removeBlock = false;
                }
            }
        }
        if(removeBlock === false) {
            let childArray = Array.from(code.children);
            childArray.forEach(e => {
                if (e.className === "title_soursFile_content") {
                    if (e.innerText === removeBlock) {
                        code.removeChild(childArray[childArray.indexOf(e) + 1]);
                        code.removeChild(e);
                    }
                }
            });
        }
        return true;
    }
    window.onbeforeunload = function() {
        return "Данные не сохранены";
    };
}