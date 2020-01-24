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







// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end
 
var chart = am4core.create("chartdiv", am4charts.XYChart);

// X scroll
var valueAxisX = chart.xAxes.push(new am4charts.ValueAxis());
valueAxisX.renderer.ticks.template.disabled = true;
valueAxisX.renderer.axisFills.template.disabled = true;

// Y scroll
var valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
valueAxisY.renderer.ticks.template.disabled = true;
valueAxisY.renderer.axisFills.template.disabled = true;


// var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
// categoryAxis.dataFields.category = "category";
// categoryAxis.renderer.grid.template.location = 0;

var series = chart.series.push(new am4charts.LineSeries());
series.dataFields.valueX = "x";
series.dataFields.valueY = "y";
series.dataFields.value = "value";
series.dataFields.category = "category1";
series.strokeOpacity = 0;
series.sequencedInterpolation = true;
series.tooltip.pointerOrientation = "vertical";

var series2 = chart.series.push(new am4charts.LineSeries());
series2.dataFields.valueX = "x";
series2.dataFields.valueY = "y";
series2.dataFields.value = "value";
series2.dataFields.category = "category2";
series2.strokeOpacity = 0;
series2.sequencedInterpolation = true;
series2.tooltip.pointerOrientation = "vertical";

var bullet = series.bullets.push(new am4core.Circle());
bullet.fill = am4core.color("#ff0000");
bullet.propertyFields.fill = "color";
bullet.strokeOpacity = 0;
bullet.strokeWidth = 2;
bullet.fillOpacity = 0.5;
bullet.stroke = am4core.color("#ffffff");
bullet.hiddenState.properties.opacity = 0;
 
//bullet.tooltipText = "[bold]{title}[/]\nBiofield Modality: {value.value}\nNumber of Subjects: {valueX.value}\nPopulation:{valueY.value}\nOutcome Measures:{valueY.value}";
 
chart.legend = new am4charts.Legend();
chart.legend.useDefaultMarker = true;

var marker = chart.legend.markers.template.children.getIndex(0);
marker.cornerRadius(12, 12, 12, 12);
marker.strokeWidth = 2;
marker.strokeOpacity = 1;
marker.stroke = am4core.color("#ccc");


bullet.tooltipHTML = '<div class="toolTip"> <a href="google.com">{title}</a> <br> Biofield Modality: {value.value} <br> Number of Subjects: {valueX.value} <br> Population:{valueY.value} <br> Outcome Measures:{valueY.value}</div>';


series.tooltip.label.interactionsEnabled = true;

var outline = chart.plotContainer.createChild(am4core.Circle);
outline.fillOpacity = 0;
outline.strokeOpacity = 0.8;
outline.stroke = am4core.color("#ff0000");
outline.strokeWidth = 2;
outline.hide(0);

var blurFilter = new am4core.BlurFilter();
outline.filters.push(blurFilter);

bullet.events.on("over", function(event) {
    var target = event.target;
    chart.cursor.triggerMove({ x: target.pixelX, y: target.pixelY }, "hard");
    chart.cursor.lineX.y = target.pixelY;
    chart.cursor.lineY.x = target.pixelX - chart.plotContainer.pixelWidth;
    valueAxisX.tooltip.disabled = false;
    valueAxisY.tooltip.disabled = false;

series.tooltip.label.interactionsEnabled = true;
series.tooltip.keepTargetHover = true;

    outline.radius = target.pixelRadius + 2;
    outline.x = target.pixelX;
    outline.y = target.pixelY;
    outline.show();
})

bullet.events.on("out", function(event) {
    chart.cursor.triggerMove(event.pointer.point, "none");
    chart.cursor.lineX.y = 0;
    chart.cursor.lineY.x = 0;
    valueAxisX.tooltip.disabled = true;
    valueAxisY.tooltip.disabled = true;
    outline.hide();
})

var hoverState = bullet.states.create("hover");
hoverState.properties.fillOpacity = 1;
hoverState.properties.strokeOpacity = 1;

series.heatRules.push({ target: bullet, min: 2, max: 60, property: "radius" });

bullet.adapter.add("tooltipY", function (tooltipY, target) {
    return -target.radius;
})

chart.cursor = new am4charts.XYCursor();
chart.cursor.behavior = "zoomXY";
chart.cursor.snapToSeries = series;

 
chart.scrollbarX = new am4core.Scrollbar();
chart.scrollbarY = new am4core.Scrollbar();

chart.data = [
    {
        "category": "category1",
        "title": "Person to Person (contact)",
        "color": "#f6a093",
        "x": 100,
        "y": 20,
        "value": 33397058
    },
    {
        "category": "category2",
        "title": "Person to person (non-contact proximal)",
        "color": "#fa71a3",
        "x": 200,
        "y": 20,
        "value": 33397058
    },
    {
        "category": "category3",
        "title": "Person to Person (non-contact distant)",
        "color": "#2ecad4",
        "x": 300,
        "y": 20,
        "value": 33397058
    },
    {
        "category": "category4",
        "title": "Self-Healing",
        "color": "#8089e6",
        "x": 400,
        "y": 20,
        "value": 33397058
    },
    {
        "category": "category5",
        "title": "rootCat5",
        "color": "#fa2e2e",
        "x": 500,
        "y": 20,
        "value": 33397058
    },
    {
        "category": "category5",
        "title": "rootCat5",
        "color": "#fa2e2e",
        "x": 550,
        "y": 20,
        "value": 33397058
    }
];



 