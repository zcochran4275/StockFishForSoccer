import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
let euroSequences = await d3
    .csv("europe_sequences_preds.csv")
    .then(function (data) {
        const updatedData = data.map((d) => {
            // Convert strings to numbers if needed
            const cut_back = +d.pass_cut_back;
            const switchPass = +d.pass_switch;
            const cross = +d.pass_cross;
            const through = +d.pass_through_ball;
            const throw_in = +d.pass_throw_in;
            const corner = +d.pass_corner;
            const goal_kick = +d.pass_goal_kick;
            const free_kick = +d.pass_free_kick;

            // Combine into a single string label

            for (let i = 1; i <= 4; i++) {
                const throw_in_i = +d[`prev_pass${i}_pass_throw_in`];
                const corner_i = +d[`prev_pass${i}_pass_corner`];
                const goal_kick_i = +d[`prev_pass${i}_pass_goal_kick`];
                const free_kick_i = +d[`prev_pass${i}_pass_free_kick`];
                const cut_back_i = +d[`prev_pass${i}_cut_back`];
                const switch_i = +d[`prev_pass${i}_switch`];
                const cross_i = +d[`prev_pass${i}_cross`];
                const through_i = +d[`prev_pass${i}_through_ball`];

                if (throw_in_i) d[`prev_pass${i}_type`] = "Throw In";
                else if (corner_i) d[`prev_pass${i}_type`] = "Corner";
                else if (goal_kick_i) d[`prev_pass${i}_type`] = "Goal Kick";
                else if (free_kick_i) d[`prev_pass${i}_type`] = "Free Kick";
                else if (through_i) d[`prev_pass${i}_type`] = "Through Ball";
                else if (cut_back_i) d[`prev_pass${i}_type`] = "Cut Back";
                else if (switch_i) d[`prev_pass${i}_type`] = "Switch";
                else if (cross_i) d[`prev_pass${i}_type`] = "Cross";
                else d[`prev_pass${i}_type`] = "Pass";
            }

            if (throw_in) d.type = "Throw In";
            else if (corner) d.type = "Corner";
            else if (goal_kick) d.type = "Goal Kick";
            else if (free_kick) d.type = "Free Kick";
            else if (through) d.type = "Through Ball";
            else if (cut_back) d.type = "Cut Back";
            else if (switchPass) d.type = "Switch";
            else if (cross) d.type = "Cross";
            else d.type = "Pass";

            return d;
        });
        return updatedData;
    });

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
function getHeightLabel(height) {
    switch (height) {
        case 0:
            return "Ground";
        case 1:
            return "Low";
        case 2:
            return "High";
        default:
            return "unknown";
    }
}
let filteredEuroSequences = euroSequences;
const teamsLastPreds = d3.rollup(
    filteredEuroSequences,
    (v) => d3.max(v, (d) => d.sequence_pred),
    (d) => d.match_id,
    (d) => d.possession
);
const matchedRowsFull = filteredEuroSequences.filter((d) => {
    const matchMap = teamsLastPreds.get(d.match_id);
    if (!matchMap) return false;

    const maxPred = matchMap.get(d.possession);
    return d.sequence_pred === maxPred;
});

const sortedPreds = matchedRowsFull
    .map((d) => parseFloat(d.sequence_pred))
    .sort(d3.ascending);

let matchedRows = matchedRowsFull;
const percentiles = [[0, 0.1], [0.3, 0.4], [0.6, 0.7], [0.9, 1.0]];

const data = percentiles.map(([lower, upper]) => {
    const lowerPredThreshold = d3.quantileSorted(sortedPreds, lower);
    const upperPredThreshold = d3.quantileSorted(sortedPreds, upper);

    return matchedRowsFull.filter(
        (d) => d.sequence_pred >= lowerPredThreshold &&
            d.sequence_pred <= upperPredThreshold
    );
});

function setUpStepI(i) {
    // Create a new SVG for the pass visualization
    const regPitch = d3.select("#pitch4Step" + i);
    const svgHeat = d3.select("#pitch5Step" + i);
    const heatContainer = d3.select("#heatmap-containerStep" + i);
    // Clear any existing elements
    regPitch.selectAll("*").remove();
    drawFootballPitch(regPitch);
    regPitch.style("display", "none");
    heatContainer.style("display", "flex");
    const filtered = data[i - 1]
    let globalType = "";
    let globalHeight = "";

    const uniquePassTypes = Array.from(new Set(matchedRowsFull.map((d) => d.type)));

    // 2. Define global color scale based on all types (fixed order)
    const color = d3
        .scaleOrdinal()
        .domain(uniquePassTypes)
        .range(d3.schemeCategory10);
    const passHeightCategories = Array.from(
        new Set(matchedRowsFull.map((d) => d.pass_height))
    );
    const heightColor = d3
        .scaleOrdinal()
        .domain(passHeightCategories)
        .range(d3.schemeCategory10);

    function updatePasses(pitch, lower, upper) {
        pitch.selectAll("*").remove();
        drawFootballPitch(pitch);


        if (globalType !== "") {
            filtered = filtered.filter((d) => d.type === globalType);
        }
        if (globalHeight !== "") {
            filtered = filtered.filter((d) => d.pass_height === globalHeight);
        }

        // Draw passes
        pitch
            .selectAll("line")
            .data(filtered)
            .enter()
            .append("line")
            .attr("x1", (d) => d.x1)
            .attr("y1", (d) => d.y1)
            .attr("x2", (d) => d.x2)
            .attr("y2", (d) => d.y2)
            .attr("stroke", (d) => (parseInt(d.outcome) === 1 ? "green" : "red"))
            .attr("stroke-width", 0.3)
            .attr("opacity", 0.4);
    }
    updatePasses(regPitch, 0.0, .05);


    function createPassTypePieChart(pitch) {
        d3.select("#pass-type-pie-chartStep" + i).selectAll("*").remove(); // clear previous chart

        // Count pass types
        const passTypeCounts = d3.rollup(
            filtered,
            (v) => v.length,
            (d) => d.type
        );

        const passTypeData = Array.from(passTypeCounts, ([type, count]) => ({
            type,
            count,
        }));

        // Dimensions
        const pieWidth = 200;
        const pieHeight = 200;
        const legendWidth = 120;
        const radius = Math.min(pieWidth, pieHeight) / 2.2;

        const svg = d3
            .select("#pass-type-pie-chartStep" + i)
            .append("svg")
            .attr("width", pieWidth + legendWidth)
            .attr("height", pieHeight);

        const pieSvg = svg
            .append("g")
            .attr("transform", `translate(${pieWidth / 2}, ${pieHeight / 2})`);

        // Color scale
        // const color = d3.scaleOrdinal()
        //   .domain(passTypeData.map(d => d.type))
        //   .range(d3.schemeCategory10);

        // Pie generator
        const pie = d3.pie().value((d) => d.count);
        const arc = d3.arc().innerRadius(0).outerRadius(radius);

        const arcs = pieSvg
            .selectAll(".arc")
            .data(pie(passTypeData))
            .enter()
            .append("g")
            .attr("class", "arc");

        const pathMap = new Map(); // Map passType → path element for linking with legend

        // Draw pie slices
        arcs.each(function (d) {
            const path = d3
                .select(this)
                .append("path")
                .attr("d", arc(d))
                .attr("fill", color(d.data.type))
                .attr("stroke", "white")
                .style("stroke-width", "2px")
            // .on("mouseover", function () {
            //     if (globalType !== d.data.type) {
            //         const [x, y] = arc.centroid(d);
            //         d3.select(this)
            //             .transition()
            //             .duration(200)
            //             .attr("transform", `translate(${x * 0.1}, ${y * 0.1})`);
            //     }
            // })
            // .on("mouseout", function () {
            //     if (globalType !== d.data.type) {
            //         d3.select(this).transition().duration(200).attr("transform", null);
            //     }
            // })
            // .on("click", function (event, d) {
            //     handleClick(d.data.type, d, this); // <- Fix here
            // });

            pathMap.set(d.data.type, path);
        });

        // function handleClick(type, d, element) {
        //     // Reset all
        //     arcs
        //         .selectAll("path")
        //         .classed("active", false)
        //         .transition()
        //         .duration(200)
        //         .attr("transform", null);

        //     if (globalType === type) {
        //         globalType = "";
        //         updatePasses(pitch, start, end, globalType, globalHeight);
        //         createPassTypePieChart(pitch);
        //         createPassHeightPieChart(pitch);
        //         createHeatmap(pitch);
        //     } else {
        //         globalType = type;

        //         const [x, y] = arc.centroid(d);
        //         const offset = 20;
        //         const angle = Math.atan2(y, x);
        //         const dx = Math.cos(angle) * offset;
        //         const dy = Math.sin(angle) * offset;

        //         d3.select(element)
        //             .classed("active", true)
        //             .transition()
        //             .duration(200)
        //             .attr("transform", `translate(${dx}, ${dy}) scale(1.1)`);
        //         updatePasses(pitch, start, end, globalType, globalHeight);
        //         createPassTypePieChart(pitch);
        //         createPassHeightPieChart(pitch);
        //         createHeatmap(pitch);
        //     }
        // }

        // Create legend
        const legend = svg
            .append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${pieWidth + 20}, 20)`);

        const legendItems = legend
            .selectAll(".legend-itemStep")
            .data(pie(passTypeData)) // use pie() output to keep 'd' structure aligned
            .enter()
            .append("g")
            .attr("class", "legend-item")
            .attr("transform", (d, i) => `translate(0, ${i * 20})`)
            .style("cursor", "pointer")
            .on("click", (event, d) => {
                const path = pathMap.get(d.data.type);
                handleClick(d.data.type, d, path.node());
            });

        legendItems
            .append("rect")
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", (d) => color(d.data.type));

        legendItems
            .append("text")
            .attr("x", 16)
            .attr("y", 10)
            .text((d) => `${d.data.type} (${d.data.count})`)
            .style("font-size", "12px");
    }
    createPassTypePieChart(regPitch);

    function createPassHeightPieChart(pitch) {
        d3.select("#pass-height-pie-chartStep" + i).selectAll("*").remove();

        const passHeightCounts = d3.rollup(
            filtered,
            (v) => v.length,
            (d) => d.pass_height
        );
        const passHeightData = Array.from(passHeightCounts, ([height, count]) => ({
            height,
            count,
        }));

        const pieWidth = 200;
        const pieHeight = 200;
        const legendWidth = 120;
        const radius = Math.min(pieWidth, pieHeight) / 2.2;
        const legendItemHeight = 20;
        const legendHeight = passHeightData.length * legendItemHeight;
        const legendYOffset = (pieHeight - legendHeight) / 2;

        const svg = d3
            .select("#pass-height-pie-chartStep" + i)
            .append("svg")
            .attr("width", pieWidth + legendWidth)
            .attr("height", pieHeight);

        const pieSvg = svg
            .append("g")
            .attr("transform", `translate(${pieWidth / 2}, ${pieHeight / 2})`);

        const pie = d3.pie().value((d) => d.count);
        const arc = d3.arc().innerRadius(0).outerRadius(radius);
        const arcs = pieSvg
            .selectAll(".arc")
            .data(pie(passHeightData))
            .enter()
            .append("g")
            .attr("class", "arc");

        const pathMap = new Map();

        arcs.each(function (d) {
            const path = d3
                .select(this)
                .append("path")
                .attr("d", arc(d))
                .attr("fill", heightColor(d.data.height))
                .attr("stroke", "white")
                .style("stroke-width", "2px")
                .on("mouseover", function () {
                    if (globalHeight !== d.data.height) {
                        const [x, y] = arc.centroid(d);
                        d3.select(this)
                            .transition()
                            .duration(200)
                            .attr("transform", `translate(${x * 0.1}, ${y * 0.1})`);
                    }
                })
                .on("mouseout", function () {
                    if (globalHeight !== d.data.height) {
                        d3.select(this).transition().duration(200).attr("transform", null);
                    }
                })
                .on("click", function (event, d) {
                    handleClick(d.data.height, d, this);
                });

            pathMap.set(d.data.height, path);
        });

        // function handleClick(height, d, element) {
        //     arcs
        //     .selectAll("path")
        //     .classed("active", false)
        //     .transition()
        //     .duration(200)
        //     .attr("transform", null);

        //     if (globalHeight === height) {
        //     globalHeight = "";
        //     } else {
        //     globalHeight = height;

        //     const [x, y] = arc.centroid(d);
        //     const angle = Math.atan2(y, x);
        //     const dx = Math.cos(angle) * 20;
        //     const dy = Math.sin(angle) * 20;

        //     d3.select(element)
        //         .classed("active", true)
        //         .transition()
        //         .duration(200)
        //         .attr("transform", `translate(${dx}, ${dy}) scale(1.1)`);
        //     }

        //     // Apply filter with both height and type
        //     let filtered = matchedRowsFull.filter(
        //     (d) =>
        //         d.sequence_pred >= d3.quantileSorted(sortedPreds, start) &&
        //         d.sequence_pred <= d3.quantileSorted(sortedPreds, end)
        //     );

        //     if (globalType !== "") {
        //     filtered = filtered.filter((d) => d.type === globalType);
        //     updatePasses(pitch, start, end, globalType, globalHeight);
        //     createPassTypePieChart(pitch);
        //     createPassHeightPieChart(pitch);
        //     createHeatmap(pitch);
        //     }
        //     if (globalHeight !== "") {
        //     filtered = filtered.filter((d) => d.height === globalHeight);
        //     updatePasses(pitch, start, end, globalType, globalHeight);
        //     createPassTypePieChart(pitch);
        //     createPassHeightPieChart(pitch);
        //     createHeatmap(pitch);
        //     }

        //     updatePasses(pitch, start, end, globalType, globalHeight);
        //     createPassTypePieChart(pitch);
        //     createPassHeightPieChart(pitch);
        //     createHeatmap(pitch);
        // }

        // Legend
        const legend = svg
            .append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${pieWidth + 20}, ${legendYOffset})`);

        const legendItems = legend
            .selectAll(".legend-item")
            .data(pie(passHeightData))
            .enter()
            .append("g")
            .attr("class", "legend-item")
            .attr("transform", (d, i) => `translate(0, ${i * legendItemHeight})`)
            .style("cursor", "pointer")
            .on("click", (event, d) => {
                const path = pathMap.get(d.data.height);
                handleClick(d.data.height, d, path.node());
            });

        legendItems
            .append("rect")
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", (d) => heightColor(d.data.height));

        legendItems
            .append("text")
            .attr("x", 16)
            .attr("y", 6)
            .attr("dy", "0.35em")
            .text((d) => `${getHeightLabel(parseInt(d.data.height))} (${d.data.count})`)
            .style("font-size", "12px");
    }
    createPassHeightPieChart(regPitch);

    function createHeatmap(pitch) {
        pitch.selectAll("*").remove();
        drawFootballPitch(pitch);
        const svgWidthHeat = +pitch.attr("width");
        const svgHeightHeat = +pitch.attr("height");

        // Dimensions of the pitch
        const pitchWidth = 120;
        const pitchHeight = 80;

        // Grid
        const gridCols = 60; // more = smoother
        const gridRows = 40;
        const cellWidth = pitchWidth / gridCols;
        const cellHeight = pitchHeight / gridRows;

        const completePasses = filtered.filter((d) => parseInt(d.outcome) === 1);
        const incompletePasses = filtered.filter((d) => parseInt(d.outcome) !== 1);

        function createSmoothedGrid(
            data,
            cols,
            rows,
            pitchWidth,
            pitchHeight,
            kernel
        ) {
            const grid = Array.from({ length: cols }, () =>
                Array.from({ length: rows }, () => 0)
            );

            data.forEach((d) => {
                const col = Math.floor((d.x2 / pitchWidth) * cols);
                const row = Math.floor((d.y2 / pitchHeight) * rows);
                if (col >= 0 && col < cols && row >= 0 && row < rows) {
                    grid[col][row]++;
                }
            });

            return convolve(grid, kernel);
        }

        // Gaussian kernel
        function gaussianKernel(size, sigma) {
            const kernel = [];
            const mean = size / 2;
            let sum = 0;
            for (let i = 0; i < size; i++) {
                kernel[i] = [];
                for (let j = 0; j < size; j++) {
                    const val = Math.exp(
                        -0.5 *
                        (Math.pow((i - mean) / sigma, 2) + Math.pow((j - mean) / sigma, 2))
                    );
                    kernel[i][j] = val;
                    sum += val;
                }
            }
            return kernel.map((row) => row.map((v) => v / sum));
        }

        // Convolution
        function convolve(grid, kernel) {
            const size = kernel.length;
            const half = Math.floor(size / 2);
            const result = Array.from({ length: gridCols }, () =>
                Array.from({ length: gridRows }, () => 0)
            );

            for (let x = 0; x < gridCols; x++) {
                for (let y = 0; y < gridRows; y++) {
                    let sum = 0;
                    for (let i = 0; i < size; i++) {
                        for (let j = 0; j < size; j++) {
                            const xi = x + i - half;
                            const yj = y + j - half;
                            if (xi >= 0 && xi < gridCols && yj >= 0 && yj < gridRows) {
                                sum += grid[xi][yj] * kernel[i][j];
                            }
                        }
                    }
                    result[x][y] = sum;
                }
            }
            return result;
        }

        const kernel = gaussianKernel(7, 1.5);
        const smoothComplete = createSmoothedGrid(
            completePasses,
            gridCols,
            gridRows,
            pitchWidth,
            pitchHeight,
            kernel
        );
        const smoothIncomplete = createSmoothedGrid(
            incompletePasses,
            gridCols,
            gridRows,
            pitchWidth,
            pitchHeight,
            kernel
        );
        const difference = smoothComplete.map((col, i) =>
            col.map((val, j) => val - smoothIncomplete[i][j])
        );

        //changing max difference
        const maxDiff = d3.max(difference.flat().map(Math.abs));
        //constant max difference

        const colorDiff = d3
            .scaleDiverging()
            .domain([-maxDiff, 0, maxDiff])
            .interpolator(d3.interpolateRdYlGn);

        // Draw
        pitch
            .selectAll("rect.heatmap-cell")
            .data(
                difference.flatMap((col, i) =>
                    col.map((value, j) => ({ x: i, y: j, value }))
                )
            )
            .join("rect")
            .attr("class", "heatmap-cell")
            .attr("x", (d) => d.x * cellWidth)
            .attr("y", (d) => d.y * cellHeight)
            .attr("width", cellWidth)
            .attr("height", cellHeight)
            .attr("fill", (d) => colorDiff(d.value))
            .attr("fill-opacity", 0.85);

        const svgLegend = d3.select("#legendStep" + i);

        // Clear previous content
        svgLegend.selectAll("*").remove();

        const legendWidth = +svgLegend.attr("width");
        const legendHeight = +svgLegend.attr("height");

        const marginHeat = { top: 30, right: 60, bottom: 20, left: 40 };
        const widthHeat = legendWidth - marginHeat.left - marginHeat.right;
        const heightHeat = legendHeight - marginHeat.top - marginHeat.bottom;

        const legendG = svgLegend
            .append("g")
            .attr("transform", `translate(${marginHeat.left},${marginHeat.top})`);

        // Create a defs and linearGradient for the color bar
        const defsHeat = svgLegend.append("defs");

        const gradientHeat = defsHeat
            .append("linearGradient")
            .attr("id", `legend-gradient-${i}`)
            .attr("x1", "0%")
            .attr("y1", "100%") // vertical bottom
            .attr("x2", "0%")
            .attr("y2", "0%"); // vertical top

        // Generate stops for gradient, e.g. 10 stops
        const stopsCount = 10;
        for (let i = 0; i <= stopsCount; i++) {
            const t = i / stopsCount;
            const value = -maxDiff + t * (2 * maxDiff);
            gradientHeat
                .append("stop")
                .attr("offset", `${t * 100}%`)
                .attr("stop-color", colorDiff(value));
        }

        // Draw the color bar rectangle using the gradient
        legendG
            .append("rect")
            .attr("width", widthHeat)
            .attr("height", heightHeat)
            .style("fill", `url(#legend-gradient-${i})`)
            .style("stroke", "black")
            .style("stroke-width", 0.5);

        // Scale for axis (values along the color bar)
        const legendScale = d3
            .scaleLinear()
            .domain([-maxDiff, 0, maxDiff])
            .range([-heightHeat / 4, heightHeat / 4]);

        // Axis with percentage formatting
        const legendAxis = d3
            .axisRight(legendScale)
            .ticks(5)
            .tickFormat((d) =>
                d === 0 ? `${d.toFixed(1)}` : `${d < 0 ? "+" : "-"}${d.toFixed(1)}`
            );

        // Append axis to legend group, translate right after the color bar
        legendG
            .append("g")
            .attr("transform", `translate(${widthHeat},80)`)
            .call(legendAxis);

        // Optional: legend title
        legendG
            .append("text")
            .attr("x", widthHeat / 2)
            .attr("y", -15)
            .attr("text-anchor", "middle")
            .style("font-weight", "bold")
            .style("font-size", "12px")
            .text("Comp - Incomp");
    }
    createHeatmap(svgHeat);

    const toggleButton = document.getElementById("toggle-heatmapStep" + i);

    toggleButton.addEventListener("click", () => {
        if (heatContainer.style("display") === "none") {
            // Show heatmap, hide passes
            heatContainer.style("display", "flex");
            regPitch.style("display", "none");
            toggleButton.textContent = "Toggle Passmap";
        } else {
            // Show passes, hide heatmap
            heatContainer.style("display", "none");
            regPitch.style("display", "inline");
            toggleButton.textContent = "Toggle Heatmap";
        }
    });
}
setUpStepI(1);
setUpStepI(2);
setUpStepI(3);
setUpStepI(4);
