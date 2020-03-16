function TreeMap(svg, data) {
  let drawDetails;
  let button = document.querySelector('#show');
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

  function getIdString(d) {
    return d.ancestors().reverse().map(d => {
      if (d.data.key) {
        return d.data.key.replace(/( |&)/g, "");
      }
    }).join("-");
  }

  function arraysMatch(arr1, arr2) {

    // Check if the arrays are the same length
    if (arr1.length !== arr2.length) return false;

    // Check if all items exist and are in the same order
    for (var i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }

    // Otherwise, return true
    return true;

  };

  document.querySelector('#resetT')
    .addEventListener('click', reset);

  function reset() {
    selectedCategories = [];
    svg.selectAll('rect').classed('selected', false);
  }

  this.draw = (newData) => {
    console.log('drawing treeMap');
    // console.log(newData);

    svg.selectAll("g").remove();

    button.removeEventListener('click', drawDetails); //remove old version;
    drawDetails = function() {
      button.innerHTML = 'Update Detail Graphs';
      if (selectedCategories.length == 0) {
        d3.select('#error').attr('class', 'show');
      } else {
        d3.select('#error').attr('class', 'hide');
      }
      let filteredData = [];
      console.log(filteredData);
      console.log(selectedCategories);
      newData.forEach((d) => {
        if (selectedCategories.some((c) => {
            return c[0] == d.state && c[1] == d.main_category && c[2] == d.category;
          })) {
          filteredData.push(d);
        }

        // if (selectedCategories.main.includes(d.main_category) && selectedCategories.sub.includes(d.category)) {
        //   console.log(d.main_category, d.category);
        //   //this is in our list we want to filter by
        //   filteredData.push(d);
        // }
      });
      console.log(filteredData);
      updateSelection(filteredData);
    };
    button.addEventListener('click', drawDetails);

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

    // console.log(root.descendants());

    var failSucceedColors = {
      failed: '#f0bdb6',
      successful: '#ccf0d5'
    };

    // node.append("rect")
    //     .data(root.descendants().filter(d => d.depth == 1))
    //     .attr("fill", d => {
    //         console.log(d.data.key);
    //         return failSucceedColors[d.data.key];
    //     })
    //     .attr("width", d => d.x1 - d.x0)
    //     .attr("height", d => d.y1 - d.y0);

    node.append("rect")
      .attr("id", d => {
        // console.log(d.ancestors().reverse().map(d => d.data.key));
        return getIdString(d);
      })
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

        // var rect = nodes[index].getBoundingClientRect();

        tooltip.classed('show', true);
        tooltip.classed('hide', false);
        tooltip.style('left', d3.event.pageX + "px");
        tooltip.style('top', d3.event.pageY + "px");
        // tooltip.style('left', rect.left+"px");
        // tooltip.style('top', rect.top+"px");
        if (datum.depth == 1) {
          // console.log(datum);
          tooltip.html('<b>' +
            +datum.value + '</b> ' +
            datum.data.key + ' projects');
        } else if (datum.depth > 0) {
          tooltip.html('<b>' +
            datum.data.key + '</b><br>' +
            datum.value + ' projects');
        }
      })
      .on('mousemove', function(datum, index, nodes) {
        var tooltip = d3.select('#treemapTooltip');
        // var rect = nodes[index].getBoundingClientRect();
        tooltip.style('left', d3.event.pageX + "px");
        tooltip.style('top', d3.event.pageY + "px");
        // tooltip.style('left', rect.left+"px");
        // tooltip.style('top', rect.top+"px");
      })
      .on('mouseleave', (datum, index, nodes) => {
        d3.select(nodes[index])
          .attr("fill-opacity", "1.0");

        var tooltip = d3.select('#treemapTooltip');
        tooltip.classed('show', false);
        tooltip.classed('hide', true);
      })
      .on('click', (datum, index, nodes) => {
        console.log('treemap clicked');
        // console.log(datum);
        // console.log(nodes);
        var currentCategory = datum.data.key;
        var currentParentCategory = datum.parent.data.key;
        var currentNode = d3.select(nodes[index]);
        let filterAr;
        // console.log(currentCategory);

        //change class of selected
        currentNode.classed("selected", !currentNode.classed("selected"))


        if (currentParentCategory == 'failed' || currentParentCategory == 'successful') {
          //we have a main category
          // console.log('main selected');
          if (currentNode.classed("selected")) {
            // if (!selectedCategories.main.includes(currentCategory)) {
            //   selectedCategories.main.push(currentCategory);
            // }
            //remove selected from children
            datum.children.forEach((d) => {
              let childNode = d3.select('#' + getIdString(d)); //select by id
              if (childNode.classed("selected")) {
                childNode.classed("selected", false);
              } else {
                filterAr = d.ancestors().reverse().map(d =>
                  d.data.key).filter((d) => d != undefined);
                selectedCategories.push(filterAr);
              }
            });

          } else if (!currentNode.classed("selected")) {
            // selectedCategories.main = selectedCategories.main.filter(category =>
            //   !(category == currentCategory));

            datum.children.forEach((d) => {
              let removedAr = d.ancestors().reverse().map(d =>
                d.data.key).filter((d) => d != undefined);
              selectedCategories = selectedCategories.filter(ar =>
                !(arraysMatch(ar, removedAr)));
            });

          }
        } else {
          //we have a sub category
          // console.log('sub selected');
          filterAr = datum.ancestors().reverse().map(d =>
            d.data.key).filter((d) => d != undefined);
          if (currentNode.classed("selected")) {
            // selectedCategories.sub.push(currentCategory);
            //check if parent is selected
            parentNode = d3.select('#' + getIdString(datum.parent));
            if (parentNode.classed('selected')) {
              parentNode.classed('selected', false);
              // console.log(parentNode.data());
              parentNode.data()[0].children.forEach((d) => {
                let removedAr = d.ancestors().reverse().map(d =>
                  d.data.key).filter((d) => d != undefined);
                selectedCategories = selectedCategories.filter(ar =>
                  !(arraysMatch(ar, removedAr)));
              }); //remove all children
            }

            selectedCategories.push(filterAr); //add selected
          } else if (!currentNode.classed("selected")) {
            selectedCategories = selectedCategories.filter(ar =>
              !(arraysMatch(ar, filterAr)));
            // selectedCategories.sub = selectedCategories.sub.filter(category =>
            //   !(category == currentCategory));
            // //remove main if no other subcategories are in the list
            // if (datum.parent.children.every((sub) => {
            //     // console.log(sub);
            //     if (selectedCategories.sub.includes(sub.data.key)) {
            //       return false;
            //     } else {
            //       return true;
            //     }
            //   })) {
            //   selectedCategories.main = selectedCategories.main.filter(category => !(category == currentParentCategory));
            // }
          }
        }
        //set stroke
        // .attr("stroke-width", () => {
        //     if (currentNode.classed("selected")) {
        //       return "3";
        //     } else {
        //       return "0";
        //     }
        //   })
        //   .attr("stroke", "black");

        console.log(selectedCategories);

      });

    node.append("clipPath")
      .attr("id", d => "clip" + d.ancestors().reverse().map(d => d.data.key).join("-"))
      .append("use")
      .attr("xlink:href", d => "#" + d.ancestors().reverse().map(d => d.data.key).join("-"));

    node.append("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px")
      .attr("clip-path", d => "url(#clip" + d.ancestors().reverse().map(d => d.data.key).join("-") + ")")
      .selectAll("tspan")
      .data(d => {
        if (d.depth != 0 && d.depth != 3) {
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