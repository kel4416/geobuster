$(document).ready(function() {
	$('#dynamic-table').dataTable({
		"bJQueryUI" : true,
		"iDisplayLength" : 5,
		"bPaginate" : true,
		"bLengthChange" : false,
		"sPaginationType" : "full_numbers"
	});

	$("#tectonicSwitch").button().click(function() {
		var label = $("#tectonicSwitch").button("option", "label");
		g.selectAll(".tectonic").attr("visibility", function(d) {
				
			if (label === "Hide Tectonic") {
				$("#tectonicSwitch").button("option", "label", "Show Tectonic");
				return "hidden";
			} else {
				$("#tectonicSwitch").button("option", "label", "Hide Tectonic");
				return "visible";
			}
			

		});
	});

	$("#tabs").tabs();
	$('#tabs').css('width','650px');
	$('#tabs').css('height','125px');

});
