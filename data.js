// The svg
const svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

const div = d3.select("#mydiv");

// Map and projection
const path = d3.geoPath();
const projection = d3.geoMercator()
  .scale(70)
  .center([0, 20])
  .translate([width / 2, height / 2]);

// Data and color scale
const data = new Map();
const colorScale = d3.scaleThreshold()
  .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
  .range(d3.schemeBlues[8]);

// Load external data and boot
Promise.all([
  d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
  d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv", function(d) {
    data.set(d.code, +d.pop);
    return d;
  })
]).then(function(loadData) {

  let topo = loadData[0];

  loadData[1].forEach(row => {
    const foundGeometry = loadData[0].features.find(e => e.id === row.code);
    if (foundGeometry) foundGeometry.properties.countryName = row.name;
  });

  let mouseOver = function(event, d) {

    div.html(d.properties.countryName)
    d3.selectAll(".Country")
      .style("opacity", .5)
    d3.select(this)
      .style("opacity", 1)
      .style("stroke", "black")
  }

  let mouseLeave = function(d) {
    div.html(null)
    d3.selectAll(".Country")
      .style("opacity", .8)
    d3.select(this)
      .style("stroke", "transparent")
  }

  // Draw the map
  svg.append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
    // draw each country
    .attr("d", d3.geoPath()
      .projection(projection)
    )
    // set the color of each country
    .attr("fill", function(d) {
      d.total = data.get(d.id) || 0;
      return colorScale(d.total);
    })
    .style("stroke", "transparent")
    .attr("class", function(d) {
      return "Country"
    })
    .style("opacity", .8)
    .on("mouseover", mouseOver)
    .on("mouseleave", mouseLeave)

})