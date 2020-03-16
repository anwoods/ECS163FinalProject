function TsneGraph(svg, data) {
  let box = svg.node().getBoundingClientRect();
  var width = box.width - 40;
  var height = box.height - 40;
  let lasso;

  this.svg = svg.append("g")
    .attr("transform", "translate(20,20)");

  //// Lasso effect ////

  var startLasso = function() {
    lasso.items()
      .attr("r", 3)
      .classed("not_possible", true)
      .classed("selected", false)
  }

  var drawLasso = function() {
    lasso.possibleItems()
      .classed("not_possible", false)
      .classed("possible", true)
      .attr("opacity", 1)

    lasso.notPossibleItems()
      .classed("not_possible", true)
      .classed("possible", false)
      .attr("opacity", 0.3)
  }
  var endLasso = function() {
    lasso.items()
      .classed("not_possible", false)
      .classed("possible", true)


    if (lasso.selectedItems().empty()) { //nothing was selected, restore all
      lasso.notSelectedItems()
        .attr('opacity', 1);

      parallelGraph.restoreAll();
    } else {
      //make dots inside lasso bigger
      lasso.selectedItems()
        .classed("selected", true)
        .attr("r", 5)
      //keep dots outside of lasso original size
      lasso.notSelectedItems()
        .attr("r", 3)

      parallelGraph.selection(d3.selectAll('.selected').data());
    }

  }

  goalScale = d3.scaleLinear()
    .range([0, 1])
    .domain(d3.extent(data, (d) => d.goal))
  pledgedScale = d3.scaleLinear()
    .range([0, 1])
    .domain(d3.extent(data, (d) => d.pledged))
  backersScale = d3.scaleLinear()
    .range([0, 1])
    .domain(d3.extent(data, function(d) {
      return d.backers
    }))
  campainLengthScale = d3.scaleLinear()
    .range([0, 1])
    .domain(d3.extent(data, function(d) {
      return d.campaignLength
    }))


  this.draw = (newData) => {
    this.svg.selectAll('circle').remove();
    console.log('calling draw');
    // console.log(newData);
    let tsneData = [];
    newData.forEach((d) => {
      let dataAr = [];
      dataAr[0] = goalScale(d.goal);
      dataAr[1] = pledgedScale(d.pledged)
      dataAr[2] = backersScale(d.backers)
      dataAr[3] = campainLengthScale(d.campaignLength)
      tsneData.push(dataAr);
    });

    var opt = {}; // epsilon is learning rate (10 = default)
    opt.perplexity = 30; // roughly how many neighbors each point influences (30 = default)
    opt.dim = 2; // dimensionality of the embedding (2 = default)
    var tsne = new tsnejs.tSNE(opt);
    console.log(tsneData);
    tsne.initDataRaw(tsneData);

    let circles = this.svg
      .selectAll('circle')
      .data(newData, (d) => {
        return d ? d.ID : this.id;
      })
      .enter()
      .append('circle')
      .attr('id', (d) => d.ID)
      .attr('r', 3)
      .attr('fill', d => {
        return categoryColors[d.main_category](d.category)
      });

    for (let i = 0; i < 10; i++) {
      tsne.step();
    }

    Y = tsne.getSolution();
    x = d3.scaleLinear()
      .range([0, width])
      .domain(d3.extent(Y, d => d[0]));
    y = d3.scaleLinear()
      .range([height, 0])
      .domain(d3.extent(Y, d => d[1]));
    circles.transition()
      .attr('cx', (d, i) => {
        // console.log(i);
        return x(Y[i][0]);
      })
      .attr('cy', (d, i) => {
        // console.log(i);
        return y(Y[i][1]);
      });


    lasso = d3.lasso()
      .closePathSelect(true) // allows for looping around pts
      // lasso will close when end pt is 70px from origin
      .closePathDistance(70)
      .items(this.svg.selectAll("circle"))
      .targetArea(svg)
      .on("start", startLasso)
      .on("draw", drawLasso)
      .on("end", endLasso);

    this.svg.call(lasso);
  }
}