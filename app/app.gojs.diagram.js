(function(module){

	"use strict";

	module.component('gojsDiagram', {
			transclude: true,
			templateUrl: 'app/app.gojs.diagram.html',			
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
			link: function(scope, element, attrs) {
				console.log('In link of gojsDiagram');
				// Create an alias for the make object.
				// let _$ = go.GraphObject.make,
				// 	diagramName = scope.name || 'myDiagramName',
				// 	width = scope.width || '200',
				// 	height = scope.height || '100',
				// 	bcolor = scope.bcolor || '#DAE4E4;',
				// 	style = 'background-color: ' + bcolor + '; width: ' + width + '; height: ' + height + ';'
				// 	initialModel = scope.model || [{ key: 'No model provided' }];

				// // Create a Diagram for the given HTML DIV element
				// var diagram = _$(go.Diagram, diagramName, {
				// 	// Center diagram contents.
				// 	initialContentAlignment: go.Spot.Center,
				// 	// Enable Ctrl-Z to undo and Ctrl-Y to redo.
				// 	"undoManager.isEnabled": true
				// });

				// var model = _$(initialModel);

				// diagram.model = model;

				function updateAngular(e){
					if (e.isTransactionFinished) {
		              scope.$apply();
		            }
				}

				function updateSelection(e){
					diagram.model.selectedNodeData = null;
		            var it = diagram.selection.iterator;
		            while (it.next()) {
		              var selnode = it.value;
		              // ignore a selected link or a deleted node
		              if (selnode instanceof go.Node && selnode.data !== null) {
		                diagram.model.selectedNodeData = selnode.data;
		                break;
		              }
		            }
		            scope.$apply();
				}

				scope.$watch('model', function(newModel){
					var oldModel = diagram.model;
		            if (oldModel !== newModel) {
		              diagram.removeDiagramListener("ChangedSelection", updateSelection);
		              diagram.model = newModel;
		              diagram.addDiagramListener("ChangedSelection", updateSelection);
		            }
				});

				scope.$watch('model.selectedNodeData.name', function(newName) {
					if (!diagram.model.selectedNodeData) 
						return;

		            // Disable recursive updates
		            diagram.removeModelChangedListener(updateAngular);
		            // Change the name
		            diagram.startTransaction("change name");
		            // The data property has already been modified, so setDataProperty would have no effect
		            var node = diagram.findNodeForData(diagram.model.selectedNodeData);

		            if (node !== null) 
		            	node.updateTargetBindings("name");

		            diagram.commitTransaction("change name");
		            // Re-enable normal updates
		            diagram.addModelChangedListener(updateAngular);
		          });
			}		
	});

	function controller($scope, go, $$) {
		console.log('In gojs Diagram');
		console.log('$scope: ', $scope);
		let ctrl = this;
		console.log('In gojs diagram ctrl: ', ctrl);
		ctrl.go = go;
		ctrl.name = 'Peter Griffin';
		console.log('ctrl Width: ', ctrl.width);
		console.log('scope Width: ', $scope.width);
		console.log('Diagram Name: ', ctrl.diagramName);
		console.log('go: ', go);
		console.log('$$', $$);
		console.log('$scope.$parent.$ctrl.model', $scope.$parent.$ctrl.model);
		console.log('ctrl.model', ctrl);
		
		let diagramName = $scope.name || 'myDiagramName',
			width = $scope.width || '200',
			height = $scope.height || '100',
			bcolor = $scope.bcolor || '#DAE4E4;',
			style = $scope.style || 'background-color: ' + bcolor + '; width: ' + width + '; height: ' + height + ';',
			initialModel = $scope.model || [{ key: 'No model provided' }];

		// Create a Diagram for the given HTML DIV element

		var diagram = $$(go.Diagram, 'myDiagram', {
			// Center diagram contents.
			initialContentAlignment: go.Spot.Center,
			// Enable Ctrl-Z to undo and Ctrl-Y to redo.
			"undoManager.isEnabled": true
		});

		var myModel = $$(go.Model);

		myModel.nodeDataArray = $scope.$parent.$ctrl.model;
		
		diagram.model = myModel;

	}

}(angular.module('myApp')));