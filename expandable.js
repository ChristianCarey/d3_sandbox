var root = {
 "name": "flare",
 "children": [
  {
   "name": "analytics",
   "children": [
    {
     "name": "cluster",
     "children": [
      {"name": "AgglomerativeCluster", "size": 3938},
      {"name": "CommunityStructure", "size": 3812},
      {"name": "HierarchicalCluster", "size": 6714},
      {"name": "MergeEdge", "size": 743}
     ]
    },
    {
     "name": "graph",
     "children": [
      {"name": "BetweennessCentrality", "size": 3534},
      {"name": "LinkDistance", "size": 5731},
      {"name": "MaxFlowMinCut", "size": 7840},
      {"name": "ShortestPaths", "size": 5914},
      {"name": "SpanningTree", "size": 3416}
     ]
    },
    {
     "name": "optimization",
     "children": [
      {"name": "AspectRatioBanker", "size": 7074}
     ]
    }
   ]
  }
 ]
}


// var width = 960,
//     height = 500,
//     data;

// var force = d3.layout.force()
//   .size([width, height])
//   .on('tick', tick);

// var svg = d3.select('body').append('svg')
//   .attr('width', width)
//   .attr('height', height);

// var link = d3.selectAll('.link'),
//     node = d3.selectAll('.node');

// d3.json('/reddit/top_subreddits.json', function(error, json) {
//   if (error) throw error;

//   data = json;
//   update();
// })

// var update = function update() {
//   var nodes = data.nodes
// }



function flatten(root) {
  var nodes = [], i = 0;

  function recurse(node) {
    if (node.children) node.children.forEach(recurse);
    if (!node.id) node.id = ++i;
    nodes.push(node);
  }

  recurse(root);
  return nodes;
}

console.log(flatten(root))