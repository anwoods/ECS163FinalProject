function TreeMap(svg, data) {

  var margins = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10
  };

  var header = {
    height: 30
  };

  var selectedCategories = [];

  var boundingBox = svg.node().getBoundingClientRect();

  var height = boundingBox.height - header.height;
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
      .paddingOuter(3)
      .paddingTop(19)
      .round(true);

    var root = d3.hierarchy({
      values: nest
    }, (d) => d.values).sum((d) => d.value).sort((a, b) => b.value - a.value);

    var result = treemap(root);
    
    const node = svg.selectAll("g")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

  // node.append("title")
  //     .text(d => `${d.ancestors().reverse().map(d => d.data.key).join("/")}\n`);

  console.log(root.descendants());

  var failSucceedColors = {failed: '#f0bdb6', successful: '#ccf0d5'};

  // node.append("rect")
  //     .data(root.descendants().filter(d => d.depth == 1))
  //     .attr("fill", d => {
  //         console.log(d.data.key);
  //         return failSucceedColors[d.data.key];
  //     })
  //     .attr("width", d => d.x1 - d.x0)
  //     .attr("height", d => d.y1 - d.y0);

  node.append("rect")
      .attr("id", d => {console.log(d.ancestors().reverse().map(d => d.data.key)); return d.ancestors().reverse().map(d => d.data.key).join("-")})
      .attr("fill", d => {
        if (d.depth == 1) {
          return failSucceedColors[d.data.key];
        } else 
        if (d.depth == 3) {
          return categoryColors[d.parent.data.key](d.data.key);
        } else {
          return 'white';
        }
      })
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .on('mouseover', (datum, index, nodes) => {
        d3.select(nodes[index])
          .attr("fill-opacity", "0.8");

        var tooltip = d3.select('#treemapTooltip');
       
        var rect = nodes[index].getBoundingClientRect();
        
        tooltip.style('display', 'block');
        tooltip.style('left', d3.event.pageX+"px");
        tooltip.style('top', d3.event.pageY+"px");
        // tooltip.style('left', rect.left+"px");
        // tooltip.style('top', rect.top+"px");
        if (datum.depth == 1) {
          console.log(datum);
          tooltip.html('<b>' + 
           + datum.value + '</b> ' 
           + datum.data.key + ' projects');
        } else if (datum.depth > 0) {
          tooltip.html('<b>'
           + datum.data.key + '</b><br>' 
           + datum.value + ' projects');
        }
      })
      .on('mousemove', function(datum, index, nodes) {
        var tooltip = d3.select('#treemapTooltip');
        var rect = nodes[index].getBoundingClientRect();
        tooltip.style('left', d3.event.pageX+"px");
        tooltip.style('top', d3.event.pageY+"px");
        // tooltip.style('left', rect.left+"px");
        // tooltip.style('top', rect.top+"px");
      })
      .on('mouseleave', (datum, index, nodes) => {
        d3.select(nodes[index])
          .attr("fill-opacity", "1.0");

        var tooltip = d3.select('#treemapTooltip');
        tooltip.style('display', 'none');
      })
      .on('click', (datum, index, nodes) => {
        console.log('treemap clicked');
        var currentNode = d3.select(nodes[index]);
        currentNode.classed("selected", !currentNode.classed("selected"))
            .attr("stroke-width", () => {
              if (currentNode.classed("selected")) {
                return "3";
              } else {
                return "0";
              }
            })
            .attr("stroke", "black");

        var currentCategory = datum.data.key;
        var currentParentCategory = datum.parent.data.key;

        if (!selectedCategories.includes(currentCategory) && currentNode.classed("selected")) {
          selectedCategories.push([currentParentCategory, currentCategory]);
        } else if (selectedCategories.includes(currentCategory) && !currentNode.classed("selected")) {
          selectedCategories = selectedCategories.filter(category => 
            !(category == currentCategory));
        }

        console.log(currentCategory);
        console.log(selectedCategories);
        
      });

  node.append("clipPath")
      .attr("id", d => "clip" +  d.ancestors().reverse().map(d => d.data.key).join("-"))
      .append("use")
      .attr("xlink:href", d => "#" + d.ancestors().reverse().map(d => d.data.key).join("-"));
      
  node.append("text")
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("clip-path", d => "url(#clip" + d.ancestors().reverse().map(d => d.data.key).join("-") + ")")
    .selectAll("tspan")
    .data(d => {
      if (d.depth != 0 && d.depth !=3) {    
        return d.data.key.split(/(?=[A-Z][^A-Z])/g).concat(d.value);
      }
      return "";
    })
    .enter()
    .append("tspan")
    .attr("fill-opacity", (d, i, nodes) => i == nodes.length - 1 ? 0.6 : null)
    .text(d => {
      return d;
    });

  node.filter(d => d.children).selectAll("tspan")
      .attr("dx", 5)
      .attr("y", 13);

  // node.filter(d => !d.children).selectAll("tspan")
  //     .attr("x", 3)
  //     .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`);


    // var node = svg
    //   .selectAll(".node")
    //   .data(root.leaves())
    //   .enter()
    //   .append("g");
      
    // node.append("rect")
    //   .attr("class", "node")
    //   .attr("x", (d) => d.x0 + "px")
    //   .attr("y", (d) => d.y0 + "px")
    //   .attr("width", (d) => d.x1 - d.x0 + "px")
    //   .attr("height", (d) => d.y1 - d.y0 + "px")
    //   .attr("fill", d => { 
    //     return categoryColors[d.parent.data.key](d.data.key)
    //   });

    // node.append("text")
    //   .attr("class", "node-label")
    //   .attr("x", (d) => d.x0 + "px")
    //   .attr("y", (d) => d.y0 + "px")
    //   .text((d) => d.parent.parent.data.key + "\n" + d.parent.data.key + "\n" + d.data.key);


  }

}

