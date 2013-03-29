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
var volcanos = svg.append("g").attr("id","volcano");

svg.append("rect")
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
	volcanos.selectAll("path") 		
		.data(collection.features)
		.enter().append("path")
		.attr("class", "volcano")	
		.attr("d", path);																				       																	    														        
});		

function move() {
	var t = d3.event.translate, s = d3.event.scale;
	t[0] = Math.min(width / 2 * (s - 1), Math.max(width / 2 * (1 - s), t[0]));
	t[1] = Math.min(height / 2 * (s - 1) + 230 * s, Math.max(height / 2 * (1 - s) - 230 * s, t[1]));
	zoom.translate(t);
	g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
}	
			
