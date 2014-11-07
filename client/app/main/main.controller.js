'use strict';

angular.module('aksiteApp')
    .controller('MainCtrl', function($scope, $http, socket) {
        $scope.awesomeThings = [];
        $scope.photos = [];
        $scope.featuredSection = {};

        $http.get('/api/photos').success(function(photos) {
            $scope.photos = photos;
        });

        $http.get('/api/things').success(function(awesomeThings) {
            $scope.awesomeThings = awesomeThings;
            socket.syncUpdates('thing', $scope.awesomeThings);
        });

        $scope.getFeatured = function() {
            $http.get('/api/featured')
                .success(function(res) {
                    $scope.featuredSection = res;
                    $scope.loadFeatured();
                });
        };
        $scope.getFeatured();

        $scope.addThing = function() {
            if($scope.newThing === '' || $scope.newThing === ' ') {
                return;
            }
            $http.post('/api/things', {name: $scope.newThing});
            $scope.newThing = '';
        };

        $scope.deleteThing = function(thing) {
            $http.delete('/api/things/' + thing._id);
        };

        $scope.$on('$destroy', function() {
            socket.unsyncUpdates('thing');
        });

        $scope.loadFeatured = function() {
            /* https://github.com/davidbau/seedrandom Copyright 2013 David Bau. */
            !function(a, b, c, d, e, f, g, h, i) {
                function j(a) {
                    var b, c = a.length, e = this, f = 0, g = e.i = e.j = 0, h = e.S = [];
                    for(c || (a = [c++]); d > f;)h[f] = f++;
                    for(f = 0; d > f; f++)h[f] = h[g = s & g + a[f % c] + (b = h[f])], h[g] = b;
                    (e.g = function(a) {
                        for(var b, c = 0, f = e.i, g = e.j, h = e.S; a--;)b = h[f = s & f + 1], c = c * d + h[s & (h[f] = h[g = s & g + b]) + (h[g] = b)];
                        return e.i = f, e.j = g, c
                    })(d)
                }

                function k(a, b) {
                    var c, d = [], e = typeof a;
                    if(b && "object" == e)for(c in a)try {
                        d.push(k(a[c], b - 1))
                    } catch(f) {
                    }
                    return d.length ? d : "string" == e ? a : a + "\0"
                }

                function l(a, b) {
                    for(var c, d = a + "", e = 0; e < d.length;)b[s & e] = s & (c ^= 19 * b[s & e]) + d.charCodeAt(e++);
                    return n(b)
                }

                function m(c) {
                    try {
                        return o ? n(o.randomBytes(d)) : (a.crypto.getRandomValues(c = new Uint8Array(d)), n(c))
                    } catch(e) {
                        return [+new Date, a, (c = a.navigator) && c.plugins, a.screen, n(b)]
                    }
                }

                function n(a) {
                    return String.fromCharCode.apply(0, a)
                }

                var o, p = c.pow(d, e), q = c.pow(2, f), r = 2 * q, s = d - 1, t = c["seed" + i] = function(a, f, g) {
                    var h = [];
                    f = 1 == f ? {entropy: !0} : f || {};
                    var o = l(k(f.entropy ? [a, n(b)] : null == a ? m() : a, 3), h), s = new j(h);
                    return l(n(s.S), b), (f.pass || g || function(a, b, d) {
                        return d ? (c[i] = a, b) : a
                    })(function() {
                        for(var a = s.g(e), b = p, c = 0; q > a;)a = (a + c) * d, b *= d, c = s.g(1);
                        for(; a >= r;)a /= 2, b /= 2, c >>>= 1;
                        return (a + c) / b
                    }, o, "global"in f ? f.global : this == c)
                };
                if(l(c[i](), b), g && g.exports) {
                    g.exports = t;
                    try {
                        o = require("crypto")
                    } catch(u) {
                    }
                } else h && h.amd && h(function() {
                    return t
                })
            }(this, [], Math, 256, 6, 52, "object" == typeof module && module, "function" == typeof define && define, "random");

            var data = $scope.featuredSection.items;

            data.forEach(function(d, i) {
                d.i = i % 10;
                d.j = i / 10 | 0;
            });

            Math.seedrandom(+d3.time.hour(new Date));

            d3.shuffle(data);

            var height = 460,
                imageWidth = 200,
                imageHeight = 200,
                radius = 100,
                depth = 4;

            var currentFocus = [innerWidth / 2, height / 2],
                desiredFocus,
                idle = true;

            var style = document.body.style,
                transform = ("webkitTransform" in style ? "-webkit-"
                        : "MozTransform" in style ? "-moz-"
                        : "msTransform" in style ? "-ms-"
                        : "OTransform" in style ? "-o-"
                        : "") + "transform";

            var hexbin = d3.hexbin()
                .radius(radius);

            if(!("ontouchstart" in document)) d3.select("#featured-photos")
                .on("mousemove", mousemoved);

            var deep = d3.select("#featured-photos-deep");

            var canvas = deep.append("canvas")
                .attr("height", height);

            var context = canvas.node().getContext("2d");

            var svg = deep.append("svg")
                .attr("height", height);

            var mesh = svg.append("path")
                .attr("class", "photo-mesh");

            var anchor = svg.append("g")
                .attr("class", "photo-anchor")
                .selectAll("a");

            var graphic = deep.selectAll("svg,canvas");

            var image = new Image;
            //image.src = "/assets/images/featured.jpg";
            image.src = "/api/upload/" + $scope.featuredSection.fileId;
            image.onload = resized;

            d3.select(window)
                .on("resize", resized)
                .each(resized);

            function drawImage(d) {
                context.save();
                context.beginPath();
                context.moveTo(0, -radius);

                for(var i = 1; i < 6; ++i) {
                    var angle = i * Math.PI / 3,
                        x = Math.sin(angle) * radius,
                        y = -Math.cos(angle) * radius;
                    context.lineTo(x, y);
                }

                context.clip();
                context.drawImage(image,
                    imageWidth * d.i, imageHeight * d.j,
                    imageWidth, imageHeight,
                    -imageWidth / 2, -imageHeight / 2,
                    imageWidth, imageHeight);
                context.restore();
            }

            function resized() {
                var deepWidth = innerWidth * (depth + 1) / depth,
                    deepHeight = height * (depth + 1) / depth,
                    centers = hexbin.size([deepWidth, deepHeight]).centers();

                desiredFocus = [innerWidth / 2, height / 2];
                moved();

                graphic
                    .style("left", Math.round((innerWidth - deepWidth) / 2) + "px")
                    .style("top", Math.round((height - deepHeight) / 2) + "px")
                    .attr("width", deepWidth)
                    .attr("height", deepHeight);

                centers.forEach(function(center, i) {
                    center.j = Math.round(center[1] / (radius * 1.5));
                    center.i = Math.round((center[0] - (center.j & 1) * radius * Math.sin(Math.PI / 3)) / (radius * 2 * Math.sin(Math.PI / 3)));
                    context.save();
                    context.translate(Math.round(center[0]), Math.round(center[1]));
                    drawImage(center.photo = data[(center.i % 10) + ((center.j + (center.i / 10 & 1) * 5) % 10) * 10]);
                    context.restore();
                });

                mesh.attr("d", hexbin.mesh);

                anchor = anchor.data(centers, function(d) {
                    return d.i + "," + d.j;
                });

                anchor.exit().remove();

                anchor.enter().append("a")
                    .attr("xlink:href", function(d) {
                        return d.photo.link;
                    })
                    .attr("xlink:title", function(d) {
                        return d.photo.name;
                    })
                    .append("path")
                    .attr("d", hexbin.hexagon());

                anchor
                    .attr("transform", function(d) {
                        return "translate(" + d + ")";
                    });
            }

            function mousemoved() {
                var m = d3.mouse(this);

                desiredFocus = [
                    Math.round((m[0] - innerWidth / 2) / depth) * depth + innerWidth / 2,
                    Math.round((m[1] - height / 2) / depth) * depth + height / 2
                ];

                moved();
            }

            function moved() {
                if(idle) d3.timer(function() {
                    if(idle = Math.abs(desiredFocus[0] - currentFocus[0]) < .5 && Math.abs(desiredFocus[1] - currentFocus[1]) < .5)
                        currentFocus = desiredFocus;
                    else {
                        currentFocus[0] += (desiredFocus[0] - currentFocus[0]) * .14;
                        currentFocus[1] += (desiredFocus[1] - currentFocus[1]) * .14;
                    }
                    deep.style(transform, "translate(" + (innerWidth / 2 - currentFocus[0]) / depth + "px," + (height / 2 - currentFocus[1]) / depth + "px)");
                    return idle;
                });
            }
        }
    });
