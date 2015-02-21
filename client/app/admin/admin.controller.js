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

        var exampleData = [
            {
                "label": "One",
                "value": 29.765957771107
            }, {
                "label": "Two",
                "value": 0
            }, {
                "label": "Three",
                "value": 32.807804682612
            }, {
                "label": "Four",
                "value": 196.45946739256
            }, {
                "label": "Five",
                "value": 0.19434030906893
            }, {
                "label": "Six",
                "value": 98.079782601442
            }, {
                "label": "Seven",
                "value": 13.925743130903
            }, {
                "label": "Eight",
                "value": 5.1387322875705
            }
        ];

        addChart(3, exampleData);
        addChart(4, exampleData);

        //Donut chart example
        function addChart(chartNum, data) {
            nv.addGraph(function () {
                var chart = nv.models.pieChart()
                        .x(function (d) {
                            return d.label
                        })
                        .y(function (d) {
                            return d.value
                        })
                        .showLabels(true)     //Display pie labels
                        .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
                        .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
                        .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
                        .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
                    ;

                d3.select("#chart" + chartNum + " svg")
                    .datum(data)
                    .transition().duration(350)
                    .call(chart);

                return chart;
            });
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

                var now = moment();

                query({
                    'ids': ids,
                    'dimensions': 'ga:browser',
                    'metrics': 'ga:pageviews',
                    'sort': '-ga:pageviews',
                    'start-date': moment(now).subtract(1, 'month').format('YYYY-MM-DD'),
                    'end-date': moment(now).format('YYYY-MM-DD')
                }).then(function(results) {
                    var browserData = convertGAPItoD3(results.rows);
                    _.forEach(browserData, function(item) {
                        if(item.label === 'Mozilla Compatible Agent') item.label = 'Mozilla';
                    });
                    addChart(1, browserData);
                    //console.log(results);
                });

                query({
                    'ids': ids,
                    'dimensions': 'ga:operatingSystem',
                    'metrics': 'ga:users',
                    'sort': '-ga:users',
                    'start-date': moment(now).subtract(1, 'month').format('YYYY-MM-DD'),
                    'end-date': moment(now).format('YYYY-MM-DD')
                }).then(function(results) {
                    var browserData = convertGAPItoD3(results.rows);
                    addChart(2, browserData);
                    //console.log(results);
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
