let heatMap = undefined;
let globalData = undefined;

function initCharts(data){
	globalData = data;
	heatMap = new HeatMap(d3.select('#heat'), data);
	controlChange(data, "launched");
}

function controlChange(newData, deadlineOrLaunched) {
  //tsneGraph.draw(newData);
  //parallelGraph.draw(newData);
  heatMap.draw(newData, deadlineOrLaunched);
  //treeMap.draw(newData);
}

function deadline(){
	console.log("hello deadline");
	heatMap.draw(globalData, "deadline");
	//controlChange(data, "deadline");
	//Update heatmap visualization
	//update others as well
}

function launched(){
	console.log("hello lanched");
	heatMap.draw(globalData, "launched");
	//controlChange(data, "deadline");
	//update heatmap visualization
	//update others as well
}