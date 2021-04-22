var myNewChart; 

function convertoToScatterData(arrayData, arrayLabels){

	var dataSetsTemp = [];
	for (var i =0; i < arrayData.length; i++){
		dataSetsTemp.push({'label':i.toString(),'posX': getIndexFromYear(arrayLabels,arrayData[i][0]),'posY':arrayData[i][1]});
	};

	var arrayLabelsTemp=[];
	for (var i =0; i< arrayLabels.length; i++){
		arrayLabelsTemp.push(arrayLabels[i]);
	};

	var data = {
		labels: arrayLabelsTemp,
		datasets: dataSetsTemp
	};
	return data;
};
function printData(data){

	document.write("<br> labels.length ", data.labels.length, "<br>");
	
	for (var i =0; i< data.labels.length; i++){
		document.write(data.labels[i]," ");
	};
	document.write("<br>");
	
	for (var i =0; i < data.datasets.length; i++){
		document.write(" <br> ", data.datasets[i].label," ", data.datasets[i].posX," ", data.datasets[i].posY);
	};
};

function getIndexFromYear(arrayData,data){

	var index;
	for (var i =0; i< arrayData.length; i++){
	
		if(data==arrayData[i]){
			//document.write("<br> year", data, " index: ", i);
			index=i;break;
		};
	};
	return index;
};

function createScatterPlot(idCanvas,x0,y0,widht,height,dataArray,labelArray){
		 

	var canvas = document.getElementById(idCanvas);
	var context = canvas.getContext("2d");	
	
	var data = convertoToScatterData(dataArray, labelArray);
	
	this.myNewChart = new Chart(context).Scatter(data,{positionX0: x0, 
	positionY0: y0});
	
	return this.myNewChart;
};


function showHighLightPointPlot(idCanvas,x0,y0,widht,height,dataArray,labelArray,id){
		 

	var canvas = document.getElementById(idCanvas);
	var context = canvas.getContext("2d");	
	
	var data = convertoToScatterData(dataArray, labelArray);
	
	this.myNewChart = new Chart(context).Scatter(data,{positionX0: x0, 
	positionY0: y0}).showHighLightPoint(id);
	
};

function restoreHighLightPointPlot(idCanvas,x0,y0,widht,height,dataArray,labelArray,id){
		 

	var canvas = document.getElementById(idCanvas);
	var context = canvas.getContext("2d");	
	
	var data = convertoToScatterData(dataArray, labelArray);
	
	this.myNewChart = new Chart(context).Scatter(data,{positionX0: x0, 
	positionY0: y0}).showHighLightPoint(id);
	
};


