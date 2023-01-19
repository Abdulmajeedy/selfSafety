/* Set the time format
  Ref: https://github.com/d3/d3-time-format */
const parseTime = d3.timeParse("%Y");
console.log(parseTime("2020"));

/* Load the dataset and formatting variables
  Ref: https://www.d3indepth.com/requests/ */
d3.csv("../data/data.csv", d => {
  return {
    'geo': d.geo,
    'country': d.country,
    'year': +d.year,
    'value': +d.value,
    'date': parseTime(+d.year)
  }
}).then(data => {
  // Print out the data on the console
  console.log(data);

  /* Data Manipulation in D3 
    Ref: https://observablehq.com/@d3/d3-extent?collection=@d3/d3-array */

  // Get the minimum and maximum of the percent pay gap
  console.log(d3.min(data, d => d.value));
  console.log(d3.max(data, d => d.value));
  console.log(d3.extent(data, d => d.value));

  // Filter the data from the year 2020
  const newData = data.filter(d => d.year === 2020);
  console.log(newData);

  // Sort the country by the percentage in the descending order
  /*console.log(newData.sort((a, b) => d3.ascending(a.value, b.value)));
  console.log(newData.sort((a, b) => d3.descending(a.value, b.value)));
  console.log(newData);*/

  // Get the mean and median of gender gap percentage
  console.log(d3.mean(newData, d => d.value));
  console.log(d3.median(newData, d => d.value));

  // Move the color scale here to share with both charts
  

  // Plot the bar chart
  createBarChart(newData);

  // Plot the line chart
  createLineChart(data);
})

const createBarChart = (data) => {
  /* Set the dimensions and margins of the graph
    Ref: https://observablehq.com/@d3/margin-convention */
  const width = 900, height = 400;
  const margins = {top: 20, right: 40, bottom: 80, left: 40};

  /* Create the SVG container */
  const svg = d3.select("#bar")
    .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

  /* Define x-axis, y-axis, and color scales
    Ref: https://observablehq.com/@d3/introduction-to-d3s-scales */
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.country))
    .range([margins.left, width-margins.right])
    .paddingInner(0.2);

  console.log(xScale("France"));
  console.log(xScale("Austria"));
  console.log(xScale.bandwidth());
  console.log(xScale.step());

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .range([height-margins.bottom, margins.top])

  console.log("Here!")
  console.log(yScale(0));
  console.log(yScale(20));

  /* Working with Color: https://observablehq.com/@d3/working-with-color
    Color schemes: https://observablehq.com/@d3/color-schemes 
    d3-scale-chromatic: https://github.com/d3/d3-scale-chromatic */
  const countries= data.map(d=> d.country);


  const color= d3.scaleOrdinal()
    .domain(countries)
    .range(d3.schemeTableau10);

  console.log(color('France'));


  /* Create the bar elements and append to the SVG group
    Ref: https://observablehq.com/@d3/bar-chart */
  
  const bar = svg.append('g')
    svg.append("g")
    .attr("class", "bars")
    .selectAll("rect")
    .data(data)
    .join("rect")
      .attr("x", d => xScale(d.country))
      .attr("y", d => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", d => yScale(0) - yScale(d.value))
      .attr('fill', d=> color(d.country));
    
  /* Add the tooltip when hover on the bar */
  
  
  /* Create the x and y axes and append them to the chart
    Ref: https://www.d3indepth.com/axes/ and https://github.com/d3/d3-axis */
    const xAxis= d3.axisBottom(xScale);

    const xGroup = svg.append('g')
        .attr('transform',`translate(0, ${height-margins.bottom})`)
    .call(xAxis);

    console.log(xGroup);

    xGroup.selectAll('text')
      .style('text-anchor','end')
      .attr('dx','-.8em')
      .attr('dy','.15em')
      .attr('transform', "rotate(-65)");

    const yAxis =d3.axisLeft(yScale);

    svg.append('g')
       .attr('transform', `translate(${margins.left}, 0)`)
      .call(yAxis)
  
}

const createLineChart = (data, colors) => {
  /* Set the dimensions and margins of the graph */
  const width = 900, height = 400;
  const margins = {top: 20, right: 40, bottom: 60, left: 40};

  /* Create the SVG container */

  const svg = d3.select("#line")
    .append("svg")
      .attr("viewBox", [0, 0, width, height]);
  
  console.log(data);

  /* Define x-axis, y-axis, and color scales */
  const yScale = d3.scaleLinear()
    .domain([0,d3.max(data, d=>d.value)])
    .range([height- margins.bottom, margins.top]);

  console.log(yScale(22));

  const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([margins.left, width -margins.right])
    

  /* Construct a line generator
    Ref: https://observablehq.com/@d3/line-chart and https://github.com/d3/d3-shape */
  const line = d3.line()
    .curve(d3.curveLinear)
    .x(d=> xScale(d.date))
    .y(d => yScale(d.value));
  /* Group the data for each country
    Ref: https://observablehq.com/@d3/d3-group */

    const group = d3.group(data, d => d.country);
    console.log(group);
  

  /* Create line paths for each country */
  const path = svg.selectAll('path')
     .data(group)
     .join('path')
        .attr('d',( [i,d]) => line(d))
        .style('stroke', 'lightgrey')
        .style('stroke-width', 2)
        .style('fill', 'transparent');

  /* Add the tooltip when hover on the line */
  

  /* Create the x and y axes and append them to the chart */


  /* Add text labels on the right of the chart */
  
}