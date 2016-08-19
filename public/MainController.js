app.controller("MainController", ["$scope", "TodoService",
function($scope, TodoService) {
    $scope.hello = "hello susan";
    $scope.todos;
    var defaultTitle = "";
    $scope.title = defaultTitle;
    $scope.errorMessage ="";
    getTodos();
    
    function getTodos() {
        TodoService.getTodos()
            .then(function(response) { 
              return response.data;
            })
            .then(function(todos) {
                $scope.todos = todos;
            })
            .catch(function(err) {
                handleError(err, "get list");
            });
    }

    $scope.createTodo = function() {
        TodoService.createTodo($scope.title)
            .then(getTodos)
            .catch(function(err) {
                handleError(err, "create item");
        });
        $scope.title = defaultTitle;
    }

    $scope.completeTodo = function(todo) {
        TodoService.completeTodo(todo)
            .then(getTodos)
            .catch(function(err) {
                handleError(err, "complete item");
        });
    }

    $scope.deleteTodo = function (todo) {
        TodoService.deleteTodo(todo)
        .then(getTodos)
        .catch(function(err) {
            handleError(err, "delete item");
        });
    }

function handleError(err, task) {
    $scope.errorMessage = "Failed to " + task + ". Server returned " + err.status + " - " + err.message
    console.log($scope.errorMessage);
}

}]);