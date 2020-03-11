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

    var nest = d3.nest()
      .key((d) => d.state)
      .key((d) => d.main_category)
      .key((d) => d.category)
      .rollup((v) => v.length)
      .entries(newData);

    var treemap = d3.treemap()
      .size([width, height])
      .padding(1)
      .round(true);

    var root = d3.hierarchy({
      values: nest
    }, (d) => d.values).sum((d) => d.value).sort((a, b) => b.value - a.value);

    var result = treemap(root);
    
    var node = svg
      .selectAll(".node")
      .data(root.leaves())
      .enter().append("rect")
      .attr("class", "node")
      .attr("x", (d) => d.x0 + "px")
      .attr("y", (d) => d.y0 + "px")
      .attr("width", (d) => d.x1 - d.x0 + "px")
      .attr("height", (d) => d.y1 - d.y0 + "px")
      .attr("fill", d => { 
        return categoryColors[d.parent.data.key](d.data.key)
      });

  }

}
