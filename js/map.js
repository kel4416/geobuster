var width = 960, height = width / 2;
				
var projection = d3.geo.mercator().translate([0, 0]).scale(width / 2 / Math.PI);

var zoom = d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", move);

var path = d3.geo.path().projection(projection);

var svg = d3.select("#map")
	.append("svg")
		.attr("width", width)
		.attr("height", height)
	.append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
		.call(zoom);

var g = svg.append("g");

g.append("rect")
	.attr("class", "overlay")
	.attr("x", -width / 2)
	.attr("y", -height / 2)
	.attr("width", width)
	.attr("height", height);

d3.json("data/world-110m.json", function(error, world) {
	g.insert("path")
		.datum(topojson.object(world, world.objects.countries))
		.attr("class", "land")
		.attr("d", path);

	g.insert("path")
		.datum(topojson.mesh(world, world.objects.countries, function(a, b) {
			return a !== b;
		})).attr("class", "boundary")
		.attr("d", path);
});

d3.json('data/tectonics.json', function(error, data) {
	g.insert("path")
		.datum(topojson.object(data, data.objects.tec))
		.attr("class", "tectonic")
		.attr("d", path);

});

d3.json("data/volcano.geojson", function(collection) {
	g.selectAll("path").data(collection.features).enter().append("path")
	.on("click",function(d){
		 $('#dynamic-table').dataTable().fnAddData( [
		 	d.properties.NAME,
		 	d.properties.TYPE,
		 	d.properties.YEAR
		 ]);
	}).attr("class", function(d) {
			var tempyear = d.properties.YEAR;
			return "_" + tempyear + " volcano" ;})
		.attr("d", path).append("svg:title").text(function(d){return d.properties.NAME;});
}); 

// d3.json("data/volcano.geojson", function(collection) {
	// g.selectAll(".volcano-label")
	    // .data(collection.features)
	  // .enter().append("text")
	    // .attr("class", "volcano-label")
	    // .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
	    // .attr("dy", ".35em")
	    // .text(function(d) { return d.properties.NAME; });
 // }); 
//  

function move() {
	var t = d3.event.translate, s = d3.event.scale;
	t[0] = Math.min(width / 2 * (s - 1), Math.max(width / 2 * (1 - s), t[0]));
	t[1] = Math.min(height / 2 * (s - 1) + 230 * s, Math.max(height / 2 * (1 - s) - 230 * s, t[1]));
	zoom.translate(t);
	g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
}	
			
