var View = require('./js/view.js');

document.addEventListener("DOMContentLoaded", function(){
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext('2d');
	new View(ctx).start();
});