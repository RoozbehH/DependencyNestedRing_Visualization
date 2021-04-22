// JavaScript Document
function QualifierCircle(ParentID,x,y,R,Data,maxVal,JQ,Cat,idx)//if JQ is 1 this function just qualify the item
{
	var NC=Data.length;//Number of criteria;
	var ran=Math.floor(Math.random()*100);
	var id="g"+ran.toString();
	var g=d3.select(ParentID).append('g').attr('id',id).attr('class','group');
	id="#"+id;
	var lineDistance=360/NC;///Degree between Axis
	radius=d3.scale.linear().domain([0,maxVal]).range([0,R]);
	//Qualifying 

	//Main Area
	var edge=Math.sqrt((R*R)+(R*R)-(2*R*R*Math.cos(lineDistance*Math.PI/180)));
	var p=0;
	p=(R+R+edge)/2;
	var SOT=0;
	SOT=Math.sqrt(p*(p-edge)*(p-R)*(p-R)); //The area of one thriangle	
	var S=0;
	for(i=0;i<Data.length;i++)
	{
		S=S+SOT;
	}
	
	//Colored Area
	var cS=0; 
	for(i=0;i<Data.length;i++)
	{
		var e1=radius(Data[i]);
		if(i===Data.length-1)
		{
			var e2=radius(Data[0]);
		}
		else
		{
			var e2=radius(Data[i+1]);
		}
		edge=Math.sqrt((e1*e1)+(e2*e2)-(2*e1*e2*Math.cos(lineDistance*Math.PI/180)));
		p=(e1+e2+edge)/2;
		SOT=Math.sqrt(p*(p-e1)*(p-e2)*(p-edge)); //The area of one thriangle	
		cS=cS+SOT;
	}
	
	Q=(cS*100)/S; ///Qualification
	Q=Q.toFixed(2);
	if(JQ==1)
	{
		return Q;
	}
	
	
	var circle=d3.select(id).append('circle')
								.attr('cx',x)
								.attr('cy',y)
								.attr('r',R)
								.style('fill','rgb(255, 252, 0)')
								.style('stroke','black')
								.style('stroke-opacity',0.2)
								.style('stroke-width',1.5)
								.style('fill-opacity',0.1);
								
	
	var axis=d3.select(id).selectAll('line')
								.data(Data)
								.enter()
								.append('line')
								.attr('class','axis')
								.attr('x1',x)
								.attr('y1',y)
								.attr('x2',x)
								.attr('y2',y+R)
								.attr('transform',function(d,i){
													return "rotate("+((i/NC*360)-180)+","+x+","+y+")";
												})
								.attr("stroke-width", 2)
								.attr('stroke','black')
								.attr('opacity',0.2);
								
	
	
	
	//make the points of data on the axis
	var aDegree
		,tempData=[]
		,lineData=[];
	for(i=0;i<Data.length;i++)
	{
		tempData.push({"x": 0,"y": 0-radius(Data[i])});
		aDegree=i*lineDistance;
		lineData.push({"x":x+(tempData[i].x*Math.cos(aDegree*Math.PI/180)-(tempData[i].y)*Math.sin(aDegree*Math.PI/180)), "y": y+(tempData[i].x*Math.sin(aDegree*Math.PI/180)+(tempData[i].y)*Math.cos(aDegree*Math.PI/180))});
	}
	
	var dataPoints=d3.select(id).selectAll('.dataCircle')
							    .data(lineData)
								.enter()
								.append('circle')
								.attr('class','dataCircle')
								.attr('cx',function(d,i){
												return d.x;
										  })
								.attr('cy',function(d,i){
												return d.y;
									      })
								.attr('r',2.5);
								
									
	var linefunction=d3.svg.line()
						   .x(function(d){
							   return d.x;
							 })
						   .y(function(d){
							   return d.y;
							 })
						   .interpolate('basic-closed');
						   
	var radGraph=d3.select(id).append('path')
								.attr('d',linefunction(lineData))
								.attr('stroke','blue')
								.attr('stroke-width',1.5)
								.attr('fill','blue')
								.attr('opacity',0.4);
								
								
	d3.select(id).append('line')
				 .attr('x1',x)
				 .attr('y1',y-R-1)
				 .attr('x2',x+R+130)
				 .attr('y2',y-R)
				 .attr('stroke-width',2)
				 .attr('stroke','#c2c0bf');
				 
				 
	var dLength=0			 
	var des=d3.select(id).selectAll('.desc')
						.data(function(){
								if(Cat==0)
								{
									dLength=jcQualify[idx].length;
									return jcQualify[idx];
								}
								if(Cat==1)
								{
									dLength=paperQualify[idx].length;
									return paperQualify[idx];
								}
								if(Cat==2)
								{
									dLength=authorQualify[idx].length;
									return authorQualify[idx];
								}
							  })
						.enter()
						.append('text')
						.attr('x',x+R+30)
						.attr('class','desc')
						.style('font-size',function(d,i){
												if(i==dLength-1)
													return '15px';
												else
													return '14px';
										  })
						.style('font-weight',function(d,i){
												if(i==dLength-1)
													return 'bold';
												else
													return 'normal';
										  })
						.attr('y',function(d,i){
								 	return y-R+20+(i*30);
								 })
						.text(function(d,i){
								if(Cat==0)
								{
									if(i==0)
										return "Quality    : "+jcQualify[idx][i].toString();
									if(i==1)
										return "Citation   : "+jcQualify[idx][i].toString();
									if(i==2)
										return "Papers Qty : "+jcQualify[idx][i].toString();
									if(i==3)
										return "Age of Jor : "+jcQualify[idx][i].toString();
									if(i==4)
										return "Grade      : "+jcQualify[idx][i].toString();
								}
								if(Cat==1)
								{
									if(i==0)
										return "Quality    : "+paperQualify[idx][i].toString();
									if(i==1)
										return "Citation   : "+paperQualify[idx][i].toString();
									if(i==2)
										return "Cite per Year : "+paperQualify[idx][i].toString();
									if(i==3)
										return "Grade      : "+paperQualify[idx][i].toString();
								}
								if(Cat==2)
								{
									if(i==0)
										return "Quality    : "+authorQualify[idx][i].toString();
									if(i==1)
										return "Citation   : "+authorQualify[idx][i].toString();
									if(i==2)
										return "Papers Qty : "+authorQualify[idx][i].toString();
									if(i==3)
										return "Grade      : "+authorQualify[idx][i].toString();
								}
							  });
						
	
		
				 
								
	
	

	
	
	d3.select(id).append('text')
					.attr('x',x-18)
					.attr('y',y+5)
					.text(Q+"%")
					.attr('opacity',0.5)
					.attr('font-size',14)
					.attr('font-family','serif, "Lucida Bright", "DejaVu Serif", Georgia, Constantia ')
					.on("mousemove",function (){
												this.setAttribute('opacity',0.9);
												this.setAttribute('font-size',20);
											})
					.on("mouseout",function (){
												this.setAttribute('opacity',0.5);
												this.setAttribute('font-size',14);
											});
	
	return Q;	
	
};

