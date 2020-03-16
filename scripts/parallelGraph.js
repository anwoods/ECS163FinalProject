function ParallelGraph(svg, data) {
  let box = svg.node().getBoundingClientRect();
  this.svg = svg.append('g')
    .attr('transform', 'translate(20, 20)');
  let names = ['goal', 'pledged', 'backers', 'campaignLength']
  let y = {}

  let x = d3.scalePoint()
    .range([0, box.width - 40])
    .padding(.5)
    .domain(names);

  function path(d) {
    return d3.line()(names.map(p => {
      return [x(p), y[p](d[p])];
    }));
  }

  this.draw = (newData) => {
    this.svg.selectAll('.axis').remove();

    for (let name of names) {
      y[name] = d3.scaleLinear()
        .domain(d3.extent(newData, d => d[name]))
        .range([box.height - 40, 0]);
    }

    let selection = this.svg.selectAll('path')
      .data(newData, d => {
        return d ? d.ID : this.id;
      })

    let entering = selection.enter()
      .append('path')
      .attr('id', d => d.ID)
      .attr('class', 'dataLine')
      .on('mouseover', (d) => {
        var tooltip = d3.select('#parallelTooltip');
        tooltip.classed('show', true);
        tooltip.classed('hide', false);
        //tooltip.style('left', d3.event.pageX + "px");
        //tooltip.style('top', d3.event.pageY + "px");
        tooltip.html('<b>' +
          d.name + '</b><br>' +
          'status: ' + d.state + '<br>' +
          'category: ' + d.main_category + ', ' + d.category + '<br>' +
          'goal: ' + d.goal + '<br>' +
          'pledged: ' + d.pledged + '<br>' +
          'backers: ' + d.backers + '<br>' +
          'campaign length (days): ' + Math.floor(d.campaignLength));
      })
      // .on('mousemove', function(datum, index, nodes) {
      //   var tooltip = d3.select('#parallelTooltip');
      //   tooltip.style('left', d3.event.pageX + "px");
      //   tooltip.style('top', d3.event.pageY + "px");
      // })
      .on('mouseleave', (datum, index, nodes) => {
        var tooltip = d3.select('#parallelTooltip');
        tooltip.classed('show', false);
        tooltip.classed('hide', true);
      });

    function update(updateSelect) {
      updateSelect
        .attr('d', path)
        .style('fill', 'none')
        .style('stroke', d => {
          return categoryColors[d.main_category](d.category)
        });
    }

    update(entering);
    update(selection.transition());

    selection.exit().remove();

    this.svg.selectAll('.axis')
      .data(names).enter()
      .append('g')
      .attr('class', 'axis')
      .attr('transform', d => {
        return "translate(" + x(d) + ")";
      })
      .each(function(d) {
        d3.select(this).call(d3.axisLeft().scale(y[d]));
      })
      .append('text')
      .style("text-anchor", 'middle')
      .attr('y', -9)
      .text(d => d)
      .style('fill', 'black');

  }

  this.selection = (selectedData) => {
    this.svg.selectAll('.dataLine')
      .attr('display', 'none'); //hide everything
    selectedData.forEach((d) => {
      this.svg.select('[id="' + d.ID + '"]') //show selected elements
        .attr('display', 'block');
    });
  }

  this.restoreAll = () => {
    this.svg.selectAll('path')
      .attr('display', 'block');
  }
}