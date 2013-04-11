var margin = {
	top : 20,
	right : 20,
	bottom : 30,
	left : 40
}, width = 720 - margin.left - margin.right, height = 300 - margin.top - margin.bottom;

var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis().scale(x).orient("bottom");

var yAxis = d3.svg.axis().scale(y).orient("left");

var svg = d3.select("#supplementary_graph").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/eruption-count.csv", function(error, data) {

	data.forEach(function(d) {
		d.frequency = +d.frequency;
	});

	x.domain(data.map(function(d) {
		return d.range;
	}));
	y.domain([0, d3.max(data, function(d) {
		return d.frequency;
	})]);

	svg.append("g").attr("class", "x axis").style("stroke", "white").attr("transform", "translate(0," + height + ")").call(xAxis);

	svg.append("g").attr("class", "y axis").style("stroke", "white").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("stroke", "white").style("text-anchor", "end").text("Frequency");

	svg.selectAll(".bar").data(data).enter().append("rect").attr("class", "bar").attr("x", function(d) {
		return x(d.range);
	}).attr("width", x.rangeBand()).attr("y", function(d) {
		return y(d.frequency);
	}).attr("height", function(d) {
		return height - y(d.frequency);
	}).on("mouseover", function(d) {
		if (d.range.indexOf('/') > -1) {
			var yearLimits = d.range.split("/");
			yearLimits[0] = yearLimits[0] * 100;
			yearLimits[1] = yearLimits[1] * 100;

			d3.selectAll('.volcano').attr("display", function(d) {
				if(d.properties.YEAR === 'unknown'){
					return "none";
				}
				if (d.properties.YEAR >= yearLimits[0] && d.properties.YEAR <= yearLimits[1]) {
					return "block";
				} else {
					return "none";
				}
			});
		} else {
			var year = d.range;
			d3.selectAll('.volcano').attr("display", function(d) {
				if(d.properties.YEAR === 'unknown'){
					return "none";
				}
				if (d.properties.YEAR >= year) {
					return "block";
				} else {
					return "none";
				}
			});

		}
	}).on("mouseout", function(d) {
		d3.selectAll('.volcano').attr("display", "block");

	}).append("svg:title").text(function(d) {
		if (d.range.indexOf('/') > -1) {
			var yearLimits = d.range.split("/");
			yearLimits[0] = yearLimits[0] * 100;
			yearLimits[1] = yearLimits[1] * 100;
			return '<b>Year:</b> ' + yearLimits[0] + ' to ' + yearLimits[1] + '<br/><br/> <b>Number of Volcano Eruption:</b> ' + d.frequency;
		}
		return 'Year: ' + d.range + ' Number of Volcano Eruption: ' + d.frequency;
	});

	$('.bar').tipsy({
		gravity : 's',
		html : true,
		delayOut : 100,
	});

});
