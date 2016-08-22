app.service("TodoService", ["$http", function($http) { 

  this.createTodo = function(todo) {
    return $http.post("/api/todo/", JSON.stringify({title: todo.title}), {
        headers: {"Content-type": "application/json"}
        });
  };

  this.getTodos = function() {
    return $http.get("/api/todo");
  };

  this.completeTodo = function(todo) {
    return $http.put("/api/todo/" + todo.id, JSON.stringify({title: todo.title, isComplete: todo.isComplete}), {
        headers: {"Content-type": "application/json"}
        });
  };

  this.deleteTodo = function(todo) {
        return $http.delete("/api/todo/" + todo.id);
  };

}]);