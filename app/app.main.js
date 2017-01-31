(function(module){

	"use strict";

	module.component('appMain', {
		templateUrl: '/app/app.main.html',
		//template: 'Howdy y\'all',
		bindings: {
			appName: '@'
		},
		controller: ['go', controller]
	});

	function controller(go) {
			let ctrl = this;
			let _$ = go.GraphObject.make;			
			ctrl.model = [
				{ name: 'Alpha', source: '/app/images/cat1.png'},
				{ name: 'Beta', source: '/app/images/cat2.png'},
				{ name: 'Gamma', source: '/app/images/cat3.png'}
			];
			ctrl.name = 'familyGuyDiagram';
			ctrl.id = 'familyGuyDiagramId';
			ctrl.width = '305';
			ctrl.height = '175';
			ctrl.bcolor = '#fff000';
			ctrl.style = 'background-color: "' + ctrl.bcolor + '"; width: "' + ctrl.width + '"; height: "' + ctrl.height + '";';
			// console.log('In appMain component begin');
			// console.log('ctrl: ', ctrl);
			// console.log('In appMain component end');
		}

}(angular.module('myApp')));