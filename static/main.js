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
        // console.log(Item)
        // console.log(Index)
        // console.log(criteria)
        
        var IndexCriteria = parseInt(criteria[index])
        if (IndexCriteria) {
            
        } else {
            var IndexCriteria = criteriaStandard[index]
        }

        // console.log(IndexCriteria)
        var Item = data.map(d => d.Item);
        
        var databins = binning(Item, Index, IndexCriteria)

        function binning(Item, Index, IndexCriteria){
            let bins = [];
            for (let i = 0; i < Index.length; i++){
                if (Index[i] > IndexCriteria) {
                    bins.push({
                        drawItem: Item[i],
                        drawL: Index[i] - IndexCriteria,
                        drawR: 0,
                        zero: false
                    });
                } else if (Index[i] < IndexCriteria) {
                    bins.push({
                        drawItem: Item[i],
                        drawL: 0,
                        drawR: IndexCriteria - Index[i],
                        zero: false
                    });
                } else {
                    bins.push({
                        drawItem: Item[i],
                        drawL: 0,
                        drawR: 0,
                        zero: true
                    });
                }
            }
            return bins;
        }

        // Two Horizontal Bar Chart
        var height = 500;
        var width = 250;
        var middle = 125;

        let xScaleL = d3.scaleLinear()
                .range([0, width])
                .domain(d3.extent(databins, function (d) {
                        return d.drawL;
                    }).reverse())
                .nice();
        
        let xScaleR = d3.scaleLinear()
                .range([0, width])
                .domain(d3.extent(databins, function (d) {
                    return d.drawR;
                }))
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

        // create tooltip
        var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

        // console.log('log zero',databins['zero'])
        // g.append("text")
        //     .data(databins)
        //     .filter(function(d){return d['zero'] == true;})
        //     .attr("x", 10)
        //     .attr("y", 20)
        //     .text(function(d) {
        //         console.log('Items: ',d.drawItem)
        //         return d.drawItem+"<br/>"+index+': '+IndexCriteria; });

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
                div.html(d.drawItem+"<br/>"+index+': '+(d.drawL+IndexCriteria))
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
                div.html(d.drawItem+"<br/>"+index+': '+(IndexCriteria-d.drawR))
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
    });
}

    // chart.append("text").attr("x",width/3).attr("y", 10).attr("class","title").text("Infant Mortality");
    // chart.append("text").attr("x",width/3+rightOffset).attr("y", 10).attr("class","title").text("GDP");
    // chart.append("text").attr("x",width+labelArea/3).attr("y", 10).attr("class","title").text("Countries");


function drawBarGraph(category) {
    var allGroup = ['Calories', 'Fat', 'Sodium', 'Sugars', 'Protein', 'Carbohydrates']
    d3.select("#selectButton")
        .selectAll('myOptions')
        .data(allGroup)
        .enter()
        .append('option')
        .text(function (d) {return d;}) // text showed in the menu
        .attr("value", function (d) {return d;}) // corresponding value returned by the button

    //initialize
    var sort1 = false
    var sort2 = false
    var criteria = {"Calories":NaN, "Fat":NaN, "Sodium":NaN, "Sugars":NaN, "Protein":NaN, "Carbohydrates":NaN}
    var selectedIndex = 'Calories'
    var click1 = d3.select("#switch1");
    var click2 = d3.select("#switch2"); 

    d3.select("#selectButton").on("change", function(d) {
        selectedIndex = d3.select(this).property("value")
        d3.selectAll('.x-axis').remove()
        d3.selectAll('rect.left').remove()
        d3.selectAll('rect.right').remove()
        draw_graph(category, selectedIndex, criteria, sort1, sort2)
    })

    click1.on("click", barSort1)
    function barSort1(event){
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
        d3.selectAll('.x-axis').remove()
        d3.selectAll('rect.left').remove()
        d3.selectAll('rect.right').remove()
        criteria["Calories"] = parseInt(document.getElementById("Calories").value)
        draw_graph(category, selectedIndex, criteria, sort1, sort2);
    });
    d3.select("#Fat").on("change", function(d){
        d3.selectAll('.x-axis').remove()
        d3.selectAll('rect.left').remove()
        d3.selectAll('rect.right').remove()
        criteria["Fat"] = parseInt(document.getElementById("Fat").value)
        draw_graph(category, selectedIndex, criteria, sort1, sort2);
    });
    d3.select("#Sodium").on("change", function(d){
        d3.selectAll('.x-axis').remove()
        d3.selectAll('rect.left').remove()
        d3.selectAll('rect.right').remove()
        criteria["Sodium"] = parseInt(document.getElementById("Sodium").value)
        draw_graph(category, selectedIndex, criteria, sort1, sort2);
    });
    d3.select("#Sugars").on("change", function(d){
        d3.selectAll('.x-axis').remove()
        d3.selectAll('rect.left').remove()
        d3.selectAll('rect.right').remove()
        criteria["Sugars"] = parseInt(document.getElementById("Sugars").value)
        draw_graph(category, selectedIndex, criteria, sort1, sort2);
    });
    d3.select("#Protein").on("change", function(d){
        d3.selectAll('.x-axis').remove()
        d3.selectAll('rect.left').remove()
        d3.selectAll('rect.right').remove()
        criteria["Protein"] = parseInt(document.getElementById("Protein").value)
        draw_graph(category, selectedIndex, criteria, sort1, sort2);
    });
    d3.select("#Carbohydrates").on("change", function(d){
        d3.selectAll('.x-axis').remove()
        d3.selectAll('rect.left').remove()
        d3.selectAll('rect.right').remove()
        criteria["Carbohydrates"] = parseInt(document.getElementById("Carbohydrates").value)
        draw_graph(category, selectedIndex, criteria, sort1, sort2);
    });

    draw_graph(category, selectedIndex, criteria, sort1, sort2);
}

//drawBarGraph('Beverages')

// category = ['Breakfast', 'Beef & Pork', 'Chicken & Fish', 'Salads', 'Snacks & Sides', 'Desserts', 
//             'Beverages', 'Coffee & Tea', 'Smoothies & Shakes']