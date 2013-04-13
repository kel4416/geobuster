$(document).ready(function() {
	$('#dynamic-table').dataTable({
		"bJQueryUI" : true,
		"iDisplayLength" : 5,
		"bPaginate" : true,
		"bLengthChange" : false,
		"sPaginationType" : "full_numbers"
	});

	$("#tectonicSwitch").button();
	$("#tectonicSwitch").click(function() {
		g.selectAll(".tectonic").attr("visibility", function(d) {

			if ($("#tectonicSwitch").button("option", "label") === "Hide Tectonic") {
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
	$('#tabs').css('height','120px');

});
