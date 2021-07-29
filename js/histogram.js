var ticksHist,
    dataHist,
    selectValueHist;

var svg = d3.select(".barsvg");

function enableDrag() {
    svg
        .on("mousedown", function() {
            var xIni = d3.mouse(this)[0];
            var svgdrag = d3.select(this)
                .classed("active", true);

            var w = d3.select(window)
                .on("mousemove", mousemove)
                .on("mouseup", mouseup);

            function mousemove() {
                var diff = d3.mouse(svgdrag.node())[0] - xIni;
                if (diff < 0 && (diff % 10 == 0)) {
                    ticksHist = ticksHist + 10;
                    histogram(dataHist, selectValueHist, ticksHist);
                } else if (diff >= 0 && (diff % 10 == 0)) {
                    ticksHist = ticksHist - 10;
                    histogram(dataHist, selectValueHist, ticksHist);
                }
            }

            function mouseup() {
                svgdrag.classed("active", false);
                w.on("mousemove", null).on("mouseup", null);
            }
        });
}

function histogram(data, selectValue, ticks) {
    d3.selectAll("g > *").remove();
    xVal = data;
    ticksHist = ticks;
    dataHist = data;
    selectValueHist = selectValue;
    var margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;
    var xScale = d3.scaleLinear().domain([0, 1.1 * d3.max(xVal)]).range([0, width]);
    yScale = d3.scaleLinear().range([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("y", 30)
        .attr("x", width - 75)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text(selectValue);


    if (ticksHist > 100)
        ticksHist = 100;
    else if (ticksHist < 10)
        ticksHist = 10;

    var histogram = d3.histogram()
        .value(function(d) { return d; })
        .domain(xScale.domain())
        .thresholds(xScale.ticks(ticksHist));


    var bins = histogram(xVal);

    yScale.domain([0, d3.max(bins, function(d) { return d.length; })]);
    g.append("g")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("Frequency");

    g.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + xScale(d.x0) + "," + yScale(d.length) + ")"; })
        .attr("width", function(d) { return (xScale(d.x1) - xScale(d.x0) - 1 < 0) ? 0 : xScale(d.x1) - xScale(d.x0) - 1; })
        .attr("height", function(d) { return height - yScale(d.length); })
        .on("mouseover", function(d) {
            d3.select(this)
                .style('fill', 'red');
            var d = d3.select(this).data()[0];
            var xtip = xScale((d3.select(this).data()[0]["x0"] + d3.select(this).data()[0]["x1"]) / 2);
            var ytip = yScale(d.length) - 10;
            g.append("text")
                .text(d.length)
                .attr("id", "tooltext")
                .attr("stroke", "red")
                .attr("transform", function(d) { return "translate(" + xtip + "," + ytip + ")"; });
        })
        .on("mouseout", function(d) {
            d3.select(this).style('fill', '#022c7a');
            d3.selectAll('.val')
                .remove();
            d3.selectAll('#tooltext')
                .remove();
            // tooltipdiv.style('display', 'none');
        })
        .style("fill", "#022c7a");


}