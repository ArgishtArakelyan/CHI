$(document).ready(function() {
    $('body').css('padding-top', $('header').height());
});

$(window).resize(function() {
    $('body').css('padding-top', $('header').height());
});

$(window).scroll(function() {
    var scroll = $(window).scrollTop();

    if (scroll > 0) {
        $('header').addClass('bg-shap');
    }
    if (scroll < 5) {
        $('header').removeClass('bg-shap');
    }
});


$(document).on("click", ".search", function() {
    $('.search-wrap').addClass('search_bg');
});

$(document).on("click", ".search_close", function() {
    $('.search-wrap').removeClass('search_bg')
});

$(document).on("click", ".m-lines", function() {
    $(this).toggleClass('open');

    if ($(this).hasClass("open")) {
        $('.menu').addClass('open');
    } else {
        $('.menu').removeClass('open');
    }
});










if ($('#ampiechart1').length) {
    var chart = AmCharts.makeChart("ampiechart1", {
        "type": "pie",
        "labelRadius": -35,
        "labelText": "[[percents]]%",
        "dataProvider": [{
            "country": "Randomized Controlled Trial (parallel)",
            "litres": 40,
            "backgroundColor": "#fa8e7e"
        }, {
            "country": "Quasi Experimental",
            "litres": 10,
            "backgroundColor": "#12c9d4"
        }, {
            "country": "Observational Study",
            "litres": 22,
            "backgroundColor": "#ff5794"
        }, {
            "country": "Explanatory sequential mixed method design",
            "litres": 28,
            "backgroundColor": "#6772e6"
        }],
        "color": "#fff",
        "colorField": "backgroundColor",
        "valueField": "litres",
        "titleField": "country"
    });
}





function toggleStudies(value) {
    studyCheckBoxes = document.getElementsByName('Study');
    for (var i = 0; i < studyCheckBoxes.length; i++) {
        if (studyCheckBoxes[i].type == 'checkbox') {
            studyCheckBoxes[i].checked = value;
        }
    }
}

//add legend
function renderLegend() {
    //////////Legend Code Starts//////////////////        
    var legendHeight = 120;
    var legendWidth = 1024;
    var legendCircleBaseRadius = 16; // BEN-EDIT: changed to "Base" radius. Final radius will vary based on stroke width.
    var legendCirclePCORIStroke = 2; // BEN-EDIT: Added stroke width for PCORI trial circle.
    var legendSpacing = 20;
    var legendOffset = 200;
    var legendFontSize = 18;


    //to-do need to change the logic to be dynamic based on the above object
    // BEN-EDIT: updated vertical alignment parameters below to dynamic rational values.
    // Horizontal values are still hard-coded.
    var color = d3.scaleOrdinal()
        .domain(["RCT", "Controlled Trial", "Quasi Experimental", "Explanatory sequential mixed method design"])
        .range(["#FA8E7E", "#FF5492", "#00C3CF", "#6772E6"]);

    var legendXPosition = d3.scalePoint()
        .domain(["RCT", "Controlled Trial", "Quasi Experimental", "Explanatory sequential mixed method design"])
        .range([300, legendWidth - 150]);

    var legend = d3.select("#legend")
        .append("svg")
        // .attr("height", legendHeight)
        // .attr("width", legendWidth)
        .attr('viewBox', '0 0 ' + legendWidth + ' ' + legendHeight)
        .append("g")
        .attr('class', 'legend-group')
        .selectAll('.legend')
        .data(color.domain())
        .enter()
        .append("g")
        .attr('transform', function(d, i) {
            return "translate(" + legendXPosition(d) + ", " + legendHeight / 2 + ")"
        })
        .attr("class", "legendItem");


    legend.append("circle")
        .attr("r", legendCircleBaseRadius)
        .attr("class", "legendCircle")
        .style('fill', color)
        .attr('fill-opacity', 0.8)
        .on("mousemove", function(d) {
            d3.select(this)
                .attr('fill-opacity', 0.8)
                .style("cursor", "pointer");
            toggleStudies(0);

            if (d == "Controlled Trial")
                document.getElementById("CT").checked = 1;
            else
                document.getElementById(d).checked = 1;
            selectStudiesByLocation();
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .attr('fill-opacity', 1);
            toggleStudies(1);
            //document.getElementById(d).checked = 0;
            selectStudiesByLocation();
        });

    legend.append('text')
        .attr("x", 40)
        //.attr("y", 5)
        //.attr("dy", ".35em")
        .text(function(d, i) {
            if (d == "Controlled Trial") {
                return "Observational Study";
            } else if (d == "RCT") {
                return "Randomized Controlled Trial (parallel)";
            } else {
                return d
            }
        })

        // BEN-EDIT: The below may seem a bit tortured, but it offsets 'y' using visual pixel height by factoring the font's cap-height ratio. 
        // This should yield a vertically centered legend label (FOR THIS FONT) for any given point size.
        .attr('y', legendFontSize / 2.73)
        .style("font-size", legendFontSize + "px");

    //////////Legend Code Ends//////////////////
};

//Toggle the checkboxes based on select all flag
function toggleSelections(input) {
    countryCheckBoxes = document.getElementsByName('US/non-US/unknown');
    yearCheckBoxes = document.getElementsByName('Year');
    studyCheckBoxes = document.getElementsByName('Study');

    if (input.id == "SelectAll" || input.id == "AllCountries") {
        for (var i = 0; i < countryCheckBoxes.length; i++) {
            if (countryCheckBoxes[i].type == 'checkbox') {
                countryCheckBoxes[i].checked = input.checked;
            }
        }
    }
    if (input.id == "SelectAll" || input.id == "AllYears") {
        for (var i = 0; i < yearCheckBoxes.length; i++) {
            if (yearCheckBoxes[i].type == 'checkbox') {
                yearCheckBoxes[i].checked = input.checked;
            }
        }
    }

    if (input.id == "SelectAll" || input.id == "AllStudies") {
        for (var i = 0; i < studyCheckBoxes.length; i++) {
            if (studyCheckBoxes[i].type == 'checkbox') {
                studyCheckBoxes[i].checked = input.checked;
            }
        }
    }

    selectStudiesByLocation();
}

//Set the "select all flag accordingly"
function setSelectAll() {
    countryCheckBoxes = document.getElementsByName('US/non-US/unknown');
    yearCheckBoxes = document.getElementsByName('Year');
    studyCheckBoxes = document.getElementsByName('Study');

    var currentSelection = 1;

    // for (var i = 0; i < countryCheckBoxes.length; i++) {
    //     if (countryCheckBoxes[i].type == 'checkbox') {
    //         currentSelection = currentSelection && countryCheckBoxes[i].checked;
    //         if (!countryCheckBoxes[i].checked) {
    //             document.getElementById("AllCountries").checked = 0;
    //         }
    //     }
    // }
    // if (currentSelection) {
    //     document.getElementById("AllCountries").checked = currentSelection;
    // }

    var currentSelection = 1;
    // for (var i = 0; i < yearCheckBoxes.length; i++) {
    //     if (yearCheckBoxes[i].type == 'checkbox') {
    //         currentSelection = currentSelection && yearCheckBoxes[i].checked;
    //         if (!yearCheckBoxes[i].checked) {
    //             document.getElementById("AllYears").checked = 0;
    //         }
    //     }
    // }
    // if (currentSelection) {
    //     document.getElementById("AllYears").checked = currentSelection;
    // }

    var currentSelection = 1;
    // for (var i = 0; i < studyCheckBoxes.length; i++) {
    //     if (studyCheckBoxes[i].type == 'checkbox') {
    //         currentSelection = currentSelection && studyCheckBoxes[i].checked;
    //         if (!studyCheckBoxes[i].checked) {
    //             document.getElementById("AllStudies").checked = 0;
    //         }
    //     }
    // }
    // if (currentSelection) {
    //     document.getElementById("AllStudies").checked = currentSelection;
    // }

    //document.getElementById("SelectAll").checked = document.getElementById("AllCountries").checked && document.getElementById("AllYears").checked && document.getElementById("AllStudies").checked;
}

// function selectAllStudies() {
//     render(originalDataset.filter((function(d) { return d['Category of intervention'] !== "inactive"; })));
// };

function includeUsa() { return document.getElementById("USA").checked; }

function includeNonUsa() { return document.getElementById("NON-USA").checked; }

function includeUnknown() { return document.getElementById("UNKNOWN").checked; }

function include2016To17() { return document.getElementById("2016-17").checked; }

function include2011To15() { return document.getElementById("2011-15").checked; }

function include2006To10() { return document.getElementById("2006-10").checked; }

function include2001To05() { return document.getElementById("2001-05").checked; }

function include2000AndEarlier() { return document.getElementById("2000-Earlier").checked; }

function includeCaseseries() { return document.getElementById("Case series").checked; }

function includeCT() { return document.getElementById("CT").checked; }

function includeRCT() { return document.getElementById("RCT").checked; }

function includeRCTPacks() { return document.getElementById("Subcircles").checked; }

function excludeCaseseries() { document.getElementById("Case series").checked = false; }

function excludeCT() { document.getElementById("CT").checked = false; }

function selectStudiesByRCT() {
    if (!document.getElementById("RCT").checked)
        document.getElementById("Subcircles").checked = false;
    selectStudiesByLocation();
}

function selectStudiesByIntervention() {
    if (includeRCTPacks()) {
        excludeCaseseries()
        excludeCT()
    }
    selectStudiesByLocation()
}

function selectStudiesByLocation() {

    //set the select all flag 
    setSelectAll();

    // earlier test sets had these - I don't see them anymore but still excluding just in case
    var prunedDataSet = originalDataset.filter((function(d) { return d['Category of intervention'] !== "inactive"; }));

    var locationsToInclude = [];

    if (includeUsa()) locationsToInclude.push("US");
    if (includeNonUsa()) locationsToInclude.push("non-US");
    if (includeUnknown()) locationsToInclude.push("unknown");

    var yearsToInclude = [];

    if (include2016To17()) yearsToInclude.push(2016, 2017);
    if (include2011To15()) yearsToInclude.push(2011, 2012, 2013, 2013, 2014, 2015);
    if (include2006To10()) yearsToInclude.push(2006, 2007, 2008, 2009, 2010);
    if (include2001To05()) yearsToInclude.push(2001, 2002, 2003, 2004, 2005);
    if (include2000AndEarlier()) {
        // Arbitrarilly chose 1960 - not sure if that's as far back as we need go
        for (year = 1960; year <= 2000; year++) {
            yearsToInclude.push(year);
        }
    }

    var studiesToInclude = [];
    if (includeCaseseries()) studiesToInclude.push("Case series");
    if (includeCT()) studiesToInclude.push("CT");
    if (includeRCT()) studiesToInclude.push("RCT");

    var prunedDataSet =
        prunedDataSet.filter(function(d) {
            return (
                locationsToInclude.indexOf(d["US/non-US/unknown"]) != -1 && yearsToInclude.indexOf(d["Year"]) != -1 && studiesToInclude.indexOf(d["Study Design"]) != -1)
        });

    render(prunedDataSet);
};

var margin = { top: 100, right: 150, bottom: 20, left: 250 };
var width = 1000 - margin.left;
var height = 600 - margin.top - margin.bottom;
var heightExenstion = 80;

var svg = d3.select("#svg-container")
    .append("svg")
    .attr('viewBox', '0 0 800 600');

var g = svg.append("g")
    .attr("id", "graphelt")
    .attr("transform", "translate(30, 16)");

var yscale = d3.scaleLinear()
    .domain([0, 120])
    .range([height, 0]);

var yAxis = d3.axisLeft()
    .tickSize(-width)
    .ticks(5)
    .scale(yscale);

g.append("g")
    .attr("class", "y axis")
    .call(yAxis);

var treatmentCategories = ["Pharmacologic", "Exercise", "Behavioral/Education", "Complementary and alternative medicine", "Combination", "Other"];

var xScale = d3.scalePoint()
    .domain(treatmentCategories)
    .range([0, width])
    .padding(1);

var xAxis = d3.axisBottom()
    .scale(xScale)
    .tickSize(-height);



g.append("g")
    .attr("transform", "translate(0, " + height + ")")
    .call(xAxis)
    .selectAll("text")
    .attr("class", "x axis")
    .attr("y", function(d, i) {
        return (i % 2 == 0 ? 35 : 60);
    });
//.style("font", "16px bold");


g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -80)
    .attr("x", 0 - (height / 2))
    .attr("dy", "2em")
    .attr("class", "y axis")
    .style("text-anchor", "middle")
//.style("font", "16px bold")
//.text("Number of studies");


var studyDesignBubbleColors = {
    "Case series": "#ff5492",
    "CT": "#00c3cf",
    "RCT": "#fa8e7e"
}

// distance left or right to show bubble
var studyDesignBubbleOffset = {
    "Case series": -10,
    "CT": 0,
    "RCT": 10
}

function render(dataset) {

    var mapStudies = {};

    var totalPatients = 0;

    dataset.forEach(function(d) {
        var studyDesignPlusInterventionCategory = d["Study Design"] + " " + d["Category of intervention"];
        var skipStudy = d["Skip for study count"];
        var patientCount = (d["# of pts for map 1"] === "NR") ? 0 : d["# of pts for map 1"];

        if (mapStudies[studyDesignPlusInterventionCategory]) {
            mapStudies[studyDesignPlusInterventionCategory]["Number of patients"] += patientCount;
            if (skipStudy != 'y')
                mapStudies[studyDesignPlusInterventionCategory]["Studies"] += 1;
        } else {
            mapStudies[studyDesignPlusInterventionCategory] = {
                "Number of patients": patientCount,
                "Study Design": d["Study Design"],
                "Category of intervention": d["Category of intervention"],
                "Specific intervention": d["Specific intervention"],
                "US/non-US/unknown": d["US/non-US/unknown"],
                "Year": d["Year"],
                "Studies": skipStudy != 'y' ? 1 : 0
            };
        }
        if (!mapStudies[studyDesignPlusInterventionCategory].children) {
            mapStudies[studyDesignPlusInterventionCategory].children = []
        }
        if (d['Study Design'] === 'RCT') {
            var circleIndex = mapStudies[studyDesignPlusInterventionCategory].children.map(function(c) { return c.circleType }).indexOf(d['Intervention Circle']);

            if (circleIndex == -1) {
                mapStudies[studyDesignPlusInterventionCategory].children.push({
                    value: patientCount,
                    circleType: d['Intervention Circle']
                });
            } else {
                mapStudies[studyDesignPlusInterventionCategory].children[circleIndex].value += patientCount;
            }
        }

        totalPatients += patientCount;
    });

    //console.log(mapStudies);

    // now create an array of studies for d3 to use
    var studies = [];
    var nodeGroups = [];
    var hierarchicalGroups = [];
    for (var key in mapStudies) {
        mapStudies[key].value = mapStudies[key]['Number of patients'];
        var h = d3.hierarchy(mapStudies[key]);
        var p = d3.pack();
        var nodes = p(h).descendants();
        studies.push(mapStudies[key]);
        nodeGroups.push(nodes);
        hierarchicalGroups.push(h);
    }

    //console.group('RCT packs');
    //console.log(hierarchicalGroups);
    console.groupEnd();


    var allCircleElts = [];
    for (var i = 0; i < hierarchicalGroups.length; i++) {
        var elt = hierarchicalGroups[i];
        allCircleElts.push(elt);
        if (elt.children) {
            allCircleElts = allCircleElts.concat(elt.children)
        }
    }

    // var allData = {
    //   value: totalPatients,
    //   children: studies
    // }
    // allData = d3.hierarchy(allData);
    // var mapPack = d3.pack();
    // var mapNodes = mapPack(allData).descendants();

    // var circleData = mapNodes.filter(function (d) {
    //   return d.depth > 0;
    // })
    // console.log(studies);
    var tooltip = d3.select("body").append("div").attr("class", "toolTip");

    var showPacks = includeRCTPacks();

    var circles = g.selectAll(".bubble")
        .data(allCircleElts.filter(function(c) {
                if (!showPacks && c.depth > 0) {
                    return false;
                }
                return true;
            }),
            function(d) { return d["Study Design"] + " --- " + d["Category of intervention"]; });

    circles.exit().transition().attr("r", 0).remove();

    circles.enter()
        .append("circle")
        .attr("class", "bubble")
        .attr('fill-opacity', 0.8)
        .attr("r", 0)
        .attr("cx", function(d, i) {
            if (d.depth === 0) {
                return studyDesignBubbleOffset[d.data["Study Design"]] +
                    (treatmentCategories.indexOf(d.data["Category of intervention"]) + 1) * (width / (treatmentCategories.length + 1));
            } else {
                return 0;
            }
        })
        .attr("cy", function(d, i) {
            if (d.depth === 0) {
                return yscale(d.data["Studies"]);
            } else {
                return yscale(d.parent.data["Studies"]);
            }
        })
        .merge(circles)
        .attr("fill", function(d) {
            if (d.depth === 0) {
                return studyDesignBubbleColors[d.data["Study Design"]];
            } else {
                return '#607F8E'
            }
        })
        .on("mousemove", function(d) {
            if (d.depth === 0) {
                d3.select(this)
                    .attr('fill-opacity', 0.8)
                    .style("cursor", "pointer")

                tooltip
                    .style("opacity", 100)
                    .style("left", d3.event.pageX + 10 + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style("display", "inline-block")
                    .html("<span><h1>Study Design: " + d.data["Study Design"] + "</h1>" + "<br><b>Category of intervention:</b> " + d.data["Category of intervention"] + "<br><b>Number of patients:</b> " + d.data["Number of patients"] + "<br><b>Studies:</b> " + d.data["Studies"] + "</span><br>");
            } else {

                d3.select(this)
                    .attr('fill-opacity', 1)
                    .style("cursor", "pointer")

                tooltip
                    .style("opacity", 100)
                    .style("left", d3.event.pageX + 10 + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style("display", "inline-block")
                    .html("<span><b>Intervention : </b>" + d.data['circleType'] + "<br/><b>Number of patients:</b> " + d.data['value'] + "</span>")
            }
        })
        .on("mouseout", function(d, i) {
            d3.select(this).attr("fill", function(d) {
                if (d.depth === 0) {
                    return studyDesignBubbleColors[d.data["Study Design"]];
                } else {
                    return '#607F8E'
                }
            }).attr('fill-opacity', 0.8)

            return tooltip.style("display", "none");
        })
        .transition().attr("cx", function(d, i) {
            if (d.depth === 0) {
                return studyDesignBubbleOffset[d.data["Study Design"]] +
                    (treatmentCategories.indexOf(d.data["Category of intervention"]) + 1) * (width / (treatmentCategories.length + 1));
            } else {
                var parentX = studyDesignBubbleOffset[d.parent.data["Study Design"]] +
                    (treatmentCategories.indexOf(d.parent.data["Category of intervention"]) + 1) * (width / (treatmentCategories.length + 1));
                var parentRadius = Math.sqrt((d.parent.data["Number of patients"] * 10) / Math.PI);
                return (d.x - 0.5) * (parentRadius * 2) + parentX;
            }
        })
        .transition().attr("cy", function(d, i) {
            if (d.depth === 0) {
                return yscale(d.data["Studies"]);
            } else {
                var parentRadius = Math.sqrt((d.parent.data["Number of patients"] * 10) / Math.PI);
                return (d.y - 0.5) * (2 * parentRadius) + yscale(d.parent.data["Studies"]);
            }
        })
        .transition().attr("r", function(d, i) {
            //console.log(d["Number of patients"])
            if (d.depth === 0) {
                return Math.sqrt((d.data["Number of patients"] * 10) / Math.PI);
            } else {
                return Math.sqrt((d.parent.data["Number of patients"] * 10) / Math.PI) * 2 * d.r;
            }
        });
}
render(originalDataset.filter(function(d) { return d["Category of intervention"] !== "inactive"; }));
renderLegend();