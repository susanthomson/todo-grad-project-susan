app.controller("MainController", ["$scope", "TodoService",
function($scope, TodoService) {
    $scope.todos = [];
    $scope.incomplete = 0;
    $scope.complete = 0;
    var defaultTitle = "";
    $scope.title = defaultTitle;
    $scope.errorMessage = "";
    $scope.displayTodos = "all";
    getTodos();
    
    function getTodos() {
        TodoService.getTodos()
            .then(function(response) { 
              return response.data;
            })
            .then(function(todos) {
                $scope.todos = todos;
                $scope.incomplete = countIncomplete();
                $scope.complete = countComplete();
            })
            .catch(function(err) {
                handleError(err, "get list");
            });
    }

    $scope.createTodo = function() {
        var todo = {title: $scope.title};
        todoAction(todo, TodoService.createTodo, "create item");
        $scope.title = defaultTitle;
    };
 
    $scope.completeTodo = function(todo) {
        todoAction(todo, TodoService.completeTodo, "complete item");
    };

    $scope.deleteTodo = function(todo) {
        todoAction(todo, TodoService.deleteTodo, "delete item");
    };

    $scope.deleteCompleted = function() {
        var completed = $scope.todos.filter(function(todo) {
            return todo.isComplete;
        });
        completed.forEach(function(todo) {
            TodoService.deleteTodo(todo)
            .catch(function(err) {
                handleError(err, "delete completed");
            });
        });
        getTodos();
    };

    $scope.hideTodo = function(todo) {
        return ($scope.displayTodos === "completed" && !todo.isComplete) ||
            ($scope.displayTodos === "active" && todo.isComplete);
    };

    function handleError(err, task) {
        $scope.errorMessage = "Failed to " + task + ". Server returned " + err.status + " - " + err.message;
    }

    function todoAction(todo, action, description) {
        action(todo)
        .then(getTodos)
        .catch(function(err) {
            handleError(err, description);
        });
    }

    function countIncomplete() {
        return $scope.todos.filter(function(todo) {
            return !todo.isComplete;
        }).length;
    }

    function countComplete() {
        return $scope.todos.length - countIncomplete();
    }

}]);