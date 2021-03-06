var width = 680, height = width / 2;

var projection = d3.geo.mercator().translate([0, 0]).scale(width / 2 / Math.PI);

var zoom = d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", move);

//set the radius of the points plotted on the map
var path = d3.geo.path().projection(projection).pointRadius(5);

var svg = d3.select("#map").append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")").call(zoom);

var g = svg.append("g");

g.append("rect").attr("class", "overlay").attr("x", -width / 2).attr("y", -height / 2).attr("width", width).attr("height", height);

d3.json("data/world-110m.json", function(error, world) {
	g.insert("path").datum(topojson.object(world, world.objects.countries)).attr("class", "land").attr("d", path);

	g.insert("path").datum(topojson.mesh(world, world.objects.countries, function(a, b) {
		return a !== b;
	})).attr("class", "boundary").attr("d", path);
});

d3.json('data/tectonics.json', function(error, data) {
	g.insert("path").datum(topojson.object(data, data.objects.tec)).attr("class", "tectonic").attr("d", path);

});

d3.json("data/volcano.geojson", function(collection) {
	g.selectAll("path").data(collection.features).enter().append("path").on("click", function(d) {
		var dataTableData =  $('#dynamic-table').dataTable().fnGetData();
		var exist = false;
		
		for(i = 0 ; i<dataTableData.length; i++){
			var tempName = dataTableData[i][0];
			if(tempName.indexOf(d.properties.NAME) > -1){
				exist = true;
				break;
			}
		}
		if (!exist) {

			$('#dynamic-table').dataTable().fnAddData(['<a href="http://www.volcano.si.edu/world/list.cfm?searchtext=' + d.properties.NAME + '" target="_blank">' + d.properties.NAME + '</a>', d.properties.LOCATION, d.properties.STATUS, d.properties.ELEV, d.properties.TYPE, d.properties.YEAR]);
		} else {

			$("#dialog-confirm").dialog({
				resizable : false,
				height : 140,
				modal : true,
				buttons : {
					"Add" : function() {
						$('#dynamic-table').dataTable().fnAddData(['<a href="http://www.volcano.si.edu/world/list.cfm?searchtext=' + d.properties.NAME + '" target="_blank">' + d.properties.NAME + '</a>', d.properties.LOCATION, d.properties.STATUS, d.properties.ELEV, d.properties.TYPE, d.properties.YEAR]);
						$(this).dialog("close");
					},
					Cancel : function() {
						$(this).dialog("close");
					}
				}
			});
		}

	}).on("mouseover", function(d) {
		var type = d.properties.TYPE;
		g.selectAll(".volcano").style("fill", function(d) {
			if (d.properties.TYPE === type) {
				//return "red";
			} else {
				return "none";
			}
		}).style("stroke", function(d) {
			if (d.properties.TYPE === type) {
				//return "red";
			} else {
				return "none";
			}
		});

	}).on("mouseout", function(d) {
		var type = d.properties.TYPE;
		g.selectAll(".volcano").style("fill", function(d) {
			return "red";
		}).style("stroke", function(d) {
			return "black";
		});

	}).attr("class", function(d) {
		var tempyear = d.properties.YEAR;
		return "_" + tempyear + " volcano";
	}).attr("d", path).append("svg:title").text(function(d) {
		return d.properties.NAME;
	});

	$('svg title').parent().tipsy({
		gravity : $.fn.tipsy.autoNS,
		interactive : true,
		html : true,
		delayOut : 750,
		title : function() {
			var d = this.__data__;
			return '<a href="http://www.volcano.si.edu/world/list.cfm?searchtext=' + d.properties.NAME + '" target="_blank">' + d.properties.NAME + '</a>' + '<p>Location: ' + d.properties.LOCATION + '</p>' + '<p>Status: ' + d.properties.STATUS + '</p>' + '<p>Elevation: ' + d.properties.ELEV + '</p>' + '<p>Type: ' + d.properties.TYPE + '</p>' + '<p>Year Erupted: ' + d.properties.YEAR + '</p>';
		}
	});

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

	var widthOfPoints = 5;
	if (1000 / (width / 2 * (s - 1)) < 5) {
		widthOfPoints = 1000 / (width / 2 * (s - 1));
	}
	g.selectAll(".volcano").attr("d", d3.geo.path().projection(projection).pointRadius(widthOfPoints));
}

