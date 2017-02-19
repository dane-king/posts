(function() {
  'use strict';

  function Controller(service) {
    var vm = this;

    vm.chained = function(id) {
      function findId(item) {
        return item.id === id;
      }
      service.case_5(id).then(function(results) {
        return results.filter(isEven);
      }).then(function(results) {
        vm.item = results.find(findId);
        return vm.item;
      });
    };


    vm.getResults = function() {
      return service.case_1('queryNow').then(function(result) {
        vm.results = result;
        return vm.results;
      });
    };

    function isEven(item) {
      return item.id % 2 === 0;
    }
    vm.filteredResults = function() {
      return service.case_2().then(function(results) {
        vm.filtered = results.filter(isEven);
        return vm.filtered;
      });
    };

    vm.searchResults = function(id) {
      function findId(item) {
        return item.id === id;
      }
      return service.case_3().then(function(results) {
        vm.found = results.find(findId);
        return vm.found;
      });
    };

    vm.handleError = function() {
      service.case_4()
        .then(function(results) {
          vm.results = results;
        })
        .catch(function(error) {
          vm.error = error;
        });
    };


  }

  function Service($q) {
    var results = [
      { id: 1, name: 'abc' },
      { id: 3, name: 'egw' },
      { id: 4, name: 'srt' }
    ];

    function one(args) {
      return $q.when(results);
    }

    return {
      //give multiple points to for different ways
      //to spy on
      case_1: one,
      case_2: one,
      case_3: one,
      case_4: one,
      case_5: one
    };
  };


  angular.module('app', [])
    .controller('ctrl', Controller)
    .factory('service', Service);

})();