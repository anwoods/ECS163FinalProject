var domainLaunched = [
  [],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
];
var domainDeadline = [
  [],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
];

let category = {};
let categoryColors = {};

d3.csv("./data/ks-projects-2016120.csv", function(error, data) {
  if (error) throw error;
  filteredData = [];
  //smallData = data.slice(0, 1000);
  data.forEach(function(d, i) {
    var splitterDeadline = d['deadline'].split(" ");
    d.deadLineDate = splitterDeadline[0].split("/");
    var splitterLaunched = d['launched'].split(" ");
    d.launchedDate = splitterLaunched[0].split("/");

    d.ID = +d.ID;
    d.goal = +d.goal;
    d.pledged = +d.pledged;
    d.backers = +d.backers;
    d.deadline = new Date(d.deadline)
    d.launched = new Date(d.launched)
    d.campaignLength = (d.deadline.getTime() - d.launched.getTime()) / (1000 * 3600 * 24); //number of milliseconds in a day

    // For our purposes, if the state is cancelled or suspended,
    // we consider it a failed, non-successful project
    if (d.state == "canceled" || d.state == "suspended") {
      d.state = "failed";
    }

    // Hack to fix titles with commas, replace with real solution later
    if (d.state == "successful" || d.state == "failed") {
      //check date
      if ((d.launchedDate[2] != "1970") && (d.deadLineDate[2] != "2017")) {
        checkYearArray(domainLaunched, d.launchedDate);
        checkYearArray(domainDeadline, d.deadLineDate);
        filteredData.push(d);
        addToDict(d.main_category, d.category, category);
      }

    }

    // addToDict(d.main_category, d.category, category);
  }); //end data for each


  data = filteredData;
  console.log(domainLaunched);
  data.launchedArray = domainLaunched;
  data.deadlineArray = domainDeadline;
  //generate color scale obj
  let catList = Object.keys(category);
  let color = d3.scaleSequential()
    .domain([0, catList.length])
    .interpolator(d3.interpolateTurbo);

  catList.forEach((type, i) => {
    valuescale = d3.scaleSequential()
      .domain([0, category[type].length])
      .interpolator(d3.interpolateRgb("white", color(i)));
    values = [];
    for (let j = 0; j < category[type].length; j++) {
      values[j] = valuescale(j + 1);
    }
    categoryColors[type] = d3.scaleOrdinal()
      .domain(category[type])
      .range(values);
  });

  console.log(categoryColors);
  initCharts(data);

  document.querySelector('#deadline')
    .addEventListener('click', deadline);

  function deadline() {
    console.log("hello deadline");
    heatMap.draw(data, "deadline");
    //controlChange(data, "deadline");
    //Update heatmap visualization
    //update others as well
  }
  document.querySelector('#launched')
    .addEventListener('click', launched);

  function launched() {
    console.log("hello lanched");
    heatMap.draw(data, "launched");
    //controlChange(data, "deadline");
    //update heatmap visualization
    //update others as well
  }

}); //end d3.csv



function addToDict(category, subcategory, dict) {
  if (dict[category] == undefined) {
    dict[category] = [];
  } else if (dict[category].indexOf(subcategory) == -1) {
    dict[category].push(subcategory);
  }
}

function checkMonthArray(array1, month, year, index) {
  if (year == 1970) {
    console.log("Found");
  }

  array1[month][index] += 1;
}

function checkYearArray(array1, date) {
  if (date[2] == undefined) {
    return;
  }
  var found = 0;
  var index = 0;
  array1[0].forEach(function(d) {
    if (d == +(date[2])) {
      found = 1;
      //break;
    }

    if (found == 0) {
      index += 1;
    }
  });

  if (found == 0) {
    if (index == 8) {
      console.log("hi");
    }
    array1[0].push(+(date[2]));
    //index += 1;
  }
  checkMonthArray(array1, +(date[0]), +(date[2]), index);
}