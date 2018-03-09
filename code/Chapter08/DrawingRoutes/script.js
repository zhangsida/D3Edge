'use strict';
(function (root, factory) {
  root.D3Edge = factory(root);
}(window, function (win) {
  var D3Edge = {};
  (function (D3Edge) {
    var D = D3Edge;
    D.dispatch = d3.dispatch('geoReady', 'dataReady', 'dataLoading', 'hover', 'stopsEnd', 'routesEnd', 'brushing');

    var data,
      t,
      s,
      svg,
      brush,
      chartdata = {
        container: '#zurich_map',
        width: 570,
        height: 500,
        center: [8.5390, 47.3687],
        scale: 900000,
        size: function () {
          return [this.width, this.height];
        }
      };

    D.svg = function () {
      var _selection = d3.select(chartdata.container)
        .append('svg')
        .attr('width', chartdata.width)
        .attr('height', chartdata.height);
      //Set svg equal to the selection that invokes this module.
      svg = svg || _selection;

      //Bind an empty datum to the selection. Usefull later for zooming.
      svg.datum([]);
      return svg;
    };

    D.chartdata = function (_chartdata) {
      if (!arguments.length) return chartdata;
      for (var key in chartdata)
        chartdata[key] = key in _chartdata && _chartdata[key] || chartdata[key];
      return D;
    };

    D.projection = d3.geo.mercator()
      .scale(chartdata.scale)
      .center(chartdata.center)
      .translate([chartdata.width / 2, chartdata.height / 2]);

    D.path = d3.geo.path()
      .projection(D.projection);

  }(D3Edge));
  (function (D3Edge) {
    var D = D3Edge,
      svg = D.svg(),
      dispatch = D.dispatch,
      path = D.path;
    //Create a drawRoutes method that can be invoked to create routes for each city.
    D.drawRoutes = function (_data) {
      svg.append('path')
        .attr('class', 'route')
        .datum(topojson.object(_data, _data.objects.routes))
        .attr('d', function (d, i) {
          return path(d);
        });

      //Dispatch our routesEnd event so we know with the routes visualization is complete.
      dispatch.routesEnd();
    };

    D.drawStops = function (_data) {
      svg.selectAll('.stop')
        .data(_data.features)
        .enter().append('circle')
        .attr('cx', function (d) {
          return D.projection(d.geometry.coordinates)[0];
        })
        .attr('cy', function (d) {
          return D.projection(d.geometry.coordinates)[1];
        })
        .attr('r', 2)
        .attr('class', 'stop')
        .on('mouseover', dispatch.hover);

      //Dispatch our stopsEnd event so we know with the stops visualization is complete.
      dispatch.stopsEnd();
    };
    d3.rebind(D, dispatch, 'on');

  }(D3Edge));
  (function (D3Edge) {
    var D = D3Edge,
      drawRoutes = D.drawRoutes;

    //Create a method to load the geojson file, and execute a custom callback on response.
    D.loadGeoJson = function (_file, _func) {
      //Load json file using d3.json.
      d3.json(_file, function (_err, _data) {
        //Execute the callback, assign the data to the context.
        _func(_data);
      });
    };
    //Bind our custom events to the 'on' method of our function.
  }(D3Edge));
  return D3Edge;
}));

var zurich = {
  container: '#zurich_map',
  center: [8.5390, 47.3687]
};
var geneva = {
  container: '#geneva_map',
  center: [6.14, 46.20]
};
var sanFrancisco = {
  container: '#san_francisco_map',
  center: [-122.4376, 37.77]
};

D3Edge.chartdata(zurich).loadGeoJson('../../../data/zurich/routes_topo.json', D3Edge.drawRoutes);
D3Edge.on('routesEnd', function () {
  D3Edge.loadGeoJson('../../../data/zurich/stops_geo.json', D3Edge.drawStops);
});

// D3Edge.chartdata(geneva).loadGeoJson('../../../data/geneva/routes_topo.json', D3Edge.drawRoutes);
// D3Edge.on('routesEnd', function () {
//   D3Edge.loadGeoJson('../../../data/geneva/stops_geo.json', D3Edge.drawStops);
// });

// D3Edge.chartdata(sanFrancisco).loadGeoJson('../../../data/san_francisco/routes_topo.json', D3Edge.drawRoutes);
// D3Edge.on('routesEnd', function () {
//   D3Edge.loadGeoJson('../../../data/san_francisco/stops_geo.json', D3Edge.drawStops);
// });