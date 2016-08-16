var todoList = document.getElementById("todo-list");
var todoListPlaceholder = document.getElementById("todo-list-placeholder");
var form = document.getElementById("todo-form");
var todoTitle = document.getElementById("new-todo");
var error = document.getElementById("error");

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
        todos.forEach(function(todo) {
            numTodos++;
            var listItem = document.createElement("li");
            if (todo.isComplete) {
                listItem.className = "completeItem";
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
            todoList.appendChild(listItem);
        });
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
            callback();
        } else {
            error.textContent = "Failed to delete item. Server returned " + this.status + " - " + this.responseText;
        }
    };
}

reloadTodoList();
