import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

const controlsContainer = d3
    .select("#learning-container");

controlsContainer
    .append("h3")
    .attr("id", "sequence-header2");

controlsContainer
    .append("svg")
    .attr("id", "pitch33")
    .attr("width", "600")
    .attr("height", "400")
    .attr("viewBox", "0 0 120 80")
    .attr("preserveAspectRatio", "xMidYMid meet")

controlsContainer
    .append("div")
    .style("text-align", "center")
    .style("margin-top", "10px");

controlsContainer
    .append("span")
    .attr("id", "learning-commentary");

const topTenSequencePasses = [
    [
        {
            "start": [
                100,
                10
            ],
            "end": [
                110,
                40
            ],
            "outcome": 1,
            "team": "Cross",
            "data": "Crosses are balls played in from the side of the field into the box, typically in the air."
        },
        {
            "start": [
                90,
                75
            ],
            "end": [
                110,
                35
            ],
            "outcome": 1,
            "team": "Cross",
            "data": "Crosses are balls played in from the side of the field into the box, typically in the air."
        }
    ],
    [
        {
            "start": [
                118, 10
            ],
            "end": [
                105, 40
            ],
            "outcome": 1,
            "team": "Cutback",
            "data": "Cutbacks are passes played close to the opponent's goal line and are passed backward towards the middle/top of the box."
        },
        {
            "start": [
                119, 55
            ],
            "end": [
                113, 45
            ],
            "outcome": 1,
            "team": "Cutback",
            "data": "Cutbacks are passes played close to the opponent's goal line and are passed backward towards the middle/top of the box."
        }
    ],
    [
        {
            "start": [
                30, 70
            ],
            "end": [
                30, 10
            ],

            "outcome": 1,
            "team": "Switch",
            "data": "A switch is a long lateral pass across the field, usually to change the point of attack and exploit space."
        },
        {
            "start": [
                90, 20
            ],
            "end": [
                95, 60
            ],

            "outcome": 1,
            "team": "Switch",
            "data": "A switch is a long lateral pass across the field, usually to change the point of attack and exploit space."
        }
    ],
    [
        {
            "start": [
                65, 50
            ],
            "end": [
                95, 25
            ],

            "outcome": 1,
            "team": "Through Ball",
            "data": "A through ball is a vertical or diagonal pass played into space behind defenders, typically for a forward to run onto."
        }
    ]
]

controlsContainer
    .append("span")
    .attr("id", "sequence-counter2")
    .style("margin", "0 10px")
    .style("font-size", "12px")
    .text(`Sequence 1 of ${topTenSequencePasses.length}`);
const svg3 = d3.select("#pitch33");
let currentSequenceIndex = 0;

const defs3 = svg3.append("defs");
defs3
    .append("marker")
    .attr("id", `arrow3`)
    .attr("viewBox", "0 0 10 10")
    .attr("refX", 2)
    .attr("refY", 5)
    .attr("markerWidth", 4)
    .attr("markerHeight", 4)
    .attr("orient", "auto")
    .attr("markerUnits", "strokeWidth")
    .append("path")
    .attr("d", "M 0 0 L 10 5 L 0 10 z")
    .attr("fill", "green");



function drawFootballPitch(svg) {
    // Pitch Boundary
    svg
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 120)
        .attr("height", 80)
        .attr("class", "line");

    // Halfway Line
    svg
        .append("line")
        .attr("x1", 60)
        .attr("y1", 0)
        .attr("x2", 60)
        .attr("y2", 80)
        .attr("class", "line");

    // Center Circle & Spot
    svg
        .append("circle")
        .attr("cx", 60)
        .attr("cy", 40)
        .attr("r", 9.15)
        .attr("class", "line");

    svg
        .append("circle")
        .attr("cx", 60)
        .attr("cy", 40)
        .attr("r", 0.2)
        .attr("fill", "black");

    // Penalty Areas
    svg
        .append("rect")
        .attr("x", 0)
        .attr("y", 19.84)
        .attr("width", 16.5)
        .attr("height", 40.32)
        .attr("class", "line");

    svg
        .append("rect")
        .attr("x", 103.5)
        .attr("y", 19.84)
        .attr("width", 16.5)
        .attr("height", 40.32)
        .attr("class", "line");

    // Goal Areas
    svg
        .append("rect")
        .attr("x", 0)
        .attr("y", 30.84)
        .attr("width", 5.5)
        .attr("height", 18.32)
        .attr("class", "line");

    svg
        .append("rect")
        .attr("x", 114.5)
        .attr("y", 30.84)
        .attr("width", 5.5)
        .attr("height", 18.32)
        .attr("class", "line");

    // Penalty Spots
    svg
        .append("circle")
        .attr("cx", 12)
        .attr("cy", 40)
        .attr("r", 0.2)
        .attr("fill", "black");

    svg
        .append("circle")
        .attr("cx", 108)
        .attr("cy", 40)
        .attr("r", 0.2)
        .attr("fill", "black");

    // Corner Arcs (inward-curving)
    svg.append("path").attr("d", "M1,0 A1,1 0 0,0 0,1").attr("class", "line");

    svg.append("path").attr("d", "M0,79 A1,1 0 0,0 1,80").attr("class", "line");

    svg.append("path").attr("d", "M119,0 A1,1 0 0,1 120,1").attr("class", "line");

    svg
        .append("path")
        .attr("d", "M120,79 A1,1 0 0,1 119,80")
        .attr("class", "line");

    // Arrowhead Markers
    const defs = svg.append("defs");

    defs
        .append("marker")
        .attr("id", "arrowgreen")
        .attr("viewBox", "0 0 10 10")
        .attr("refX", 2)
        .attr("refY", 5)
        .attr("markerWidth", 4)
        .attr("markerHeight", 4)
        .attr("orient", "auto")
        .attr("markerUnits", "userSpaceOnUse")
        .append("path")
        .attr("d", "M 0 0 L 10 5 L 0 10 z")
        .attr("fill", "green");

    defs
        .append("marker")
        .attr("id", "arrowred")
        .attr("viewBox", "0 0 10 10")
        .attr("refX", 2)
        .attr("refY", 5)
        .attr("markerWidth", 4)
        .attr("markerHeight", 4)
        .attr("orient", "auto")
        .attr("markerUnits", "userSpaceOnUse")
        .append("path")
        .attr("d", "M 0 0 L 10 5 L 0 10 z")
        .attr("fill", "red");

    const arcGenerator = d3.arc()
        .innerRadius(9.15)
        .outerRadius(9.15)
        .startAngle(-0.3 * Math.PI)
        .endAngle(0.3 * Math.PI);

    // Left penalty box arc
    svg.append("path")
        .attr("d", arcGenerator())
        .attr("transform", "translate(11,40) rotate(90,0,0)")
        .attr("fill", "none")
        .attr("class", "line");

    // Right penalty box arc
    const arcGeneratorRight = d3.arc()
        .innerRadius(9.15)
        .outerRadius(9.15)
        .startAngle(0.7 * Math.PI)
        .endAngle(1.3 * Math.PI);

    svg.append("path")
        .attr("d", arcGeneratorRight())
        .attr("transform", "translate(109,40) rotate(90,0,0)")
        .attr("fill", "none")
        .attr("class", "line");
}

function updatePassDisplay() {
    // Update sequence header
    const currentSequence = topTenSequencePasses[currentSequenceIndex][0];
    d3.select("#sequence-header2").html(
        `${currentSequence.team}`
    );

    svg3
        .selectAll(".pass")
        .data(topTenSequencePasses[currentSequenceIndex])
        .join("line")
        .attr("class", "pass")
        .attr("x1", (d) => d.start[0])
        .attr("y1", (d) => d.start[1])
        .attr("x2", (d) => d.end[0])
        .attr("y2", (d) => d.end[1])
        .attr("stroke", (d) => (d.outcome === 1.0 ? "green" : "red"))
        .attr("stroke-width", 1)
        .attr("marker-end", (d, i) => `url(#arrow3)`)

    // Update sequence counter display
    d3.select("#sequence-counter2").text(
        `Sequence ${currentSequenceIndex + 1} of ${topTenSequencePasses.length}`
    );

    d3.select("#learning-commentary").text(`${currentSequence.data}`);

    if (currentSequence.team == "Through Ball"){
        const x = 80;     // X position
        const y = 30;      // Y position
        const size = 2;   // Half the height of the triangle

        const triangle = svg3.append("polygon")
        .attr("points", `${x},${y - size} ${x - size},${y + size} ${x + size},${y + size}`)
        .attr("fill", "tomato")
        .attr("stroke", "black")
        .attr("stroke-width", 1);
    }
    else {
        svg3.select("polygon").remove()
    }

}


drawFootballPitch(svg3);

const tooltip3 = d3
    .select("body")
    .append("div")
    .style("position", "absolute")
    .style("background", "rgba(0,0,0,0.7)")
    .style("color", "white")
    .style("padding", "6px")
    .style("border-radius", "4px")
    .style("font-size", "12px")
    .style("pointer-events", "none")
    .style("opacity", 0);

// Add navigation controls outside SVG


controlsContainer
    .append("button")
    .style("margin", "0 5px")
    .text("←")
    .on("click", () => {
        currentSequenceIndex =
            (currentSequenceIndex - 1 + topTenSequencePasses.length) %
            topTenSequencePasses.length;
        updatePassDisplay();
    });

controlsContainer
    .append("button")
    .style("margin", "0 5px")
    .text("→")
    .on("click", () => {
        currentSequenceIndex =
            (currentSequenceIndex + 1) % topTenSequencePasses.length;
        updatePassDisplay();
    });

// Initial display
updatePassDisplay();
