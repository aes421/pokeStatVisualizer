function visualize(json){
	var colorMap = new Map([
		['1', '#d3d3d3'],  //normal
		['2', '#902a08'],  //fighting
		['3', '#3da2cc'],  //flying
		['4', '#800080'],  //poison
		['5', '#875304'],  //ground
		['6', '#cc7b00'],  //rock
		['7', '#68ba09'],  //bug
		['8', '#9c659c'],  //ghost
		['9', '#cecdcd'],  //steel
		['10', '#fb4c00'], //fire
		['11', '#2634f6'], //water
		['12', '#077407'], //grass
		['13', '#e3e305'], //electric
		['14', '#f85888'], //psychic
		['15', '#add8e6'], //ice
		['16', '#500dd4'], //dragon
		['17', '#00012d'], //dark
		['18', '#ffc0cb'], //fairy
		['10001', '#000000'], //unknown
		['10002', '#000000'] //shadow
		]);

	var data = JSON.parse(json);

	//if we keep the data sorted we could changed this to just take the first and last
	var max = Math.max.apply(Math, data.map(function(o){return o.base_stat;}));
	var min = Math.min.apply(Math, data.map(function(o){return o.base_stat;}));;
	//Blissey has max hp at 255
	var linearScale = d3.scaleLinear().domain([min, max]).range([0,75]);

	for (var i = 0; i < data.length; i++){
			data[i].base_stat = linearScale(data[i].base_stat);
	}

	//dynamically determine svg space
	var space = data.reduce(function(sum, value){
		return sum + parseInt(value.base_stat);
	}, 0);

	space = space / 9;

	
	var svgContainer = d3.select("body")
	.append("svg")
	.attr("width", space)
	.attr("height", space)
	.attr("font-family", "sans-serif")
	.attr("font-size", "11")
	.attr("text-anchor", "middle");

	var svgContainer = d3.select("svg");
	var width = svgContainer.attr("width");
	var height = svgContainer.attr("height");

    var forceSimulation = d3.forceSimulation(data)
		.force('charge', d3.forceManyBody().strength(0)) 
  		.force('center', d3.forceCenter(space / 2 , space / 2))
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
	d3.select("svg").remove();
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
        }
    };
    xmlhttp.open("GET","serverSide.php?stat="+stat,true);
    xmlhttp.send();
}

function getDropdownValues(){
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
        	var select = document.getElementById('stat');
        	var stats = JSON.parse(xmlhttp.responseText);
        	for (var i = 0; i < stats.length; i++){
        		var option = new Option();
        		option.text = stats[i].identifier;
        		option.value = stats[i].id;
        		select.options.add( option );
        	}
        }
    };
    xmlhttp.open("GET","StatDropDown.php");
    xmlhttp.send();
}