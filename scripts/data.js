let category = {};
let categoryColors = {};

d3.csv("./data/ks-projects-201612.csv", function(error, data) {
  if (error) throw error;
  filteredData = [];
  //smallData = data.slice(0, 1000);
  data.forEach(function(d, i) {
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
      filteredData.push(d);
      addToDict(d.main_category, d.category, category);
    }

    // addToDict(d.main_category, d.category, category);
  });

  data = filteredData;
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
});



function addToDict(category, subcategory, dict) {
  if (dict[category] == undefined) {
    dict[category] = [];
  } else if (dict[category].indexOf(subcategory) == -1) {
    dict[category].push(subcategory);
  }
}