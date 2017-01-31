(function(module, go){

	"use strict";

	module.value('go', go);
	module.value('$$', go.GraphObject.make);

}(angular.module('myApp'), go));