(function(module){

	"use strict";

	function template($element, $attrs){

		let myCrap = this;		

		// console.log('myCrap: ', myCrap);		

		// console.log('Inside of templateUrl. $element: ', $element);

		// console.log('Inside of templateUrl. $element[0]: ', $element[0]);

		// console.log('Inside of templateUrl begin');

		let diagram = $element[0].querySelector('#myDiagram');

		// console.log('diagram: ', diagram);

		// console.log('Inside of temaplateUrl end');

		return 'app/app.gojs.diagram.html' 
	}

	function controller($scope, go, $$) {
		// console.log('In gojs Diagram');
		// console.log('$scope: ', $scope);
		let ctrl = this;		
		// console.log('$scope.$parent.$ctrl.model', $scope.$parent.$ctrl.model);
		// console.log('ctrl', ctrl);
		// console.log('$scope.id', $scope.$parent.$ctrl.id);

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

		// define a Node template
		diagram.nodeTemplate =
		  $$(go.Node, "Horizontal",
		    // the entire node will have an orange background
		    { background: "#DD4814" },
		    $$(go.Picture,
		      // Pictures are best off having an explicit width and height.
		      // Adding a red background ensures something is visible when there is no source set
		      { margin: 10, width: 50, height: 50, background: "red" },
		      // Picture.source is data bound to the "source" attribute of the model data
		      new go.Binding("source")),
		    $$(go.TextBlock,
		      "Default Text",  // the initial value for TextBlock.text
		      // some room around the text, a larger font, and a white stroke:
		      { margin: 12, stroke: "white", font: "bold 16px sans-serif" },
		      // TextBlock.text is data bound to the "name" attribute of the model data
		      new go.Binding("text", "name"))
		  );

		var myModel = $$(go.Model);

		myModel.nodeDataArray = ctrl.model;
		
		diagram.model = myModel;

	}

	// whenever a GoJS transaction has finished modifying the model, update all Angular bindings
	function updateAngular(e) {
		if (e.isTransactionFinished) {
		 	scope.$apply();
		}
	}

	// update the Angular model when the Diagram.selection changes
	function updateSelection(e) {
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