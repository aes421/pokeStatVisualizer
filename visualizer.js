function visualize(json){
	var colorMap = new Map([
		['1', ''],  //normal
		['2', ''],  //fighting
		['3', ''],  //flying
		['4', ''],  //poison
		['5', ''],  //ground
		['6', ''],  //rock
		['7', ''],  //bug
		['8', ''],  //ghost
		['9', ''],  //steel
		['10', '#FF0000'], //fire
		['11', '#0000FF'], //water
		['12', '#008000'], //grass
		['13', ''], //electric
		['14', ''], //psychic
		['15', ''], //ice
		['16', ''], //dragon
		['17', ''], //dark
		['18', ''], //fairy
		['10001', ''], //unknown
		['10002', ''] //shadow
		]);

	var svgContainer = d3.select("svg");
	var width = svgContainer.attr("width");
	var height = svgContainer.attr("height");

	var data = JSON.parse(json);
	//if we keep the data sorted we could changed this to just take the first and last
	var max = Math.max.apply(Math, data.map(function(o){return o.base_stat;}));
	var min = Math.min.apply(Math, data.map(function(o){return o.base_stat;}));;
	//Blissey has max hp at 255
	var linearScale = d3.scaleLinear().domain([min, max]).range([0,100]);

	for (var i = 0; i < data.length; i++){
			data[i].base_stat = linearScale(data[i].base_stat);
	}

    var forceSimulation = d3.forceSimulation(data)
		.force('charge', d3.forceManyBody().strength(0)) 
  		.force('center', d3.forceCenter(width / 2, height / 2))
  		.force('collision', d3.forceCollide().radius(function(d) {
    		return d.base_stat;
		})); 

 	var node = svgContainer.append('g')
 		 .selectAll('circle')
 		 .data(data)
 		 .enter()
 		 .append('circle')
 		 	 .attr("r", function (d) { return d.base_stat; })
	          .style("fill", function (d) { return colorMap.get(d.type_id); });

	var text = svgContainer
	.append('g')
	.selectAll("text")
 	.data(data)
 	.enter()
 	.append("text")
 		.text( function(d) { return d.identifier; });


 	forceSimulation.nodes(data).on("tick", ticked);

 	function ticked() {
    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    text
    	.attr("x", function(d) { return d.x; })
    	.attr("y", function(d) { return d.y; });
  }
}

function reset(){
	var svgContainer = d3.select("svg");
	svgContainer.selectAll("*").remove();
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
        	//document.getElementById("connectionInfo").innerHTML = xmlhttp.responseText;
        }
    };
    xmlhttp.open("GET","serverSide.php?stat="+stat,true);
    xmlhttp.send();
}