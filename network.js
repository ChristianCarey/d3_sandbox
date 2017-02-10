var width = 960;
var height = 500;

var svg = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height);

var force = d3.layout.force()
  .gravity(.05) // attraction
  .distance(150)
  .charge(-500) // repellant
  .size([width, height]);

d3.json('data.json', function(json) {
  // set up force network
  // adding force behavior to the nodes
  force.nodes(json.nodes).links(json.links).start();

  // set up a link
  var link = svg.selectAll('.link')
  .data(json.links)
  .enter().append('line') // svg element
  .attr('class', 'link')
  .style('stroke-width', function(d) { return Math.sqrt(d.weight); });

  // set up a node
  var node = svg.selectAll('.node')
      .data(json.nodes)
    .enter().append('g') // 'g' is a container svg element
      .attr('class', 'node')
      .call(force.drag); // dragable node

  // fill in node 'g' with a circle
  node.append('circle')
    .attr('r', function(d) { return d.size; } );

  node.append('text')
    .attr("dx", 12)
    .attr("dy", ".35em")
    .text(function(d) { return d.name; });


  // keeps the links attached to the nodes
  // allows nodes to move around
  force.on('tick', function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
  });

});
