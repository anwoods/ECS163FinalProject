d3.csv("./data/ks-projects-201612.csv", function(error, data) {
  if (error) throw error;
  // var tSNEdata = [];
  smallData = data.slice(0, 1000);
  smallData.forEach(function(d, i) {
    d.ID = +d.ID;
    d.goal = +d.goal;
    d.pledged = +d.pledged;
    d.backers = +d.backers;
    d.deadline = new Date(d.deadline)
    d.launched = new Date(d.launched)
    d.campaignLength = (d.deadline.getTime() - d.launched.getTime()) / (1000 * 3600 * 24); //number of milliseconds in a day
    // d["usd pledged"] = +d["usd pledged"]
    // want original data on left side and
    // if (i < 100)
    //   tSNEdata.push([d.goal, Math.random(), Math.random()])
    //  tSNEdata.push([d.goal,d.pledged,d.backers,d["usd pledged"]])
  });

  initCharts(smallData);
});

function addToDict(category, subcategory, dict) {
  if (dict[category] == undefined) {
    dict[category] = [];
  } else if (dict[category].indexOf(subcategory) == -1) {
    dict[category].push(subcategory);
  }
}