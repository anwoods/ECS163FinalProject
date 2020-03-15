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


d3.csv("./data/ks-projects-201612.csv", function(error, data) {
  if (error) throw error;

  var deadlineNest = d3.nest()
    .key(function(d) {
      var splitterDeadline = d['deadline'].split(" ");
      var deadLineDate = splitterDeadline[0].split("/");
      return deadLineDate[2];
    })
    .key(function(d) {
      var splitterDeadline = d['deadline'].split(" ");
      var deadLineDate = splitterDeadline[0].split("/");
      return deadLineDate[0];
    })
    .rollup(function(d) {
      return d.length;
    })
    .entries(data);

  let filteredData = [];
  data.forEach(function(d) {
    //d.deadLineDate = parseTime(d['deadline']);
    //d.launchedDate = parseTime(d['launched']);
    var splitterDeadline = d['deadline'].split(" ");
    d.deadLineDate = splitterDeadline[0].split("/");
    var splitterLaunched = d['launched'].split(" ");
    d.launchedDate = splitterLaunched[0].split("/");
    if ((d.launchedDate[2] != "1970") && (d.deadLineDate[2] != "2017")) {
      checkYearArray(domainLaunched, d.launchedDate);
      checkYearArray(domainDeadline, d.deadLineDate);
      filteredData.push(d);
    }

    //d.deadLineDate = parseTime.parse(splitter[0]);
  });
  console.log(filteredData);
  data = filteredData;

  data.launchedArray = domainLaunched;
  data.deadlineArray = domainDeadline;
  console.log("Here:", data.launchedArray);

  //initCharts(domainDeadline);
  initCharts(data);

});