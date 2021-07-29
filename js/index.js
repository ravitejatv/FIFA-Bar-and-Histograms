var axisSelected = [
    ["X", ""],
    ["Y", ""]
];
var isHistogram = false;
var path_to_csv = "data/fifa_processed.csv";
var filter;

function init() {
    document.querySelector(".scatterdiv").style.display = "none";
    document.querySelector(".bardiv").style.display = "none";
    document.querySelector(".homediv").style.display = "block";
}
init();
d3.csv(path_to_csv, function(error, data) {
    if (error) {
        throw error;
    }
    dataset = data;
    columnData = data.columns;
    var select = d3.select('#barselect')
        .on('change', onchange);

    select.selectAll('#barselect')
        .data(columnData)
        .enter()
        .append('option')
        .text(function(d) {
            return d;
        });

    var selectscat = d3.select('#scatselect')
        .on('change', onchangeScat);

    selectscat.selectAll('#dropvalues')
        .data(columnData)
        .enter()
        .append('option')
        .text(function(d) {
            return d;
        });

    for (const [key, value] of Object.entries(data[data.length - 1])) {
        if (value === "catf")
            filter = key;
    }

    filterData = jQuery.map(data, function(n, i) {
        return n[filter];
    });
    filterData.pop();
    var filterselect = d3.select('#barfilterselect')
        .on('change', onchange);

    filterselect.selectAll('#dropvalues')
        .data(filterData)
        .enter()
        .append('option')
        .text(function(d) {
            return d;
        });

});

function onchange() {
    selectValue = d3.select('#barselect').property('value');
    filterValue = d3.select('#barfilterselect').property('value');
    console.log(filterValue);
    console.log(selectValue);
    d3.csv(path_to_csv, function(error, data) {
        if (error) {
            throw error;
        }
        var plot = data[data.length - 1][selectValue];
        if (plot === "cat" || plot === "catf") {
            isHistogram = false;
            barData = jQuery.map(data, function(n, i) {
                if (n[filter] === filterValue || filterValue === "" || i === data.length - 1) {
                    if (n[selectValue] != "")
                        return n[selectValue];
                }
            });
            console.log(barData);
            barData.pop();
            barchart(barData, selectValue);
        } else if (plot === "num") {
            isHistogram = true;
            histData = jQuery.map(data, function(n, i) {
                if (n[filter] === filterValue || filterValue === "" || i === data.length - 1) {
                    if (n[selectValue] != "")
                        return parseInt(n[selectValue]);
                }
            });
            console.log(histData);
            histData.pop();
            enableDrag();
            histogram(histData, selectValue, 50);
        }
    });
}

function onchangeScat() {
    isHistogram = false;
    var form = document.getElementById("radioscat")
    var formval;
    for (var i = 0; i < form.length; i++) {
        if (form[i].checked) {
            formval = form[i].value;
        }
    }
    selectValue = d3.select('#scatselect').property('value');
    for (var i = 0; i < axisSelected.length; i++) {
        if (axisSelected[i][0] === formval) {
            axisSelected[i][1] = selectValue;
        }
    }
    if (document.getElementById("axisscatter2"))
        document.getElementById("axisscatter2").innerHTML = "";
    for (var i = 0; i < axisSelected.length; i++) {
        d3.select("#axisscatter2").append("p").text(axisSelected[i][0] + " axis selected: " + axisSelected[i][1]);
    }
    var axisSelect = true;
    for (var i = 0; i < axisSelected.length; i++) {
        if (axisSelected[i][1] === "")
            axisSelect = false;
    }
    if (axisSelect) {
        selectValueX = axisSelected[0][1];
        selectValueY = axisSelected[1][1];
        d3.csv(path_to_csv, function(error, data) {
            if (error) {
                throw error;
            }
            scatterDataX = jQuery.map(data, function(n, i) {
                if (n[selectValueX] != "" && n[selectValueY] != "")
                    return n[selectValueX];
            });
            scatterDataY = jQuery.map(data, function(n, i) {
                if (n[selectValueY] != "" && n[selectValueX] != "")
                    return (n[selectValueY]);
            });
            xPlot = scatterDataX.pop();
            yPlot = scatterDataY.pop();
            if (xPlot === "num") {
                for (var i = 0; i < scatterDataX.length; i++) {
                    scatterDataX[i] = parseInt(scatterDataX[i]);
                }
            }
            if (yPlot === "num") {
                for (var i = 0; i < scatterDataY.length; i++) {
                    scatterDataY[i] = parseInt(scatterDataY[i]);
                }
            }
            scatterplot(scatterDataX, scatterDataY, selectValueX, selectValueY, xPlot, yPlot);
        });
    }
}

function show(div) {
    if (div === 'bar') {
        document.querySelector(".scatterdiv").style.display = "none";
        document.querySelector(".bardiv").style.display = "block";
        document.querySelector(".homediv").style.display = "none";
        d3.selectAll("g > *").remove();
        d3.select('#scatselect').property('value', "");
        if (document.getElementById("axisscatter2"))
            document.getElementById("axisscatter2").innerHTML = "";
        var form = document.getElementById("radioscat");
        for (var i = 0; i < form.length; i++) {
            if (form[i].value === "X")
                form[i].checked = true;
            else
                form[i].checked = false;
        }
        for (var i = 0; i < form.length; i++) {
            axisSelected[i][1] = "";
        }
    } else if (div === 'scatter') {
        d3.select('#barselect').property('value', "");
        d3.select('#barfilterselect').property('value', "");
        d3.selectAll("g > *").remove();
        document.querySelector(".bardiv").style.display = "none";
        document.querySelector(".scatterdiv").style.display = "block";
        document.querySelector(".homediv").style.display = "none";
    } else if (div === 'home') {
        d3.selectAll("g > *").remove();
        d3.select('#scatselect').property('value', "");
        if (document.getElementById("axisscatter2"))
            document.getElementById("axisscatter2").innerHTML = "";
        var form = document.getElementById("radioscat");
        for (var i = 0; i < form.length; i++) {
            if (form[i].value === "X")
                form[i].checked = true;
            else
                form[i].checked = false;
        }
        d3.select('#barselect').property('value', "");
        d3.select('#barfilterselect').property('value', "");
        document.querySelector(".bardiv").style.display = "none";
        document.querySelector(".scatterdiv").style.display = "none";
        document.querySelector(".homediv").style.display = "block";
        for (var i = 0; i < form.length; i++) {
            axisSelected[i][1] = "";
        }
    }
}

d3.select(".scatterbutton")
    .append("button")
    .html("Submit")
    .on("click", onclick);