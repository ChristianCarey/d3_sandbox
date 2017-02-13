// Set height and width of svg canvas, hoist nodes and root (center of graph).
var width = 1200,
    height = 600,
    nodes,
    root;

// Find the body, append a new svg element, and set its width and height.
var svg = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height)

// Configure force settings to adjust physics interaction between nodes.
var force = d3.layout.force()
  // 'Ideal' distance between nodes (modified by charge and gravity).
  .linkDistance(50)
  // A high link stength (range 0.0 - 1.0) makes the linkDistance harder to modify.
  .linkStrength(.8)
  // Force of attraction between nodes (negative means they repulse each other).
  .charge(-100)
  // Gravitational force at center of the canvas (0.0 - 1.0).
  .gravity(.05)
  // Sets the size of the force layout, which is used to determine the center of gravity and the bounds within which nodes initally appear. Here it is equal to our svg canvas size.
  .size([width, height])

// We will scale the radius of each circle with a linear slope within a specified range.
var rScale = d3.scale.linear().range([5, 15]);
// And the color saturation.
var colScale = d3.scale.linear().range(['white', '#3182bd']);

// Store references to all elements with the '.link' and '.node' class that appear within our svg.
var link = svg.selectAll('.link'),
    node = svg.selectAll('.node');

// Get the json object which contains a root node with nested children.
d3.json("show1.json", function(error, json) {
  if (error) throw error;

  // The json response becomes our root, and we are ready to update.
  root = json;
  update();
})

var update = function update() {
  // Put all nodes into a flat array (see flatten() implementation below).
  nodes = flatten(root),
    // And create links between them (nodes must have a property called 'children').
    links = d3.layout.tree().links(nodes);

  // Feed the force layout current nodes and links.
  force
    .nodes(nodes)
    .links(links)
    // The tick event fires whenever the graph's layout changes. We will use the tick handler function to re-render nodes/links at their new positions.
    .on("tick", tick)
    // Start ticking!
    .start();
  
  // Set the real min and max to be scaled down to our rScale. d3.extent returns the min an max value of an array. The function argument specifies an accessor for which value to compare between objects.
  rScale.domain(d3.extent(nodes, function(d) { return d.numSubscribers; }));
  // Same with the color scale and activeUsers.
  colScale.domain(d3.extent(nodes, function(d) { return d.activeUsers; }));

  // Bind links data to all '.link' elements in canvas.
  link = link.data(links, function(d) { 
    // Keep binding consistent by using the target's ID.
    return d.target.id;
  });

  // Remove extra DOM links if there are more '.link' elements in the DOM than in the 'links' data.
  link.exit().remove();

  // If there are more objects in the 'links' data than '.link' DOM elements, insert that many more elements (<line class=".link">). Each one is inserted before a '.node' element.
  link.enter().insert('line', '.node')
    // Add the class '.link' so that they are bound to our 'links' data.
    .attr('class', 'link')
  // Same as above, but now binding data to '.node' DOM elements.
  node = node.data(nodes, function(d) { return d.id })
  // Same as above again, but removing extra '.node' elements.
  node.exit().remove()

  // Because nodes contain both circles and text, we will bind each object in 'nodes' to a <g> element (like a generic <div> container but for svg).
  var nodeEnter = node.enter().append('g')
    // Adding class so our data is bound.
    .attr('class', 'node')
    // And a click handler for showing a node's children.
    .on('click', expand)
    // And a built-in d3 function to make nodes draggable.
    .call(force.drag);

  // Add a circle to our <g> container.
  nodeEnter.append('circle')
    // And set its radius as a function of its data's numSubscribers, adjusted to fit our scale.
    .attr('r', function(d) { return rScale(d.numSubscribers) })
    // Ditto color saturation to activeUsers.
    .style('fill', function(d) { return colScale(d.activeUsers) })

  // Add a text element to the <g>.
  nodeEnter.append('text')
    // With a slight offset from the node's center.
    .attr('dx', 12)
    .attr('dy', '.35em')
    // And set the text to our data's name.
    .text(function(d) { return d.name });
}

// Called repeatedly as long as nodes/links are moving.
var tick = function tick() {
  // Sort our nodes into a quadtree (https://github.com/d3/d3-3.x-api-reference/blob/master/Quadtree-Geom.md)
  var qTree = d3.geom.quadtree(nodes);
  
  nodes.forEach(function(node) {
    // Run every node in the quadtree through the callback returned by collide(node).
    qTree.visit(collide(node))
  })

  // Redraw lines so that their endpoints are at their nodes' centers.
  link.attr('x1', function(d) { return d.source.x; })
      .attr('y1', function(d) { return d.source.y; })
      .attr('x2', function(d) { return d.target.x; })
      .attr('y2', function(d) { return d.target.y; })

  // Adjust the transform:translate property on each node to match its data's x and y coordinates (which are created by the force function).
  node.attr('transform', function(d) { 
    return 'translate(' + d.x + ',' + d.y + ')';
  });
}

var expand = function expand(d) {
  // Return if node is being dragged.
  if(d3.event.defaultPrevented) return;
  lastX = d.x;
  lastY = d.y;
  // If expanded...
  if(d.children) {
    // Hide children in _children.
    d._children = d.children;
    d.children = null;
  }
  // If hidden children are cached...
  else if (d._children) {
    // Show hidden children.
    d.children = d._children;
    d._children = null;
  } 
  // If no children exist...
  else {
    // Fetch children. Here I'm using a file named after the ID, this will of course be an AJAX request to our API.
    d3.json('show' + d.id + '.json', function(error, json) {
      if (error) throw error;
      d.children = json.children;
      // Update needs to be called within the callback so that we know the new data is ready.
      update();
    })
  }
  update();
}

var flatten = function flatten(root) {
  var nodes = [], i = 0;

  // Keep adding each node's children to the flat array as long as children are present
  var recurse = function recurse(node) {
    if (node.children) node.children.forEach(recurse);
    if (!node.id) node.id = ++i;
    nodes.push(node);
  }

  // Starting with the root
  recurse(root);
  return nodes
}

var collide = function collide(dataNode) {
  // Define the bounds of the given node.
  var radius = rScale(dataNode.numSubscribers),
      dataX1 = dataNode.x - radius,
      dataX2 = dataNode.x + radius,
      dataY1 = dataNode.y - radius,
      dataY2 = dataNode.y + radius;
  // This callback takes the node of the quadtree and its bounds. 
  return function(quad, treeX1, treeY1, treeX2, treeY2) {
    var treeNode = quad.point;
    if (treeNode && (treeNode.id !== dataNode.id)) {
      // Calculate the distance between the two nodes.
      var x = dataNode.x - treeNode.x,
          y = dataNode.y - treeNode.y,
          // Pythagoras!
          distance = Math.sqrt(x * x + y * y),
          // Add radii together to find the minimum distance apart the nodes can be without colliding.
          min = radius + rScale(treeNode.numSubscribers);
          
      // If nodes collide...
      if (distance < min) {
        // Find the amount of overlap and adjust each node half that distance.
        var adjustment = (distance - min) / distance * .5;
        var xAdjustment = x * adjustment;
        var yAdjustment = x * adjustment;
        dataNode.x -= xAdjustment;
        dataNode.y -= yAdjustment;
        treeNode.x += xAdjustment;
        treeNode.y += yAdjustment;
      }
    }
    
    // Return true if no part of the dataNode is inside of the treeNode. If this callback returns true, none of the current treeNode's children are visited.
    return treeX1 > dataX2 || 
           treeX2 < dataX1 || 
           treeY1 > dataY2 || 
           treeY2 < dataY1;
  };
}
