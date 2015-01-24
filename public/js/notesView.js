(function(angular) {
    var theModule = angular.module("notesView", ["ui.bootstrap"]);

    theModule.controller("notesViewController",
    [
        "$scope", "$window", "$http",
        function($scope, $window, $http) {
            $scope.notes = [];
            $scope.newNote = createBlankNote();

            //get the category name:
            var urlParts = $window.location.pathname.split("/");
            var catName = urlParts[urlParts.length - 1];

            var notesUrl = "/api/notes/" + catName;
            $http.get(notesUrl)
                .then(function (result) {
                    //success: 
                    $scope.notes = result.data;
                }, function (err) {
                    //error:
                    alert(err);
            });
            
            var socket = io.connect();

            socket.emit("join category", catName);

            socket.on("broadcast note", function (note) {
                $scope.notes.push(note);
                $scope.$apply();
            });

            $scope.save = function() {
                $http.post(notesUrl, $scope.newNote)
                    .then(function (result) {
                        //success:
                        $scope.notes.push(result.data);
                        $scope.newNote = createBlankNote();
                        socket.emit("newNote", {category: catName, note: result.data});
                }, function(err) {
                    //failure:
                    alert(err);
                });
            };
        }
    ]);

    function createBlankNote() {
        return {
            note: "",
            color: "yellow"
        };
    }

})(window.angular)