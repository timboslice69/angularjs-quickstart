application.register.component('icon', function() {
	return {
		restrict: 'E',
		transclude: false,
		link: function($scope, $element, $attrs) {
/*			var attempts = 0,
				injectSvg = function() {
					attempts++;
					if (attempts > 5) return false;

					var symbol = document.getElementById($attrs.ref.replace('#', '')),
						element = $element[0];

					if (!symbol) setTimeout(injectSvg, 100);
					else {
						element.setAttribute('viewBox', symbol.attributes.viewBox.value);
						$(element).append($(symbol).children());
					}
				};

			injectSvg();*/
		},
		template: '<svg class="icon"></svg>',
		replace: true
	};
})