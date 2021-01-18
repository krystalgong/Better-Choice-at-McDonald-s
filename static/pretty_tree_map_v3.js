let width = '800';
let height = '800';
let bold = true;
let black = true;
let shadow = true;
let multicolor = true;
let hexcolor = "#0099cc";

function draw_graph(category,index,criteria,sort1,sort2){
    // loading the data and convert into numbers
    d3.csv('menu.csv').then(function(data){
        data.forEach(d => {
            d.Category = d.Category;
            d.Item = d.Item;
            d.Serving_Size = d.Serving_Size;
            d.Calories = +Number(d.Calories);
            d.Fat = +Number(d.Fat);
            d.Sodium = +Number(d.Sodium);
            d.Sugars = +Number(d.Sugars);
            d.Protein = +Number(d.Protein);
            d.Carbohydrates = +Number(d.Carbohydrates);
            });
        // console.log(data)

        // default values
        var criteriaStandard = {'Calories':368, 
                        'Fat':30, 
                        'Sodium':495, 
                        'Sugars':30, 
                        'Protein':13, 
                        'Carbohydrates':47};
       
        data = data.filter(function(obj){return obj.Category == category;});

        console.log('In the function: ',criteria)
        // map data for bar chart
        if (sort1 == true) {
            if (index == 'Calories') {
                data = data.sort(function(a,b) {
                    return d3.descending(a.Calories, b.Calories)
                });
                var Index = data.map(d => d.Calories)
            } else if (index == 'Fat') {
                data = data.sort(function(a,b) {
                    return d3.descending(a.Fat, b.Fat)
                });
                var Index = data.map(d => d.Fat)
            } else if (index == 'Sodium') {
                data = data.sort(function(a,b) {
                    return d3.descending(a.Sodium, b.Sodium)
                });
                var Index = data.map(d => d.Sodium)
            } else if (index == 'Sugars') {
                data = data.sort(function(a,b) {
                    return d3.descending(a.Sugars, b.Sugars)
                });
                var Index = data.map(d => d.Sugars)
            } else if (index == 'Protein') {
                data = data.sort(function(a,b) {
                    return d3.descending(a.Protein, b.Protein)
                });
                var Index = data.map(d => d.Protein)
            } else {
                data = data.sort(function(a,b) {
                    return d3.descending(a.Carbohydrates, b.Carbohydrates)
                });
                var Index = data.map(d => d.Carbohydrates)
            };
        } else if (sort2 == true) {
            if (index == 'Calories') {
                data = data.sort(function(a,b) {
                    return d3.ascending(a.Calories, b.Calories)
                });
                var Index = data.map(d => d.Calories)
            } else if (index == 'Fat') {
                data = data.sort(function(a,b) {
                    return d3.ascending(a.Fat, b.Fat)
                });
                var Index = data.map(d => d.Fat)
            } else if (index == 'Sodium') {
                data = data.sort(function(a,b) {
                    return d3.ascending(a.Sodium, b.Sodium)
                });
                var Index = data.map(d => d.Sodium)
            } else if (index == 'Sugars') {
                data = data.sort(function(a,b) {
                    return d3.ascending(a.Sugars, b.Sugars)
                });
                var Index = data.map(d => d.Sugars)
            } else if (index == 'Protein') {
                data = data.sort(function(a,b) {
                    return d3.ascending(a.Protein, b.Protein)
                });
                var Index = data.map(d => d.Protein)
            } else {
                data = data.sort(function(a,b) {
                    return d3.ascending(a.Carbohydrates, b.Carbohydrates)
                });
                var Index = data.map(d => d.Carbohydrates)
            };
        } else {
            if (index == 'Calories') {
                var Index = data.map(d => d.Calories)
            } else if (index == 'Fat') {
                var Index = data.map(d => d.Fat)
            } else if (index == 'Sodium') {
                var Index = data.map(d => d.Sodium)
            } else if (index == 'Sugars') {
                var Index = data.map(d => d.Sugars)
            } else if (index == 'Protein') {
                var Index = data.map(d => d.Protein)
            } else {
                var Index = data.map(d => d.Carbohydrates)
            };
        }
        
        var IndexCriteria = parseInt(criteria[index])
        if (IndexCriteria) {
            
        } else {
            var IndexCriteria = criteriaStandard[index]
        }

        var Item = data.map(d => d.Item);

        var DATA = binning(Item, Index, IndexCriteria)
        var databins = DATA[0]
        var left = DATA[1]
        var right = DATA[2]

        function binning(Item, Index, IndexCriteria){
            let bins = [];
            let L = 0;
            let R = 0;
            let Z = 0;
            var left = false;
            var right = false;
            for (let i = 0; i < Index.length; i++){
                if (Index[i] > IndexCriteria) {
                    L = L + 1
                    bins.push({
                        drawItem: Item[i],
                        drawL: Index[i] - IndexCriteria,
                        drawR: 0,
                        drawLandR: Index[i] - IndexCriteria,
                        zero: false
                    });
                } else if (Index[i] < IndexCriteria) {
                    R = R + 1
                    bins.push({
                        drawItem: Item[i],
                        drawL: 0,
                        drawR: IndexCriteria - Index[i],
                        drawLandR: IndexCriteria - Index[i],
                        zero: false
                    });
                } else {
                    Z = Z + 1
                    bins.push({
                        drawItem: Item[i],
                        drawL: 0,
                        drawR: 0,
                        drawLandR: 0,
                        zero: true
                    });
                }
            }
            if ((Index.length-L-Z) == 0) {
                left = false
                right = true
            } else if ((Index.length-R-Z) == 0) {
                left = true
                right = false
            } else {
                left = false
                right = false
            }
            return [bins,left, right];
        }

        // Two Horizontal Bar Chart
        var height = 500;
        var width = 250;
        var middle = 125;

        let xScaleL = d3.scaleLinear()
                .range([0, width])
                .domain([0,d3.max(databins, function (d) {
                        return d.drawLandR;
                    })].reverse())
                .nice();
        
        
        let xScaleR = d3.scaleLinear()
                .range([0, width])
                .domain([0,d3.max(databins, function (d) {
                    return d.drawLandR;
                })])
                .nice();

        let yScale = d3.scaleBand()
                .range([20,height])
                .domain(Item);
        
        let xAxisL = d3.axisTop(xScaleL);
        let xAxisR = d3.axisTop(xScaleR);
        let yAxis = d3.axisLeft(yScale).ticks();

        var svg = d3.select('#wholebarchart');
        let g = svg.append("g")
                .attr("transform", "translate(" + 10 + "," + 0 + ")")
                .attr('class', 'chart')
                .attr('width', width+240)
                .attr('height', height+20);

        g.append('g')
        .attr("transform", "translate(" + 0 + "," + 20 + ")")
        .attr('class', 'x-axis')
        .call(xAxisL);

        g.append('g')
        .attr("transform", "translate(" + 250 + "," + 20 + ")")
        .attr('class', 'x-axis')
        .call(xAxisR);

        // g.append('g')
        // .attr("transform", "translate(" + 250 + "," + 20 + ")")
        // .attr('class', 'y-axis')
        // .call(yAxis);

        // create tooltip
        var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
        
        zeroOnly = databins.filter(function(obj){return obj.zero == true})

        if (zeroOnly) {
            g.append("text")
            .data(zeroOnly)
            .attr('id','exactText1')
            .attr("x", 520)
            .attr("y", 40)
            .text('Item with exact '+IndexCriteria+' units of '+index+': ')     

            g.append("text")
                .data(zeroOnly)
                .attr('id','exactText2')
                .attr("x", 520)
                .attr("y", 70)
                .text(function(d){return d.drawItem})
        }
        
        // console.log('Where is my graph???')
        g.selectAll('rect.left')
            .data(databins)
            .enter().append('rect')
            .attr('class', "left")
            .attr('id', d => d.drawItem)
            .attr('x', function (d) {
                //console.log('x',width - xScaleL(d.drawL));
                return (xScaleL(d.drawL));})
            .attr('y', d => yScale(d.drawItem)) //  yPosByIndex
            .attr('width', function (d) {
                //console.log('width',xScaleL(d.drawL));
                return width-xScaleL(d.drawL);})
            .attr('height', d => {
                //console.log('height',yScale.bandwidth());
                return yScale.bandwidth();}) // height - yScale(d.Item)
            .style('fill','red')
            .style('stroke','black')
            .style('stroke-width',2)
            .on("mouseover",function(event,d){
                d3.select(this)
                    .transition()
                    .style("fill",'darkred')
                div.transition()
                    .style('opacity',.9)
                div.html(d.drawItem+"<br/>"+index+': '+(d.drawL+IndexCriteria)+"<br/>"+'Difference with standard: '+d.drawL)
                    .style("left", (event.pageX-240) + "px")
                    .style("top", (event.pageY-28) + "px");
                var judge1 = this.id;
                d3.selectAll(".treecircle")
                    .filter(function(f){return f['id'] == judge1;})
                    .attr("stroke", "#000")
                    .attr('fill','steelblue');
                })
            .on("mouseout",function(d){
                d3.select(this)
                    .transition()
                    .style("fill","red")
                div.transition()
                    .duration(200)
                    .style("opacity", 0)
                var judge2 = this.id;
                d3.selectAll(".treecircle")
                    .filter(function(f){return f['id'] == judge2;})
                    .attr("stroke", null)
                    .attr('fill','white');
                })

        g.selectAll('rect.right')
            .data(databins)
            .enter().append('rect')
            .attr('class', "right")
            .attr('id', d => d.drawItem)
            .attr('x', 250)
            .attr('y', d => yScale(d.drawItem)) //  yPosByIndex
            .attr('width', function (d) {
                //console.log('width',xScaleL(d.drawL));
                return xScaleR(d.drawR);})
            .attr('height', d => {
                //console.log('height',yScale.bandwidth());
                return yScale.bandwidth();}) // height - yScale(d.Item)
            .style('fill','green')
            .style('stroke','black')
            .style('stroke-width',2)
            .on("mouseover",function(event,d){
                d3.select(this)
                    .transition()
                    .style("fill",'darkgreen');
                div.transition()
                    .style('opacity',.9);
                div.html(d.drawItem+"<br/>"+index+': '+(IndexCriteria-d.drawR)+"<br/>"+'Difference with standard: '+d.drawR)
                    .style("left", (event.pageX+40) + "px")
                    .style("top", (event.pageY-28) + "px");
                var judge1 = this.id;
                    d3.selectAll(".treecircle")
                        .filter(function(f){return f['id'] == judge1;})
                        .transition()
                        .duration(100)
                        .attr("stroke", "#000")
                        .attr('fill','steelblue');
                })
            .on("mouseout",function(d){
                d3.select(this)
                    .transition()
                    .style("fill","green");
                div.transition()
                    .duration(200)
                    .style("opacity", 0);
                var judge2 = this.id;
                    d3.selectAll(".treecircle")
                        .filter(function(f){return f['id'] == judge2;})
                        .transition()
                        .duration(100)
                        .attr("stroke", null)
                        .attr('fill','white');
                })
        if (left) {
            g.selectAll('rect.left').remove()
            g.selectAll('.x-axis').remove()
            g.append('g')
                .attr("transform", "translate(" + 250 + "," + 20 + ")")
                .attr('class', 'x-axis')
                .call(xAxisR);
        } else if (right) {
            g.selectAll('rect.right').remove()
            g.selectAll('.x-axis').remove()
            g.append('g')
                .attr("transform", "translate(" + 0 + "," + 20 + ")")
                .attr('class', 'x-axis')
                .call(xAxisL);
        }
    });
}

var allGroup = ['Calories', 'Fat', 'Sodium', 'Sugars', 'Protein', 'Carbohydrates']
d3.select("#selectButton")
    .selectAll('myOptions')
    .data(allGroup)
    .enter()
    .append('option')
    .text(function (d) {return d;}) // text showed in the menu
    .attr("value", function (d) {return d;}) // corresponding value returned by the button


var sort1 = false
var sort2 = false
var selectedIndex = 'Calories'
var click1 = d3.select("#switch1");
var click2 = d3.select("#switch2"); 
var criteria = {"Calories":NaN, "Fat":NaN, "Sodium":NaN, "Sugars":NaN, "Protein":NaN, "Carbohydrates":NaN};
var category = ''


d3.select("#selectButton").on("change", function(d) {
    selectedIndex = d3.select(this).property("value")
    d3.select('#exactText1').remove()
    d3.select('#exactText2').remove()
    d3.selectAll('.x-axis').remove()
    d3.selectAll('rect.left').remove()
    d3.selectAll('rect.right').remove()
    draw_graph(category, selectedIndex, criteria, sort1, sort2)
})

click1.on("click", barSort1)
function barSort1(event){
    d3.select('#exactText1').remove()
    d3.select('#exactText2').remove()
    d3.selectAll('.x-axis').remove()
    d3.selectAll('rect.left').remove()
    d3.selectAll('rect.right').remove()
    if (click1.property("checked")){
        sort1 = true
        sort2 = false
        draw_graph(category, selectedIndex, criteria, sort1, sort2)
    } else {
        sort1 = false
        sort2 = false
        draw_graph(category, selectedIndex, criteria, sort1, sort2);
    }
}

click2.on("click", barSort2)
function barSort2(event){
    d3.select('#exactText1').remove()
    d3.select('#exactText2').remove()
    d3.selectAll('.x-axis').remove()
    d3.selectAll('rect.left').remove()
    d3.selectAll('rect.right').remove()
    if (click2.property("checked")){
        sort1 = false
        sort2 = true
        draw_graph(category, selectedIndex, criteria, sort1, sort2)
    } else {
        sort1 = false
        sort2 = false
        draw_graph(category, selectedIndex, criteria, sort1, sort2);
    }
}

d3.select("#Calories").on("change", function(d){
    d3.select('#exactText1').remove()
    d3.select('#exactText2').remove()
    d3.selectAll('.x-axis').remove()
    d3.selectAll('rect.left').remove()
    d3.selectAll('rect.right').remove()
    criteria["Calories"] = parseInt(document.getElementById("Calories").value)
    draw_graph(category, selectedIndex, criteria, sort1, sort2);
});
d3.select("#Fat").on("change", function(d){
    d3.select('#exactText1').remove()
    d3.select('#exactText2').remove()
    d3.selectAll('.x-axis').remove()
    d3.selectAll('rect.left').remove()
    d3.selectAll('rect.right').remove()
    criteria["Fat"] = parseInt(document.getElementById("Fat").value)
    draw_graph(category, selectedIndex, criteria, sort1, sort2);
});
d3.select("#Sodium").on("change", function(d){
    d3.select('#exactText1').remove()
    d3.select('#exactText2').remove()
    d3.selectAll('.x-axis').remove()
    d3.selectAll('rect.left').remove()
    d3.selectAll('rect.right').remove()
    criteria["Sodium"] = parseInt(document.getElementById("Sodium").value)
    draw_graph(category, selectedIndex, criteria, sort1, sort2);
});
d3.select("#Sugars").on("change", function(d){
    d3.select('#exactText1').remove()
    d3.select('#exactText2').remove()
    d3.selectAll('.x-axis').remove()
    d3.selectAll('rect.left').remove()
    d3.selectAll('rect.right').remove()
    criteria["Sugars"] = parseInt(document.getElementById("Sugars").value)
    draw_graph(category, selectedIndex, criteria, sort1, sort2);
});
d3.select("#Protein").on("change", function(d){
    d3.select('#exactText1').remove()
    d3.select('#exactText2').remove()
    d3.selectAll('.x-axis').remove()
    d3.selectAll('rect.left').remove()
    d3.selectAll('rect.right').remove()
    criteria["Protein"] = parseInt(document.getElementById("Protein").value)
    draw_graph(category, selectedIndex, criteria, sort1, sort2);
});
d3.select("#Carbohydrates").on("change", function(d){
    d3.select('#exactText1').remove()
    d3.select('#exactText2').remove()
    d3.selectAll('.x-axis').remove()
    d3.selectAll('rect.left').remove()
    d3.selectAll('rect.right').remove()
    criteria["Carbohydrates"] = parseInt(document.getElementById("Carbohydrates").value)
    draw_graph(category, selectedIndex, criteria, sort1, sort2);
});
// console.log('Out of function:',criteria)

function load(name) {
    let xhr = new XMLHttpRequest(),
        okStatus = document.location.protocol === "file:" ? 0 : 200;
    xhr.open('GET', name, false);
    xhr.overrideMimeType("text/html;charset=utf-8");//默认为utf-8
    xhr.send(null);
    return xhr.status === okStatus ? xhr.responseText : null;
}
let text = load("ForTreeMap_full_name.txt");
// console.log(text);

var table = d3.csvParse(text);
// console.log(table);
var data = d3.stratify()
            .id(function(d) { return d.name; })
            .parentId(function(d) { return d.parent; })
            (table);
data.sum(function(d) { if (d.value != '0'){return d.value;} })
    .sort((a, b) => b.value - a.value);
console.log(data);

const pack = d3.pack()
    .size([width, height])
    .padding(4);
        
// let color = d3.scaleLinear()
//     .domain([0, 5])
//     .range(["hsl(270,100%,90%)", "hsl(250,20%,45%)"])
//     .interpolate(d3.interpolateHcl);

const root = pack(data);
console.log(root);
let focus = root;
let view;

let fontsize = d3.scaleOrdinal()
    .domain([1,3])
    .range([24,16])
  
function setColorScheme(multi){
if (multi) {
    let color = d3.scaleOrdinal()
    .range(d3.schemeCategory10)
    return color;
}
}

let color = setColorScheme(multicolor);

function setCircleColor(obj) {
let depth = obj.depth;
if (!obj.children){
    return 'white';
}else{
while (obj.depth > 1) {
    obj = obj.parent;
}
let newcolor = multicolor ? d3.hsl(color(obj.data.name)) : d3.hsl(hexcolor);
newcolor.l += depth == 1 ? 0 : depth * .1;
return newcolor;
}}

function setStrokeColor(obj) {
let depth = obj.depth;
while (obj.depth > 1) {
    obj = obj.parent;
}
let strokecolor = multicolor ? d3.hsl(color(obj.data.name)) : d3.hsl(hexcolor);
return strokecolor;
}

let Bigcategory = ['Breakfast','Beef & Pork','Chicken & Fish','Salads','Snacks & Sides','Desserts','Beverages','Coffee & Tea','Smoothies & Shakes'];

const treesvg = d3.select("#treemap")
    .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
    .style("display", "block")
    .style("margin", "0 -14px")
    .style("background", 'white')
    .style("cursor", "pointer")
    .on("click", function(event) {
        d3.select('#exactText1').remove();
        d3.select('#exactText2').remove();
        d3.selectAll('.x-axis').remove();
        d3.selectAll('rect.left').remove();
        d3.selectAll('rect.right').remove();
        zoom(event, root);
    });

const node = treesvg.append("g")
    .selectAll("circle")
    .data(root.descendants().slice(1))
    .join("circle")
    .attr('class','treecircle')
    .attr("id", function(d){return (d.id);})
    .attr("fill", setCircleColor)
    .attr("stroke", setStrokeColor)
    //.attr("fill", d => d.children ? color(d.depth) : "white")
    //.attr("pointer-events", d => !d.children ? "None" : null)
    .on("mouseover", function(d) { 
        d3.select(this).attr("stroke", d => d.depth == 1 ? "black" : "white");
        var judge1 = this.id;
        //console.log(this.fill);
        d3.selectAll("rect.left")
            .filter(function(f){return f['drawItem'] == judge1;})
            .style('fill','steelblue');
        d3.selectAll("rect.right")
            .filter(function(f){return f['drawItem'] == judge1;})
            .style('fill','steelblue');
    })
    .on("mouseout", function() { 
        d3.select(this).attr("stroke", setStrokeColor);
        var judge2 = this.id;
        d3.selectAll("rect.left")
            .filter(function(f){return f['drawItem'] == judge2;})
            .style('fill','red');
        d3.selectAll("rect.right")
            .filter(function(f){return f['drawItem'] == judge2;})
            .style('fill','green'); })
    .on("click", function(event, d) {
        if (Bigcategory.includes(d.id)){
            category = d.id
            d3.select('#exactText1').remove();
            d3.select('#exactText2').remove();
            d3.selectAll('.x-axis').remove();
            d3.selectAll('rect.left').remove();
            d3.selectAll('rect.right').remove();
            draw_graph(category, selectedIndex, criteria, sort1, sort2);
        };
        focus !== d && d.children && (zoom(event, d), event.stopPropagation());
        });

const label = treesvg.append("g")
    .style("fill", function() {
        return black ? "black" : "white";
    })
    .style("text-shadow", function(){
        if (shadow) {
        return black ? "8px 2px 8px white" : "8px 2px 8px black";
        } else {
        return "none";
        }
    })
    //.style("font", "10px sans-serif")
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .selectAll("text")
    .data(root.descendants())
    .join("text")
    //.style('font','times')
    .style("fill-opacity", d => d.parent === root ? 1 : 0)
    .style("display", d => d.parent === root ? "inline" : "none")
    .style("font", d => fontsize(d.depth)/1.5 + "px sans-serif")
    .style("font-weight", function() {
        return bold ? "bold" : "normal";
      })
    .text(d => d.data.name);

zoomTo([root.x, root.y, root.r * 2]);

function zoomTo(v) {
const k = width / v[2];

view = v;

label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
node.attr("r", d => d.r * k);
}

function zoom(event, d) {
const focus0 = focus;

focus = d;

const transition = treesvg.transition()
    .duration(event.altKey ? 7500 : 750)
    .tween("zoom", d => {
        const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
        return t => zoomTo(i(t));
    });
label
    .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
    .transition(transition)
        .style("fill-opacity", d => d.parent === focus ? 1 : 0)
        .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
        .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });


// node
// .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
// .transition(transition)
//     .style("fill-opacity", d => d.parent === focus ? 1 : 0)
//     .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
//     .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
}