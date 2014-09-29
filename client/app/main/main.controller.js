'use strict';

angular.module('aksiteApp')
    .controller('MainCtrl', function ($scope, $http, socket, d3Service) {
        $scope.awesomeThings = [];
        $scope.photos = [];

        $http.get('/api/photos').success(function (photos) {
            $scope.photos = photos;
        });

        $http.get('/api/things').success(function (awesomeThings) {
            $scope.awesomeThings = awesomeThings;
            socket.syncUpdates('thing', $scope.awesomeThings);
        });

        $scope.addThing = function () {
            if ($scope.newThing === '') {
                return;
            }
            $http.post('/api/things', { name: $scope.newThing });
            $scope.newThing = '';
        };

        $scope.deleteThing = function (thing) {
            $http.delete('/api/things/' + thing._id);
        };

        $scope.$on('$destroy', function () {
            socket.unsyncUpdates('thing');
        });

        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 900 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var color = d3.scale.linear()
            .domain([0, 20])
            .range(["orange", "orange"])
            .interpolate(d3.interpolateLab);

        var hexbin = d3.hexbin()
            .size([width, height])
            .radius(100);

        var points = hexbin.centers();

        var x = d3.scale.identity()
            .domain([0, width]);

        var y = d3.scale.linear()
            .domain([0, height])
            .range([height, 0]);

        var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)

        svg.append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("class", "mesh")
            .attr("width", width)
            .attr("height", height);

        svg.append("g")
            .attr("clip-path", "url(#clip)")
            .selectAll(".hexagon")
            .data(hexbin(points))
            .enter().append("path")
            .attr("class", "hexagon")
            .attr("d", hexbin.hexagon())
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
            .style("fill", 'url(#image)');
    });