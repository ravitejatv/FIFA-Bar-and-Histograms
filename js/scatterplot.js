function scatterplot(scatterDataX, scatterDataY, selectValueX, selectValueY, xPlot, yPlot) {
    d3.selectAll("g > *").remove();
    var svg = d3.select(".scattersvg"),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin

    var xScale, yScale;
    if (xPlot === "num")
        xScale = d3.scaleLinear().domain([0, 1.1 * d3.max(scatterDataX)]).range([0, width]);
    else if (xPlot === "cat" || xPlot === "catf") {
        xScale = d3.scaleBand().range([0, width]);
        xScale.domain(scatterDataX);
    }

    if (yPlot === "num")
        yScale = d3.scaleLinear().domain([0, 1.1 * d3.max(scatterDataY)]).range([height, 0]);
    else if (yPlot === "cat" || yPlot === "catf") {
        yScale = d3.scaleBand().range([height, 0]);
        yScale.domain(scatterDataY);
    }

    var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("y", height - 325)
        .attr("x", width - 100)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text(selectValueX);

    g.append("g")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text(selectValueY);

    var scatterDatatotal = scatterDataX.map((item, index) => { return [item, scatterDataY[index]] });

    console.log(selectValueY);

    g.selectAll(".circle")
        .data(scatterDatatotal)
        .enter().append("circle")
        .attr("r", function(d) { return 1.5; })
        .attr("cx", function(d) {
            if (xPlot === "cat" || xPlot === "catf")
                return xScale(d[0]) + xScale.bandwidth() / 2;
            else if (xPlot === "num")
                return xScale(d[0]);
        })
        .attr("cy", function(d) {
            if (yPlot === "cat" || yPlot === "catf")
                return yScale(d[1]) + yScale.bandwidth() / 2;
            else if (yPlot === "num")
                return yScale(d[1]);
        });
}