
  
  const container = document.getElementById('heatmap');
  const width = '720', height = '480';
  // Tooltip div
  const tooltip2 = document.createElement('div');
  tooltip2.id = 'tooltip';
  tooltip2.className = 'tooltip';
  container.appendChild(tooltip2);

  // SVG
  const svg2 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg2.id = 'soccer';
  svg2.setAttribute('width', width);
  svg2.setAttribute('height', height);
  container.appendChild(svg2);

  // Button selection bar
  const selectionBar = document.createElement('div');
  selectionBar.className = 'selection-bar';

  const buttons = [
    { label: 'XG', value: 'shot_data.json' },
    { label: 'Goals', value: 'shots_goals.json' },
    { label: 'Shots Taken', value: 'shots_taken.json' },
  ];

  buttons.forEach(btn => {
    const button = document.createElement('button');
    button.textContent = btn.label;
    button.dataset.value = btn.value;
    selectionBar.appendChild(button);
  });

  container.appendChild(selectionBar);




const pitchLength = 120, pitchWidth = 80;

const svg = d3.select("#soccer");
const xScale = d3.scaleLinear().domain([0, pitchLength]).range([0, width]);
const yScale = d3.scaleLinear().domain([0, pitchWidth]).range([0, height]);
const tooltip = d3.select("#tooltip");



function draw(fdata, tag) {
  
  d3.json(`goals/data/${fdata}`).then(raw => {
  const keys = Object.keys(raw.x);
  const data = keys.map(key => ({
    x: +raw.x[key],
    y: +raw.y[key],
    z: +raw.z[key]
  }));

  const xBins = 30, yBins = 20;
  const xStep = pitchLength / xBins, yStep = pitchWidth / yBins;
  const grid = Array.from({ length: xBins }, (_, i) =>
    Array.from({ length: yBins }, (_, j) => ({
      x0: i * xStep,
      y0: j * yStep,
      zValues: []
    }))
  );

  for (const d of data) {
    const i = Math.floor(d.x / xStep);
    const j = Math.floor(d.y / yStep);
    if (i >= 0 && i < xBins && j >= 0 && j < yBins) {
      grid[i][j].zValues.push(d.z);
    }
  }

  for (const row of grid) {
    for (const cell of row) {
      if (fdata.includes("data") || fdata.includes("last_pass")) {
        cell.z = d3.mean(cell.zValues) || 0;
      }

      else if (fdata.includes("goals")){
        cell.z = d3.sum(cell.zValues);
      }

      else if (fdata.includes("taken")){
        cell.z = d3.count(cell.zValues);
      }
    }
  }


  let zzz = grid.flat().map(d => d.z)
  const minn = Math.min(...zzz);
  const maxx = Math.max(...zzz);


  cmap = grid.flat().map(d => ((d.z - minn)/(maxx-minn)) * 0.7 - 0.3);
  
  const color = d3.scaleSequential()
    .domain(d3.extent(cmap))
    .interpolator(d3.interpolateGreens);

  svg.selectAll("rect.cell")
    .data(grid.flat())
    .join("rect")
    .attr("class", "cell")
    .attr("x", d => xScale(d.x0))
    .attr("y", d => yScale(d.y0))
    .attr("width", xScale(xStep) - xScale(0))
    .attr("height", yScale(yStep) - yScale(0))
    .attr("fill", d => color((d.z - minn) / (maxx - minn)))
    .on("mouseover", (event, d) => {
      tooltip.style("opacity", 1)
        .html(`${tag}: ${Math.round(d.z * 100) / 100}`)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.clientY - 20}px`);
    })
    .on("mousemove", event => {
      tooltip.style("left", `${event.pageX + 10}px`)
             .style("top", `${event.clientY - 20}px`);
    })
    .on("mouseout", () => {
      tooltip.style("opacity", 0);
    });

  drawPitch();
});};

const drawPitch = () => {
  const g = svg.append("g");
  const cornerRadius = 10;

  g.append("path")
    .attr("d", `M${cornerRadius},0
                H${width - cornerRadius}
                A${cornerRadius},${cornerRadius} 0 0 1 ${width},${cornerRadius}
                V${height - cornerRadius}
                A${cornerRadius},${cornerRadius} 0 0 1 ${width - cornerRadius},${height}
                H${cornerRadius}
                A${cornerRadius},${cornerRadius} 0 0 1 0,${height - cornerRadius}
                V${cornerRadius}
                A${cornerRadius},${cornerRadius} 0 0 1 ${cornerRadius},0
                Z`)
    .attr("class", "pitch-line");

  g.append("circle")
    .attr("cx", width/2).attr("cy", height/2)
    .attr("r", 9.15 * (width / pitchLength))
    .attr("class", "pitch-line");

  g.append("circle")
    .attr("cx", width/2).attr("cy", height/2)
    .attr("r", 1.5)
    .attr("fill", "#ccc");

  const penaltyBox = {
    width: 18 * (width / pitchLength),
    height: 44 * (height / pitchWidth)
  };
  g.append("line")
    .attr("x1", width / 2)
    .attr("y1", 0)
    .attr("x2", width / 2)
    .attr("y2", height)
    .attr("class", "pitch-line");

  g.append("rect")
    .attr("x", 0)
    .attr("y", (height - penaltyBox.height) / 2)
    .attr("width", penaltyBox.width)
    .attr("height", penaltyBox.height)
    .attr("class", "pitch-line");

  g.append("rect")
    .attr("x", width - penaltyBox.width)
    .attr("y", (height - penaltyBox.height) / 2)
    .attr("width", penaltyBox.width)
    .attr("height", penaltyBox.height)
    .attr("class", "pitch-line");

  const goalBox = {
    width: 6 * (width / pitchLength),
    height: 20 * (height / pitchWidth)
  };

  g.append("rect")
    .attr("x", 0)
    .attr("y", (height - goalBox.height) / 2)
    .attr("width", goalBox.width)
    .attr("height", goalBox.height)
    .attr("class", "pitch-line");

  g.append("rect")
    .attr("x", width - goalBox.width)
    .attr("y", (height - goalBox.height) / 2)
    .attr("width", goalBox.width)
    .attr("height", goalBox.height)
    .attr("class", "pitch-line");
};
let data = null;

const buttons2 = document.querySelectorAll('.selection-bar button');
const output = document.getElementById('output');

buttons2.forEach(button => {
  button.addEventListener('click', () => {
    // Update variable
    data = button.getAttribute('data-value');
    draw(data, button.textContent);

    // Highlight active button
    buttons2.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
  });
});
document.addEventListener("DOMContentLoaded", function () {
  buttons2[0].click();
});
