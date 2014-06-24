;(function(window, document, undefined) {
	var Nemrefusion = new namespace("Nemrefusion");
	// Set default data
	Nemrefusion.data = {
		logCount: 0
	};
	Nemrefusion.log = function(msg) {
		try {
			if (this.data.logCount > 200) {
				console.clear();
				this.data.logCount = 0;
			}
			if (msg.toString().trim() === 'true') {
				console.log('%c' + msg,'background-color: green; color: #fff;');
			}
			else if (msg.toString().trim() === 'false') {
				console.log('%c' + msg,'background-color: red; color: #fff;');
			}
			else {
				console.log(msg);
			}
			this.data.logCount++;
		}
		catch(err) {
			//send error to developer platform
		}
	};
	Nemrefusion.resetScrollView = function() {
		// Reset scroll container(window)
		window.scrollTo(0, 0);
	};
	Nemrefusion.init = function() {
		Nemrefusion.resetScrollView();
	};

	Nemrefusion.init();

	// Make sure that module is exposed to window
	window.Nemrefusion = Nemrefusion;
})(window, window.document);


