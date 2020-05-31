
let taskList;

let url = "http://localhost:3000/tasks/"


function intialize() {
    getTasks(url).then(res => res.json().then(tasks => {
        taskList = tasks;
        taskList.map(task => CreateTask(task))
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

function CreateTask(task) {
    var node = GetTaskType(task.status);
    if (node) {
        var wrapper = document.createElement("div");
        var card = document.createElement("div");
        var body = document.createElement("div");
        var title = document.createElement("p");
        title.setAttribute("class", "card-title");
        title.textContent = "Task-" + task.id
        var icon = document.createElement("i");

        icon.className = "fa fa-user-circle"
        icon.style.float = "right";
        title.appendChild(icon)
        var taskName = document.createElement("p");
        taskName.textContent = task.name
        var subTask = document.createElement("p");
        subTask.textContent = task.content
        var check = document.createElement("i")
        check.className = "fa fa-check-square"
        var equals = document.createElement("i")
        equals.className = "fa fa-equals"
        body.setAttribute("class", "card-body");
        card.setAttribute("class", "card my-8");
        card.style.width = "100%";
        wrapper.setAttribute("class", "d-flex justify");
        wrapper.setAttribute("draggable", "true");
        wrapper.setAttribute("ondragstart", "drag(event)");
        wrapper.id = task.id;
        wrapper.style.cursor = "grab"
        body.append(title, taskName, subTask, check, equals);
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
    if (ev.target.id == "toDo" || ev.target.id == "inProgress" || ev.target.id == "done") {
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
    const content = document.getElementById("content");
    let task = {};
    task.status = status.value;
    task.name = taskName.value;
    task.content = content.value;
    if (status.value == "none") {
        alert("Select Task Status");
        return;
    }
    storeTask(url, task)
        .then((res) => { debugger; window.location.href = "index.html" })
}

window.onload = intialize