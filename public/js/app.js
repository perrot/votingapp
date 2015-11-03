function MyCtrl($scope) {
  $scope.greeting = 'Hello';
  $scope.person = 'World'
}
(function() {
  var app = angular.module('newPoll', []);
  app.controller("NewPollController", function($http){

    this.poll = {};
    $http.get('/profile')
        .success(function(data) {
            this.polls = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    this.addPoll= function(){
	$http.post('/profile',this.poll)
	.success(function(data){
		this.poll={};
		this.polls=data;
		console.log(data);
	})
	.error(function (data){
		console.log('Error:'+data);
	});
    };
  });

})();
