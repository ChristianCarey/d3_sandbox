var svg = d3.select('svg');

var circles = svg.selectAll('circle').data([1, 2, 3, 4, 5, 6]);

var circleTransition = d3.transition().duration(1000)

// circles.enter().append('circle').attr('r', 20)
circles.enter()
  .append('circle')
  .attr('r', 0)
  .attr('cx', function(d, i) {
    return 30 + (i * 30);
  })
  .attr('cy', 50)
  .transition(circleTransition)
    .attr('r', function(d) { return d });
