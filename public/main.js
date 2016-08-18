var todoList = document.getElementById("todo-list");
var todoListPlaceholder = document.getElementById("todo-list-placeholder");
var form = document.getElementById("todo-form");
var todoTitle = document.getElementById("new-todo");
var error = document.getElementById("error");
var countLabel = document.getElementById("count-label");
var clearCompleted = document.getElementById("clear-completed");
var filterRadios = document.getElementsByName("filter-todos");
var displayTodos = "all";

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}

function filterTodos(event) {
    displayTodos = event.target.value;
    reloadTodoList();
}

form.onsubmit = function(event) {
    var title = todoTitle.value;
    createTodo(title).then(reloadTodoList);
    todoTitle.value = "";
    event.preventDefault();
};

function createTodo(title) {
    return fetch("/api/todo/", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({title: title})
    })
        .then(checkStatus)
        .catch(function(err) {
            error.textContent = "Failed to create item. Server returned " + err.response.status + " - " + err.message;
        });
}

function getTodoList() {
    return fetch("/api/todo")
        .then(checkStatus)
        .then(function(response) {
            return response.text();
        })
        .then(JSON.parse)
        .catch(function(err) {
            error.textContent = "Failed to get list. Server returned " + err.response.status + " - " + err.message;
        });
}

function reloadTodoList() {
    while (todoList.firstChild) {
        todoList.removeChild(todoList.firstChild);
    }
    todoListPlaceholder.style.display = "block";
    getTodoList().then(createTodoList);
}

function createTodoList(todos) {
    todoListPlaceholder.style.display = "none";
    var numTodos = 0;
    var undoneTodos = 0;
    var visibleTodos = todos.filter(function(todo) {
        return (displayTodos === "all") ||
            (displayTodos === "completed" && todo.isComplete) ||
            (displayTodos === "active" && !todo.isComplete);
    });
    visibleTodos.forEach(function(todo) {
        numTodos++;
        var listItem = document.createElement("li");
        if (todo.isComplete) {
            listItem.className = "completeItem";
        }
        else {
            undoneTodos++;
        }
        listItem.textContent = todo.title;
        listItem.appendChild(createTaskButton(todo, numTodos, "delete", deleteTodo));
        listItem.appendChild(createTaskButton(todo, numTodos, "complete", completeTodo));
        todoList.appendChild(listItem);
    });
    countLabel.textContent = undoneTodos;
    if (numTodos - undoneTodos !== 0) {
        clearCompleted.className = "someTodos";
    } else {
        clearCompleted.className = "noTodos";
    }
}

function createTaskButton(todo, numTodos, task, clickFunction) {
    var taskButton = document.createElement("button");
    taskButton.id = task + numTodos;
    taskButton.textContent = task;
    taskButton.onclick = function(event) {
        clickFunction(todo).then(reloadTodoList);
    };
    return taskButton;
}

function completeTodo(todo) {
    return fetch("/api/todo/" + todo.id, {
            method: "PUT",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({title: todo.title, isComplete: true})
        })
        .then(checkStatus)
        .catch(function(err) {
            error.textContent = "Failed to complete item. Server returned " + err.response.status + " - " + err.message;
        });
}

function deleteTodo(todo) {
    return fetch("/api/todo/" + todo.id, {method: "DELETE"})
        .then(checkStatus)
        .catch(function(err) {
            error.textContent = "Failed to delete item. Server returned " + err.response.status + " - " + err.message;
        });
}

function deleteCompleted() {
    var completed = [];
    getTodoList().then(function(todos) {
        todos.forEach(function(todo) {
            if (todo.isComplete) {
                completed.push(todo);
            }
        });
        completed.forEach(function(todo) {
            deleteTodo(todo);
        });
        reloadTodoList();
    });
}

reloadTodoList();
