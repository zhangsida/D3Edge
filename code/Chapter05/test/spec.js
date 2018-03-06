describe('Reusable Bar Chart Test Suite', function () {
    var barChart, chartdata, fixture;

    beforeEach(function () {
        barChart = d3.edge.barChart();
        fixture = d3.select('body')
            .append('div')
            .classed('test-container', true);
        chartdata = {
            container: '.test-container',
            dataset: [10, 20, 30, 40]
        };
    });

    afterEach(function () {
        fixture.remove();
    });

    it('should render a chart with minimal requirements', function () {
        // fixture.datum(dataset).call(barChart);
        barChart.chartdata(chartdata).draw();
        expect(fixture.select('.chart')).toBeDefined(1);
    });

    it('should provide getters and setters', function () {
        var defaultWidth = barChart.chartdata().width;
        var defaultEase = barChart.chartdata().ease;

        chartdata = {
            container: '.test-container',
            dataset: [10, 20, 30, 40],
            width: 1234,
            ease: 'linear'
        };

        barChart.chartdata(chartdata).draw();

        var newWidth = barChart.chartdata().width;
        var newEase = barChart.chartdata().ease;

        expect(defaultWidth).not.toBe(1234);
        expect(defaultEase).not.toBe('linear');
        expect(newWidth).toBe(1234);
        expect(newEase).toBe('linear');
    });

    it('should scope some private and some public fields and methods', function () {
        expect(typeof barChart.draw).toBe('function');
        expect(typeof barChart.chartdata).toBe('function');
        expect(typeof barChart.chartdata()).toBe('object');
        expect(barChart.chartdata().ease).toBeDefined();
        expect(typeof barChart.chartdata().ease).toBe('string');
        expect(barChart.chartdata().className).toBeUndefined();
    });

    it('should update a chart with new attributes', function () {
        chartdata = {
            width: 10000,
        };
        barChart.chartdata(chartdata).draw();
        // fixture.datum(dataset)
        //     .call(barChart);
        chartdata = {
            width: 20000,
        };
        barChart.chartdata(chartdata).draw();

        expect(barChart.chartdata().width).toBe(20000);
    });

    it('should update a chart with new data', function () {
        // fixture.datum(dataset)
        //     .call(barChart);
        barChart.chartdata(chartdata).draw();

        var firstBarNodeData1 = fixture.selectAll('.bar')[0][0].__data__;

        var chartdata2 = {
            dataset: [1000]
        };
        // fixture.datum(dataset2)
        //     .call(barChart);
        barChart.chartdata(chartdata2).draw();

        var firstBarNodeData2 = fixture.selectAll('.bar')[0][0].__data__;

        expect(firstBarNodeData1).toBe(chartdata.dataset[0]);
        expect(firstBarNodeData2).toBe(chartdata2.dataset[0]);
    });

    it('should render two charts with distinct configuration', function () {
        fixture.append('div').classed('t1', true);
        var chartdata1 = {
            container: '.t1',
            dataset: [10, 20, 30, 40]
        };
        barChart.chartdata(chartdata1).draw();
        
        fixture.append('div').classed('t2', true);
        var chartdata2 = {
            container: '.t2',
            dataset: [400, 300, 200, 100],
            ease: 'linear'
        };

        barChart.chartdata(chartdata2).draw();

        var charts = fixture.selectAll('div').selectAll('.chart');

        expect(charts.length).toBe(2);
        expect(chartdata2.ease).not.toBe(chartdata1.ease);
    });

    // it('can be composed with another one', function() {
    //     fixture.datum(dataset)
    //         .call(barChart);

    //     var barChart2 = d3.edge.barChart();

    //     fixture.selectAll('.chart')
    //         .datum(dataset)
    //         .call(barChart2);

    //     var charts = fixture.selectAll('.chart');

    //     expect(charts[0].length).toBe(2);
    //     expect(charts[0][1].parentElement).toBe(charts[0][0]);
    // });

    // it('should render a chart for each data series', function () {
    //     var dataset = [
    //         [1, 2, 3, 4],
    //         [5, 6, 7, 8],
    //         [9, 10, 11, 12]
    //     ];

    //     fixture.selectAll('div.container')
    //         .data(dataset)
    //         .enter().append('div')
    //         .classed('container', true)
    //         .datum(function (d, i) {
    //             return d;
    //         })
    //         .call(barChart);

    //     var charts = fixture.selectAll('.chart');

    //     expect(charts[0].length).toBe(dataset.length);
    //     expect(charts[0][0].__data__).toBe(dataset[0]);
    //     expect(charts[0][1].__data__).toBe(dataset[1]);
    //     expect(charts[0][2].__data__).toBe(dataset[2]);
    // });

    it('should trigger a callback on events', function () {
        // fixture.datum(dataset)
        //     .call(barChart);
        barChart.chartdata(chartdata).draw();
        var callback = jasmine.createSpy("filterCallback");
        barChart.draw.on('customHover', callback);

        var bars = fixture.selectAll('.bar');
        bars[0][0].__onmouseover();
        var callBackArguments = callback.argsForCall[0][0];

        expect(callback).toHaveBeenCalled();
        expect(callBackArguments).toBe(chartdata.dataset[0]);
    });
});