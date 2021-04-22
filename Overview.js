// JavaScript Document
var labelArray = ["2000", "2001", "2002", "2003", "2004", "2005", "2006",
						  "2007", "2008", "2009", "2010", "2011", "2012", "2013"];
var scatter;

function CreateDB(file)
{
	//making the main array equal to the file
	//var DataSet=[];
	var cLevels=d3.text("QualisConferencias2012.csv",function(error,data){
														//alert(data.length);
														cLevel=d3.csv.parse(data);
														
												    });
	var Data=d3.csv(file,function(error,data){
						//alert("Data is loaded");
						DataSet=data;
						var temp=[];
						var id=0;
						
						//Making Authors Array
						for(i=0;i<DataSet.length;i++)
						{
							temp=DataSet[i].Authors.split(';');
							for(j=0;j<temp.length;j++)
							{
								var repeat=findString(Authors,temp[j]);
								if(repeat.length==0)
								{
									Authors.push({'ID':id,'Name':temp[j]});
									id++;
								}
							}
						}
						id=0;
						//------------------------------------------------------------------
						//Making Key Words Array
						for(i=0;i<DataSet.length;i++)
						{
							temp=DataSet[i].KeyWord.split(',');
							for(j=0;j<temp.length;j++)
							{
								var repeat=findString(keyWords,temp[j]);
								if(repeat.length==0 && temp[j]!='n/a')
								{
									keyWords.push({'ID':id,'Name':temp[j]});
									id++;
									
								}
							}
						}
						id=0;
						//-------------------------------------------------------------------
						//Making Papers
						for(i=0;i<DataSet.length;i++)
						{
							Papers.push({'ID':i,'Name':DataSet[i].Title,'Cite':DataSet[i].Citation,'Year':+DataSet[i].Year});
							id++;
						}
						id=0;
						//-------------------------------------------------------------------
						//Making Jornals and Confrances Array
						for(i=0;i<DataSet.length;i++)
						{
							var repeat=findString(JC,DataSet[i].JC);
							if(repeat.length==0)
							{
								JC.push({'ID':id,'Name':DataSet[i].JC,'Age':DataSet[i].Age});
								id++;
							}
						}
						id=0;
						//-------------------------------------------------------------------
						//Create the relationship arrays between entities
						//-------------------------------------------------------------------
						//Ceate Relationship Array for Paper && KeyWords
						for (i=0;i<Papers.length;i++)
						{
							temp=DataSet[i].KeyWord.split(',');
							for(j=0;j<keyWords.length;j++)
							{
								for(q=0;q<temp.length;q++)
								{
									if (temp[q]==keyWords[j].Name)
									{
										P_K.push({ 'pID': i, 'kID': j });
									}
								}
							}
						}
						
						//Ceate Relationship Array for Paper && Authors
						for (i=0;i<Papers.length;i++)
						{
							for(j=0;j<Authors.length;j++)
							{
							    if (DataSet[i].Authors.search(Authors[j].Name) != -1)
							    {
							        P_A.push({ 'pID': i, 'aID': j });
							    }
							}
						}
						
						//Ceate Relationship Array for Paper && Jornals and Confrences
						for (i=0;i<Papers.length;i++)
						{
							for(j=0;j<JC.length;j++)
							{
								if(DataSet[i].JC==JC[j].Name)
								{
									P_JC.push({'pID':i,'jcID':j});
								}
							}
						}
	                    //---------------------------------------------------------------
						//Make Qualified Array for the papers
						//Normalizing 
						
						var temp=[];
						var confLevel=-1,maxCite,maxQual,maxCY,age; //maxCY is maximum of Cite per year
						for(i=0;i<Papers.length;i++)
						{
							for(j=0;j<P_JC.length;j++)
							{
								if(Papers[i].ID==P_JC[j].pID)
								{
									for(q=0;q<cLevel.length;q++)
									{
										if(JC[P_JC[j].jcID].Name==cLevel[q].Name)
										{
											confLevel=(+cLevel[q].level);
											
										}
									}
									
								}
								
							}
							if (confLevel==-1)
							{
								confLevel=1;
							}
							age=new Date().getFullYear()-(+Papers[i].Year);
							paperQualify[i]=[confLevel,(+Papers[i].Cite),Papers[i].Cite/age];
							confLevel=-1;
						}
						var mp=[];
						mp[0]=paperQualify.map(function(d){
												return d[0];
											});
						mp[0]=Math.max.apply(null,mp[0]);
						mp[1]=paperQualify.map(function(d){
												return d[1];
											});
						mp[1]=Math.max.apply(null,mp[1]);
						mp[2]=paperQualify.map(function(d){
												return d[2];
											});
						mp[2]=Math.max.apply(null,mp[2]);
						
						
						normalConf=d3.scale.linear().domain([0,7]).range([0,100]);
						normalCite=d3.scale.linear().domain([0,mp[1]]).range([0,100]);
						normalCA=d3.scale.linear().domain([0,mp[2]]).range([0,100]);
						for(l=0;l<paperQualify.length;l++)
						{
							pnormalized[l]=[normalConf(paperQualify[l][0]),normalCite(paperQualify[l][1]),normalCA(paperQualify[l][2])];
							paperQualify[l][3]=QualifierCircle('#radarSVG',50,50,100,pnormalized[l],100,1);
						}
						//---------------------------------------------------------------
						//Qualifying the Authors
						
						var temp=[];
						var confLevel=-1,sumCite=0,sumLevel=0,NP=0;
						for(i=0;i<Authors.length;i++)
						{
							for(j=0;j<P_A.length;j++)
							{
								if(Authors[i].ID==P_A[j].aID)
								{
									NP++;
									sumCite=sumCite+(+Papers[P_A[j].pID].Cite);
									for(w=0;w<P_JC.length;w++)
									{
										if(Papers[P_A[j].pID].ID==P_JC[w].pID)//sum the levels of confrences that the authors' papers have been published there
										{
											for(q=0;q<cLevel.length;q++)
											{
												if(JC[P_JC[w].jcID].Name==cLevel[q].Name)
												{
													confLevel=(+cLevel[q].level);
												}
											}
											if(confLevel==-1)
											{
												sumLevel=sumLevel+1;
											}
											else
											{
												sumLevel=sumLevel+confLevel;
											}
										}
									}
									
									
								}
								
							}

							authorQualify[i]=[sumLevel,sumCite,NP];
							confLevel=-1;
							sumCite=0;
							NP=0;
							sumLevel=0;
						}
						var ma=[];
						ma[0]=authorQualify.map(function(d){
												return d[0];
											});
						ma[0]=Math.max.apply(null,ma[0]);
						ma[1]=authorQualify.map(function(d){
												return d[1];
											});
						ma[1]=Math.max.apply(null,ma[1]);
						ma[2]=authorQualify.map(function(d){
												return d[2];
											});
						ma[2]=Math.max.apply(null,ma[2]);
						
						
						normalConf=d3.scale.linear().domain([0,ma[0]]).range([0,100]);
						normalCite=d3.scale.linear().domain([0,ma[1]]).range([0,100]);
						normalNP=d3.scale.linear().domain([0,ma[2]]).range([0,100]);
						for(l=0;l<authorQualify.length;l++)
						{
							anormalized[l]=[normalConf(authorQualify[l][0]),normalCite(authorQualify[l][1]),normalNP(authorQualify[l][2])];
							authorQualify[l][3]=QualifierCircle('#radarSVG',50,50,100,anormalized[l],100,1);
						}
						//---------------------------------------------------------------
						//Qualifying the JounalsConferences
						
						
						var temp=[];
						var confLevel=-1,maxCite,sumCite=0,NP=0,age=0;//NP is the paper number
						
						for(m=0;m<JC.length;m++)
						{
							
							age=(+JC[m].Age);
							
							for(n=0;n<cLevel.length;n++)
							{
								
								if(JC[m].Name.toLowerCase()==cLevel[n].Name.toLowerCase())
								{
									confLevel=(+cLevel[n].level);
								}
							}
							if (confLevel==-1)
							{
								confLevel=1;
							}
							for(j=0;j<P_JC.length;j++)
							{
								if(JC[m].ID==P_JC[j].jcID)
								{
									NP++;
									sumCite=sumCite+(+Papers[P_JC[j].pID].Cite);								
								}
								
							}

							jcQualify[m]=[confLevel,sumCite,NP,age];
							confLevel=-1;
							sumCite=0;
							NP=0;
						}
						var mjc=[];
						mjc[0]=jcQualify.map(function(d){
												return d[0];
											});
						mjc[0]=Math.max.apply(null,mjc[0]);
						mjc[1]=jcQualify.map(function(d){
												return d[1];
											});
						mjc[1]=Math.max.apply(null,mjc[1]);
						mjc[2]=jcQualify.map(function(d){
												return d[2];
											});
						mjc[2]=Math.max.apply(null,mjc[2]);
						mjc[3]=jcQualify.map(function(d){
												return d[3];
											});
						mjc[3]=Math.max.apply(null,mjc[3]);
						
						normalConf=d3.scale.linear().domain([0,mjc[0]]).range([0,100]);
						normalCite=d3.scale.linear().domain([0,mjc[1]]).range([0,100]);
						normalNP=d3.scale.linear().domain([0,mjc[2]]).range([0,100]);
						normalAge=d3.scale.linear().domain([0,mjc[3]]).range([0,100]);
						for(l=0;l<jcQualify.length;l++)
						{
							jcnormalized[l]=[normalConf(jcQualify[l][0]),normalCite(jcQualify[l][1]),normalNP(jcQualify[l][2]),normalAge(jcQualify[l][3])];
							jcQualify[l][4]=QualifierCircle('#radarSVG',50,50,100,jcnormalized[l],100,1);
						}
						//---------------------------------------------------------------
	                    //Make the overview rings
						mainSize=document.getElementById('mainSVG');
						ItemRing(mainSize.clientWidth/2 , mainSize.clientHeight/2 , (mainSize.clientWidth/2)*5.4/100, JC, 0);
						ItemRing(mainSize.clientWidth/2 , mainSize.clientHeight/2 , (mainSize.clientWidth/2)*18.9/100, Papers, 1);
						ItemRing(mainSize.clientWidth/2 , mainSize.clientHeight/2 , (mainSize.clientWidth/2)*32.43/100, Authors, 2);
						ItemRing(mainSize.clientWidth/2 , mainSize.clientHeight/2 , (mainSize.clientWidth/2)*45.94/100, keyWords, 3);
	    				//making legend
						var colors = ['#5EFE4D', '#FF6000', '#EE4DFE', '#FE4D5E'];
						var legX=60,legY=20;
						d3.select('#mainSVG').selectAll('.leggend')
                                              .data(colors)
                                              .enter()
                                              .append('rect')
                                              .attr('class','leggend')
                                              .attr('x', legX)
                                              .attr('y', function (d, i) {
                                                    return i * 32 + 10;
                                                })
                                              .attr('width', 15)
                                              .attr('height', 15)
	                                          .attr('fill', function (d) { return d });

						var legtxt=['Journals & Conferences','Papers','Authors','Key Words'];
					   d3.select('#mainSVG').selectAll('.leggendtxt')
                                                            .data(legtxt)
                                                            .enter()
                                                            .append('text')
                                                            .attr('class', 'leggendtxt')
                                                            .attr('x', legX+20)
                                                            .attr('y', function (d, i) {
                                                                return (i * 32 + 21);
                                                            })
                                                            .attr('width', 30)
                                                            .attr('height', 30)
                                                            .attr('fill', function (d, i) { return colors[i]; })
                                                            .style('stroke', 'black')
                                                            .style('stroke-width','0.5px')
					                                        .text(function(d){return d;});

						//---------------------------------------------------------------
						for(i=0;i<paperQualify.length;i++)
						{
							paperScatter[i]=[(+Papers[i].Year),(+paperQualify[i][3])];
						}
						
						var z=document.getElementById("scatterDiv");
						
						scatter = createScatterPlot('scatterConv',0,0,z.clientWidth-10,z.clientHeight-40,paperScatter,labelArray);
				});
	
	
	
};

function findString(array,data)
{
	var location=[],j=0;
	
	for(q=0;q<array.length;q++)
	{
		if(array[q].Name==data)
		{
			location[j]=i;
			j++;
		}
		
	}
	return location;
};


function ItemRing(X,Y,R,Data,Cat)//making the rings for overview 
{
	//choosing colors based on Category of data
	if (Cat==0)//Conferences
	{
		iColor='#5EFE4D';//item color
		tColor='#5ba152';//text color
	}
	else if(Cat==1)//Papers
	{
		iColor='#FF6000';//item color
		tColor ='#FF7F00';//'#00A2FF';//'#FF6300';//text color
	}
	else if(Cat==2)//Authors
	{
		iColor='#EE4DFE';//item color
		tColor='#a255a8';//text color
	}
	else if(Cat==3)//Key Words
	{
		iColor='#FE4D5E';//item color
		tColor='#ab545b';//text color
	}
	
	// The Data should have 2 columns the First one is the ID and second one is the name
	var id = "Cat"+Cat;
	var group=d3.select('#mainSVG').append('g')
							 .attr('id',id)
							 .attr('opacity',1);
							 /*.on("mousemove",function (){
												this.setAttribute('opacity',1);
											})
							 .on("mouseout",function (){
												this.setAttribute('opacity',0.7);
											});*/
	
	id = "#" + id;
	var ring=d3.select(id).append('circle')
							.attr('cx',X)
							.attr('cy',Y)
							.attr('r',R)
							.attr('stroke','gray')
							.attr('stroke-width',1.5)
							.attr('class','ring')
							.attr('fill','none'); 
							
	var items=d3.select(id).selectAll('.items')//the circles which show the items
							.data(Data)
							.enter()
							.append('circle')
							.attr('cx',X)
							.attr('cy',Y+R)
							.attr('r',2.5)
							.attr('fill',iColor)
							.attr('class','items')
							.attr('id',function(d,i){
											return "item"+i.toString();
									  })
							.attr('transform',function(d,i){
												return "rotate("+((i*360/Data.length)-180)+","+X+","+Y+")";
											 });
							
											 
	var text=d3.select(id).selectAll('.names')// the name of each items
							.data(Data)
							.enter()
							.append('text')
							.attr('x',X)
							.attr('y',Y+R+5)
							.attr('class','names')
							.attr('id',function(d,i){
											return "name"+i.toString();
									  })
							.attr('transform',function(d,i){
												return "rotate("+((i*360/Data.length)-180)+","+X+","+Y+")";
											 })
							.style('writing-mode','tb')
							
							.style('fill',tColor) //previouse color '#6A6A6A'
							.style('font-size','8px')
							.text(function(d,i){
										return d.Name;
								  })
							.on("mouseover",function (d,i){
							                    itemMouseOver(i, Cat);
											})
							.on("mouseout",function (){
												d3.select('#mainSVG').selectAll('.items').attr('opacity',1).attr('r', 2.5);
												d3.select('#mainSVG').selectAll('.ring').attr('opacity',1);
												d3.select('#mainSVG').selectAll('.names').attr('opacity',1).style('font-size', '8px');
												d3.select('#infoSVG').selectAll('*').remove();
												d3.select('#radarSVG').selectAll('*').remove();
												scatter = createScatterPlot('scatterConv',0,0,z.clientWidth-10,z.clientHeight-40,paperScatter,labelArray);
												//scatter.restoreHighLightPoint(i);
											});
							
							
};
function textChange()
{
    var e = document.getElementById("searchCategories");
    var Category = e.value;
    var text = document.getElementById('searchBox').value;
    var Cat;
    if (Category == "Jurnals")//Conferences
    {
        Cat = 0;
    }
    else if (Category == "Papers")//Papers
    {
        Cat = 1;
    }
    else if (Category == "Authors")//Authors
    {
        Cat = 2;
    }
    else if (Category == "Key Words")//Key Words
    {
        Cat = 3;
    }
    findItems(text, Cat);
}
function findItems(text,Cat)
{
    var tempText,items;
    d3.select('#mainSVG').selectAll('.items').attr('opacity', 0.15);
    d3.select('#mainSVG').selectAll('.ring').attr('opacity', 0.15);
    d3.select('#mainSVG').selectAll('.names').attr('opacity', 0.15);
    Cat = "#Cat" + Cat.toString();
    items = d3.selectAll(Cat).selectAll('text');
    for(i=0;i<items[0].length;i++)
    {
        if(items[0][i].textContent.indexOf(text)>=0)
        {
            d3.select(items[0][i]).attr('opacity', 1);
        }
    }
}
function itemMouseOver(i,Cat)
{
    d3.select('#mainSVG').selectAll('.items').attr('opacity', 0.15);
    d3.select('#mainSVG').selectAll('.ring').attr('opacity', 0.15);
    d3.select('#mainSVG').selectAll('.names').attr('opacity', 0.15);
    var RN = findRelated(i, Cat);
    for (q = 0; q < RN.length; q++) {
        for (j = 0; j < RN[q].length; j++) {
            d3.select('#Cat' + q).select('#item' + RN[q][j]).attr('opacity', 1);
            d3.select('#Cat' + q).select('#name' + RN[q][j]).attr('opacity', 1);
            d3.select('#Cat' + q).select('#item' + RN[q][j]).attr('r', 3.5);
            d3.select('#Cat' + q).select('#name' + RN[q][j]).style('font-size', '11px');
        }
    };
    WriteSpec(RN, i, Cat);
    if (Cat == 0)//Conf
    {
        QualifierCircle('#radarSVG', 200, 105, 100, jcnormalized[i], 100, 0, 0, i);
    }
    if (Cat == 1)//Papers
    {
        QualifierCircle('#radarSVG', 200, 105, 100, pnormalized[i], 100, 0, 1, i);
    }
    if (Cat == 2)//Conf
    {
        QualifierCircle('#radarSVG', 200, 105, 100, anormalized[i], 100, 0, 2, i);
    }
    if (Cat == 1) {
        scatter = createScatterPlot('scatterConv', 0, 0, z.clientWidth - 10, z.clientHeight - 40, paperScatter, labelArray);
        scatter.showHighLightPoint(i);
    }
}

function findRelated(item, cat) {
    var paperItems=[],authorItems=[],keywordItems=[],jornalItems=[],relatedItems = [];//this array save the related items to the selected items :Row 0 is Confrences , 1 is Papers, 2 is Authors, 3 is Key words
    var itemID;
    var CC = 0, //Conf Counter
        PC = 0, //Paper Counter
        AC = 0, //Author Counter
        KC = 0; //Keywords Counter
    if (cat == 0)//Conferences
    {
        for(i=0;i<P_JC.length;i++)
        {
            if (P_JC[i].jcID == item)
            {
                jornalItems[CC] = item;
                paperItems[PC] = P_JC[i].pID;
                for (j = 0; j < P_A.length; j++) //finding Authors who are related to the papers which are published in the Conf.|| Jornals.
                {
                    if(P_A[j].pID==paperItems[PC])
                    {
                        authorItems[AC] = P_A[j].aID;
                        AC++;
                    }
                }
                for (j = 0; j < P_K.length ; j++) //finding Key words who are related to the papers which are published in the Conf.|| Jornals.
                {
                    if (P_K[j].pID == paperItems[PC])
                    {
                        keywordItems[KC] = P_K[j].kID;
                        KC++;
                    }
                }
                CC++;
                PC++;
            }
        }
        relatedItems[0] = jornalItems;
        relatedItems[1] = paperItems;
        relatedItems[2] = authorItems;
        relatedItems[3] = keywordItems;
        return relatedItems;
    }
    if (cat == 1)//Papers
    {
        for (i = 0; i < P_JC.length; i++)
        {
            if (P_JC[i].pID == item)//finding Journals which have published the papers  
            {
                jornalItems[CC] = P_JC[i].jcID;
                paperItems[PC] = item;
                CC++;
                PC++;
            }
        }
        for (j = 0; j < P_A.length; j++) //finding Authors who are related to the papers which are published in the Conf.|| Jornals.
        {
            if (P_A[j].pID == item)
            {
                authorItems[AC] = P_A[j].aID;
                AC++;
            }
        }
        for (j = 0; j < P_K.length ; j++) //finding Key words who are related to the papers which are published in the Conf.|| Jornals.
        {
            if (P_K[j].pID == item)
            {
                keywordItems[KC] = P_K[j].kID;
                KC++;
            }
        }
                
            
        
        relatedItems[0] = jornalItems;
        relatedItems[1] = paperItems;
        relatedItems[2] = authorItems;
        relatedItems[3] = keywordItems;
        return relatedItems;
    }
    if (cat == 2)//Authors
    {
		for(i=0;i<P_A.length;i++)
        {
            if (P_A[i].aID == item)
            {
                authorItems[AC] = item;
                paperItems[PC] = P_A[i].pID;
                for (j = 0; j < P_JC.length; j++) //finding Journals who are related to the papers which wrote by the Author.
                {
                    if(P_JC[j].pID==paperItems[PC])
                    {
                        jornalItems[CC] = P_JC[j].jcID;
                        CC++;
                    }
                }
                for (j = 0; j < P_K.length ; j++) //finding Key words who are related to the papers which are published in the Conf.|| Jornals.
                {
                    if (P_K[j].pID == paperItems[PC])
                    {
                        keywordItems[KC] = P_K[j].kID;
                        KC++;
                    }
                }
                AC++;
                PC++;
            }
        }
        relatedItems[0] = jornalItems;
        relatedItems[1] = paperItems;
        relatedItems[2] = authorItems;
        relatedItems[3] = keywordItems;
        return relatedItems; 
	}
    if (cat == 3)//Key Words
    {
		for(i=0;i<P_K.length;i++)
        {
            if (P_K[i].kID == item)
            {
                keywordItems[KC] = item;
                paperItems[PC] = P_K[i].pID;
                for (j = 0; j < P_A.length; j++) //finding Author who has writen the papers which are related to the key word.
                {
                    if(P_A[j].pID==paperItems[PC])
                    {
                        authorItems[AC] = P_A[j].aID;
                        AC++;
                    }
                }
                for (j = 0; j < P_JC.length; j++) //finding Journals who are related to the papers which wrote by the Author.
                {
                    if(P_JC[j].pID==paperItems[PC])
                    {
                        jornalItems[CC] = P_JC[j].jcID;
                        CC++;
                    }
                }
                KC++;
                PC++;
            }
        }
        relatedItems[0] = jornalItems;
        relatedItems[1] = paperItems;
        relatedItems[2] = authorItems;
        relatedItems[3] = keywordItems;
        return relatedItems; 
	}

};


function WriteSpec(Data,idx,Cat)
{
	var z=document.getElementById('infoDiv');
	var a=[idx];
	var startX=20,X;
	var startY = 45, Y;
	var text0 = d3.select('#infoSVG')
                        .append('text')
                        .attr('x', startX)
                        .attr('y', startY)
                        .attr('class','titleSpec')
                        .text(function () {
                            if (Cat == 0)
                                return "Journal and Conference:"
                            if (Cat == 1)
                                return "Paper:"
                            if (Cat == 2)
                                return "Author:"
                        });
	startX += 5;
	startY += 10;
	if(Cat==0)//Confrences
	{
	    
		var text1=d3.select('#infoSVG')
							.append('text')
							.attr('x',startX)
							.attr('y',startY)
							.attr('class','spec')
							.attr('font-size','12px')
							.attr('class','spec');
		var a=JC[idx].Name;
		for(i=0;i<=a.length/95;i++)
		{
			text1.append('tspan').attr('x',startX+5).attr('dy',20).text(function(d){return a.substr(i*95,(i+1)*95)});
		}
		
		//Print Papers
		var text2=d3.select('#infoSVG').append('text')
										  .attr('x',startX+10)
										  .attr('y',startY+48)
										  .attr('class','titleSpec')
										  .style('font-size','14')
										  .text("Papers:");
		X=startX+15;
		Y=startY+70;								  
		for(i=0;i<Data[1].length;i++)
		{
			
			d3.select('#infoSVG').append('text')
								 .attr('x',X)
								 .attr('y',Y)
								 .attr('class','spec')
								 .text('- '+Papers[Data[1][i]].Name)
								 .style('font-size','12px');
			Y=Y+20;
		}
		
		//Print Authors
		Y=Y+20;
		var text2=d3.select('#infoSVG').append('text')
										  .attr('x',startX+10)
										  .attr('y',Y)
										  .attr('class','titleSpec')
										  .style('font-size','14')
										  .text("Authors:");
		X=startX+15;
		Y=Y+20;							  
		for(i=0;i<Data[2].length;i++)
		{
			
			d3.select('#infoSVG').append('text')
								 .attr('x',X)
								 .attr('y',Y)
								 .attr('class','spec')
								 .text('* '+Authors[Data[2][i]].Name)
								 .style('font-size','12px');
			X=X+150;
			if(X>z.clientWidth-100)
			{
				Y=Y+20;
				X=startX+15;
			}
		}
		
		
						

	}
	if(Cat==1)//Papers
	{
		var text1=d3.select('#infoSVG')
							.append('text')
							.attr('x',startX)
							.attr('y',startY)
							.attr('font-size','12px')
							.attr('class','spec');
		var a=Papers[idx].Name;
		for(i=0;i<=a.length/95;i++)
		{
			text1.append('tspan').attr('x',startX).attr('dy',15).text(function(d){return a.substr(i*95,(i+1)*95)});
		}
		
		//Print Journal
		var text2=d3.select('#infoSVG').append('text')
										  .attr('x',startX+10)
										  .attr('y',startY+48)
										  .attr('class','titleSpec')
										  .style('font-size','14')
										  .text("Journal:");
		X=startX+15;
		Y=startY+70;								  
		for(i=0;i<Data[0].length;i++)
		{
			
			d3.select('#infoSVG').append('text')
								 .attr('x',X)
								 .attr('y',Y)
								 .attr('class','spec')
								 .text('- '+Papers[Data[1][i]].Name)
								 .style('font-size','12px');
			Y=Y+20;
		}
		
		//Print Authors
		Y=Y+20;
		var text2=d3.select('#infoSVG').append('text')
										  .attr('x',startX+10)
										  .attr('y',Y)
										  .attr('class','titleSpec')
										  .style('font-size','14')
										  .text("Authors:");
		X=startX+15;
		Y=Y+20;							  
		for(i=0;i<Data[2].length;i++)
		{
			
			d3.select('#infoSVG').append('text')
								 .attr('x',X)
								 .attr('y',Y)
								 .attr('class','spec')
								 .text('* '+Authors[Data[2][i]].Name)
								 .style('font-size','12px');
			X=X+200;
			if(X>z.clientWidth-100)
			{
				Y=Y+20;
				X=startX+15;
			}
		}
	}
	if(Cat==2)//Authors
	{
		var text1=d3.select('#infoSVG')
							.append('text')
							.attr('x',startX)
							.attr('y',startY)
							.attr('font-size','12px')
							.attr('class','spec');
		var a=Authors[idx].Name;
		for(i=0;i<=a.length/75;i++)
		{
			text1.append('tspan').attr('x',startX).attr('dy',15).text(function(d){return a.substr(i*95,(i+1)*95)});
		}
		
		//Print Journal
		var text2=d3.select('#infoSVG').append('text')
										  .attr('x',startX+10)
										  .attr('y',startY+48)
										  .attr('class','titleSpec')
										  .style('font-size','14')
										  .text("Journal:");
		X=startX+15;
		Y=startY+70;								  
		for(i=0;i<Data[0].length;i++)
		{
			
			d3.select('#infoSVG').append('text')
								 .attr('x',X)
								 .attr('y',Y)
								 .attr('class','spec')
								 .text('- '+JC[Data[0][i]].Name)
								 .style('font-size','12px');
			Y=Y+20;
		}
		
		//Print Papers
		Y=Y+20;
		var text2=d3.select('#infoSVG').append('text')
										  .attr('x',startX+10)
										  .attr('y',Y)
										  .attr('class','titleSpec')
										  .style('font-size','14')
										  .text("Papers:");
		X=startX+15;
		Y=Y+20;							  
		for(i=0;i<Data[1].length;i++)
		{
			
			d3.select('#infoSVG').append('text')
								 .attr('x',X)
								 .attr('y',Y)
								 .attr('class','spec')
								 .text('- '+Papers[Data[1][i]].Name)
								 .style('font-size','12px');
			Y=Y+20;

		}
	}
	if(Cat==3)//Key Words
	{}
}