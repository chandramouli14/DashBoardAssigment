let taskList;
let url = "http://localhost:4000/tasks/";

let selectLabel = document.getElementById("selectall");
let labels = document.getElementsByClassName("labelSelected")

function selectAll() {
    Object.values(labels).map(label => {
        label.checked = selectLabel.checked;
        ShowLabels(label)
    })
}

function ShowLabels(label) {
    let section = document.getElementById(label.name)
    if (label.checked) {
        section.className = "col-lg bg-light mx-2";
        if (Object.values(labels).filter(label => label.checked).length == 5) {
            selectLabel.checked = true;
        }
    }
    else {
        section.className = "hide"
        selectLabel.checked = false
    }
}

function intialize() {
    getTasks(url).then(res => res.json().then(tasks => {
        taskList = tasks;
        taskList.map(task => CreateTask(task));
        ChartView();
        selectAll()
    }))
}

function getTasks(url) {
    return fetch(url)
}


function updateTask(url, task) {
    return fetch(url, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task)
    })
}

function removeTask(url) {
    fetch(url, {
        method: "DELETE"
    })
}

function storeTask(url, task) {
    return fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task)
    })
}

function ChartView() {
    var doTasks = [];
    var doingTasks = [];
    var doneTasks = [];
    var devTasks = [];
    var qaTasks = [];
    if (taskList.length > 0) {
        taskList.forEach(element => {
            if (element.status == "toDo") {
                doTasks.push(element)
            }
            else if (element.status == "done") {
                doneTasks.push(element)
            }
            else if (element.status == "inProgress") {
                doingTasks.push(element)
            }
            else if (element.status == "inQA") {
                qaTasks.push(element)
            }
            else if (element.status == "devDone") {
                devTasks.push(element)
            }
        })
    }
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true, theme: "light2",
        title: {
            text: " Chart View Of Tasks:",
        },
        data: [{
            type: "line",
            startAngle: 90,
            indexLabelFontSize: 18,
            radius: 500,
            yValueFormatString: "##0.00\"%\"",
            indexLabel: "{label} {y}",
            click: explodePie,
            dataPoints: [
                { y: GetTaskPercentage("toDo"), label: "TODO" },
                { y: GetTaskPercentage("inProgress"), label: "INPROGRESS" },
                { y: GetTaskPercentage("done"), label: "DONE" },
                { y: GetTaskPercentage("devDone"), label: "DEV DONE" },
                { y: GetTaskPercentage("inQA"), label: "IN QA" }
            ]
        }]
    });
    chart.render();

    function GetTaskPercentage(type) {
        if (type == "toDo") {
            return doTasks.length > 0 ?
                100 * doTasks.length / taskList.length :
                0;
        }
        else if (type == "done") {
            return doneTasks.length > 0 ?
                100 * doneTasks.length / taskList.length :
                0;
        }
        else if (type == "inProgress") {
            return doingTasks.length > 0 ?
                100 * doingTasks.length / taskList.length :
                0;
        }
        else if (type == "inQA") {
            return qaTasks.length > 0 ?
                100 * qaTasks.length / taskList.length :
                0;
        }
        else if (type == "devDone") {
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

function showView(view) {
    hideView();
    document.getElementById(view).className = ""
    if (view == "chartView") {
        ChartView();
    }
}
const chartView = document.getElementById("chartView");
const dashBoard = document.getElementById("dashBoard");
const addTask = document.getElementById("addTask");
const settings = document.getElementById("settings")
function hideView() {
    chartView.className = dashBoard.className = addTask.className = settings.className = "hide"
}

function CreateTask(task) {
    var node = GetTaskType(task.status);
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
        title.appendChild(icon)
        let taskName = document.createElement("p");
        taskName.textContent = task.name
        taskName.className = "text-warning"
        let assignee = document.createElement("p");
        assignee.textContent = "Assign to:" + task.assignee;
        assignee.className = "text-secondary"
        let priority = document.createElement("span");
        priority.textContent = task.priority
        priority.className = "bg-success text-white"
        let icons = document.createElement("p");
        let check = document.createElement("i")
        check.className = "fa fa-check-square text-primary"
        let equals = document.createElement("i")
        equals.className = "fa fa-equals  text-warning"
        icons.append(check, equals);
        body.setAttribute("class", "card-body");
        card.setAttribute("class", "card my-8");
        card.style.width = "100%";
        wrapper.setAttribute("class", "d-flex justify");
        wrapper.setAttribute("draggable", "true");
        wrapper.setAttribute("ondragstart", "drag(event)");
        wrapper.id = task.id;
        wrapper.style.cursor = "grab"
        body.append(title, taskName, assignee, priority, icons);
        card.appendChild(body);
        wrapper.appendChild(card);
        node.appendChild(wrapper);
    }
}

function GetTaskType(value) {
    switch (value) {
        case 'toDo':
            return document.getElementById("toDo");
        case 'inProgress':
            return document.getElementById("inProgress");
        case 'devDone':
            return document.getElementById("devDone");
        case 'inQA':
            return document.getElementById("inQA");
        case 'done':
            return document.getElementById("done");
    }
}

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
    if (ev.target.id == "toDo" || ev.target.id == "inProgress" || ev.target.id == "done" || ev.target.id == "devDone" || ev.target.id == "inQA") {
        ev.target.appendChild(document.getElementById(data));
        changeStatus(data, ev.target.id)
    }
    else if (ev.target.id == "delete") {
        var task = document.getElementById(data);
        task.remove();
        removeTask(url + data);
    }
}

function changeStatus(id, type) {
    let task = taskList.find(t => t.id == id);
    task.status = type;
    updateTask(url + task.id, task)
}


function addNewTask() {
    const taskName = document.getElementById("name")
    const status = document.getElementById("status")
    const assignee = document.getElementById("assignee");
    const priority = document.getElementById("priority");

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