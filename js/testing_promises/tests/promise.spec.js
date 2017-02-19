describe("Promises", function() {
  var $rootScope, controller, service, promiseSpy, deferred,
    mockList = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

  beforeEach(module('app'));
  beforeEach(inject(function($q, $controller, _service_, _$rootScope_) {
    service = _service_;
    $rootScope = _$rootScope_;
    var scope = $rootScope.$new();
    //We are just verifying we need to call the right method on the service
    spyOn(service, 'case_1').and.returnValue({ then: angular.noop });

    //Now we need to test the function that is ran in the then block
    promiseSpy = jasmine.createSpy('madeUpName').and.callFake(angular.noop);
    spyOn(service, 'case_2').and.returnValue({ then: promiseSpy });

    //Use a successful promise to return values
    successPromise = $q.when([{ id: 1 }, { id: 2 }]);
    spyOn(service, 'case_3').and.returnValue(successPromise);

    //Use a unsuccessful promise to return values
    deferred = $q.defer();
    spyOn(service, 'case_4').and.returnValue(deferred.promise);
    //Or use it for chaining
    spyOn(service, 'case_5').and.returnValue(deferred.promise);

    controller = $controller('ctrl', {
      $scope: scope,
      service: service
    });

  }));

  it("testing service method was called", function() {
    controller.getResults();
    $rootScope.$apply();
    expect(service.case_1).toHaveBeenCalledWith('queryNow');
  });

  it("testing then function capture", function() {
    controller.filteredResults();
    $rootScope.$apply();
    var promiseSpyFunction = promiseSpy.calls.mostRecent().args[0];
    //test like you would any other function
    promiseSpyFunction(mockList);
    expect(controller.filtered).toEqual([{ id: 2 }, { id: 4 }]);
  });

  it("testing then function fake promise", function() {
    var item = controller.searchResults(1);
    $rootScope.$apply();
    expect(controller.found).toEqual({ id: 1 });
  });

  it("testing then function fake error", function() {
    //If reject in main before each all promises fail
    deferred.reject('error here');
    var item = controller.handleError();
    $rootScope.$apply();
    expect(controller.error).toEqual('error here');
  });

  it("testing then function fake error", function() {
    //If reject in main before each all promises fail
    var item = controller.chained(2);
    deferred.resolve(mockList);
    $rootScope.$apply();
    expect(controller.item).toEqual({ id: 2 });
  });
});