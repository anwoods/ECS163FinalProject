function TreeMap(svg, data) {

  var margins = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10
  };

  var boundingBox = svg.node().getBoundingClientRect();

  var height = boundingBox.height;
  var width = boundingBox.width;
  var color = d3.scaleOrdinal().range(d3.schemeCategory20c);

  this.draw = (newData) => {
    console.log('drawing treeMap');

    // filteredData = [];
    // // dict = {};
    //
    // newData.forEach(function(d, i) {
    //
    //   // For our purposes, if the state is cancelled or suspended,
    //   // we consider it a failed, non-successful project
    //   if (d.state == "canceled" || d.state == "suspended") {
    //     d.state = "failed";
    //   }
    //
    //
    // });
    //
    //
    // newData = filteredData;

    // Create a hierarchy of data, based on:
    // project's state -> main category -> category -> number of projects
    var hierarchy = d3.nest()
      .key((d) => d.state)
      .key((d) => d.main_category)
      .key((d) => d.category)
      .rollup((v) => v.length)
      .entries(newData);

    console.log(hierarchy);

    var treemap = d3.treemap()
      .size([width, height])
      .padding(1)
      .round(true);

    var root = d3.hierarchy({
      values: hierarchy
    }, (d) => d.values);
    console.log(root);
    var result = treemap(root);

    var node = svg
      .selectAll(".node")
      .data(root.leaves())
      .enter()
      .append("div")
      .attr("class", "node")
      .style("left", (d) => d.x0 + "px")
      .style("top", (d) => d.y0 + "px")
      .style("width", (d) => Math.max(0, d.x1 - d.x0 - 1) + "px")
      .style("height", (d) => Math.max(0, d.y1 - d.y0 - 1) + "px")
      .style("background", (d) => color(d.parent.data.name))
      .text((d) => d.data.name);
  }

}

// d3.csv("./data/ks-projects-201612.csv", function(error, data) {
//   if (error) throw error;
//
//   data.forEach(function(d, i) {
//     d.goal = +d.goal;
//     d.pledged = +d.pledged;
//     d.backers = +d.backers;
//     //d.category = d["category "];
//     d.deadline = new Date(d.deadline)
//     d.launched = new Date(d.deadline)
//     d.campaignLength = (d.deadline.getTime() - d.launched.getTime()) / (1000 * 3600 * 24); //number of milliseconds in a day
//   });
//
//
//   treemap = new TreeMap(d3.select('#tree'), data);
//   treemap.draw(data);
// });