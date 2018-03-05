
var chartdata1 = {
    fontColor: 'red'
};
var chartdata2 = {
    dataset: [1, 2, 3, 4],
    fontSize: 20,
    fontColor: 'green'
};

// private update Module private
///////////////////////////////////////////////////////////////////////
// Our own namespace under the d3 namespace
// Like d3.svg or d3.layout
d3.edge = {};

// The "module" function returns another function
d3.edge.table = function module() {

    // To get events out of the module
    // we use d3.dispatch, declaring an "hover" event
    var dispatch = d3.dispatch("customHover");

    // This returned function takes a d3 selection as argument
    function exports(_chartdata) {
        if (_chartdata === undefined) {
            _chartdata = {};
        }
        var value = function (_default, _x) {
            return _x === undefined ? _default : _x;
        };

        var chartdata = {
            containter: value('#figure', _chartdata.containter),
            dataset: value([], _chartdata.dataset),
            fontSize: value(10, _chartdata.fontSize),
            fontColor: value('black', _chartdata.fontColor)
        };

        var _selection = d3.select(chartdata.containter).datum(chartdata.dataset);
        // So it can loop through this selection with d3.each
        _selection.each(function (_data) {
            // "_data" was bound to this DOM element by d3
            // "this" is the current DOM object
            d3.select(this)
                // Let's add a div to it
                .append("div")
                .style({
                    "font-size": chartdata.fontSize + "px",
                    "color": chartdata.fontColor
                })
                // and write something useful
                .html("Hello World: " + _data)
                // we trigger the "customHover" event that will receive the usual "d" and "i" arguments
                // as it is equivalent to:
                //     .on("mouseover", function(d, i) { return dispatch.customHover(d, i); });
                .on("mouseover", dispatch.customHover);
        });
    };
   // We can rebind the custom events to the "exports" function
    // so it's available under the typical "on" method
    d3.rebind(exports, dispatch, "on");
    // This is where the function is returned by the "module" function
    return exports;
};

// To use it, first we ask the module to give us the function
var table = d3.edge.table();

// We pass a selection with some data bound to it
table();
table(chartdata1)
table(chartdata2);

table.on("customHover", function (d, i) {
    console.log("customHover: " + d, i);
});
table(chartdata2);