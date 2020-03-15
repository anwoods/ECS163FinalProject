var opacityFlat = [];
var selectedTimes = [];

function HeatMap(svg, data) {
  let box = svg.node().getBoundingClientRect();
  var margin = 10,
    width = box.width,
    height = box.height;

  var sizeWidth = 150;
  var sizeLength = 150;

  var xPosition = 60;
  var yPosition = 80;

  svg = d3.select("#heat")
  // .attr("width", width)
  // .attr("height", height)
  // .attr("transform", "translate(" + 0 + "," + 0 + ")");

  var months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  var x = d3.scaleBand()
    .range([0, width - sizeWidth])
    .padding(0.1);
  var y = d3.scaleBand()
    .range([height - sizeLength, 0])
    .padding(0.1);

  var parseTime = d3.timeFormat("%m/%d/%Y");


  this.draw = (d2, deadlineOrLaunched) => {
    svg.selectAll('*').remove();
    console.log('drawing heatMap');
    var realData;
    if (deadlineOrLaunched == "launched") {
      realData = d2.launchedArray;
    } else if (deadlineOrLaunched == "deadline") {
      realData = d2.deadlineArray;
    }

    var min = d3.min(realData[0], function(d) {
      return d;
    });

    var max = d3.max(realData[0], function(d) {
      return d;
    });

    var years = [];
    var temp = [];
    for (var i = 0; i < 9; i++) {
      console.log(realData[0][i]);
      temp.push(realData[0][i]);
    }


    var sortedData = temp.sort();
    sortedData.forEach(function(d) {
      console.log(d);
      var string = d.toString();
      years.push(string);
    });

    console.log(years);
    console.log(temp);
    x.domain(months);
    y.domain(years);


    //Find min and max of entire 2d array
    var minValue = 100000000000;
    var maxValue = -1;

    for (var row = 1; row < 13; row++) {
      for (var col = 0; col < 9; col++) {
        if (realData[row][col] < minValue) {
          minValue = realData[row][col];
        }

        if (realData[row][col] > maxValue) {
          maxValue = realData[row][col];
        }
      }
    }

    // console.log("Min value", minValue);
    // console.log("Max value", maxValue);

    var myColor = d3.scaleLinear()
      .range(["#dcdcdc", "#8b008b"])
      .domain([minValue, maxValue]);

    // var colorLegend = d3.select('#heat').append('g');

    var previouslySelected = "NULL";

    function findMonth(xVal) {
      // console.log("xVal = ", xVal);
      var realX = xVal - xPosition;
      // console.log("realx = ", realX);
      var form = d3.format(".6f");
      for (var it = 1; it < 13; it++) {
        // console.log("x at ", it, " = ", x(it));
        if (form(x(it)) == form(realX)) {
          // console.log(form(x(it)));
          // console.log(form(realX));
          return it;
        }
      }
      return -1;
    }

    function findYear(yVal) {
      var realY = yVal - yPosition;
      var form = d3.format(".6f");
      for (var it = 0; it < 9; it++) {
        if (form(y(realData[0][it].toString())) == form(realY)) {
          return realData[0][it];
        }
      }
      return -1;
    }

    function inSelectedTimesArray(month, year) {
      for (var it = 0; it < selectedTimes.length; it++) {
        if (selectedTimes[it][0] == month && selectedTimes[it][1] == year) {
          return true;
        }
      }
      return false;
    }

    function findYearIndex(yearVal) {
      for (var yearIt = 0; yearIt < 9; yearIt++) {
        //console.log("years at yearIT = " , +(years[yearIt]), " vs yearVal toString = ", yearVal);
        if (+(years[yearIt]) == yearVal) {
          //console.log("found year ", yearIt);
          return yearIt + 1;
        }
      }
    }

    function filterAndUpdate(d2) {
      var filteredData = d2.filter(function(s) {
        if (deadlineOrLaunched == "launched") {
          var result = false;
          for (var it = 0; it < selectedTimes.length; it++) {
            if (s.launchedDate[0] == selectedTimes[it][0] && s.launchedDate[2] == selectedTimes[it][1]) {
              //found match
              result = true;
              break;
            }
          }
          return result;

        } else {
          var result = false;
          for (var it = 0; it < selectedTimes.length; it++) {
            if (s.deadLineDate[0] == selectedTimes[it][0] && s.deadLineDate[2] == selectedTimes[it][1]) {
              //found match
              result = true;
              break;
            }
          }
          return result;
        }
      });

      // console.log("Original data :", d2);
      // console.log("filteredData : ", filteredData);

      //update scatter and treemap
    }


    // console.log(realData);
    var temp2 = [];
    for (var i = 0; i < 9; i++) {
      temp2.push(realData[0][i]);
    }
    var dataFlat = [];
    var dataYears = [];
    realData.forEach(function(d, i) {
      if (i == 0) {
        d.forEach(function(d1) {
          dataYears.push(d1);
        })
      } else {
        d.forEach(function(d1) {
          dataFlat.push(d1);
        })
      }
      // console.log("d = ", d);
    })
    // console.log("dataFlat = ", dataFlat);
    // console.log("dataYears = ", dataYears);

    //var opacityFlat = [];

    svg.selectAll("rect")
      .data(dataFlat)
      .enter()
      .append("rect")
      .attr("x", function(d, i) {
        //find year and month
        var yearIndex = i % 9;
        var monthIndex = Math.floor(i / 9);
        // console.log(" d = ", d, " i = ", i, " yearIndex = ", yearIndex, " monthIndex = ", monthIndex);
        opacityFlat.push(1);
        return x(monthIndex + 1) + xPosition;
      })
      .attr("y", function(d, i) {
        //find year and month
        var yearIndex = i % 9;
        var monthIndex = Math.floor(i / 9);
        var numberYear = dataYears[yearIndex];
        // console.log(" d = ", d, " i = ", i, " yearIndex = ", yearIndex, " numberYear = ", numberYear);
        return y(numberYear.toString()) + yPosition;
        //return x(monthIndex +1) + xPosition;
      })
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("opacity", 1)
      .style("fill", function(d) {
        if (d < 3000 && d > 2000) {
          // console.log("color", myColor(d), " number: ", d);
        }

        return myColor(d);
      })
      .attr("stroke-width", 1)
      .attr("stroke", "black")
      .on("click", function(d, i) {
        var prevX = d3.select(this).attr("x");
        var prevY = d3.select(this).attr("y");
        var getMonth = findMonth(prevX);
        var getYear = findYear(prevY);
        // console.log("m = ", getMonth, "y = ", getYear);
        var checkSelectedTimesArray = inSelectedTimesArray(getMonth, getYear);
        if (selectedTimes.length == 0) {
          //make rest opaque and highlight
          //console.log("this =", this);
          // console.log("i = ", i);
          previouslySelected = d3.select(this);
          // console.log(d3.select(this));
          var allRects = d3.selectAll("rect");
          allRects.attr("opacity", 0.4);
          for (var it = 0; it < opacityFlat.length; it++) {
            if (it == i) {
              opacityFlat[it] = 1;
            } else {
              opacityFlat[it] = 0.4;
            }

          }

          previouslySelected.attr("opacity", 1);
          var time = [getMonth, getYear];
          selectedTimes.push(time);
          // console.log(selectedTimes);
          //update other visualizations
          filterAndUpdate(d2);


        } else if (checkSelectedTimesArray == false) {
          //add it to array
          //and make it colorful again
          previouslySelected = d3.select(this);
          previouslySelected.attr("opacity", 1);
          opacityFlat[i] = 1;
          var time = [getMonth, getYear];
          selectedTimes.push(time);
          // console.log(selectedTimes);
          filterAndUpdate(d2);

          //update visualizations
        } else if (checkSelectedTimesArray == true) {
          previouslySelected = d3.select(this);
          //deselect current
          previouslySelected.attr("opacity", 0.4);
          opacityFlat[i] = 0.4;
          selectedTimes = selectedTimes.filter(function(v) {
            var res = true;
            if (v[0] == getMonth && v[1] == getYear) {
              res = false;
            }
            return res;
          });
          // console.log(selectedTimes);

          if (selectedTimes.length == 0) {
            reset();
          } else {
            filterAndUpdate(d2);
          }

        }

      });


    function getMonthAxis(xVal) {
      // console.log("xVal = ", xVal);
      var bandwidth = x.bandwidth();
      // console.log("bandwidth =", bandwidth);
      var realX = xVal;
      // console.log("realx = ", realX);
      var form = d3.format(".6f");
      for (var it = 1; it < 13; it++) {
        // console.log("x at ", it, " = ", x(it));
        var min = x(it);
        var max = x(it) + bandwidth;
        // console.log("min = ", min, " max = ", max);
        if (form(realX) <= max && form(realX) >= min) {
          return it;
        }
      }
      return -1;
    }

    function getYearAxis(yVal) {
      var bandwidth = y.bandwidth();
      // console.log("yVal = ", yVal);
      var form = d3.format(".6f");
      // console.log(years);
      // console.log(dataYears);
      //0 is 1970
      var count = 0;
      for (var it = 0; it < 9; it++) {
        var min = y(dataYears[it]);
        var max = y(dataYears[it]) + bandwidth;
        if (form(yVal) <= max && form(yVal) >= min) {
          return it;
        }
        count++;
      }
    }

    //Make x axis clickable
    svg.append("g")
      .attr("transform", "translate(" + xPosition + "," + yPosition + ")")
      .call(d3.axisTop(x))
      .on("click", function(d) {
        var prevX = d3.mouse(this)[0];
        var getMonth = getMonthAxis(prevX);
        var rectangles = svg.selectAll("rect");

        //Change opacity
        rectangles.attr("opacity", function(d, i) {
          //make a long array for opacity
          //find if in the month row
          var yearIndex = i % 9;
          var monthIndex = Math.floor(i / 9);
          //check if selected array empty make all 0.4 except the row....
          if (selectedTimes.length == 0) {
            if (monthIndex == getMonth - 1) {
              opacityFlat[i] = 1;
              return 1;
            } else {
              opacityFlat[i] = 0.4;
              return 0.4;
            }
          } else if (monthIndex == getMonth - 1) {
            //Found matching then make opacity 1
            //and add to listof selected
            opacityFlat[i] = 1;
            return 1;
          } else if (opacityFlat[i] == 1) {
            return 1;
          } else {
            return 0.4;
          }

        });

        //Add to selected array
        for (var y = 0; y < 9; y++) {
          var getYear = dataYears[y];
          var checkSelectedTimesArray = inSelectedTimesArray(getMonth, getYear);
          if (checkSelectedTimesArray == false) {
            var time = [getMonth, getYear];
            selectedTimes.push(time);
            // console.log(selectedTimes);
          }
        }

        //Update other function!
        filterAndUpdate(d2);
      });



    svg.append("g")
      .attr("transform", "translate(" + xPosition + "," + yPosition + ")")
      .call(d3.axisLeft(y))
      .on("click", function(d) {
        var prevY = d3.mouse(this)[1];
        var getYear = getYearAxis(prevY);
        var rectangles = svg.selectAll("rect");

        rectangles.attr("opacity", function(d, i) {
          var yearIndex = i % 9;
          var monthIndex = Math.floor(i / 9);

          if (selectedTimes.length == 0) {
            if (getYear == yearIndex) {
              opacityFlat[i] = 1;
              return 1;
            } else {
              opacityFlat[i] = 0.4;
              return 0.4;
            }
          } else if (getYear == yearIndex) {
            opacityFlat[i] = 1;
            return 1;
          } else if (opacityFlat[i] == 1) {
            return 1;
          } else if (opacityFlat[i] == 0.4) {
            return 0.4;
          }
        });

        //Add to selected array
        for (var x = 1; x < 13; x++) {
          var checkSelectedTimesArray = inSelectedTimesArray(x, dataYears[getYear]);
          if (checkSelectedTimesArray == false) {
            var time = [x, dataYears[getYear]];
            selectedTimes.push(time);
          }
        }

        filterAndUpdate(d2);
        //Update other function!
      });

    //HeatMap XAxis Label
    svg.append("text")
      .attr("transform",
        "translate(" + (xPosition + width - sizeWidth + xPosition) / 2 + "," +
        (yPosition / 2 + 20) + ")")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Month");

    //HeatMap YAxis Label
    svg.append("text")
      .attr("transform",
        "rotate(-90)")
      .attr("y", xPosition / 2 - 10)
      .attr("x", -(yPosition + height - sizeLength + yPosition) / 2)
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Year");

    //HeatMap Title
    var titleString;
    if (deadlineOrLaunched == "launched") {
      titleString = "HeatMap Based on Launched Date";
    } else {
      titleString = "HeatMap Based on Deadline Date";
    }

    svg.append("text")
      .attr("transform",
        "translate(" + ((xPosition + width - sizeWidth + xPosition) / 2 - 100) + "," +
        (yPosition / 2) + ")")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("text-decoration", "underline")
      .text(titleString);

    svg.append("text")
      .attr("transform",
        "translate(" + ((xPosition + width - sizeWidth + xPosition) / 2) + "," +
        (height - 50) + ")")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("fill", "#8b008b")
      .text("Purple");

    svg.append("text")
      .attr("transform",
        "translate(" + ((xPosition + width - sizeWidth + xPosition) / 2 + 50) + "," +
        (height - 50) + ")")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("fill", "black")
      .text(" = " + maxValue.toString() + " Projects");

    svg.append("text")
      .attr("transform",
        "translate(" + ((xPosition + width - sizeWidth + xPosition) / 2 - 160) + "," +
        (height - 50) + ")")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("fill", "#dcdcdc")
      .text("Grey");

    svg.append("text")
      .attr("transform",
        "translate(" + ((xPosition + width - sizeWidth + xPosition) / 2 - 125) + "," +
        (height - 50) + ")")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("fill", "black")
      .text(" = " + minValue.toString() + " Projects");


    // colorLegend.append("text")
    //     .attr("x", 100)
    //     .attr("y", height -30)
    //     .style("font-size","12px")
    //     .style("font-weight", "bold")
    //     .text(minValue.toString());

    // //Color legend maximum label
    // colorLegend.append("text")
    //     .attr("x", width -sizeWidth)
    //     .attr("y", height -30)
    //     .style("font-size","12px")
    //     .style("font-weight", "bold")
    //     .text(maxValue.toString());

    // //Color legend minimum tick mark
    //    colorLegend.append('rect')
    // 	.attr('y', height - 50)
    // 	.attr('height', 10)
    // 	.attr('x', 100)
    // 	.attr('width', 2)
    // 	.attr('fill', 'black');

    // //Color legend maximum tick mark
    // colorLegend
    // 	.append('rect')
    // 	.attr('y', height - 50)
    // 	.attr('height', 10)
    // 	.attr('x', width -sizeWidth)
    // 	.attr('width', 2)
    // 	.attr('fill', 'black');




  } //end draw



} //end heatmap