;(function(window, document, undefined) {
	var Nemrefusion = new namespace("Nemrefusion");


	Nemrefusion.Angular.directive('qnalist',['$sce', function($sce) {
		return {
			restrict: "A",
			scope: {
				qnaId: "@",
				qnaGetmore: "@",
				qnaDates: "@"
			},
			template:'<div data-ng-class="{\'qna__item--active\': qnactrl.checkActive($index)}" class="qna__item" data-ng-repeat="item in qnactrl.items">' +
						'<div data-ng-click="qnactrl.toggle($index)" class="qna__itemHead">' +
							'<p data-ng-bind="item.CreateDate" data-ng-show="qnactrl.states.showDates">Date</p>' +
							'<h3 data-ng-bind="item.Title"></h3>' +
						'</div>' +
						'<div class="qna__itemBody">' +
							'<div class="rte" data-ng-bind-html="item.BodyText"></div>' +
						'</div>' +
						'<div data-ng-click="qnactrl.toggle($index)" data-ng-hide="qnactrl.checkActive($index)" class="qna__toggle">' +
							'<div class="icon icon--chevronright" ></div>' +
							'<div class="qna__toggletext">Se mere</div>' +
						'</div>' +
						'<div data-ng-click="qnactrl.toggle($index)" data-ng-show="qnactrl.checkActive($index)" class="qna__toggle">' +
							'<div class="icon icon--chevronright" ></div>' +
							'<div class="qna__toggletext">Se mindre</div>' +
						'</div>' +
					'</div>'+
					'<div class="qna__getmore" data-ng-class="{\'qna__getmore--show\':qnactrl.getmore.states.show}">' +
						'<div class="btn" data-ng-bind="qnactrl.getmore.text" data-ng-class="{\'btn--disabled\': !qnactrl.getmore.states.anyleftovers}" data-ng-click="qnactrl.getMore()"></div>' +
					'</div>',
			controller: function($scope, $compile, $http) {

				// Data
				$scope.qnactrl = {
					options: {
						apiurl: "http://localhost:50658/umbraco/api/operatingstatus/content/",
						numOfItems: 5
					},
					activeId: null,
					items: [],
					id: $scope.qnaId,
					currentIndexBase: 0,
					currentMultiplier: 1,
					getmore: {
						text: $scope.qnaGetmore,
						states: {
							show: false,
							anyleftovers: false
						}
					},
					states: {
						pending: false,
						success: false,
						error: false,
						showDates: false
					},
					css: {}
				};

				/* Scope Functions
				 ===========================*/
				$scope.qnactrl.convertToBool = function(value) {
					var bool = false;
					if (typeof value === "string") {
						if (value.toLowerCase() === "true") {
							bool = true;
						}
					}
					else {

					}
					return bool;
				};
				$scope.qnactrl.checkActive = function(id) {
					if (id != undefined && id === $scope.qnactrl.activeId) {
						return true;
					}
					else {
						return false;
					}
				};
				$scope.qnactrl.toggle = function(id) {
					if (id != undefined) {
						if (id === $scope.qnactrl.activeId) {
							$scope.qnactrl.activeId = null;
						}
						else {
							$scope.qnactrl.activeId = id;
						}
					}
				};
				$scope.qnactrl.parseData = function(data) {
					for (var i=0;i<data.length;i++) {
						var page = data[i];
						// Parse BodyText
						if (page.BodyText != undefined) {
							page.BodyText = $sce.trustAsHtml(page.BodyText);
						}
					}
					return data;
				};
				$scope.qnactrl.oneUpMultiplier = function(add) {
					add= (add === undefined) ? 1 : add;
					$scope.qnactrl.currentMultiplier += add;
				}
				$scope.qnactrl.getItems = function(index, numOfItems, multiplier) {
					index = (index === undefined) ? $scope.qnactrl.currentIndexBase : index;
					multiplier = (multiplier === undefined) ? $scope.qnactrl.currentMultiplier : multiplier;
					numOfItems = (numOfItems === undefined) ? $scope.qnactrl.options.numOfItems : numOfItems;
					numOfItems = numOfItems * multiplier;

					$scope.qnactrl.states.pending = true;

					$http({
						method: 'GET',
						url: $scope.qnactrl.options.apiurl + $scope.qnactrl.id + "?skip=" + index + "&take=" + numOfItems
					}).success(function(data, status, headers, config) {
						$scope.qnactrl.states.sucess = true;
						$scope.qnactrl.states.error = false;
						$scope.qnactrl.states.pending = false;
						$scope.qnactrl.currentIndexBase = index;

						$scope.qnactrl.items = $scope.qnactrl.parseData(data.Model);

						if (data.Results > (data.Take + data.Skiped)) {
							$scope.qnactrl.getmore.states.anyleftovers = true;
						}
						else {
							$scope.qnactrl.getmore.states.anyleftovers = false;
						}
					}).error(function(data, status, headers, config) {
						$scope.qnactrl.states.sucess = false;
						$scope.qnactrl.states.error = true;
						$scope.qnactrl.states.pending = false;

					});
				};
				$scope.qnactrl.getMore = function() {
					$scope.qnactrl.oneUpMultiplier();
					$scope.qnactrl.getItems();
				}
			},
			compile: function compile(tElement, tAttrs, transclude) {
				return {
					pre: function preLink(scope, iElement, iAttrs, controller) {
						if (typeof scope.qnaDates === "string" && scope.qnaDates.length > 0) {
							scope.qnactrl.states.showDates = scope.qnactrl.convertToBool(scope.qnaDates);
						}
						if (typeof scope.qnactrl.getmore.text === "string" && scope.qnactrl.getmore.text.length > 0) {
							scope.qnactrl.getmore.states.show = true;
						}

						scope.qnactrl.getItems();
					},
					post: function postLink(scope, iElement, iAttrs, controller) {



					}
				}
			}
		};
	}]);




})(window, window.document);
