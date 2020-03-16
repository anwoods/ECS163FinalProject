// let globalData = undefined;
let tsneGraph = undefined;
let parallelGraph = undefined;
let heatMap = undefined;
let treeMap = undefined;

function initCharts(data) {
  // globalData = data;
  tsneGraph = new TsneGraph(d3.select('#tsne'), data);
  parallelGraph = new ParallelGraph(d3.select('#parallel'), data);
  heatMap = new HeatMap(d3.select('#heat'), data);
  treeMap = new TreeMap(d3.select('#tree'), data);

  heatMap.draw(data, "launched");
  treeMap.draw(data);
  d3.select('#show').attr('class', 'show'); //show button after graphs are drawn
  d3.select('#buttons').attr('class', 'show');
}

function updateTreeMap(newData) {
  treeMap.draw(newData);
}

function updateSelection(newData) {
  tsneGraph.draw(newData);
  parallelGraph.draw(newData);
}