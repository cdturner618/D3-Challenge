// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function (data) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    console.log(data);
    data.forEach(element => {
        element.poverty = + element.poverty;
        element.healthcare = +element.healthcare
    });
    // Step 2: Create scale functions
    // ==============================
    var xscale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.poverty)])
        .range([0, width])

    var yscale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthcare)])
        .range([height, 0])
    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xscale);
    var leftAxis = d3.axisLeft(yscale);
    // Step 4: Append Axes to the chart
    // ==============================
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);


    chartGroup.append("g")
        .call(leftAxis);


    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr("cx", d => xscale(d.poverty))
        .attr("cy", d => yscale(d.healthcare))
        .attr("r", 10)
        .attr("fill", "pink")
        .attr("opacity", 0.5)
    // .text(d => d.abbr).attr('fill', 'black')


    chartGroup.selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .attr('x', d => xscale(d.poverty))
        .attr('y', d => yscale(d.healthcare))
        .text(d => d.abbr).attr('fill', 'black').attr("text-anchor", "middle")


    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
        .attr('class', toolTip)
        .offset([80, -60])
        .html(function (d) {
            return `${d.state}<br>${d.poverty}% poverty<br>${d.healthcare}% healthcare`;
        });
    chartGroup.call(toolTip)
    circlesGroup.on("mouseover", function (d) {
        toolTip.show(d, this);
    }).on("mouseout", function (d) {
        toolTip.hide(d);
    })

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip)
    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================

    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Healthcare(%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
}).catch(function (error) {
    console.log(error);
});


// // When the browser loads, makeResponsive() is called.
// makeResponsive();

// // When the browser window is resized, makeResponsive() is called.
// d3.select(window).on("resize", makeResponsive);