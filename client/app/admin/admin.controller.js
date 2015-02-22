'use strict';

angular.module('aksiteApp')
    .controller('AdminCtrl', function($scope, $mdSidenav, $timeout, $log, $http) {
        $scope.pages = [
            {
                name: 'Users',
                icon: 'fa-user',
                link: 'admin/users'
            }, {
                name: 'Photos',
                icon: 'fa-photo',
                link: 'admin/photos'
            }, {
                name: 'Projects',
                icon: 'fa-briefcase',
                link: 'admin/projects'
            }, {
                name: 'Blog',
                icon: 'fa-newspaper-o',
                link: 'admin/blog'
            }, {
                name: 'Featured',
                icon: 'fa-star-o',
                link: 'admin/featured'
            }, {
                name: 'Files',
                icon: 'fa-files-o',
                link: 'admin/files'
            }, {
                name: 'Settings',
                icon: 'fa-cog',
                link: 'admin/settings'
            }
        ];

        $scope.sections = [
            {
                title: 'Home',
                icon: 'fa-home',
                link: 'admin'
            }, {
                title: 'Users',
                icon: 'fa-user',
                link: 'admin/users'
            }, {
                title: 'Photos',
                icon: 'fa-photo',
                link: 'admin/photos'
            }, {
                title: 'Projects',
                icon: 'fa-briefcase',
                link: 'admin/projects'
            }, {
                title: 'Blog',
                icon: 'fa-newspaper-o',
                link: 'admin/blog'
            }, {
                title: 'Featured',
                icon: 'fa-star-o',
                link: 'admin/featured'
            }, {
                title: 'Files',
                icon: 'fa-files-o',
                link: 'admin/files'
            }, {
                title: 'Settings',
                icon: 'fa-cog',
                link: 'admin/settings'
            }
        ];

        $scope.toggleLeft = function () {
            $mdSidenav('left').toggle()
                .then(function () {
                    $log.debug("toggle left is done");
                });
        };

        var apiItems = [
            {
                path: 'upload',
                title: 'Uploads'
            }, {
                path: 'files',
                title: 'Files'
            }, {
                path: 'posts',
                title: 'Posts'
            }, {
                path: 'gallery',
                title: 'Galleries'
            }, {
                path: 'photos',
                title: 'Photos'
            }, {
                path: 'users',
                title: 'Users'
            }, {
                path: 'featured',
                title: 'Featured Items'
            }, {
                path: 'projects',
                title: 'Projects'
            }
        ];

        $scope.tableItems = [];
        _.forEach(apiItems, function (item) {
            $http.get('api/' + item.path + '/count')
                .success(function (data) {
                    $scope.tableItems.push([item.title, data]);
                })
                .error(function (err, code) {
                    console.log(code);
                    console.log(err);
                });
        });

        //Donut chart example
        function addChart(chartNum, data, options) {
            options = options ? options : {};

            var chartDiv = document.querySelector("#chart" + chartNum);

            nv.addGraph(function () {
                var chart = nv.models.pieChart()
                        .x(function (d) {
                            return d.label
                        })
                        .y(function (d) {
                            return d.value
                        })
                    ;

                chart.showLegend(_.has(options, 'showLegend') ?  options.showLegend : false);
                chart.showLabels(_.has(options, 'showLabels') ?  options.showLabels : true);
                chart.labelThreshold(options.labelThreshold || .05);
                chart.labelType(options.labelType || 'percent');   // key, value, percent

                chart.donut(options.donut || false);
                if(options.donut) chart.donutRatio(options.donutRatio || .35);

                d3.select("#chart" + chartNum + " svg")
                    .datum(data)
                    .transition().duration(350)
                    .call(chart);

                return chart;
            });

            classie.addClass(chartDiv, 'hide-preloader');
        }

        function convertGAPItoD3(rows) {
            var data = [];
            _.forEach(rows, function(item) {
                data.push({
                    label: item[0],
                    value: item[1]
                });
            });
            return data;
        }

        gapi.analytics.ready(function () {
            var CLIENT_ID = '693903895035-1lk6sfgma8o270mk4icngumgnomuahob.apps.googleusercontent.com';

            gapi.analytics.auth.authorize({
                container: 'auth-button',
                clientid: CLIENT_ID
            });

            /**
             * Extend the Embed APIs `gapi.analytics.report.Data` component to
             * return a promise the is fulfilled with the value returned by the API.
             * @param {Object} params The request parameters.
             * @return {Promise} A promise.
             */
            function query(params) {
                return new Promise(function(resolve, reject) {
                    var data = new gapi.analytics.report.Data({query: params});
                    data.once('success', function(response) { resolve(response); })
                        .once('error', function(response) { reject(response); })
                        .execute();
                });
            }

            // Create the view selector.
            var viewSelector = new gapi.analytics.ViewSelector({
                container: 'view-selector'
            });

            // Create the timeline chart.
            var timeline = new gapi.analytics.googleCharts.DataChart({
                reportType: 'ga',
                query: {
                    'dimensions': 'ga:date',
                    'metrics': 'ga:sessions',
                    'start-date': '30daysAgo',
                    'end-date': 'yesterday'
                },
                chart: {
                    type: 'LINE',
                    container: 'timeline'
                }
            });

            // Hook up the components to work together.
            gapi.analytics.auth.on('success', function (response) {
                viewSelector.execute();
            });

            viewSelector.on('change', function (ids) {

                var now = moment(),
                    monthAgo = moment(now).subtract(1, 'month');

                query({
                    'ids': ids,
                    'dimensions': 'ga:browser',
                    'metrics': 'ga:pageviews',
                    'sort': '-ga:pageviews',
                    'start-date': monthAgo.format('YYYY-MM-DD'),
                    'end-date': now.format('YYYY-MM-DD')
                }).then(function(results) {
                    var browserData = convertGAPItoD3(results.rows);
                    _.forEach(browserData, function(item) {
                        if(item.label === 'Mozilla Compatible Agent') item.label = 'Mozilla';
                    });
                    addChart(1, browserData, {
                        showLegend: true
                    });
                });

                query({
                    'ids': ids,
                    'dimensions': 'ga:operatingSystem',
                    'metrics': 'ga:users',
                    'sort': '-ga:users',
                    'start-date': monthAgo.format('YYYY-MM-DD'),
                    'end-date': now.format('YYYY-MM-DD')
                }).then(function(results) {
                    addChart(2, convertGAPItoD3(results.rows), {
                        showLegend: true
                    });
                });

                query({
                    'ids': ids,
                    'dimensions': 'ga:country',
                    'metrics': 'ga:users',
                    'sort': '-ga:users',
                    'start-date': monthAgo.format('YYYY-MM-DD'),
                    'end-date': now.format('YYYY-MM-DD')
                }).then(function(results) {
                    addChart(3, convertGAPItoD3(results.rows), {
                        showLegend: false,
                        showLabels: true,
                        labelThreshold: .01,
                        labelType: 'key'
                    });
                });

                query({
                    'ids': ids,
                    'dimensions': 'ga:userType',
                    'metrics': 'ga:users',
                    'sort': '-ga:users',
                    'start-date': monthAgo.format('YYYY-MM-DD'),
                    'end-date': now.format('YYYY-MM-DD')
                }).then(function(results) {
                    addChart(4, convertGAPItoD3(results.rows), {
                        showLegend: true,
                        showLabels: true,
                        labelThreshold: .01,
                        labelType: 'percent'
                    });
                });

                var newIds = {
                    query: {
                        ids: ids
                    }
                };
                timeline.set(newIds).execute();
            });
        });
    })
    .controller('LeftCtrl', function($scope, $timeout, $mdSidenav, $log) {
        $scope.close = function() {
            $mdSidenav('left').close()
                .then(function(){
                    $log.debug("close LEFT is done");
                });
        };
    });
