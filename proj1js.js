//Initializing all the required Variables for Map
var  padding = {top: 5, right: 50, bottom:50, left: 5},
	width = 400 -padding.left - padding.right,
 	height = 400 - padding.top - padding.bottom;
var scalingValue = 30;  
var deathDays = [] ;
var deathGender=[];
var ageGroup = [];
var color = d3.scale.category10()
var selecteddate;
var deaths = [];
var DeathsToPlot = [];
var DeathsAgeSex =[];
var DeathsByDay = [];


//div and div1 are for the tooltip
var div = d3.select("body").append("div")	
			.attr("class", "tooltip")				
            .style("opacity", 0);
var div1 = d3.select("body").append("div")
            .attr("class", "tooltip2")
            .style("opacity", 0);

// Creating a svg and add zoom functionality
var map = d3.select("body").append("svg")
		    .attr("id","map")
    	    .attr("width", width + padding.left + padding.right)
            .attr("height", height + padding.top + padding.bottom)                      
        	.call(d3.behavior.zoom().on("zoom", function () {
        	    map.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")}))
  			        .append("g")
  			        .attr("transform", "translate(" + padding.left + "," + padding.top + ")");

//moveToFront and moveToBack
d3.selection.prototype.moveToFront = function() {  
    return this.each(function(){
        this.parentNode.appendChild(this);
    });
};
d3.selection.prototype.moveToBack = function() {  
    return this.each(function() { 
        var firstChild = this.parentNode.firstChild; 
        if (firstChild) { 
            this.parentNode.insertBefore(this, firstChild); 
        } 
    });
};



/*---------- Load Streets and Plot them on SVG ----------*/

var streets = [];
var street_names = [];
var brewery = [{"x": 13.9 , "y": 9.7 }]
var workhouse = [{"x": 12.8 , "y": 8.3 }]

//function to plot workhouse
function plotWorkHouse()
{	
    map.selectAll('rect')
        .data(workhouse)
        .attr("id","workhouse")
        .enter()
        .append('rect')
        .style('fill', '#BF110C')
        .style('stroke', '#004d4d')
        .attr('x', function(d) { return d.x*scalingValue ; })
        .attr('y', function(d) { return d.y*scalingValue  ; })
        .attr("transform","rotate(-26,"+11*scalingValue+","+13*scalingValue+")")
        .attr('height', 30)
        .attr('width', 39)    
        .on("mouseover", function(d,i) {
            div1.transition()
                .duration(50)
                .style("opacity", 1);
            div1.html("<b>Work House"+"</br>X="+d.x+"</br>Y="+d.y+"</b>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY-28) + "px");
        })
        .on("mouseout", function(d) {

            div.transition()
                .duration(50)
                .style("opacity", 0);
            })
}


function plotStreets(){
    var x = d3.scale.linear();
    var y = d3.scale.linear();

    var drawLine = d3.svg.line()
        .x(function(d) { return d.x*scalingValue;})
        .y(function(d) { return height- d.y*scalingValue;})
        .interpolate("linear");
        
        map.selectAll(".street")
            .data(streets)
			.enter()
			.append("path")
            .attr("class","street")
            .attr("d",function(data){ return drawLine(data);})
            .attr("transform", "translate(0, 300)");         


		//bring elements to front
		//d3.select(this).moveToBack();
}
	
function plotStreetLables() {
    d3.csv("streetnames.csv", function(data) {
        for (let i=0; i < data.length; i++) {
            street_names.push({
                x: data[i].x ,
                y: data[i].y ,
                text: data[i].text,
                fontsize: data[i].fontsize,
                angle: data[i].angle
            });
        }
        
        map.selectAll('.streetnames')
            .data(street_names)
            .enter()
            .append('text')
            .attr('class', 'street_names')
            .attr('x', function(d) { return d.x ; })
            .attr('y', function(d) { return height- d.y ; })
            .attr('font-size', function(d) { return d.fontsize; })
            .text(function(d) { return d.text; })
            .attr('transform', "translate(0, 300)")
            .attr('transform',function(d) {
                return 'rotate(' + d.angle + ',' +
                    d.x + ',' + d.y + ')';
            });           
        
    });
    
}

			
// Load JSON file and parse
d3.json("streets.json",function(error,data){
    if (error) { 
        console.log(error); 
	} else { 
		console.log("streets data:",data);
	}

	streets = data;
					
    plotStreets();
    plotStreetLables();
    plotWorkHouse();
    
     
});	


		
/*---------- Load Pumps coordinates and Plot them on Streets ----------*/
			
function plotPumps(pumps){

    var x = d3.scale.linear();
	var y = d3.scale.linear();
			
			
	map.selectAll("circle")
		.data(pumps)
		.enter().append("circle")
		.style("opacity", 1)
		.style("stroke-width", "1.2")
        .style("stroke", "#0B6C6C")
		.style("fill","#E48A1D")
		.attr("r",8)
		.attr("cx",function(e){return e.x *scalingValue})
        .attr("cy",function(e){return height- e.y *scalingValue})
        .attr("transform", "translate(0, 300)")
    	.on("mouseover", function(e,i) {
            div1.transition()
                .duration(50)
                .style("opacity", 1);
            div1.html("<b>Pump"+"</br>X="+e.x+"</br>Y="+e.y+"</b>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY-28) + "px");
        })
        .on("mouseout", function(e) {
    		d3.select(this).moveToFront();
            div.transition()
                .duration(50)
                .style("opacity", 0);
        });
            
}

// Load Pumps.csv and call Pumps function
		
d3.csv("pumps.csv",function(error,pumps){
    if (error) { 
		console.log(error); //Log the error.
	} else { //If no error, the file loaded correctly. Yay!
		console.log("pumps",pumps); //Log the data.
	}
    plotPumps(pumps);    		
			
});

function plotBrewery(){
    map.selectAll('ellipse')
        .data(brewery)
    	.enter()
        .append('ellipse')
        .attr("class","brewery")
    	.style('fill', '#38EF54')
    	.style('stroke', '#004d4d')
        .attr('rx', 12)
        .attr('ry',15)
    	.attr('cx', function(f) { return f.x*scalingValue ; })
        .attr('cy', function(f) { return f.y*scalingValue  ; })
        
    	.on("mouseover", function(f,i) {
 		    div1.transition()
	            .duration(200)
	    	    .style("opacity", 1);
        	div1.html("<b>Brewery"+"</br>X="+f.x+"</br>Y="+f.y+"</b>")
    	        .style("left", (d3.event.pageX) + "px")
        	    .style("top", (d3.event.pageY-28) + "px");
            })
        .on("mouseout", function(f) {
            div.transition()
                .duration(300)
                .style("opacity", 0);
        });

}
plotBrewery()



/*---------- Plot Deaths ----------*/

function plotDeaths(selecteddate){
    if(selecteddate){
        DeathsToPlot = DeathsAgeSex.filter(function(d,i){
            if(DeathsByDay[i].date == selecteddate){
                console.log(DeathsByDay[i].date ,selecteddate)
	            console.log(i)
                DeathsToPlot = DeathsAgeSex.slice(0,totalDeaths[i]); 
                console.log("filtered:", DeathsToPlot);
            }
            
            map.selectAll('.deaths')
    			.data(DeathsToPlot)
    			.enter()
    			.append('circle')
    			.attr('class', 'deaths')
    			.attr('r', 3.5)
    			.attr('cx', function(d) { return d.x*scalingValue; })
                .attr('cy', function(d) { return height- d.y*scalingValue; })
                .attr("transform", "translate(0, 300)")
    			.style('stroke','lightgrey')
    			.style('fill', function(d){
    				if (d.gender == 0){
    			 	    return "#EE27BE"
    				}else {
    				    return "#43BEE6" 
    				}})
    			.on("mouseover", function(d,i) {
    				d3.select(this).moveToFront();
 					div.transition()
	                	.duration(50)
	    	            .style("opacity", .9);
        	        div.html("<b>Age Group: </b>"+ ageGroup[i] +"<br/>"+"<b>Gender: </b>" +deathGender[i])
    	                .style("left", (d3.event.pageX) + "px")
        	            .style("top", (d3.event.pageY-28) + "px");
                })
                .on("mouseout", function(d) {

                    div.transition()
                        .duration(50)
                        .style("opacity", 0);
                    });
        })       
    }//end of if condition   
    DeathsToPlot = DeathsAgeSex; 
 
	//Plot All deaths and their locations

	map.selectAll('.deaths')
    	.data(DeathsToPlot)
    	.enter()
    	.append('circle')
    	.attr('class', 'deaths')
    	.attr('r', 3.5)
    	.attr('cx', function(d) { return d.x*scalingValue; })
        .attr('cy', function(d) { return height- d.y*scalingValue; })
        .attr("transform", "translate(0, 300)")
    	.style('stroke','black')
    	.style('fill', function(d){
    	    if (d.gender == 0){
    			return "#EE27BE"
    		}else {
    			return "#43BEE6" 
    	}})
    	.on("mouseover", function(d,i) {
    		d3.select(this).moveToFront();
 			div.transition()
	            .duration(50)
	    	    .style("opacity", .9);
        	div.html("<b>Age Group: </b>"+ ageGroup[i] +"<br/>"+"<b>Gender: </b>" +deathGender[i])
    	        .style("left", (d3.event.pageX) + "px")
        	    .style("top", (d3.event.pageY-28) + "px");
        })
        .on("mouseout", function(d) {

            div.transition()
                .duration(50)
                .style("opacity", 0);
        });
            
}
			
d3.csv("deaths_age_sex.csv",function(error,d){
	if (error) { 
		console.log(error); 
	} else { 
		console.log("Deaths Age Sex array",d); 
	}
			
	for (var i=0; i<d.length; i++){
		var record = d[i];
		var item1 = {
			x: record.x,
			y: record.y,
			age : record.age,
			gender : record.gender	
	    }; // age & sex object
        DeathsAgeSex.push(item1);
                
                
        // set gender array
        if(record.gender==1){
            deathGender[i]= "Female"
        }else{
            deathGender[i]= "Male"
        }
                
        //set age group array
        
        if(record.age == 0){
            ageGroup[i]="0-10"
        }else if(record.age == 1){
            ageGroup[i]="11-20"
        }else if(record.age == 2){
            ageGroup[i]="21-40"
        }else if(record.age == 3){ 
            ageGroup[i]="41-60"
        }else if(record.age == 4){ 
            ageGroup[i]="61-80"
        }else if(record.age == 5){ 
            ageGroup[i]="> 80"
        }
	}//end of for statement
		
    plotDeaths();

});
		
/* Plot a graph of Deaths and their time line */

							
var padding1 = {top: 40, right: 20, bottom: 50, left: 50},
	width1 = 500-padding1.left - padding1.right,
	height1 = 400-padding1.top - padding1.bottom;
var formatDate = d3.time.format("%d-%b").parse;
var formatTime = d3.time.format("%e %b");

var timelineGraph = d3.select("body")
  		            .append("svg")
		            .attr("id","timelineGraph")
    	            .attr("width", width1 + padding1.left + padding1.right)
        	        .attr("height", height1 + padding1.top + padding1.bottom)
        	        .append("g")
  			        .attr("transform", "translate(" + padding1.left + "," + padding1.top + ")");

var maxDeaths = 143;
var minDate = new Date(1854,7,1), maxDate = new Date(1854,9,31);
var x_date = d3.time.scale().range([0, width1]);
var y_death = d3.scale.linear().range([height1, 0]);
            
// Define the axes
var xDateAxis = d3.svg.axis().scale(x_date)
		        .orient("bottom").ticks(5);

var yDeathAxis = d3.svg.axis().scale(y_death)
		        .orient("left").ticks(20);
						
var drawLine1 = d3.svg.line()
				.x(function(d) { return x_date(d.date); })
				.y(function(d) { return y_death(d.deaths); });

/*---------- Load deaths data ----------*/
var totalDeaths=[];
var sum =0;

d3.csv("deathdays.csv",function(error,deathDays,i){
    deathDays.forEach(function(d) {
        d.date = formatDate(d.date);
		d.deaths = +d.deaths;
	});
            
    DeathsByDay = deathDays;
    for(i=0; i<deathDays.length; i++){
		sum +=deathDays[i].deaths;
		totalDeaths.push(sum);
	}
	console.log("deathDays array:",deathDays);

    //scale range of data
	x_date.domain(d3.extent(deathDays, function(d) { return d.date; }));
    y_death.domain([0, d3.max(deathDays, function(d) { return d.deaths+10; })]);
    	
    timelineGraph.append("path")
                .attr("class", "line")
                .attr("d", drawLine1(deathDays));

    // Add the scatterplot
    timelineGraph.selectAll("dot")	
                .data(deathDays)	
  		        .enter().append("circle")								
                .attr("r", 4.5)	
                .attr("cx", function(d) { return x_date(d.date); })		 
                .attr("cy", function(d) { return y_death(d.deaths); })	
                .on("mouseover", function(d,i) {	
                    selecteddate = d.date; 
                    div.transition()		
                        .duration(200)		
                        .style("opacity", .9);		
                    div	.html(formatTime(d.date) + "<br/> <b>Deaths:</b>"  + d.deaths +  "<br/> <b>Total Deaths:</b>" +totalDeaths[i] )	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
                })	
                .on("click", function(d,i) {
			        //draw_totaldeaths(totalDeaths[i]);
                    console.log("Total deaths on clicked Date is :"+totalDeaths[i]);
                    console.log("active date = "+selecteddate);
           
                    map.selectAll('.deaths').remove();
            
                    plotDeaths(selecteddate);           
           
                })
    		
                .on("mouseout", function(d) {		
                    div.transition()		
                        .duration(500)		
                        .style("opacity", 0);	
                });


    // Add the X Axis
    timelineGraph.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height1 + ")")
        .call(xDateAxis);
    
    // title of timelineGraph
    timelineGraph.append("text")  
	.attr("transform", "translate(" + (width1/2) + ")")
	.style("font", "18px Segoe UI")
    .style("text-anchor", "middle")
    .text("Interactive Timeline Graph of Death's");
      
      
    //  label for  X axis
    timelineGraph.append("text")  
	.attr("transform", "translate(" + (width1/2) + " ," + (height1 + 40) + ")")
	.style("font", "16px Segoe UI")
    .style("text-anchor", "middle")
      .text("19th August to 29th September - 1854");


    // Add the Y Axis
    timelineGraph.append("g")
        .attr("class", "y axis")
        .call(yDeathAxis);

    
    //  label for  Y axis
    timelineGraph.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - padding1.left)
      .attr("x",0 - (height1 / 2))
      .attr("dy", "1em")
      .style("font", "16px Segoe UI")
      .style("text-anchor", "middle")
      .text("Number of Death's");      


});

