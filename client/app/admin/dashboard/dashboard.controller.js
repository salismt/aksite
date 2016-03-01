'use strict';
import _ from 'lodash-es';
//import d3 from 'd3';
//import nv from 'nvd3';
const d3 = {};
const nv = {};
import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

const apiItems = [{
    path: 'upload', title: 'Uploads'
}, {
    path: 'files', title: 'Files'
}, {
    path: 'posts', title: 'Posts'
}, {
    path: 'gallery', title: 'Galleries'
}, {
    path: 'photos', title: 'Photos'
}, {
    path: 'users', title: 'Users'
}, {
    path: 'projects', title: 'Projects'
}];

const convertGAPItoD3 = _.partialRight(_.map, item => ({label: item[0], value: item[1]}));

function addChart(chartNum, data, options = {}) {
    nv.addGraph(function() {
        var chart = nv.models.pieChart().x(d => d.label).y(d => d.value);

        chart.showLegend(_.has(options, 'showLegend') ? options.showLegend : false);
        chart.showLabels(_.has(options, 'showLabels') ? options.showLabels : true);
        chart.labelThreshold(options.labelThreshold || .05);
        chart.labelType(options.labelType || 'percent');   // key, value, percent

        chart.donut(options.donut || false);
        if(options.donut) chart.donutRatio(options.donutRatio || .35);

        React.unmountComponentAtNode(document.getElementById(`chart${chartNum}`));
        ReactDOM.render(<svg></svg>, document.getElementById(`chart${chartNum}`));

        d3.select(`#chart${chartNum} svg`).datum(data).transition().duration(350).call(chart);

        return chart;
    });
}

export default class DashboardController {
    /*@ngInject*/
    constructor($http, $timeout) {
        this.tableItems = [];
        _.forEach(apiItems, item => {
            $http.get(`api/${item.path}/count`)
                .then(({data}) => {
                    this.tableItems.push([item.title, data]);
                })
                .catch(({data, status}) => {
                    console.log(status);
                    console.log(data);
                });
        });

        $timeout(function() {
            ReactDOM.render(<preloader></preloader>, document.getElementById('chart1'));
            ReactDOM.render(<preloader></preloader>, document.getElementById('chart2'));
            ReactDOM.render(<preloader></preloader>, document.getElementById('chart3'));
            ReactDOM.render(<preloader></preloader>, document.getElementById('chart4'));
        });

        // FIXME: Temp fix for unit tests
        var gapi = window.gapi;
        if(!gapi) {
            gapi = {
                analytics: {
                    ready: function() {
                    }
                }
            };
        }

        gapi.analytics.ready(function() {
            gapi.analytics.auth.authorize({
                container: 'auth-button',
                clientid: '693903895035-1lk6sfgma8o270mk4icngumgnomuahob.apps.googleusercontent.com'
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
                    data.once('success', resolve).once('error', reject).execute();
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
                    dimensions: 'ga:date',
                    metrics: 'ga:sessions',
                    'start-date': '30daysAgo',
                    'end-date': 'yesterday'
                },
                chart: {
                    type: 'LINE', container: 'timeline'
                }
            });

            // Hook up the components to work together.
            gapi.analytics.auth.on('success', () => viewSelector.execute());

            viewSelector.on('change', function(ids) {
                var now = moment();
                var monthAgo = moment(now).subtract(1, 'month');

                query({
                    ids,
                    dimensions: 'ga:browser',
                    metrics: 'ga:pageviews',
                    sort: '-ga:pageviews',
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
                    ids,
                    dimensions: 'ga:operatingSystem',
                    metrics: 'ga:users',
                    sort: '-ga:users',
                    'start-date': monthAgo.format('YYYY-MM-DD'),
                    'end-date': now.format('YYYY-MM-DD')
                }).then(function(results) {
                    addChart(2, convertGAPItoD3(results.rows), {
                        showLegend: true
                    });
                });

                query({
                    ids,
                    dimensions: 'ga:country',
                    metrics: 'ga:users',
                    sort: '-ga:users',
                    'start-date': monthAgo.format('YYYY-MM-DD'),
                    'end-date': now.format('YYYY-MM-DD')
                }).then(function(results) {
                    addChart(3, convertGAPItoD3(results.rows), {
                        showLegend: false, showLabels: true, labelThreshold: .01, labelType: 'key'
                    });
                });

                query({
                    ids,
                    dimensions: 'ga:userType',
                    metrics: 'ga:users',
                    sort: '-ga:users',
                    'start-date': monthAgo.format('YYYY-MM-DD'),
                    'end-date': now.format('YYYY-MM-DD')
                }).then(function(results) {
                    addChart(4, convertGAPItoD3(results.rows), {
                        showLegend: true, showLabels: true, labelThreshold: .01, labelType: 'percent'
                    });
                });

                var newIds = {
                    query: {
                        ids
                    }
                };
                timeline.set(newIds).execute();
            });
        });
    }
}
