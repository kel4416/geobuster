//d3.selectAll("#map").remove();

var width = 960, height = width / 2;

var projection = d3.geo.geo.transverseMercator()
    .rotate([120 + 50 / 60, -47 -00 / 60]);
    
var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#map_wa").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("data/county.geojson", function(collection) {
	
	svg.selectAll("path")
		.data(collection.features)
		.enter().append("path")
		.attr("class", "wa-county")
		.attr("d", path);
	
}); 

