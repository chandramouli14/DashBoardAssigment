let taskList;
let url = "http://localhost:3000/tasks/";
let labelsSelected;


//Vanilla Script for  multiSelect DropDown

let VSBoxCounter = function () {
    let count = 0;
    return {
        set: function () {
            return ++count;
        }
    };
}();

function vanillaSelectBox(domSelector, options) {
    let self = this;
    this.instanceOffset = VSBoxCounter.set();
    this.domSelector = domSelector;
    this.root = document.querySelector(domSelector)
    this.main;
    this.button;
    this.title;
    this.isMultiple = this.root.hasAttribute("multiple");
    this.multipleSize = this.isMultiple && this.root.hasAttribute("size") ? parseInt(this.root.getAttribute("size")) : -1;
    this.drop;
    this.top;
    this.left;
    this.options;
    this.listElements;
    this.isDisabled = false;
    this.search = false;
    this.searchZone = null;
    this.inputBox = null;
    this.disabledItems = [];
    this.ulminWidth = 140;
    this.ulminHeight = 25;
    this.userOptions = {
        maxWidth: 500,
        maxHeight: 400,
        translations: { "all": "All", "items": "items" },
        search: false,
        placeHolder: "",
        stayOpen: false
    }
    if (options) {
        if (options.maxWidth != undefined) {
            this.userOptions.maxWidth = options.maxWidth;
        }
        if (options.maxHeight != undefined) {
            this.userOptions.maxHeight = options.maxHeight;
        }
        if (options.translations != undefined) {
            this.userOptions.translations = options.translations;
        }
        if (options.placeHolder != undefined) {
            this.userOptions.placeHolder = options.placeHolder;
        }
        if (options.search != undefined) {
            this.search = options.search;
        }
        if (options.stayOpen != undefined) {
            this.userOptions.stayOpen = options.stayOpen;
        }
    }
    this.repositionMenu = function () {
        let rect = self.main.getBoundingClientRect();
        this.drop.style.left = rect.left + "px";
        this.drop.style.top = rect.bottom + "px";
    }

    this.init = function () {
        let self = this;
        this.root.style.display = "none";
        let already = document.getElementById("btn-group-" + self.domSelector);
        if (already) {
            already.remove();
        }
        this.main = document.createElement("div");
        this.root.parentNode.insertBefore(this.main, this.root.nextSibling);
        this.main.classList.add("vsb-main");
        this.main.setAttribute("id", "btn-group-" + this.domSelector);
        this.main.style.marginLeft = this.main.style.marginLeft;
        if (self.userOptions.stayOpen) {
            this.main.style.minHeight = (this.userOptions.maxHeight + 10) + "px";
        }

        let btnTag = self.userOptions.stayOpen ? "div" : "button";
        this.button = document.createElement(btnTag);
        this.main.appendChild(this.button);
        this.title = document.createElement("span");
        this.button.appendChild(this.title);
        this.title.classList.add("title");
        let caret = document.createElement("span");
        this.button.appendChild(caret);
        caret.classList.add("caret");
        caret.style.position = "absolute";
        caret.style.right = "8px";
        caret.style.marginTop = "8px";
        if (self.userOptions.stayOpen) {
            caret.style.display = "none";
            this.title.style.paddingLeft = "20px";
            this.title.style.fontStyle = "italic";
            this.title.style.verticalAlign = "20%";
        }
        let rect = this.button.getBoundingClientRect();
        this.top = rect.bottom;
        this.left = rect.left;
        this.drop = document.createElement("div");
        this.main.appendChild(this.drop);
        this.drop.classList.add("vsb-menu");
        this.drop.style.zIndex = 2000 - this.instanceOffset;
        this.ul = document.createElement("ul");
        this.drop.appendChild(this.ul);

        if (!this.userOptions.stayOpen) {
            window.addEventListener("resize", function (e) {
                self.repositionMenu();
            });

            window.addEventListener("scroll", function (e) {
                self.repositionMenu();
            });
        }

        this.ul.style.maxHeight = this.userOptions.maxHeight + "px";
        this.ul.style.minWidth = this.ulminWidth + "px";
        this.ul.style.minHeight = this.ulminHeight + "px";
        if (this.isMultiple) {
            this.ul.classList.add("multi");
        }
        let selectedTexts = ""
        let sep = "";
        let nrActives = 0;

        if (this.search) {
            this.searchZone = document.createElement("div");
            this.ul.appendChild(this.searchZone);
            this.searchZone.classList.add("vsb-js-search-zone");
            this.searchZone.style.zIndex = 2001 - this.instanceOffset;
            this.inputBox = document.createElement("input");
            this.searchZone.appendChild(this.inputBox);
            this.inputBox.setAttribute("type", "text");
            this.inputBox.setAttribute("id", "search_" + this.domSelector);

            let fontSizeForP = this.isMultiple ? "8px" : "6px";
            var para = document.createElement("p");
            this.ul.appendChild(para);
            para.style.fontSize = fontSizeForP;
            para.innerHTML = "&nbsp;";
            this.ul.addEventListener("scroll", function (e) {
                var y = this.scrollTop;
                self.searchZone.parentNode.style.top = y + "px";
            });
        }
        this.options = document.querySelectorAll(this.domSelector + " option");
        Array.prototype.slice.call(this.options).forEach(function (x) {
            let text = x.textContent;
            let value = x.value;
            let classes = x.getAttribute("class");
            if (classes) {
                classes = classes.split(" ");
            }
            else {
                classes = [];
            }
            let li = document.createElement("li");
            let isSelected = x.hasAttribute("selected");
            let isDisabled = x.hasAttribute("disabled");
            self.ul.appendChild(li);
            li.setAttribute("data-value", value);
            li.setAttribute("data-text", text);
            li.onclick = hideLabel
            if (classes.length != 0) {
                classes.forEach(function (x) {
                    li.classList.add(x);
                });
            }
            if (isSelected) {
                nrActives++;
                selectedTexts += sep + text;
                sep = ",";
                li.classList.add("active");
                if (!self.isMultiple) {
                    self.title.textContent = text;
                    if (classes.length != 0) {
                        classes.forEach(function (x) {
                            self.title.classList.add(x);
                        });
                    }
                }
            }
            if (isDisabled) {
                li.classList.add("disabled");
            }
            li.appendChild(document.createTextNode(text));
        });
        if (self.multipleSize != -1) {
            if (nrActives > self.multipleSize) {
                let wordForItems = self.userOptions.translations.items || "items"
                selectedTexts = nrActives + " " + wordForItems;
            }
        }
        if (self.isMultiple) {
            self.title.innerHTML = selectedTexts;
        }
        if (self.userOptions.placeHolder != "" && self.title.textContent == "") {
            self.title.textContent = self.userOptions.placeHolder;
        }
        this.listElements = this.drop.querySelectorAll("li");
        if (self.search) {
            self.inputBox.addEventListener("keyup", function (e) {
                let searchValue = e.target.value.toUpperCase();
                let searchValueLength = searchValue.length;
                if (searchValueLength < 2) {
                    Array.prototype.slice.call(self.listElements).forEach(function (x) {
                        x.classList.remove("hide");
                    });
                } else {
                    Array.prototype.slice.call(self.listElements).forEach(function (x) {
                        let text = x.getAttribute("data-text").toUpperCase();
                        if (text.indexOf(searchValue) == -1) {
                            x.classList.add("hide");
                        } else {
                            x.classList.remove("hide");
                        }
                    });
                }
            });
        }

        if (self.userOptions.stayOpen) {
            self.drop.style.display = "block";
            self.drop.style.boxShadow = "none";
            self.drop.style.minHeight = (this.userOptions.maxHeight + 10) + "px";
            self.drop.style.position = "relative";
            self.drop.style.left = "0px";
            self.drop.style.top = "0px";
            self.button.style.border = "none";
        } else {
            this.main.addEventListener("click", function (e) {
                if (self.isDisabled) return;
                self.drop.style.left = self.left + "px";
                self.drop.style.top = self.top + "px";
                self.drop.style.display = "block";
                document.addEventListener("click", docListener);
                e.preventDefault();
                e.stopPropagation();
                if (!self.userOptions.stayOpen) {
                    self.repositionMenu();
                }
            });
        }
        this.drop.addEventListener("click", function (e) {
            if (self.isDisabled) return;

            if (!e.target.hasAttribute("data-value")) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            let choiceValue = e.target.getAttribute("data-value");
            let choiceText = e.target.getAttribute("data-text");
            let className = e.target.getAttribute("class");
            if (className && className.indexOf("disabled") != -1) {
                return;
            }
            if (!self.isMultiple) {
                self.root.value = choiceValue;
                self.title.textContent = choiceText;
                if (className) {
                    self.title.setAttribute("class", className + " title");
                } else {
                    self.title.setAttribute("class", "title");
                }
                Array.prototype.slice.call(self.listElements).forEach(function (x) {
                    x.classList.remove("active");
                });
                if (choiceText != "") {
                    e.target.classList.add("active");
                }
                self.privateSendChange();
                if (!self.userOptions.stayOpen) {
                    docListener();
                }
            } else {
                let wasActive = false;
                if (className) {
                    wasActive = className.indexOf("active") != -1;
                }
                if (wasActive) {
                    e.target.classList.remove("active");
                } else {
                    e.target.classList.add("active");
                }
                let selectedTexts = ""
                let sep = "";
                let nrActives = 0;
                let nrAll = 0;
                for (let i = 0; i < self.options.length; i++) {
                    nrAll++;
                    if (self.options[i].value == choiceValue) {
                        self.options[i].selected = !wasActive;
                    }
                    if (self.options[i].selected) {
                        nrActives++;
                        selectedTexts += sep + self.options[i].textContent;
                        sep = ",";
                    }
                }
                if (nrAll == nrActives) {
                    let wordForAll = self.userOptions.translations.all || "all";
                    selectedTexts = wordForAll;
                } else if (self.multipleSize != -1) {
                    if (nrActives > self.multipleSize) {
                        let wordForItems = self.userOptions.translations.items || "items"
                        selectedTexts = nrActives + " " + wordForItems;
                    }
                }
                self.title.textContent = selectedTexts;
                self.privateSendChange();
            }
            e.preventDefault();
            e.stopPropagation();
            if (self.userOptions.placeHolder != "" && self.title.textContent == "") {
                self.title.textContent = self.userOptions.placeHolder;
            }
        });
        function docListener() {
            document.removeEventListener("click", docListener);
            self.drop.style.display = "none";
            if (self.search) {
                self.inputBox.value = "";
                Array.prototype.slice.call(self.listElements).forEach(function (x) {
                    x.classList.remove("hide");
                });
            }
        }
    }
    this.init();
}

vanillaSelectBox.prototype.disableItems = function (values) {
    let self = this;
    let foundValues = [];
    if (vanillaSelectBox_type(values) == "string") {
        values = values.split(",");
    }

    if (vanillaSelectBox_type(values) == "array") {
        Array.prototype.slice.call(self.options).forEach(function (x) {
            if (values.indexOf(x.value) != -1) {
                foundValues.push(x.value);
                x.setAttribute("disabled", "");
            }
        });
    }
    Array.prototype.slice.call(self.listElements).forEach(function (x) {
        let val = x.getAttribute("data-value");
        if (foundValues.indexOf(val) != -1) {
            x.classList.add("disabled");
        }
    });


}

vanillaSelectBox.prototype.enableItems = function (values) {
    let self = this;
    let foundValues = [];
    if (vanillaSelectBox_type(values) == "string") {
        values = values.split(",");
    }

    if (vanillaSelectBox_type(values) == "array") {
        Array.prototype.slice.call(self.options).forEach(function (x) {
            if (values.indexOf(x.value) != -1) {
                foundValues.push(x.value);
                x.removeAttribute("disabled");
            }
        });
    }

    Array.prototype.slice.call(self.listElements).forEach(function (x) {
        if (foundValues.indexOf(x.getAttribute("data-value")) != -1) {
            x.classList.remove("disabled");
        }
    });
}

vanillaSelectBox.prototype.setValue = function (values) {
    let self = this;
    if (values == null || values == undefined || values == "") {
        self.empty();
    } else {
        if (self.isMultiple) {
            if (vanillaSelectBox_type(values) == "string") {
                if (values == "all") {
                    values = [];
                    Array.prototype.slice.call(self.options).forEach(function (x) {
                        values.push(x.value);
                    });
                } else {
                    values = values.split(",");
                }
            }
            let foundValues = [];
            if (vanillaSelectBox_type(values) == "array") {
                Array.prototype.slice.call(self.options).forEach(function (x) {
                    if (values.indexOf(x.value) != -1) {
                        x.selected = true;
                        foundValues.push(x.value);
                    } else {
                        x.selected = false;
                    }
                });
                let selectedTexts = ""
                let sep = "";
                let nrActives = 0;
                let nrAll = 0;
                Array.prototype.slice.call(self.listElements).forEach(function (x) {
                    nrAll++;
                    if (foundValues.indexOf(x.getAttribute("data-value")) != -1) {
                        x.classList.add("active");
                        nrActives++;
                        selectedTexts += sep + x.getAttribute("data-text");
                        sep = ",";
                    } else {
                        x.classList.remove("active");
                    }
                });
                if (nrAll == nrActives) {
                    let wordForAll = self.userOptions.translations.all || "all";
                    selectedTexts = wordForAll;
                } else if (self.multipleSize != -1) {
                    if (nrActives > self.multipleSize) {
                        let wordForItems = self.userOptions.translations.items || "items"
                        selectedTexts = nrActives + " " + wordForItems;
                    }
                }
                self.title.textContent = selectedTexts;
                self.privateSendChange();
            }
        } else {
            let found = false;
            let text = "";
            let classNames = ""
            Array.prototype.slice.call(self.listElements).forEach(function (x) {
                if (x.getAttribute("data-value") == values) {
                    x.classList.add("active");
                    found = true;
                    text = x.getAttribute("data-text")
                } else {
                    x.classList.remove("active");
                }
            });
            Array.prototype.slice.call(self.options).forEach(function (x) {
                if (x.value == values) {
                    x.selected = true;
                    className = x.getAttribute("class");
                    if (!className) className = "";
                } else {
                    x.selected = false;
                }
            });
            if (found) {
                self.title.textContent = text;
                if (self.userOptions.placeHolder != "" && self.title.textContent == "") {
                    self.title.textContent = self.userOptions.placeHolder;
                }
                if (className != "") {
                    self.title.setAttribute("class", className + " title");
                } else {
                    self.title.setAttribute("class", "title");
                }
            }
        }
    }
}

vanillaSelectBox.prototype.privateSendChange = function () {
    let event = document.createEvent('HTMLEvents');
    event.initEvent('change', true, false);
    this.root.dispatchEvent(event);

}

vanillaSelectBox.prototype.empty = function () {
    Array.prototype.slice.call(this.listElements).forEach(function (x) {
        x.classList.remove("active");
    });
    Array.prototype.slice.call(this.options).forEach(function (x) {
        x.selected = false;
    });
    this.title.textContent = "";
    if (this.userOptions.placeHolder != "" && this.title.textContent == "") {
        this.title.textContent = this.userOptions.placeHolder;
    }
    this.privateSendChange();
}

vanillaSelectBox.prototype.destroy = function () {
    let already = document.getElementById("btn-group-" + this.domSelector);
    if (already) {
        already.remove();
        this.root.style.display = "inline-block";
    }
}
vanillaSelectBox.prototype.disable = function () {
    let already = document.getElementById("btn-group-" + this.domSelector);
    if (already) {
        button = already.querySelector("button")
        if (button) button.classList.add("disabled");
        this.isDisabled = true;
    }
}
vanillaSelectBox.prototype.enable = function () {
    let already = document.getElementById("btn-group-" + this.domSelector);
    if (already) {
        button = already.querySelector("button")
        if (button) button.classList.remove("disabled");
        this.isDisabled = false;
    }
}



vanillaSelectBox.prototype.showOptions = function () {
    console.log(this.userOptions);
}
// Polyfills for IE
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}

function vanillaSelectBox_type(target) {
    const computedType = Object.prototype.toString.call(target);
    const stripped = computedType.replace("[object ", "").replace("]", "");
    const lowercase = stripped.toLowerCase();
    return lowercase;
}

//**Javascript Code for UI**//

//filter the label for display in dashboard

function hideLabel(event) {
    let activelabels = document.getElementsByClassName("active")
    if (event.target.className == "active") {
        document.getElementById(event.target.dataset.value).className = "hide"
    }
    else {
        document.getElementById(event.target.dataset.value).className = "col-lg bg-light mx-2"
    }

}

const chartView = document.getElementById("chartView");
const dashBoard = document.getElementById("dashBoard");
const addTask = document.getElementById("addTask");
const settings = document.getElementById("settings");
const taskName = document.getElementById("name")
const status = document.getElementById("status")
const assignee = document.getElementById("assignee");
const priority = document.getElementById("priority");
let selectLabel = document.getElementById("selectAll");
let labels = document.getElementsByClassName("labelSelected");

//add checkbox for delete the label in a settingsPage

function addDeleteCheckBox(label) {
    let divOption = document.createElement("div")
    let inputElement = document.createElement("input")
    inputElement.className = "labelSelected"
    inputElement.setAttribute("type", "checkbox")
    inputElement.id = "check" + label;
    inputElement.name = label;
    let text = document.createElement("label")
    text.textContent = label
    inputElement.onclick = (event) => ShowLabels(event.target);
    divOption.setAttribute("name", label)
    divOption.append(inputElement, text)
    document.getElementById("checkboxLabel").append(divOption);
}

//For selecting all the checkBoxes for delete

function All() {
    labels = document.getElementsByClassName("labelSelected");
    Object.values(labels).map(label => {
        label.checked = selectLabel.checked;
        ShowLabels(label)
    })
}

//For select/deselect the individual checkbox

function ShowLabels(label) {
    labels = document.getElementsByClassName("labelSelected");
    if (label.checked) {
        if (Object.values(labels).filter(label => label.checked).length == 5) {
            selectLabel.checked = true;
        }
    }
    else {
        selectLabel.checked = false
    }
}

//Delete the labels from dashboard & settings page

function deleteLabels() {
    let deleteSelected = Object.values(labels).filter(label => label.checked == true)
    if (deleteSelected.length > 0) {
        for (let label of deleteSelected) {
            const deleteDiv = document.getElementById(label.name)
            if (deleteDiv.childElementCount > 1) {
                alert(`There is some tasks in ${labelsSelected[label.name]} delete them before delete section`)
                window.location.href = "/index.html";
                return;
            }
            else {
                deleteDiv.remove();
                delete labelsSelected[label.name]
                updateTask("http://localhost:3000/labels", labelsSelected)
                Object.values(document.getElementsByTagName("option")).filter(key => key.value == "sample").forEach(key => key.remove())
                Object.values(document.getElementsByName("sample")).forEach(node => node.remove())
            }
        }
        multiselect()
        window.location.href = "/index.html";
    }
    else {
        alert("Labels are not selected for Delete")
    }
}
//Add new label for an task to display in dashboard and settings

function addNewLabel() {
    var label = prompt("Please enter your name", "labelName");
    if (label != null) {
        label = label.toUpperCase();
        labelsSelected[label] = label;
        updateTask("http://localhost:3000/labels", labelsSelected);
        window.location.href = "index.html"
    }
}

//Intialize the data of tasks,labels in dashboard

async function intialize() {
    await getTasks("http://localhost:3000/labels").then(res => res.json().then(data => labelsSelected = data));
    getTasks(url).then(res => res.json().then(tasks => {
        taskList = tasks;
        taskList.map(task => CreateTask(task));
        ChartView();
        //selectOption("mouli")
    }))
    Object.keys(labelsSelected).forEach(key => {
        addLabelsDiv(key);
        addDeleteCheckBox(key)
        selectOption(key);
        multiselect();
        addOptionsForTask(key);
    })
}

//Creates the multiselect Dropdown using VanillaSelectBox 

var multiselect = function () {
    let mySelect = new vanillaSelectBox("#myMulti", {
        translations: {
            "all": "All",
            "items": "items"
        },
        placeHolder: 'Select the labels to Display',
    });
    mySelect.setValue(Object.keys(labelsSelected));
}

//Add options for Multiselect Drop down in dashboard
function selectOption(label) {
    let option = document.createElement("option")
    option.value = label;
    option.textContent = label
    document.getElementById("myMulti").appendChild(option)
}

//getData from server
function getTasks(url) {
    return fetch(url)
}

//update data in server
function updateTask(url, task) {
    return fetch(url, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task)
    })
}

//delete data from server
function removeTask(url) {
    fetch(url, {
        method: "DELETE"
    })
}

//Add Data to the server
function storeTask(url, task) {
    return fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task)
    })
}

//Add labels in the Dashboard 
function addLabelsDiv(key) {
    let parentDiv = document.createElement("div");
    parentDiv.className = "col-lg bg-light mx-2";
    parentDiv.id = key;
    parentDiv.ondrop = drop;
    parentDiv.ondragover = allowDrop;
    let childDiv = document.createElement("div");
    childDiv.className = "d-flex justify-content-left m-2"
    let labelName = document.createElement("h5");
    labelName.textContent = labelsSelected[key]
    childDiv.appendChild(labelName);
    parentDiv.appendChild(childDiv)
    document.getElementById("labelsDiv").appendChild(parentDiv)
}

//Creates Chart view Representation of data using the canvas.js
function ChartView() {
    var doTasks = taskList.filter(task => task.status == "TO DO")
    var doingTasks = taskList.filter(task => task.status == "IN PROGRESS")
    var doneTasks = taskList.filter(task => task.status == "DONE")
    var devTasks = taskList.filter(task => task.status == "DEV DONE")
    var qaTasks = taskList.filter(task => task.status == "IN QA")
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true, theme: "light2",
        title: {
            text: " Chart View Of Tasks:",
        },
        data: [{
            type: "column",
            startAngle: 180,
            indexLabelFontSize: 18,
            radius: 500,
            yValueFormatString: "##0.00\"%\"",
            indexLabel: "{label} {y}",
            click: explodePie,
            dataPoints: Object.keys(labelsSelected).map(label => {
                let obj = {};
                obj.y = GetTaskPercentage(label);
                obj.label = labelsSelected[label];
                return obj
            })
        }]
    });
    chart.render();

    function GetTaskPercentage(type) {
        if (type == "TO DO") {
            return doTasks.length > 0 ?
                100 * doTasks.length / taskList.length :
                0;
        }
        else if (type == "DONE") {
            return doneTasks.length > 0 ?
                100 * doneTasks.length / taskList.length :
                0;
        }
        else if (type == "IN PROGRESS") {
            return doingTasks.length > 0 ?
                100 * doingTasks.length / taskList.length :
                0;
        }
        else if (type == "IN QA") {
            return qaTasks.length > 0 ?
                100 * qaTasks.length / taskList.length :
                0;
        }
        else if (type == "DEV DONE") {
            return devTasks.length > 0 ?
                100 * devTasks.length / taskList.length :
                0;
        }
    }

    function explodePie(e) {
        for (var i = 0; i < e.dataSeries.dataPoints.length; i++) {
            if (i !== e.dataPointIndex)
                e.dataSeries.dataPoints[i].exploded = false;
        }
    }
}

//creates options for labels in addTask
function addOptionsForTask(label) {
    let option = document.createElement("option")
    let text = document.createTextNode(label)
    option.appendChild(text);
    option.setAttribute("value", label)
    status.appendChild(option);
}

//Display/not different views Dashboard,Settings,Add Task,Chart
function showView(view) {
    hideView();
    document.getElementById(view).className = ""
    if (view == "chartView") {
        ChartView();
    }
}

function hideView() {
    chartView.className = dashBoard.className = addTask.className = settings.className = "hide"
}

//Add task  in the dashboard labels
function CreateTask(task) {
    var node = document.getElementById(task.status);
    if (node) {
        let wrapper = document.createElement("div");
        let card = document.createElement("div");
        let body = document.createElement("div");
        let title = document.createElement("p");
        title.setAttribute("class", "card-title");
        title.className = "text-primary"
        title.textContent = "Task-" + task.id
        let icon = document.createElement("i");
        icon.className = "fa fa-user-circle text-primary"
        icon.style.float = "right";
        icon.style.fontSize = "large";
        title.appendChild(icon)
        let taskName = document.createElement("p");
        taskName.textContent = task.name
        taskName.className = "text-warning"
        let assignee = document.createElement("p");
        assignee.textContent = "Assign to:" + task.assignee;
        assignee.className = "text-secondary"
        let priority = document.createElement("span");
        priority.textContent = task.priority
        priority.className = "bg-success spanStyle text-white"
        let icons = document.createElement("p");
        let check = document.createElement("i")
        check.className = "fa fa-check-square icon text-primary"
        let equals = document.createElement("i")
        equals.className = "fa fa-equals icon  text-warning"
        let close = document.createElement("span");
        close.className = "fa fa-trash deleteStyle text-danger";
        close.setAttribute("data-dismiss","modal")
        close.onclick = clearTask
        check.id=equals.id=task.id;
        icons.append(check, equals);
        body.setAttribute("class", "card-body");
        card.setAttribute("class", "card my-8");
        card.style.width = "100%";
        wrapper.setAttribute("class", "d-flex justify");
        wrapper.setAttribute("draggable", "true");
        wrapper.setAttribute("ondragstart", "drag(event)");
        wrapper.id = card.id = close.id = body.id =icon.id=icons.id=title.id=priority.id=assignee.id=taskName.id= task.id;
        wrapper.style.cursor = "grab"
        body.append(title, taskName, assignee, priority, icons);
        card.append(body,close);
        body.setAttribute("data-toggle", "modal");
        body.setAttribute("data-target", "#editModal")
        body.onclick = editTask
        wrapper.appendChild(card);
        node.appendChild(wrapper);
    }
}

let editName = document.getElementById("editTaskName");
let editAssign = document.getElementById("editAssignName");
let editPriority = document.getElementById("editPriority");
let editStatus = document.getElementById("editStatus")

//edit the task data with popup
function editTask(event) {
    debugger
    let editTask = taskList.find(t => t.id == event.target.id);
    if (editTask) {
        localStorage.setItem("editId", editTask.id)
        editName.value = editTask.name;
        editAssign.value = editTask.assignee;
        editPriority.value = editTask.priority;
        editStatus.innerHTML = ""
        let option = document.createElement("option")
        let text = document.createTextNode("Select type")
        option.appendChild(text);
        option.setAttribute("value", "none")
        editStatus.appendChild(option);
        Object.keys(labelsSelected).forEach(label => {
            let option = document.createElement("option")
            let text = document.createTextNode(label)
            option.appendChild(text);
            option.setAttribute("value", label)
            editStatus.appendChild(option);
        });
        editStatus.options[0].disabled = true;
        editStatus.value = editTask.status
    }
}

//send the update details of task from modal to server
function sendEditTask() {
    let task = {};
    task.status = editStatus.value;
    task.name = editName.value;
    task.assignee = editAssign.value;
    task.priority = editPriority.value;
    task.id = localStorage.getItem("editId")
    if(task.id){
    updateTask(url + task.id, task)
        .then((res) => {
            window.location.href = "index.html"
        })
    }
}

//remove the task on click delete icon in the task
function clearTask(task) {
    let taskId = event.target.id;
    debugger;
    var task = document.getElementById(taskId);
    task.remove();
    removeTask(url + taskId);
}

//Used to Drag ,Drop and Update the task in dashBoard.
function allowDrop(ev) {
    ev.preventDefault();
    ev.stopPropagation();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}


function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    if (Object.keys(labelsSelected).find(label => label == ev.target.id)) {
        ev.target.appendChild(document.getElementById(data));
        changeStatus(data, ev.target.id)
    }
    else if (ev.target.parentElement.parentElement.parentElement) {
        ev.target.parentElement.parentElement.parentElement.appendChild(document.getElementById(data));
        changeStatus(data, ev.target.parentElement.parentElement.parentElement.id)
    }
}
//Update the status on drag and drop
function changeStatus(id, type) {
    let task = taskList.find(t => t.id == id);
    task.status = type;
    updateTask(url + task.id, task)
}

//Add new task 
function addNewTask() {

    if (status.value == "none" || priority.value == "none") {
        alert("Alert Please fill all required fields.");
        return;
    }
    else {
        let task = {};
        task.status = status.value;
        task.name = taskName.value;
        task.assignee = assignee.value;
        task.priority = priority.value;
        storeTask(url, task)
            .then((res) => {
                alert("Task Added SucessFully");
                window.location.href = "index.html"
            })
    }
}

window.onload = intialize

