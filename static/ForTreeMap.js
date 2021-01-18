let width = '800';
let height = '800';

function load(name) {
    let xhr = new XMLHttpRequest(),
        okStatus = document.location.protocol === "file:" ? 0 : 200;
    xhr.open('GET', name, false);
    xhr.overrideMimeType("text/html;charset=utf-8");//默认为utf-8
    xhr.send(null);
    return xhr.status === okStatus ? xhr.responseText : null;
}
let text = load("./ForTreeMap_full_name.txt");
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
    .padding(3);
        
let color = d3.scaleLinear()
    .domain([0, 5])
    .range(["hsl(270,100%,90%)", "hsl(250,20%,45%)"])
    .interpolate(d3.interpolateHcl);

const root = pack(data);
console.log(root);
let focus = root;
let view;

let category = ['Breakfast','Beef & Pork','Chicken & Fish','Salads','Snacks & Sides','Desserts','Beverages','Coffee & Tea','Smoothies & Shakes'];

const treesvg = d3.select("#treemap")
    .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
    .style("display", "block")
    .style("margin", "0 -14px")
    .style("background", 'white')
    .style("cursor", "pointer")
    .on("click", (event) => zoom(event, root));

const node = treesvg.append("g")
    .selectAll("circle")
    .data(root.descendants().slice(1))
    .join("circle")
    .attr('class','treecircle')
    .attr("id", function(d){return (d.id);})
    .attr("fill", d => d.children ? color(d.depth) : "white")
    //.attr("pointer-events", d => !d.children ? "None" : null)
    .on("mouseover", function(d) { 
        d3.select(this).attr("stroke", "#000");
        var judge1 = this.id;
        d3.selectAll("rect.left")
            .filter(function(f){return f['drawItem'] == judge1;})
            .style('fill','steelblue');
        d3.selectAll("rect.right")
            .filter(function(f){return f['drawItem'] == judge1;})
            .style('fill','steelblue');
    })
    .on("mouseout", function() { 
        d3.select(this).attr("stroke", null);
        var judge2 = this.id;
        d3.selectAll("rect.left")
            .filter(function(f){return f['drawItem'] == judge2;})
            .style('fill','red');
        d3.selectAll("rect.right")
            .filter(function(f){return f['drawItem'] == judge2;})
            .style('fill','green'); })
    .on("click", function(event, d) {
        focus !== d && d.children && (zoom(event, d), event.stopPropagation());   
        });


const label = treesvg.append("g")
    .style("font", "10px sans-serif")
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .selectAll("text")
    .data(root.descendants())
    .join("text")
    //.style('font','times')
    .style("fill-opacity", d => d.parent === root ? 1 : 0)
    .style("display", d => d.parent === root ? "inline" : "none")
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