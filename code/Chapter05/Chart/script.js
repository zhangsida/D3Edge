// Bar chart Module
/////////////////////////////////

d3.edge = {};

d3.edge.barChart = function module() {
    var exports = {},
        svg,
        dispatch = d3.dispatch("customHover"),
        chartdata = {
            container: '#figure',
            dataset: [],
            fontSize: 10,
            fontColor: 'black',
            width: 500,
            height: 500,
            gap: 0,
            ease: 'bounce',
            margin: {
                top: 20,
                right: 20,
                bottom: 40,
                left: 40
            }
        };
    exports.chartdata = function (_chartdata) {
        if (!arguments.length) return chartdata;
        for (var key in chartdata)
            chartdata[key] = key in _chartdata && _chartdata[key] || chartdata[key];
        return this;
    };

    exports.draw = function () {
        var chartW = chartdata.width - chartdata.margin.left - chartdata.margin.right;
        var chartH = chartdata.height - chartdata.margin.top - chartdata.margin.bottom;
        var _selection = d3.select(chartdata.container).datum(chartdata.dataset);
        // So it can loop through this selection with d3.each
        _selection.each(function (_data) {

            var x1 = d3.scale.ordinal()
                .domain(_data.map(function (d, i) {
                    return i;
                }))
                .rangeRoundBands([0, chartW], 0.1);

            var y1 = d3.scale.linear()
                .domain([0, d3.max(_data, function (d, i) {
                    return d;
                })])
                .range([chartH, 0]);

            var xAxis = d3.svg.axis()
                .scale(x1)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y1)
                .orient("left");

            var barW = chartW / _data.length;

            if (!svg) {
                svg = d3.select(this)
                    .append("svg")
                    .classed("chart", true);
                var container = svg.append("g").classed("container-group", true);
                container.append("g").classed("chart-group", true);
                container.append("g").classed("x-axis-group axis", true);
                container.append("g").classed("y-axis-group axis", true);
            }

            svg.transition().attr({
                width: chartdata.width,
                height: chartdata.height
            });
            svg.select(".container-group")
                .attr({
                    transform: "translate(" + chartdata.margin.left + "," + chartdata.margin.top + ")"
                });

            svg.select(".x-axis-group.axis")
                .transition()
                .ease(chartdata.ease)
                .attr({
                    transform: "translate(0," + (chartH) + ")"
                })
                .call(xAxis);

            svg.select(".y-axis-group.axis")
                .transition()
                .ease(chartdata.ease)
                .call(yAxis);

            var gapSize = x1.rangeBand() / 100 * chartdata.gap;
            var barW = x1.rangeBand() - gapSize;
            var bars = svg.select(".chart-group")
                .selectAll(".bar")
                .data(_data);
            bars.enter().append("rect")
                .classed("bar", true)
                .attr({
                    x: chartW,
                    width: barW,
                    y: function (d, i) {
                        return y1(d);
                    },
                    height: function (d, i) {
                        return chartH - y1(d);
                    }
                })
                .on("mouseover", dispatch.customHover);
            bars.transition()
                .ease(chartdata.ease)
                .attr({
                    width: barW,
                    x: function (d, i) {
                        return x1(i) + gapSize / 2;
                    },
                    y: function (d, i) {
                        return y1(d);
                    },
                    height: function (d, i) {
                        return chartH - y1(d);
                    }
                });
            bars.exit().transition().style({
                opacity: 0
            }).remove();
        });
    }
    d3.rebind(exports.draw, dispatch, "on");
    return exports;
};