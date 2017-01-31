(function(module){

	"use strict";

	function template($element, $attrs){

		let myCrap = this;		

		console.log('myCrap: ', myCrap);		

		console.log('Inside of templateUrl. $element: ', $element);

		console.log('Inside of templateUrl. $element[0]: ', $element[0]);

		console.log('Inside of templateUrl begin');

		let diagram = $element[0].querySelector('#myDiagram');

		console.log('diagram: ', diagram);

		console.log('Inside of temaplateUrl end');

		return 'app/app.gojs.diagram.html' 
	}

	function controller($scope, go, $$) {
		console.log('In gojs Diagram');
		console.log('$scope: ', $scope);
		let ctrl = this;
		// console.log('In gojs diagram ctrl: ', ctrl);
		//ctrl.go = go;
		// ctrl.name = 'Peter Griffin';
		// console.log('ctrl Width: ', ctrl.width);
		// console.log('scope Width: ', $scope.width);
		// console.log('Diagram Name: ', ctrl.diagramName);
		// console.log('go: ', go);
		// console.log('$$', $$);
		console.log('$scope.$parent.$ctrl.model', $scope.$parent.$ctrl.model);
		console.log('ctrl', ctrl);
		console.log('$scope.id', $scope.$parent.$ctrl.id);

		let parent = $scope.$parent.$ctrl;		
		
		ctrl.name = parent.name || 'myDiagramName';
		//ctrl.id = parent.id || 'myDiagramId';
		ctrl.width = parent.width || '200';
		ctrl.height = parent.height || '100';
		ctrl.bcolor = parent.bcolor || '#DAE4E4;';
		ctrl.style = parent.style || 'background-color: ' + ctrl.bcolor + '; width: ' + ctrl.width + '; height: ' + ctrl.height + ';';
		ctrl.model = parent.model || [{ key: 'No model provided' }];

		// Create a Diagram for the given HTML DIV element

		var diagram = $$(go.Diagram, "myDiagramId", {
			// Center diagram contents.
			initialContentAlignment: go.Spot.Center,
			// Enable Ctrl-Z to undo and Ctrl-Y to redo.
			"undoManager.isEnabled": true
		});

		var myModel = $$(go.Model);

		myModel.nodeDataArray = ctrl.model;
		
		diagram.model = myModel;

	}

	module.component('gojsDiagram', {			
			transclude: true,				
			bindings: {
				name: '@',				
				width: '@',
				height: '@',
				class: '@',
				style: '@',
				bcolor: '@',
				model: '=gojsModel'
			},
			controller: ['$scope', 'go', '$$', controller],
			templateUrl: ['$element', '$attrs', template]			
	});	

}(angular.module('myApp')));