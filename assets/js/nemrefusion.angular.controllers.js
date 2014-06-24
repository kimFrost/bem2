;(function(window, document, undefined) {
	var Nemrefusion = new namespace("Nemrefusion");


	// Newsletter Controller
	Nemrefusion.Angular.controller('NewsletterCtrl', ['$scope', '$element', '$http',  function($scope, $element, $http) {
		$scope.data = ($scope.data === undefined) ? {} : $scope.data;
		$scope.states = ($scope.states === undefined) ? {} : $scope.states;
		$scope.options = ($scope.options === undefined) ? {} : $scope.options;

		// Data
		$scope.newsletterctrl = {
			options: {},
			states: {
				validated: false,
				pending: false,
				postedSuccess: false,
				postedError: false,
				notValidated: false
			},
			css: {}
		};



		/* Scope Functions
		 ===========================*/
		$scope.newsletterctrl.postform = function(action) {
			action = (action === undefined) ? "unsubscribe" : action;
			//Nemrefusion.log($scope.newsletterform);
			if (!$scope.newsletterform.$invalid) {
				var url = "";
				if (action === "subscribe") {
					url = "/umbraco/api/";
				}
				else if (action === "unsubscribe") {
					url = "/umbraco/api/";
				}


				return false;
				$scope.newsletterctrl.states.notValidated = false;
				$scope.newsletterctrl.states.pending = true;
				$http({
					method: 'POST',
					url: url,
					data: $scope.newsletterform.formdata
				}).success(function(data, status, headers, config) {
					$scope.newsletterctrl.states.pending = false;
					$scope.newsletterctrl.states.postedSuccess = true;
					$scope.newsletterctrl.states.postedError = false;
					$scope.newsletterctrl.clearform();
				}).error(function(data, status, headers, config) {
					$scope.newsletterctrl.states.pending = false;
					$scope.newsletterctrl.states.postedSuccess = false;
					$scope.newsletterctrl.states.postedError = true;
				});


			}
			else {
				$scope.newsletterctrl.states.notValidated = true;
				for (var i=0;i<$scope.newsletterform.$error.required.length;i++) {
					var required = $scope.newsletterform.$error.required[i];
					required.$setViewValue(required.$viewValue);
				}
			}
		};
		$scope.newsletterctrl.clearform = function() {
			$scope.newsletterform.formdata = {};
		};


		/* Bindings
		 ===========================*/
		// Scope Events

		// User Events

	}]);


	// Search Controller
	Nemrefusion.Angular.controller('SearchCtrl', ['$scope', '$element', '$http', '$rootScope', '$sce',  function($scope, $element, $http, $rootScope, $sce) {
		$scope.data = ($scope.data === undefined) ? {} : $scope.data;
		$scope.states = ($scope.states === undefined) ? {} : $scope.states;
		$scope.options = ($scope.options === undefined) ? {} : $scope.options;

		// searchctrl
		$scope.searchctrl = {
			options: {
				apiurl: "/umbraco/api/search/perform?q="
			},
			searchvalue: new String(),
			results: {
				pages: [],
				states: {
					show: false,
					pending: false
				},
				css: {
					height: null
				}
			},
			states: {

			},
			css: {}
		};

		/* Scope Functions
		===========================*/
		$scope.searchctrl.updateHeight = function() {
			$scope.searchctrl.results.css.height = window.innerHeight - ($element[0].getBoundingClientRect().top) + "px";
		};
		$scope.searchctrl.toggleSearch = function(state) {
			state = (state === undefined) ? "toggle" : state;
			if (state === "toggle") {
				$scope.searchctrl.states.showSearch = !$scope.searchctrl.states.showSearch;
				$rootScope.$broadcast('overlay__toggleOverlay', {
					state: $scope.searchctrl.states.showSearch
				});
			}
			else {
				$scope.searchctrl.states.showSearch = state;
				$rootScope.$broadcast('overlay__toggleOverlay', {
					state: state
				});
			}
			if ($scope.searchctrl.states.showSearch) {
				$rootScope.$broadcast('primmenu__lockIndicator');
			}
			else {
				$rootScope.$broadcast('primmenu__releaseIndicator');
			}
		};
		$scope.searchctrl.parseData = function(data) {
			for (var i=0;i<data.length;i++) {
				var page = data[i];

				// Parse Title
				if (page.Title != undefined) {
					page.Title = "<p>" + page.Title + "</p>";
					page.Title = page.Title.replace(new RegExp($scope.searchctrl.searchvalue,"gi"), '<span class="search__highlight">'+$scope.searchctrl.searchvalue+'</span>')
					page.Title = $sce.trustAsHtml(page.Title);
				}

				// Parse BodyText
				if (page.BodyText != undefined) {
					page.BodyText = page.BodyText.replace(new RegExp($scope.searchctrl.searchvalue,"gi"), '<span class="search__highlight">'+$scope.searchctrl.searchvalue+'</span>')
					page.BodyText = $sce.trustAsHtml(page.BodyText);
				}
			}
			return data;
		};
		$scope.searchctrl.requestResult = function(query) {
			if (query != undefined && typeof query == "string") {
				if (query.length > 2) {

					$scope.searchctrl.results.states.pending = true;
					$scope.searchctrl.results.states.show = true;
					$scope.searchctrl.results.states.error = false;

					$http({
						method: 'GET',
						url: $scope.searchctrl.options.apiurl + query
					}).success(function(data, status, headers, config) {
						$scope.searchctrl.results.states.pending = false;
						$scope.searchctrl.results.states.error = false;
						$scope.searchctrl.results.pages = $scope.searchctrl.parseData(data.pages);

					}).error(function(data, status, headers, config) {
						$scope.searchctrl.results.states.pending = false;
						$scope.searchctrl.results.states.error = true;
						$scope.searchctrl.results.pages = [];
					});

					/*
					var xsrf = {serviceName: "getProperties"};
					$http({
						method: 'POST',
						url: "http://www.boligportal.dk/api/soeg_leje_bolig.php",
						transformRequest: function(obj) {
							var str = [];
							for(var p in obj)
								str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
							return str.join("&");
						},
						data: xsrf,
						headers: {'Content-Type': 'application/x-www-form-urlencoded'}
					}).success(function(data, status, headers, config) {
						Nemrefusion.log("success");
						Nemrefusion.log(data);
					}).error(function(data, status, headers, config) {
						Nemrefusion.log("error");
						Nemrefusion.log(data);
					});
					*/
				}
				else {
					$scope.searchctrl.results.states.show = false;
					$scope.searchctrl.results.states.error = false;
				}
			}
		};

		/* Bindings
		===========================*/
		// Scope Events
		$rootScope.$on('searchCtrlToggleSearch',function(event, data) {
			if (data != undefined && data.state != undefined) {
				$scope.searchctrl.toggleSearch(data.state);
			}
		});

		// User Events
		// Scroll
		angular.element(window).bind('scroll', function(event) {
			$scope.searchctrl.updateHeight();
		});
		// Search value change
		$scope.$watch('searchctrl.searchvalue', function(newval, oldval) {
			$scope.searchctrl.requestResult(newval);
		});

		$scope.searchctrl.updateHeight();
	}]);


	// Status Controller
	Nemrefusion.Angular.controller('StatusCtrl', ['$scope', '$element', '$http',  function($scope, $element, $http) {
		$scope.data = ($scope.data === undefined) ? {} : $scope.data;
		$scope.states = ($scope.states === undefined) ? {} : $scope.states;
		$scope.options = ($scope.options === undefined) ? {} : $scope.options;

		// statusctrl
		$scope.statusctrl = {
			options: {},
			timeupdated: new String(),
			getall: Boolean($element.attr('data-statusctrl-getall')),
			systems: {
				nemrefusion: {
					key: "IsNemRefusionLive",
					states: {
						isup: false
					}
				},
				cpr: {
					key: "IsCprLive",
					states: {
						isup: false
					}
				},
				cvr: {
					key: "IsCvrLive",
					states: {
						isup: false
					}
				},
				eindkomst: {
					key: "IsEIndkomstLive",
					states: {
						isup: false
					}
				},
				municipality: {
					key: "IsMunicipalitySystemLive",
					states: {
						isup: false
					}
				}
			},
			states: {
				success: false,
				pending: true,
				error: false,
				isup: false
			},
			css: {}
		};

		/* Scope Functions
		===========================*/
		$scope.statusctrl.requestStatus = function() {
			$scope.statusctrl.states.pending = true;
			var url = "",
				getall = false;
			if ($scope.statusctrl.getall != undefined && $scope.statusctrl.getall != "") {
				url = "/umbraco/api/operatingstatus/systems";
				getall = true;
			}
			else {
				url = "/umbraco/api/operatingstatus/overall";
			}
			$http({
				method: 'GET',
				url: url
			}).success(function(data, status, headers, config) {
				$scope.statusctrl.states.pending = false;
				$scope.statusctrl.states.error = false;
				$scope.statusctrl.states.success = true;
				if (getall) {
					for (var key in $scope.statusctrl.systems) {
						var system = $scope.statusctrl.systems[key];
						if (data[system.key] != undefined) {
							system.states.isup = data[system.key];
						}
					}
				}
				else {
					$scope.statusctrl.states.isup = data;
				}
				$scope.statusctrl.updateTime();
			}).error(function(data, status, headers, config) {
				$scope.statusctrl.states.pending = false;
				$scope.statusctrl.states.error = true;
				$scope.statusctrl.states.success = false;
				$scope.statusctrl.updateTime();
			});
		};
		// Update Time
		$scope.statusctrl.updateTime = function() {
			var date = new Date();
			var minutes = date.getMinutes();
			if (minutes < 10) minutes = "0" + minutes.toString();
			var hours = date.getHours();
			if (hours < 10) hours = "0" + hours.toString();
			$scope.statusctrl.timeupdated = hours + "." + minutes;
		}

		/* Bindings
		===========================*/
		// Scope Events

		// User Events

		$scope.statusctrl.requestStatus();
	}]);


	// MinHeight Controller
	Nemrefusion.Angular.controller('MinHeightCtrl', ['$scope', '$element', '$rootScope',  function($scope, $element, $rootScope) {
		$scope.data = ($scope.data === undefined) ? {} : $scope.data;
		$scope.states = ($scope.states === undefined) ? {} : $scope.states;
		$scope.options = ($scope.options === undefined) ? {} : $scope.options;

		// Foxhound
		$scope.minheightctrl = {
			options: {},
			data: {

			},
			states: {

			},
			css: {}
		};

		/* Scope Functions
		===========================*/
		$scope.minheightctrl.setMinHeight = function(height) {
			if (height === false) {
				$scope.minheightctrl.css.minHeight = null;
			}
			else {
				$scope.minheightctrl.css.minHeight = height + "px";
			}
		}

		/* Bindings
		===========================*/
		// Scope Events

		// User Events

	}]);



	// Sticky Controller
	Nemrefusion.Angular.controller('StickyCtrl', ['$scope', '$element', '$rootScope', function($scope, $element, $rootScope) {
		//$scope.data = ($scope.data === undefined) ? {} : $scope.data;
		$scope.data = {};
		//$scope.states = ($scope.states === undefined) ? {} : $scope.states;
		$scope.states = {};
		//$scope.css = ($scope.css === undefined) ? {} : $scope.css;
		$scope.css = {};
		$scope.childcss = {};
		$scope.options = ($scope.options === undefined) ? {} : $scope.options;
		// Options

		// Data
		$scope.data.originalOffsetTop = (function(){
			var el = $element[0];
			var offsets = el.getBoundingClientRect();
			return offsets.top + (window.scrollY || window.pageYOffset);
		})();
		$scope.data.originalOffsetLeft = (function(){
			var el = $element[0];
			var offsets = el.getBoundingClientRect();
			return offsets.left + (window.scrollX || window.pageXOffset);
		})();
		$scope.data.stickyTopPos = (function() {
			var value = $element.attr('data-sticky-topoffset');
			value = parseInt(value);
			if (isNaN(value)) value = 0;
			return value;
		})();
		$scope.data.stickyFill = (function() {
			var value = $element.attr('data-sticky-fill');
			return Boolean(value);
		})();


		// CSS
		$scope.css.top = "";
		$scope.css.left = "";
		$scope.css.width = "inherit";
		$scope.css.height = "";
		$scope.childcss.height = "";

		/*
		if ($scope.data.stickyFill) {
			$scope.css.height = window.innerHeight - $element[0].getBoundingClientRect().top + "px";
			console.log(window.innerHeight);
			console.log($scope.css.height);
			console.log($element[0].getBoundingClientRect().top);
		}
		*/

		// States
		$scope.states.sticky = false;
		$scope.states.rendered = false;
		$scope.states.dataRead = false;
		//$scope.states.showSearch = false;

		/* Scope Functions
		===========================*/
		$scope.updateStickyData = function() {
			$scope.states.rendered =  $scope.visible($element[0]);
			if ($scope.states.rendered && !$scope.states.dataRead) {
				$scope.data.originalOffsetTop = (function(){
					var el = $element[0];
					var offsets = el.getBoundingClientRect();
					return offsets.top + (window.scrollY || window.pageYOffset);
				})();
				$scope.data.originalOffsetLeft = (function(){
					var el = $element[0];
					var offsets = el.getBoundingClientRect();
					return offsets.left + (window.scrollX || window.pageXOffset);
				})();
				$scope.states.dataRead = true;

				var _data = {};

				_data.logContent = "";
				_data.logContent += "<p>visible: " + $scope.states.rendered + "</p>";
				_data.logContent += "<p>originalOffsetTop: " + $scope.data.originalOffsetTop + "</p>";
				_data.logContent += "<p>originalOffsetLeft: " + $scope.data.originalOffsetLeft + "</p>";
				//_data.logContent += "<p>window.scrollY: " + window.scrollY + "</p>";
				//_data.logContent += "<p>window.pageYOffset: " + window.pageYOffset + "</p>";
				//_data.logContent += "<p>getBoundingClientRect: " + $element[0].getBoundingClientRect().top + "</p>";

				$rootScope.$broadcast('devLog', {
					log: "Read",
					name: $scope.$id,
					content: _data.logContent
				});
			}
			else if ($scope.states.rendered && $scope.states.dataRead){
				if (!$scope.states.sticky) {
					$scope.data.originalOffsetTop = (function(){
						var el = $element[0];
						var offsets = el.getBoundingClientRect();
						return offsets.top + (window.scrollY || window.pageYOffset);
					})();
					$scope.data.originalOffsetLeft = (function(){
						var el = $element[0];
						var offsets = el.getBoundingClientRect();
						return offsets.left + (window.scrollX || window.pageXOffset);
					})();
				}
			}
		};
		$scope.updateStickyStatus = function() {
			$scope.updateStickyData();
			var _data = {};
			_data.windowScrollTop = (window.scrollY || window.pageYOffset);
			_data.diff = $scope.data.originalOffsetTop - _data.windowScrollTop - $scope.data.stickyTopPos;

			if (_data.diff <= 0 && $scope.states.rendered) {
				//if (_data.windowScrollTop > $scope.data.originalOffsetTop) {
				$scope.states.sticky = true;
				$scope.css.top = $scope.data.stickyTopPos.toString() + "px";
				//$scope.css.left = $scope.data.originalOffsetLeft.toString() + "px";

				_data.logContent = "";
				_data.logContent += "<p>:visible: " + $scope.states.rendered + "</p>";
				_data.logContent += "<p>windowScrollTop: " + _data.windowScrollTop + "</p>";
				_data.logContent += "<p>window.pageYOffset : " + window.pageYOffset  + "</p>";
				_data.logContent += "<p>data.originalOffsetTop: " + $scope.data.originalOffsetTop + "</p>";
				_data.logContent += "<p>data.stickyTopPos: " + $scope.data.stickyTopPos + "</p>";
				_data.logContent += "<p>Diff: " + _data.diff + "</p>";

				$rootScope.$broadcast('devLog', {
					log: true,
					name: $scope.$id,
					content: _data.logContent
				});
			}
			else {
				$scope.states.sticky = false;
				$scope.css.top = "";
				//$scope.css.left = "";

				_data.logContent = "";
				_data.logContent += "<p>visible: " + $scope.states.rendered + "</p>";
				_data.logContent += "<p>windowScrollTop: " + _data.windowScrollTop + "</p>";
				_data.logContent += "<p>window.pageYOffset : " + window.pageYOffset  + "</p>";
				_data.logContent += "<p>data.originalOffsetTop: " + $scope.data.originalOffsetTop + "</p>";
				_data.logContent += "<p>data.stickyTopPos: " + $scope.data.stickyTopPos + "</p>";
				_data.logContent += "<p>Diff: " + _data.diff + "</p>";

				$rootScope.$broadcast('devLog', {
					log: false,
					name: $scope.$id,
					content: _data.logContent
				});
			}
			if ($scope.data.stickyFill) {
				if ($element[0].getBoundingClientRect().top >= 0) {
					//$scope.css.height = window.innerHeight - $element[0].getBoundingClientRect().top + "px";
					$scope.childcss.height = window.innerHeight - $element[0].getBoundingClientRect().top + "px";
				}
			}
			_data = null;
		};
		$scope.visible = function(element) {
			if (element.offsetWidth > 0 && element.offsetHeight > 0) {
				return true;
			}
			else {
				return false;
			}
		};
		$scope.toggleMobileMenu = function(state) {
			state = (state === undefined) ? "toggle" : state;
			$rootScope.$broadcast('foxhound__toggleShow', {
				state: state
			});
		};

		$scope.toggleSearch = function(state) {
			state = (state === undefined) ? "toggle" : state;
			$rootScope.$broadcast('searchCtrlToggleSearch', {
				state: state
			});
			/*
			if (state === "toggle") {
				$scope.states.showSearch = !$scope.states.showSearch;
				$rootScope.$broadcast('overlay__toggleOverlay', {
					state: $scope.states.showSearch
				});

			}
			else {
				$scope.states.showSearch = state;
				$rootScope.$broadcast('overlay__toggleOverlay', {
					state: state
				});
			}
			if ($scope.states.showSearch) {
				$rootScope.$broadcast('primmenu__lockIndicator');
			}
			else {
				$rootScope.$broadcast('primmenu__releaseIndicator');
			}
			*/
		};


		/* Bindings
		===========================*/
		// Scroll
		angular.element(window).bind("scroll",function() {
			//Nemrefusion.log("scroll");
			$scope.$apply(function(){
				$scope.updateStickyStatus();
			});
		});
		// Resize
		angular.element(window).bind("resize",function() {
			$scope.$apply(function() {
				$scope.updateStickyStatus();
			});
		});
		// Hide search event
		/*
		$rootScope.$on('stickyCtrlToggleSearch',function(event, data) {
			if (data != undefined && data.state != undefined) {
				$scope.toggleSearch(data.state);
			}
		});
		*/
		/*
		// Press ESC
		document.onkeydown = function(event) {
			event = event || window.event;
			if(event.which === 27) {
				$scope.$apply(function() {
					$scope.toggleSearch();
				});
			}
		};
		*/

		if ($scope.$parent.minheightctrl != undefined) {
			$scope.$parent.minheightctrl.setMinHeight($element[0].clientHeight + 50);
		}

		$scope.updateStickyStatus();
	}]);



	// Primmenu Controller
	Nemrefusion.Angular.controller('PrimmenuCtrl', ['$scope', '$element', '$rootScope', '$timeout', function($scope, $element, $rootScope, $timeout) {

		$scope.data = ($scope.data === undefined) ? {} : $scope.data;
		$scope.states = ($scope.states === undefined) ? {} : $scope.states;
		$scope.options = ($scope.options === undefined) ? {} : $scope.options;
		$scope.css = ($scope.css === undefined) ? {} : $scope.css;

		// Options
		$scope.options.indicatorTimeReset = 500;

		// Data
		$scope.data.timerId = null;

		// States
		$scope.states.activemenu = new String();
		$scope.states.showIndicator = false;

		// Indicator
		$scope.indicator = {
			options: {},
			data: {
				preSetPosition: new String()
			},
			states: {
				locked: false
			},
			css: {
				left: "0px"
			}
		};

		/* Scope Functions
		===========================*/
		$scope.moveIndicator = function(left, preSetActive) {
			if ($scope.indicator.states.locked) return false;
			$timeout.cancel($scope.data.timerId);
			$scope.indicator.css.left = left.toString() + "px";
			if (!$scope.states.showIndicator) $scope.states.showIndicator = true;
			if (preSetActive === true) {
				$scope.indicator.data.preSetPosition = left;
			}
		};
		$scope.resetIndicator = function() {
			if ($scope.indicator.states.locked) return false;
			$scope.data.timerId = $timeout(function() {
				$scope.indicator.css.left = $scope.indicator.data.preSetPosition.toString()+"px";
			}, $scope.options.indicatorTimeReset);
		}
		$scope.toggleLockIndicator = function() {
			if ($scope.indicator.states.locked) {
				$scope.releaseIndicator();
			}
			else {
				$scope.lockIndicator();
			}
		};
		$scope.lockIndicator = function() {
			$scope.indicator.states.locked = true;
		};
		$scope.releaseIndicator = function() {
			$scope.indicator.states.locked = false;
			$scope.resetIndicator();
		};

		/* Bindings
		===========================*/
		$rootScope.$on('primmenu__lockIndicator',function(event) {
			$scope.lockIndicator();
		});
		$rootScope.$on('primmenu__releaseIndicator',function(event) {
			$scope.releaseIndicator();
		});

	}]);


	// PrimmenuItem Controller
	Nemrefusion.Angular.controller('PrimmenuItemCtrl', ['$scope', '$element', '$rootScope', function($scope, $element, $rootScope) {
		$scope.data = {};
		$scope.states = ($scope.states === undefined) ? {} : $scope.states;
		$scope.options = ($scope.options === undefined) ? {} : $scope.options;
		$scope.css = ($scope.css === undefined) ? {} : $scope.css;
		// Options

		// Data
		$scope.data.leftPos = $element[0].getBoundingClientRect().left + ($element[0].getBoundingClientRect().width / 2) - $element[0].parentNode.getBoundingClientRect().left;
		$scope.data.preSetActive = $element.hasClass('primmenu__item--active');

		// States

		// Css

		/* Scope Functions
		 ===========================*/

		/* Bindings
		 ===========================*/
		$element.bind('mouseenter', function()  {
			$scope.$apply(function() {
				$scope.data.leftPos = $element[0].getBoundingClientRect().left + ($element[0].getBoundingClientRect().width / 2) - $element[0].parentNode.getBoundingClientRect().left;
				$scope.moveIndicator($scope.data.leftPos);
			});
		});

		$element.bind('mouseleave', function()  {
			$scope.$apply(function() {
				$scope.resetIndicator();
			});
		});

		if ($scope.data.preSetActive) {
			$scope.moveIndicator($scope.data.leftPos, true);
		}

	}]);





	// Qna Controller
	Nemrefusion.Angular.controller('QnaCtrl', ['$scope', '$element', '$http', function($scope, $element, $http) {

		// Data
		$scope.qnactrl = {
			options: {
				apiurl: "http://localhost:50658/umbraco/api/operatingstatus/content/",
				numOfItems: 5
			},
			activeId: null,
			items: [],
			id: $element.attr('data-qna-id'),
			states: {
				pending: false,
				success: false,
				error: false
			},
			css: {}
		};

		/* Scope Functions
		 ===========================*/
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

		/* Bindings
		===========================*/


	}]);



	// Foxhound Controller
	Nemrefusion.Angular.controller('FoxhoundCtrl', ['$scope', '$element', '$rootScope', function($scope, $element, $rootScope) {
		$scope.data = ($scope.data === undefined) ? {} : $scope.data;
		$scope.states = ($scope.states === undefined) ? {} : $scope.states;
		$scope.options = ($scope.options === undefined) ? {} : $scope.options;

		// Foxhound
		$scope.foxhoundctrl = {
			options: {},
			data: {
				lastYPos: window.scrollY
			},
			states: {
				show: false
			},
			css: {}
		};

		// Options

		// Data

		// States

		/* Scope Functions
		===========================*/
		$scope.toggleShow = function(state) {
			state = (state === undefined) ? "toggle" : state;
			if (state === "toggle") {
				if ($scope.foxhoundctrl.states.show) {
					$scope.toggleShow('hide');
				}
				else {
					$scope.toggleShow('show');
				}
			}
			if (state === "hide") {
				$scope.foxhoundctrl.states.show = false;
				//$scope.foxhoundctrl.data.lastYPos = (window.scrollY || window.pageYOffset);
				$scope.foxhoundctrl.data.lastYPos = (window.scrollY || window.scrollY);
			}
			if (state === "show") {
				$scope.foxhoundctrl.states.show = true;
			}
			$rootScope.$broadcast('scroll__toggleScroll', {
				state: state
			});
		};


		/* Bindings
		===========================*/
		// Scope Events
		$rootScope.$on('foxhound__toggleShow',function(event, data) {
			if (data != undefined && data.state != undefined) {
				$scope.toggleShow(data.state);
			}
		});
		// User Events
		$element.bind('scroll', function(event) {
			if ($scope.foxhoundctrl.states.show) {
				if (event.stopPropagation)    event.stopPropagation();
				if (event.cancelBubble!=null) event.cancelBubble = true;
				var child = $element.children();
				var scrollDistFromTop = $element[0].scrollTop;
				var scrollDistFromBottom = child[0].clientHeight - $element[0].scrollTop - $element[0].offsetHeight;

				if (scrollDistFromTop === 0 && scrollDistFromBottom === 0) {

				}
				else if (scrollDistFromTop === 0) {
					$element[0].scrollTop = 1;
				}
				else if (scrollDistFromBottom === 0) {
					$element[0].scrollTop = child[0].clientHeight - $element[0].offsetHeight - 1;
				}
				// Posisition scrollbar always at least 1px from bottom and 1px from top to prevent escape scroll on window container
			}
		});
		angular.element(window).bind('scroll', function(event) {
			if ($scope.foxhoundctrl.states.show) {
				window.scrollTo(0, $scope.foxhoundctrl.data.lastYPos);
			}
			else {
				$scope.foxhoundctrl.data.lastYPos = (window.scrollY || window.scrollY);
			}
		});
	}]);



	// Scroll Controller (For disable scroll with overflow hidden)
	Nemrefusion.Angular.controller('ScrollCtrl', ['$scope', '$element', '$rootScope', function($scope, $element, $rootScope) {

		$scope.scrollctrl = {
			options: {},
			data: {
				lastYPos: window.scrollY
			},
			states: {
				disable: false
			},
			css: {}
		};



		/* Scope Functions
		===========================*/
		$scope.toggleScroll = function(state) {
			state = (state === undefined) ? "toggle" : state;
			if (state === "toggle") {
				if ($scope.scrollctrl.states.disable) {
					state = "show";
				}
				else {
					state = "hide";
				}
			}
			if (state === "hide") {
				$scope.scrollctrl.states.disable = true;
				$scope.scrollctrl.data.lastYPos = (window.scrollY || window.pageYOffset);
				$scope.scrollctrl.css.height = "100%";
				$scope.scrollctrl.css.overflow = "hidden";

			}
			if (state === "show") {
				$scope.scrollctrl.states.disable = false;
				$scope.scrollctrl.css.height = "";
				$scope.scrollctrl.css.overflow = "";
			}
		};

		/* Bindings
		 ===========================*/
		// Scope Events
		$rootScope.$on('scroll__toggleScroll',function(event, data) {
			if (data != undefined && data.state != undefined) {
				//$scope.toggleScroll(data.state);
			}
		});
		// User Events
		angular.element(window).bind('scroll', function(event) {
			/*
			console.log($scope.states.disable);
			if ($scope.states.disable) {
				event.preventDefault();
				window.scrollTo(0, $scope.data.lastYPos);
			}
			else {
				$scope.data.lastYPos = window.scrollY;
			}
			*/
		});

	}]);


	// Scroll Controller (For disable scroll with overflow hidden)
	Nemrefusion.Angular.controller('mobilemenuCtrl', ['$scope', '$element', '$rootScope', function($scope, $element, $rootScope) {

		$scope.mobilemenuctrl = {
			options: {},
			data: {
				activelist: []
			},
			states: {},
			css: {}
		};

		/* Scope Functions
		===========================*/
		$scope.toggleSubItems = function(id, state) {
			state = (state === undefined) ? "toggle" : state;
			if (id != undefined) {
				var found = false;
				for (var i=0;i<$scope.mobilemenuctrl.data.activelist.length; i++) {
					var itemid = $scope.mobilemenuctrl.data.activelist[i];
					if (itemid === id) {
						$scope.mobilemenuctrl.data.activelist.splice(i,1);
						found = true;
					}
				}
				if (!found) {
					$scope.mobilemenuctrl.data.activelist.push(id);
				}
			}
		};
		$scope.check = function(id) {
			if (id != undefined) {
				if ($scope.mobilemenuctrl.data.activelist.indexOf(id) != -1) {
					return true;
				}
				else {
					return false;
				}
			}
		};


		/* Bindings
		===========================*/
		// Scope Events

		// User Events

	}]);


	// Scroll Controller (For disable scroll with overflow hidden)
	Nemrefusion.Angular.controller('overlayCtrl', ['$scope', '$element', '$rootScope', function($scope, $element, $rootScope) {
		$scope.data = {};
		$scope.states = {};
		$scope.css = {};
		$scope.options = ($scope.options === undefined) ? {} : $scope.options;
		// Options

		// Data

		// States
		$scope.states.show = false;

		// CSS


		/* Scope Functions
		 ===========================*/
		$scope.toggleOverlay = function(state) {
			state = (state === undefined) ? "toggle" : state;
			if (state === "toggle") {
				$scope.states.show = !$scope.states.show;
			}
			else {
				$scope.states.show = state;
			}
		};

		/* Bindings
		 ===========================*/
		// Scope Events
		$rootScope.$on('overlay__toggleOverlay',function(event, data) {
			if (data != undefined && data.state != undefined) {
				$scope.toggleOverlay(data.state);
			}
		});
		// User Events
		$element.bind('click', function(){
			// Buggy for some reason. Dom doesn't update propper
			/*
			$rootScope.$broadcast('stickyCtrlToggleSearch', {
				state: false
			});
			*/

		});

	}]);



	// Dev Controller
	Nemrefusion.Angular.controller('devCtrl', ['$scope', '$element', '$rootScope', '$sce', function($scope, $element, $rootScope, $sce) {
		$scope.data = ($scope.data === undefined) ? {} : $scope.data;
		$scope.states = ($scope.states === undefined) ? {} : $scope.states;
		$scope.options = ($scope.options === undefined) ? {} : $scope.options;
		// Options

		// Data
		$scope.data.logList = [];
		$scope.data.logContent = "";
		$scope.data.logActiveId = null;
		$scope.data.idCounter = 0;

		// States
		$scope.states.logShow = false;

		/* Scope Functions
		===========================*/
		$scope.showLog = function(id) {
			if (id != undefined) {
				var html = "<p>NOT FOUND</p>";
				for (var i=0;i<$scope.data.logList.length;i++) {
					var log = $scope.data.logList[i];
					if (log != undefined) {
						if (id === log.id) {
							html = log.content;
						}
					}
				}
				$scope.data.logActiveId = id;
				$scope.data.logContent = $scope.trustHtml(html);
				$scope.states.logShow = true;
			}
		};
		$scope.hideLog = function() {
			$scope.data.logActiveId = null;
			$scope.states.logShow = false;
		};
		$scope.trustHtml = function(html) {
			return $sce.trustAsHtml(html);
		};
		$scope.trustSrc = function(src) {
			return $sce.trustAsResourceUrl(src);
		};
		$scope.trimList = function(array) {
			var list = array;
			var newList = [];
			if (list != undefined && list.length > 10) {
				newList = list.slice(list.length-11, -1);
			}
			else {
				newList = array;
			}
			return newList;
		};

		/* Bindings
		===========================*/
		$rootScope.$on('devLog',function(event, data) {
			if (data != undefined) {
				$scope.data.logList = $scope.trimList($scope.data.logList);
				$scope.data.logList.unshift({
					content: $scope.data.idCounter.toString() + data.content,
					name: data.name,
					log: data.log,
					id: $scope.data.idCounter
				});
				$scope.data.idCounter++;
			}
		});

	}]);





})(window, window.document);
