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
				{ key: 'Alpha'},
				{ key: 'Beta'},
				{ key: 'Gamma'}
			];
			ctrl.name = 'familyGuyDiagram';
			ctrl.id = 'familyGuyDiagramId';
			ctrl.width = '305';
			ctrl.height = '175';
			ctrl.bcolor = '#fff000';
			ctrl.style = 'background-color: "' + ctrl.bcolor + '"; width: "' + ctrl.width + '"; height: "' + ctrl.height + '";';
			console.log('In appMain component begin');
			console.log('ctrl: ', ctrl);
			console.log('In appMain component end');
		}

}(angular.module('myApp')));