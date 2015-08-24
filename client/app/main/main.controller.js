'use strict';

angular.module('aksiteApp')
    .controller('MainCtrl', function($scope) {
        var texts = ['dashed-stroke-text', 'gradient-text', 'pattern-text', 'diag-striped-text', 'bg-img-text'],
            usedTexts = [],
            currentText = _.sample(texts);  // Load first random text

        classie.removeClass( document.getElementById(currentText), 'hidden' );
        usedTexts.push(_.remove( texts, _.partial(_.isEqual, currentText) ));

        $scope.changeText = function() {
            // We've used all the styles; start over, using them all again
            if(texts.length == 0) {
                texts = usedTexts;
                usedTexts = [];
            }
            // Hide the previously used text
            classie.addClass( document.getElementById(currentText), 'hidden' );
            // Get the new text ID
            currentText = _.sample(texts);
            // Move the new text ID to the usedTexts array, so that it's not used again until we run out of styles
            usedTexts.push(_.remove( texts, _.partial(_.isEqual, currentText) ));
            // Show the new text
            classie.removeClass( document.getElementById(currentText), 'hidden' );
        };

        let vendorSection = document.getElementById('vendor-container');
        var masonry;
        imagesLoaded(vendorSection, function() {
            masonry = new Masonry(vendorSection, {
                transitionDuration: 0,
                itemSelector: ".brick",
                gutter: 20,
                containerStyle: {"margin": "auto"},
                isFitWidth: true
            });
        });

        $scope.loadFeatured = function() {
            var height = 460,
                imageWidth = 200,
                imageHeight = 200,
                radius = 100,
                depth = 4,
                currentFocus = [innerWidth / 2, height / 2],
                desiredFocus,
                idle = true,
                style = document.body.style,
                transform = ("webkitTransform" in style ? "-webkit-"
                        : "MozTransform" in style ? "-moz-"
                        : "msTransform" in style ? "-ms-"
                        : "OTransform" in style ? "-o-"
                        : "") + "transform",
                data = $scope.featuredSection.items;

            _.forEach(data, function(item, i) {
                item.i = i % 10;
                item.j = i / 10 | 0;
            });

            //Randomize the placement of the hexbins, changing every hour
            Math.seedrandom(+d3.time.hour(new Date));

            d3.shuffle(data);

            var hexbin = d3.hexbin()
                .radius(radius);

            if(!("ontouchstart" in document)) d3.select("#featured-photos")
                .on("mousemove", mousemoved);

            var deep = d3.select("#featured-photos-deep"),
                canvas = deep.append("canvas")
                    .attr("height", height),
                context = canvas.node().getContext("2d"),
                svg = deep.append("svg")
                    .attr("height", height),
                mesh = svg.append("path")
                    .attr("class", "photo-mesh"),
                anchor = svg.append("g")
                    .attr("class", "photo-anchor")
                    .selectAll("a"),
                graphic = deep.selectAll("svg,canvas");

            var image = new Image;
            image.src = "/api/upload/" + $scope.featuredSection.fileId + '.jpg';
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

                _.forEach(centers, function(center) {
                    center.j = Math.round(center[1] / (radius * 1.5));
                    center.i = Math.round((center[0] - (center.j & 1) * radius * Math.sin(Math.PI / 3)) / (radius * 2 * Math.sin(Math.PI / 3)));
                    context.save();
                    context.translate(Math.round(center[0]), Math.round(center[1]));
                    drawImage(center.photo = data[(center.i % 10) + ((center.j + (center.i / 10 & 1) * 5) % 10) * 10]);
                    context.restore();
                });

                mesh.attr("d", hexbin.mesh);

                anchor = anchor.data(centers, d => d.i + "," + d.j);

                anchor.exit().remove();

                anchor.enter()
                    .append("a")
                    .attr("xlink:href", d => d.photo.link)
                    .attr("xlink:title", d => d.photo.name)
                    .append("path")
                    .attr("d", hexbin.hexagon());

                anchor
                    .attr("transform", d => "translate(" + d + ")");
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
                if(idle) {
                    d3.timer(function() {
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
        }
    });
