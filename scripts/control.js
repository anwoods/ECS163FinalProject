let tsneGraph = undefined;
let parallelGraph = undefined;
let heatMap = undefined;
let treeMap = undefined;

function initCharts(data) {
  tsneGraph = new TsneGraph(d3.select('#tsne'), data);
  parallelGraph = new ParallelGraph(d3.select('#parallel'), data);
  heatMap = new HeatMap(d3.select('#heat'), data);
  treeMap = new TreeMap(d3.select('#tree'), data);

  controlChange(data); //load graphs first time
}

function controlChange(newData) {
  tsneGraph.draw(newData);
  parallelGraph.draw(newData);
  // heatMap.draw(newData);
  // treeMap.draw(newData);
}