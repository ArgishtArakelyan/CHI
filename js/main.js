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





am4core.useTheme(am4themes_animated);

var chart = am4core.create("chartdiv", am4charts.XYChart);

var valueAxisX = chart.xAxes.push(new am4charts.ValueAxis());
valueAxisX.renderer.ticks.template.disabled = true;
valueAxisX.renderer.axisFills.template.disabled = true;

var valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
valueAxisY.renderer.ticks.template.disabled = true;
valueAxisY.renderer.axisFills.template.disabled = true;

var series = chart.series.push(new am4charts.LineSeries());
series.dataFields.valueX = "x";
series.dataFields.valueY = "y";
series.dataFields.value = "value";
series.dataFields.hidden = "hidden";
series.strokeOpacity = 0;
series.sequencedInterpolation = true;
series.tooltip.pointerOrientation = "vertical";

var bullet = series.bullets.push(new am4charts.CircleBullet());
bullet.fill = am4core.color("#ff0000");
bullet.propertyFields.fill = "color";
bullet.strokeOpacity = 0;
bullet.strokeWidth = 2;
bullet.fillOpacity = 0.5;

bullet.stroke = am4core.color("#ffffff");
bullet.hiddenState.properties.opacity = 0;
bullet.tooltipHTML = '<div class="toolTip"> <a href="google.com">{title}</a> <br> Biofield Modality: {value.value} <br> Number of Subjects: {valueX.value} <br> Population:{valueY.value} <br> Outcome Measures:{valueY.value}</div>';

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
  outline.radius = target.circle.pixelRadius + 2;
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

series.heatRules.push({ target: bullet.circle, min: 2, max: 60, property: "radius" });

bullet.circle.adapter.add("tooltipY", function (tooltipY, target) {
  return -target.radius;
})

chart.cursor = new am4charts.XYCursor();
chart.cursor.behavior = "zoomXY";

chart.scrollbarX = new am4core.Scrollbar();
chart.scrollbarY = new am4core.Scrollbar();




chart.data = [
    {

        "category": "category1",
        "title": "Person to Person (contact)",
        "color": "#0D4D8E",
        "x": 100,
        "y": 20,
        "value": 33397058
    },
    {
        "category": "category2",
        "title": "Person to person (non-contact proximal)",
        "color": "#F8C847",
        "x": 200,
        "y": 20,
        "value": 33397058
    },
    {
        "category": "category2",
        "title": "Person to person (non-contact proximal)",
        "color": "#F8C847",
        "x": 230,
        "y": 18,
        "value": 33397058
    },
    {
        "category": "category2",
        "title": "Person to person (non-contact proximal)",
        "color": "#F8C847",
        "x": 250,
        "y": 12,
        "value": 33397058
    },
    {
        "category": "category3",
        "title": "Person to Person (non-contact distant)",
        "color": "#e44c43",
        "x": 300,
        "y": 20,
        "value": 33397058
    },
    {
        "category": "category4",
        "title": "Self-Healing",
        "color": "#60b46a",
        "x": 400,
        "y": 20,
        "value": 33397058
    },
    {
        "category": "category4",
        "title": "Self-Healing",
        "color": "#60b46a",
        "x": 320,
        "y": 13,
        "value": 33397058
    },
    {
        "category": "category5",
        "title": "rootCat5",
        "color": "#3db3d8",
        "x": 500,
        "y": 20,
        "value": 33397058
    },
    {
        "category": "category5",
        "title": "rootCat5",
        "color": "#3db3d8",
        "x": 420,
        "y": 19,
        "value": 33397058
    },
    {
        "category": "category5",
        "title": "rootCat5",
        "color": "#3db3d8",
        "x": 550,
        "y": 20,
        "value": 33397058
    },
    {
        "category": "category5",
        "title": "rootCat5",
        "color": "#3db3d8",
        "x": 180,
        "y": 11,
        "value": 33397058
    }
];


 
let exist = [];
let newArray = [];

chart.legend = new am4charts.Legend();

chart.data.forEach(function (el) {
   if (!inArray(el.category, exist)) {
        exist.push(el.category);
        newArray.push(el);
    } 
});

chart.legend.data = newArray.map(i => ({
    category: i.category,
    name: i.title, 
    fill: i.color,
    visible: !i.hidden
}));


chart.legend.itemContainers.template.events.on("up", (event) => {
  const category = event.target.dataItem.dataContext.category;

    chart.data.forEach(function (el) {
        if(el.category === category){
            el.hidden = !event.target.isActive;
        }
    });

  // chart.data.find(i => i.category === category).hidden = !event.target.isActive;
  chart.validateData();
});


function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}






 