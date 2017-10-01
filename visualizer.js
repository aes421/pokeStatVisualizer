function visualize(json){
		var svgContainer = d3.select("body").append("svg").attr("width", 400).attr("height", 100);

		var data = JSON.parse(json);
		var circles = svgContainer
 		.selectAll("circle")
 		.data(data)
 		.enter()
 		.append("circle");

 		var circleAttributes = circles
                        .attr("cx", function (d) { return 40; })
                        .attr("cy", function (d) { return 40; })
                        .attr("r", function (d) { return 40; })
                        .style("fill", function (d) { return "red"; });
	}


function lookupStats(stat){
	if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } 
    else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        	visualize(xmlhttp.responseText);
        	document.getElementById("connectionInfo").innerHTML = xmlhttp.responseText;
        }
    };
    xmlhttp.open("GET","serverSide.php?stat="+stat,true);
    xmlhttp.send();
}