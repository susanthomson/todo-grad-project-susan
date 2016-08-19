app.service('TodoService', ['$http', function($http) { 

  this.createTodo = function(title) {
    return $http.post("/api/todo/", JSON.stringify({title: title}), {
        headers: {"Content-type": "application/json"}
        });
  }

  this.getTodos = function() {
    return $http.get('/api/todo');
  }

  this.completeTodo= function(todo) {
    return $http.put("/api/todo/" + todo.id, JSON.stringify({title: todo.title, isComplete: true}), {
        headers: {"Content-type": "application/json"}
        });
  }

  this.deleteTodo = function(todo) {
        return $http.delete("/api/todo/" + todo.id);
  }
}]);