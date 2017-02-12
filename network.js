var margin = {top: -5, right: -5, bottom: -5, left: -5},
    width = 1278 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var zoomed = function zoomed() {
  container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}  

var dragStarted = function dragStarted(d) {
  console.log('dragstart')
  d3.event.sourceEvent.stopPropagation();
  d3.select(this).classed("dragging", true);
}

var dragged = function dragged(d) {
  console.log(d3.select(this))
  d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
}

var dragEnded = function dragEnded(d) {
  console.log('drag end')
  d3.select(this).classed("dragging", false);
}

var zoom = d3.behavior.zoom()
  .scaleExtent([1,10])
  .on("zoom", zoomed);

var svg = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height)
  .call(zoom);

var container = svg.append('g')
  .style("pointer-events", "all");

var drag = d3.behavior.drag()
  .origin(function(d) { return d; })
  .on("dragstart", dragStarted)
  .on("drag", dragged)
  .on("dragend", dragEnded);


var force = d3.layout.force()
  .gravity(.05) // attraction
  .distance(150)
  .charge(-500) // repellant
  .size([width, height]);


d3.json('/reddit/top_subreddits.json', function(json) {
  // set up force network
  // adding force behavior to the nodes
  force.nodes(json.nodes).links(json.links).start();

  // set up a link
  var link = container.selectAll('.link')
  .data(json.links)
  .enter().append('line') // svg element
  .attr('class', 'link')
  .style('stroke-width', function(d) { return Math.sqrt(d.weight); });

  // set up a node
  var node = container.selectAll('.node')
      .data(json.nodes)
    .enter().append('g') // 'g' is a container svg element
      .attr('class', 'node')
      .call(force.drag)
      .call(drag); // dragable node

  // fill in node 'g' with a circle
  node.append('circle')
    .attr('r', function(d) { return Math.sqrt(d.size) / 100; } );

  node.append('text')
    .attr("dx", 12)
    .attr("dy", ".35em")
    .text(function(d) { return d.name; });


  // keeps the links attached to the nodes
  // allows nodes to move around
  force.on('tick', function() {
    console.log('tick')
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
  });

});
