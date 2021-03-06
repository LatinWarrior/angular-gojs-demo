(function(module){

	"use strict";

	function template($element, $attrs) {				

		let diagram = $element[0].querySelector('#myDiagram');
		
		return 'app/app.gojs.diagram.html' 
	}

	function controller($scope, go, $$) {
		
		let ctrl = this,
			parent = $scope.$parent.$ctrl;		
		
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
			"ModelChanged": updateAngular,
            "ChangedSelection": updateSelection,
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

		// define a Link template that routes orthogonally, with no arrowhead
        diagram.linkTemplate =
            $$(go.Link,
                { routing: go.Link.Orthogonal, corner: 5 },
                $$(go.Shape, { strokeWidth: 3, stroke: "#555" })
                ); // the link shape

        // Set up a Part as a legend, and place it directly on the diagram
    diagram.add(
      $$(go.Part, "Table",
        { position: new go.Point(500, 10), selectable: false },
        $$(go.TextBlock, "Key",
          { row: 0, font: "700 14px Arial, Helvetica, sans-serif" }),  // end row 0
        $$(go.Panel, "Horizontal",
          { row: 1, alignment: go.Spot.Left },
          $$(go.Shape, "Rectangle",
            { desiredSize: new go.Size(20, 20), fill: '#CC293D', margin: 5 }),
          $$(go.TextBlock, "Always Execute",
            { font: "700 13px Arial, Helvetica, sans-serif" })
        ),  // end row 1
        $$(go.Panel, "Horizontal",
          { row: 2, alignment: go.Spot.Left },
          $$(go.Shape, "Rectangle",
            { desiredSize: new go.Size(20, 20), fill: '#FFD700', margin: 5 }),
          $$(go.TextBlock, "Left Only",
            { font: "700 13px Arial, Helvetica, sans-serif" })
        ),  // end row 2
        $$(go.Panel, "Horizontal",
          { row: 3, alignment: go.Spot.Left },
          $$(go.Shape, "Rectangle",
            { desiredSize: new go.Size(20, 20), fill: '#009CCC', margin: 5 }),
          $$(go.TextBlock, "Right Only",
            { font: "700 13px Arial, Helvetica, sans-serif" })
        ),  // end row 3
        $$(go.Panel, "Horizontal",
          { row: 4, alignment: go.Spot.Left },
          $$(go.Shape, "Rectangle",
            { desiredSize: new go.Size(20, 20), fill: '#F09AAA', margin: 5 }),
          $$(go.TextBlock, "Both",
            { font: "700 13px Arial, Helvetica, sans-serif" })
        )  // end row 4
      ));

		let myModel = $$(go.Model);

		myModel.nodeDataArray = ctrl.model;
		
		diagram.model = myModel;

		console.log('diagram.model: ', diagram.model);

		let palette = $$(go.Palette, "myPaletteId", {
         	// nodeTemplateMap: diagram.nodeTemplateMap,
          	// groupTemplateMap: diagram.groupTemplateMap,
          	layout: $$(go.GridLayout, { wrappingColumn: 1, alignment: go.GridLayout.Position })
        });

	    palette.model = new go.GraphLinksModel([
	      	{ key: "lightgreen", color: "#ACE600" },
	      	{ key: "yellow", color: "#FFDD33" },
	      	{ key: "lightblue", color: "#33D3E5" }
	    ]);	    

	    // document.getElementById("displayModel").value = diagram.model.toJson();

	    // Whenever a GoJS transaction has finished modifying the model, update all Angular bindings
		function updateAngular(event) {			
			if (event.isTransactionFinished) {				
				console.log('In updateAngular');
				//ctrl.updateModel(e);
			 	$scope.$apply();
			}
		}

		// Update the Angular model when the Diagram.selection changes
		function updateSelection(e) {
			// console.log('In updateSelection');
			diagram.model.selectedNodeData = null;
			var it = diagram.selection.iterator;
			while (it.next()) {
				  var selnode = it.value;
				  // Ignore a selected link or a deleted node
				  if (selnode instanceof go.Node && selnode.data !== null) {
					    diagram.model.selectedNodeData = selnode.data;
					    break;
				  }
			}
			$scope.$apply();
		}

		ctrl.$onChanges = function(changes) {
			let isFirstChange = changes.model.isFirstChange();
			if (isFirstChange) {
				console.log('In onChanges hook. isFirstChange: ', isFirstChange);
				return;
			}			
			if (changes.model) {
				// Copy the current model here.
				console.log('In onChanges hook. changes: ', changes);
			}
			
		};		

		// notice when the value of "model" changes: update the Diagram.model
          $scope.$watch("model", function(newModel) {
          	console.log('In watch model. diagram: ', diagram.model);
          	console.log('In watch model. newModel: ', newModel);
            var oldmodel = diagram.model;
            if (newModel && oldmodel !== newModel) {
              diagram.removeDiagramListener("ChangedSelection", updateSelection);
              diagram.model = newModel;
              diagram.addDiagramListener("ChangedSelection", updateSelection);
            }
          });

          $scope.$watch("model.selectedNodeData.name", function(newName) {
          	console.log('In watch model.selectedNodeData.name', diagram.model.selectedNodeData);
            if (!diagram.model.selectedNodeData) return;
            // disable recursive updates
            diagram.removeModelChangedListener(updateAngular);
            // change the name
            diagram.startTransaction("change name");
            // the data property has already been modified, so setDataProperty would have no effect
            var node = diagram.findNodeForData(diagram.model.selectedNodeData);
            if (node !== null) node.updateTargetBindings("name");
            diagram.commitTransaction("change name");
            // re-enable normal updates
            diagram.addModelChangedListener(updateAngular);
          });

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
				model: '<gojsModel'
			},
			controller: ['$scope', 'go', '$$', controller],
			templateUrl: ['$element', '$attrs', template]			
	});	

}(angular.module('myApp')));