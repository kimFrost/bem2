;(function(window, document, undefined) {
	var Nordgourmet = new namespace("Nemrefusion");
	Nemrefusion.Angular = angular.module('nemrefusion', []).
		config(function() { // provider-injector
			// This is an example of config block.
			// You can have as many of these as you want.
			// You can only inject Providers (not instances)
			// into the config blocks.
		}).
		run(function($rootScope) { // instance-injector
			// This is an example of a run block.
			// You can have as many of these as you want.
			// You can only inject instances (not Providers)
			// into the run blocks
			$rootScope.findme = "test value";
		});
})(window, window.document);