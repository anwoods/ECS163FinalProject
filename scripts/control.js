let heatMap = undefined;
let globalData = undefined;

function initCharts(data) {
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
document.querySelector('#deadline')
  .addEventListener('click', deadline);

function deadline() {
  console.log("hello deadline");
  heatMap.draw(globalData, "deadline");
  //controlChange(data, "deadline");
  //Update heatmap visualization
  //update others as well
}
document.querySelector('#launched')
  .addEventListener('click', launched);

function launched() {
  console.log("hello lanched");
  heatMap.draw(globalData, "launched");
  //controlChange(data, "deadline");
  //update heatmap visualization
  //update others as well
}

document.querySelector('#reset')
  .addEventListener('click', reset);

function reset() {
  var rectangles = d3.select("#heat").selectAll("rect");
  rectangles.attr("opacity", 1);
  for (var it = 0; it < opacityFlat.length; it++) {
    opacityFlat[it] = 1;
  }
  while (selectedTimes.length != 0) {
    selectedTimes.pop();
  }
  //UPdate other visualizations
}