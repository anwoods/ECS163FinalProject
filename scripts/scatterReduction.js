var margin = { top: 50, right: 300, bottom: 80, left: 70 };
var width = 960 - margin.left - margin.right;
var height = 460 - margin.top - margin.bottom;

var svgPlot = d3.select("#scatter")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.csv("./data/ks-projects-201612.csv", function(error, data) {
    if (error) throw error;
var tSNEdata = [];
    data.forEach(function(d,i) {
        d.goal = +d.goal;
        d.pledged = +d.pledged;
        d.backers = +d.backers;
        d["usd pledged"]= +d["usd pledged"]
        // want original data on left side and 
        if (i<100)
            tSNEdata.push([Math.random(),Math.random(),Math.random()])
      //  tSNEdata.push([d.goal,d.pledged,d.backers,d["usd pledged"]])
    });
    

    
var dist = function(a,b){
    
    return 0.5
}
 
var distMatrix = []

for (var i=0; i<tSNEdata.length; i++){
    var row = []
    
    for (var j=0;j<tSNEdata.length;j++){
        
      row.push(dist(tSNEdata[i],tSNEdata[j]))
      
    }
    distMatrix.push(row)
}
 
 
    var opt = {}; // epsilon is learning rate (10 = default)
    var tsne = new tsnejs.tSNE(opt);
    tsne.initDataDist(distMatrix);


    for(var k = 0; k < 10; k++) {
        tsne.step(); // every time you call this, solution gets better
    }

    var points = tsne.getSolution();

  


});