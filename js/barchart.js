function barchart(data, selectValue) {
    d3.selectAll("g > *").remove();
    const freqMap = data.reduce((data, e) => data.set(e, (data.get(e) || 0) + 1), new Map());
    xVal = Array.from(freqMap.keys());
    yVal = Array.from(freqMap.values());
    var svg = d3.select(".barsvg")
        .on("mousedown", null),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;

    var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

    var xScale = d3.scaleBand().range([0, width]).padding(0.05);
    yScale = d3.scaleLinear().range([height, 0]);

    xScale.domain(xVal);
    yScale.domain([0, d3.max(yVal)]);

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("y", 30)
        .attr("x", width - 75)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text(selectValue);


    g.append("g")
        .call(d3.axisLeft(yScale).tickFormat(function(d) {
                return d;
            })
            .ticks(10))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("Frequency");

    var rect = g.selectAll("rect")
        .data(xVal)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return xScale(d); })
        .attr("y", function(d) { return yScale(yVal[xVal.indexOf(d)]); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return height - yScale(yVal[xVal.indexOf(d)]) })
        .attr('fill', '#022c7a')
        .on("mouseover", function(d) {
            d3.select(this)
                .style('fill', 'red');
            d3.select(this)
                .style('fill', 'red');
            var d = d3.select(this).data()[0];

            var xtip = xScale(d) + xScale.bandwidth() / 2;
            var ytip = yScale(yVal[xVal.indexOf(d)]) - 10;
            g.append("text")
                .text(yVal[xVal.indexOf(d)])
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
        })
}