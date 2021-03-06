/** 統計陣列 */
interface DataChart
{
    /** 計數名 */
    name:string,
    /** 數量大小 */
    size?:number,
    children:Array<DataChart>
}

/** key name format {} */
interface getChartColorName
{
    [key:string]:string
}

/** 我的歷程圖表 
 * @param d3 chart svg 渲染
 * @param csvRowData 統計資料
 * @param  colors 物件顏色
*/
export default (d3:any,csvRowData:Array<Array<string>>,colors:getChartColorName)=>{
    d3.selectAll('svg').remove();
    // Dimensions of sunburst.
    var width = 450;
    var height = 400;
    var radius = Math.min(width, height) / 2;

    // Breadcrumb dimensions: width, height, spacing, width of tip/tail.
    var b = {
         w: 70, h: 30, s: 3, t: 10
    };

    // Total size of all segments; we set this later, after loading the data.
    var totalSize = 0; 

    var vis = d3.select("#authorChart").append("svg:svg")
        .attr("width", width)
        .attr("height", height)
        .append("svg:g")
        .attr("id", "container")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var partition = d3.partition()
        .size([2 * Math.PI, radius * radius]);

    var arc = d3.arc()
        .startAngle(function(d:any) { return d.x0; })
        .endAngle(function(d:any) { return d.x1; })
        .innerRadius(function(d:any) { return Math.sqrt(d.y0); })
        .outerRadius(function(d:any) { return Math.sqrt(d.y1); });

    // Use d3.text and d3.csvParseRows so that we do not need to have a header
    // row, and can receive the csv as an array of arrays.
    createVisualization(buildHierarchy(csvRowData));


    // Main function to draw and set up the visualization, once we have the data.
    function createVisualization(json:DataChart) {

    // Basic setup of page elements.
    initializeBreadcrumbTrail();

    // Bounding circle underneath the sunburst, to make it easier to detect
    // when the mouse leaves the parent g.
    vis.append("svg:circle")
        .attr("r", radius)
        .style("opacity", 0);

    // Turn the data into a d3 hierarchy and calculate the sums.
    var root = d3.hierarchy(json)
        .sum(function(d:any) { return d.size; })
        .sort(function(a:any, b:any) { return b.value - a.value; });
    
    // For efficiency, filter nodes to keep only those large enough to see.
    var nodes = partition(root).descendants()
        .filter(function(d:any) {
            return (d.x1 - d.x0 > 0.005); // 0.005 radians = 0.29 degrees
        });

    var path = vis.data([json]).selectAll("path")
        .data(nodes)
        .enter().append("svg:path")
        .attr("display", function(d:any) { return d.depth ? null : "none"; })
        .attr("d", arc)
        .attr("fill-rule", "evenodd")
        .style("fill", function(d:any) { 
            return colors[d.data.name]; 
        })
        .style("opacity", 1)
        .on("mouseover", mouseover);

    // Add the mouseleave handler to the bounding circle.
    d3.select("#container").on("mouseleave", mouseleave);

    // Get total size of the tree = value of root node from partition.
    totalSize = path.datum().value;
    };

    // Fade all but the current sequence, and show it in the breadcrumb trail.
    function mouseover(d:any) {

    var percentage = (100 * d.value / totalSize).toPrecision(3);
    var percentageString = percentage + "%";
    if (Number(percentage) < 0.1) {
        percentageString = "< 0.1%";
    }

    d3.select("#authorpercentage")
        .text(percentageString);

    d3.select("#authorexplanation")
        .style("visibility", "");

    var sequenceArray = d.ancestors().reverse();
    sequenceArray.shift(); // remove root node from the array
    updateBreadcrumbs(sequenceArray, percentageString);

    // Fade all the segments.
    d3.selectAll("path")
        .style("opacity", 0.3);

    // Then highlight only those that are an ancestor of the current segment.
    vis.selectAll("path")
        .filter(function(node:any) {
                    return (sequenceArray.indexOf(node) >= 0);
                })
        .style("opacity", 1);
    }

    // Restore everything to full opacity when moving off the visualization.
    function mouseleave(d:any) {

    // Hide the breadcrumb trail
    d3.select("#trail")
        .style("visibility", "hidden");

    // Deactivate all segments during transition.
    d3.selectAll("path").on("mouseover", null);

    // Transition each segment to full opacity and then reactivate it.
    d3.selectAll("path")
        .transition()
        .duration(1000)
        .style("opacity", 1)
        .on("end", function() {
                d3.select((eval("this") as any)).on("mouseover", mouseover);
         });

    d3.select("#authorexplanation")
        .style("visibility", "hidden");
    }

    function initializeBreadcrumbTrail() {
        // Add the svg area.
        var trail = d3.select("#authorsequence").append("svg:svg")
            .attr("width", width)
            .attr("height", 50)
            .attr("id", "trail");
        // Add the label at the end, for the percentage.
        trail.append("svg:text")
            .attr("id", "endlabel")
            .style("fill", "#000");
    }

    // Generate a string that describes the points of a breadcrumb polygon.
    function breadcrumbPoints(d:any, i:any) {
        var points = [];
        points.push("0,0");
        points.push(b.w + ",0");
        points.push(b.w + b.t + "," + (b.h / 2));
        points.push(b.w + "," + b.h);
        points.push("0," + b.h);
        if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
            points.push(b.t + "," + (b.h / 2));
        }
        return points.join(" ");
    }

    // Update the breadcrumb trail to show the current sequence and percentage.
    function updateBreadcrumbs(nodeArray:any, percentageString:string) {

        // Data join; key function combines name and depth (= position in sequence).
        var trail = d3.select("#trail")
            .selectAll("g")
            .data(nodeArray, function(d:any) { return d.data.name + d.depth; });

        // Remove exiting nodes.
        trail.exit().remove();

        // Add breadcrumb and label for entering nodes.
        var entering = trail.enter().append("svg:g");

        entering.append("svg:polygon")
            .attr("points", breadcrumbPoints)
            .style("fill", function(d:any) { return colors[d.data.name]; });

        entering.append("svg:text")
            .attr("x", (b.w + b.t) / 2)
            .attr("y", b.h / 2)
            .attr("dy", "0.25em")
            .attr("font-size", "0.75em")
            .attr("text-anchor", "middle")
            .text(function(d:any) { return d.data.name; });

        // Merge enter and update selections; set position for all nodes.
        entering.merge(trail).attr("transform", function(d:any, i:any) {
            return "translate(" + i * (b.w + b.s) + ", 0)";
        });

        // Now move and update the percentage at the end.
        d3.select("#trail").select("#endlabel")
            .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
            .attr("y", b.h / 2)
            .attr("dy", "0.25em")
            .attr("text-anchor", "middle")
            .text(percentageString);

        // Make the breadcrumb trail visible, if it's hidden.
        d3.select("#trail")
            .style("visibility", "");

    }

    /** bunild list */
    function toH(childNode:DataChart,nu:any,parts:Array<string>):DataChart
    {
        var childNodeFind=false;
        childNode.children.forEach(function(valD,nuD)
        {
            if (valD["name"] == parts[nu]) 
            {
                childNode = valD;
                childNodeFind = true;
            }
        });

        var newChildNode=null;
        if(!childNodeFind)
        {//未找到
            newChildNode = {"name": parts[nu], "children": []};
            childNode.children.push(newChildNode);
        }
        else
        {//繼承已找到
            newChildNode = childNode;
        }

        if(parts.length-1==nu)
        {//階層結束
            return newChildNode;
        }
        else
        {
            return toH(newChildNode,nu+1,parts);
        }
    }

    // Take a 2-column CSV and transform it into a hierarchical structure suitable
    // for a partition layout. The first column is a sequence of step names, from
    // root to leaf, separated by hyphens. The second column is a count of how 
    // often that sequence occurred.
    function buildHierarchy(csv:Array<Array<string>>):DataChart {
        let root:DataChart = {"name": "root", "children": []};
        csv.forEach(function(val,nu){
            var sequence = val[0];
            var parts = sequence.split("-");
            var catchNode=toH(root,0,parts);//遞歸尋找
            if(catchNode["size"]==null || catchNode["size"]==undefined)
            {
                catchNode["size"] = 0;
            }
            catchNode["size"] += Number(val[1]);
        });
        return root;
    };
    d3.select("#authorChart").style("height", "400px");
}