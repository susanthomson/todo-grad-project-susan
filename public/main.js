var todoList = document.getElementById("todo-list");
var todoListPlaceholder = document.getElementById("todo-list-placeholder");
var form = document.getElementById("todo-form");
var todoTitle = document.getElementById("new-todo");
var error = document.getElementById("error");
var countLabel = document.getElementById("count-label");
var clearCompleted = document.getElementById("clear-completed");
var filterRadios = document.getElementsByName("filter-todos");
var displayTodos = "all";

filterRadios.forEach(function (radio) {
    radio.onclick = function () {
        displayTodos = this.value;
        reloadTodoList();
    };
});

form.onsubmit = function(event) {
    var title = todoTitle.value;
    createTodo(title, function() {
        reloadTodoList();
    });
    todoTitle.value = "";
    event.preventDefault();
};

function createTodo(title, callback) {
    var createRequest = new XMLHttpRequest();
    createRequest.open("POST", "/api/todo");
    createRequest.setRequestHeader("Content-type", "application/json");
    createRequest.send(JSON.stringify({
        title: title
    }));
    createRequest.onload = function() {
        if (this.status === 201) {
            callback();
        } else {
            error.textContent = "Failed to create item. Server returned " + this.status + " - " + this.responseText;
        }
    };
}

function getTodoList(callback) {
    var createRequest = new XMLHttpRequest();
    createRequest.open("GET", "/api/todo");
    createRequest.onload = function() {
        if (this.status === 200) {
            callback(JSON.parse(this.responseText));
        } else {
            error.textContent = "Failed to get list. Server returned " + this.status + " - " + this.responseText;
        }
    };
    createRequest.send();
}

function reloadTodoList() {
    while (todoList.firstChild) {
        todoList.removeChild(todoList.firstChild);
    }
    todoListPlaceholder.style.display = "block";
    getTodoList(function(todos) {
        todoListPlaceholder.style.display = "none";
        var numTodos = 0;
        var undoneTodos = 0;
        todos.forEach(function(todo) {
            numTodos++;
            var listItem = document.createElement("li");
            if (todo.isComplete) {
                listItem.className = "completeItem";
            }
            else {
                undoneTodos++;
            }
            listItem.textContent = todo.title;
            var delButton = document.createElement("button");
            delButton.id = "del" + numTodos;
            delButton.className = "deleteButton";
            delButton.textContent = "delete";
            delButton.onclick = function (event) {
                deleteTodo(todo.id, function() {
                    reloadTodoList();
                });
            };
            listItem.appendChild(delButton);
            var completeButton = document.createElement("button");
            completeButton.id = "complete" + numTodos;
            completeButton.className = "deleteButton";
            completeButton.textContent = "complete";
            completeButton.onclick = function (event) {
                completeTodo(todo, function() {
                    reloadTodoList();
                });
            };
            listItem.appendChild(completeButton);
            if (displayTodos === "all") {
                todoList.appendChild(listItem);
            } else if (displayTodos === "completed" && todo.isComplete) {
                todoList.appendChild(listItem);
            } else if (displayTodos === "active" && !todo.isComplete) {
                todoList.appendChild(listItem);
            }
        });
        countLabel.textContent = undoneTodos;
        if (numTodos - undoneTodos !== 0) {
            clearCompleted.className = "someTodos";
        } else {
            clearCompleted.className = "noTodos";
        }
    });
}
function completeTodo(todo, callback) {
    var completeRequest = new XMLHttpRequest();
    completeRequest.open("PUT", "/api/todo/" + todo.id);
    completeRequest.setRequestHeader("Content-type", "application/json");
    completeRequest.send(JSON.stringify({
        title: todo.title,
        isComplete: true
    }));
    completeRequest.onload = function() {
        if (this.status === 200) {
            callback();
        } else {
            error.textContent = "Failed to complete item. Server returned " + this.status + " - " + this.responseText;
        }
    };
}

function deleteTodo(id, callback) {
    var deleteRequest = new XMLHttpRequest();
    deleteRequest.open("DELETE", "/api/todo/" + id);
    deleteRequest.send();
    deleteRequest.onload = function() {
        if (this.status === 200) {
            if (callback) {
                callback();
            }
        } else {
            error.textContent = "Failed to delete item. Server returned " + this.status + " - " + this.responseText;
        }
    };
}

function deleteCompleted() {
    var completed = [];
    getTodoList(function(todos) {
        todos.forEach(function (todo) {
            if (todo.isComplete) {
                completed.push(todo.id);
            }
        });
        completed.forEach(function (id) {
            deleteTodo(id);
        });
        reloadTodoList();
    });
}

reloadTodoList();
