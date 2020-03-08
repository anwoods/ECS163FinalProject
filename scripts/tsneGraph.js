function TsneGraph(svg, data) {
  let box = svg.node().getBoundingClientRect();
  // var margin = {
  //   top: 50,
  //   right: 300,
  //   bottom: 80,
  //   left: 70
  // };
  var width = box.width - 40;
  var height = box.height - 40;

  this.svg = svg
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(20,20)");
  // svg.append("g").attr(transform)
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

  // console.log(goalScale.range(), goalScale.domain());

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
    for (let i = 0; i < 100; i++) {
      tsne.step();
    }
    console.log(tsne.iter);
    let Y = tsne.getSolution(); // x = Y[i][0] y = Y[i][1]
    console.log('ran steps');
    let x = d3.scaleLinear()
      .range([0, width])
      .domain(d3.extent(Y, d => d[0]));
    let y = d3.scaleLinear()
      .range([height, 0])
      .domain(d3.extent(Y, d => d[1]));;

    console.log(Y);
    this.svg.selectAll('circle')
      .data(newData, (d) => {
        return d ? d.ID : this.id;
      })
      .enter()
      .append('circle')
      .attr('id', (d) => d.ID)
      .attr('cx', (d, i) => {
        // console.log(i);
        return x(Y[i][0]);
      })
      .attr('cy', (d, i) => {
        // console.log(i);
        return y(Y[i][1]);
      })
      .attr('r', 5)
      .attr('fill', 'red'); //TODO: add color by category later
  }
}