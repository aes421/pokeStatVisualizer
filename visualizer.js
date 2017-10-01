function visualize(json){
	//var svgContainer = d3.select("body").append("svg").attr("width", 1000).attr("height", 1000);
	var svgContainer = d3.select("svg");
	var width = svgContainer.attr("width");
	var height = svgContainer.attr("height");

	var pack = d3.pack()
    .size([width, height])
    .padding(1.5);
	
	var data = JSON.parse(json);

	var root = d3.hierarchy(data);

	var node = svgContainer.selectAll(".node")
    .data(pack(root).leaves())
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    var circles = node
		.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
	        .attr("r", function (d) { return d.base_stat; })
	        .style("fill", function (d) { return "red"; });
		
     node.selectAll("text")
 		.data(data)
 		.enter()
 		.append("text")
 			.text( function(d) { return d.identifier; });
}

function reset(){
	var svgContainer = d3.select("svg");
	svgContainer.selectAll("*").remove();
	//d3.select("svg").remove();
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
        	reset();
        	visualize(xmlhttp.responseText);
        	document.getElementById("connectionInfo").innerHTML = xmlhttp.responseText;
        }
    };
    xmlhttp.open("GET","serverSide.php?stat="+stat,true);
    xmlhttp.send();
}