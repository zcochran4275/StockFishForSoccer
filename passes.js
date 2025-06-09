import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
import scrollama from "https://cdn.jsdelivr.net/npm/scrollama@3.2.0/+esm";
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

const intro = document.querySelector(".intro");
intro.style.backgroundImage = 'url("assets/bg-soccer.jpeg")';
intro.style.backgroundSize = "cover"; // optional, but usually needed
intro.style.backgroundPosition = "center";
// Load YouTube iframe API
function handleStep(stepIndex, element) {
  // Remove active classes from all graphics
  document
    .querySelectorAll(".graphic-item")
    .forEach((item) => item.classList.remove("active"));

  // Add active class to the matched graphic
  const graphicToShow = document.getElementById(
    `graphic-item-${stepIndex + 1}`
  );
  if (graphicToShow) {
    graphicToShow.classList.add("active");
  }

  // Remove active from all steps, add to current
  document
    .querySelectorAll(".step")
    .forEach((step) => step.classList.remove("active"));
  element.classList.add("active");

  // Your custom logic for step 0 (e.g., start video)
  if (stepIndex === 0) {
    startVideoLoop?.();
  } else {
    stopVideoLoop?.();
  }
}

window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player("yt-player", {
    height: 315,
    width: 560,
    videoId: "8nQRnTSDwLs",
    playerVars: {
      start: 311,
      end: 322,
      autoplay: 0,
      controls: 0,
      modestbranding: 1,
      mute: 1,
    },
    events: {
      startVideoLoop: startVideoLoop,
      stopVideoLoop: stopVideoLoop,
    },
  });
};

// Load YouTube iframe API
const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

// Create YouTube player container
const playerContainer = document.querySelector(".player");
if (playerContainer && !document.getElementById("yt-player")) {
  const ytDiv = document.createElement("div");
  ytDiv.id = "yt-player";
  playerContainer.appendChild(ytDiv);
}

let player;
let checkInterval = null;
const VIDEO_STEP_INDEX = 0; // step-1 => graphic-item-1

function startVideoLoop() {
  if (!player) return;
  player.seekTo(311);
  player.playVideo();
  clearInterval(checkInterval);
  checkInterval = setInterval(() => {
    if (player.getCurrentTime() >= 322) {
      player.seekTo(311);
    }
  }, 500);
}

function stopVideoLoop() {
  if (player) {
    player.pauseVideo();
    clearInterval(checkInterval);
  }
}

function resetAndStartSlider() {
  progress = 0;
  clearInterval(animationInterval);
  animationInterval = setInterval(() => {
    if (progress + windowSize > 1) {
      clearInterval(animationInterval);
      return;
    }
    const startPixel = x(progress);
    const endPixel = x(progress + windowSize);
    svg.select(".brush").call(brush.move, [startPixel, endPixel]);
    progress += step;
  }, intervalDelay);
}

const scroller = scrollama();
let ballInterval;
// Set up Scrollama
const sliderStepIndex = 12; // Replace with your actual slider step index

scroller
  .setup({
    step: ".step",
    offset: 0.5,
    debug: false,
  })
  .onStepEnter((response) => {
    const stepIndex = Array.from(document.querySelectorAll(".step")).indexOf(
      response.element
    );

    // Remove 'active' from all graphic-items
    document.querySelectorAll(".graphic-item").forEach((item) => {
      item.classList.remove("active");
    });

    // Add 'active' class to the matching graphic-item
    const graphicToShow = document.getElementById(
      `graphic-item-${stepIndex + 1}`
    );
    if (graphicToShow) {
      graphicToShow.classList.add("active");
    }

    // Optional: Highlight current step
    document
      .querySelectorAll(".step")
      .forEach((el) => el.classList.remove("active"));
    response.element.classList.add("active");

    const graphicItem1 = document.getElementById("graphic-item-1");
    if (stepIndex === VIDEO_STEP_INDEX) {
      graphicItem1.style.display = "block";
      startVideoLoop();
    } else {
      stopVideoLoop();
      graphicItem1.style.display = "none";
    }
    if (stepIndex === 1) {
      if (ballInterval) {
        clearInterval(ballInterval);
      }
      animateSegments();
      ballInterval = setInterval(animateSegments, 13000);
    } else {
      if (ballInterval) {
        clearInterval(ballInterval);
      }
    }
    const graphicItem4 = document.getElementById("graphic-item-4");
    if (stepIndex === 3) {
      graphicItem4.style.display = "flex";
      //createPieChart();
      updateBarChart("");
      createStageLegend(euroSequences);
    } else {
      graphicItem4.style.display = "none";
    }
    const graphicItem9 = document.getElementById("graphic-item-9");
    if (stepIndex === 8) {
      graphicItem9.style.display = "flex";
    } else {
      graphicItem9.style.display = "none";
    }
    const graphicItem10 = document.getElementById("graphic-item-10");
    if (stepIndex === 9) {
      graphicItem10.style.display = "flex";
    } else {
      graphicItem10.style.display = "none";
    }
    const graphicItem11 = document.getElementById("graphic-item-11");
    if (stepIndex === 10) {
      graphicItem11.style.display = "flex";
    } else {
      graphicItem11.style.display = "none";
    }
    const graphicItem12 = document.getElementById("graphic-item-12");
    if (stepIndex === 11) {
      graphicItem12.style.display = "flex";
    } else {
      graphicItem12.style.display = "none";
    }
    const graphicItem13 = document.getElementById("graphic-item-13");
    if (stepIndex === 12) {
      graphicItem13.style.display = "block";
    } else {
      graphicItem13.style.display = "none";
    }
    const graphicItem14 = document.getElementById("graphic-item-14");
    if (stepIndex === 13) {
      graphicItem14.style.display = "flex";
    } else {
      graphicItem14.style.display = "none";
    }

    // NEW: Reset and restart slider animation on slider step enter
    if (stepIndex === sliderStepIndex) {
      resetAndStartSlider();
      startSliderAnimation(true);
      isPaused = false;
      document.getElementById("pause-animation-btn").textContent =
        "Pause Slider Animation";
    }
  });
// const graphicItem10 = document.getElementById("graphic-item-10");
// graphicItem10.style.display = "none";
// const graphicItem10 = document.getElementById("graphic-item-10");
// graphicItem10.style.display = "none";
// Recalculate dimensions on resize
window.addEventListener("resize", scroller.resize);
window.addEventListener("load", () => {
  const firstStep = document.querySelector(".step");
  if (firstStep) {
    scroller.resize();
    handleStep(0, firstStep);
  }
});

function getDribblesFromPasses(passes) {
  const dribbles = [];

  for (let i = 0; i < passes.length - 1; i++) {
    const currentPass = passes[i];
    const nextPass = passes[i + 1];

    dribbles.push({
      start: currentPass.end,
      end: nextPass.start,
      type: "Dribble",
    });
  }

  return dribbles;
}

const lamineChanceLast5 = await fetch("lamine_chance_last_5.json");
const passes = await lamineChanceLast5.json();
const lamineDribbles = getDribblesFromPasses(passes);
let passesV2 = passes.slice(0, passes.length - 1);
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

  const arcGenerator = d3
    .arc()
    .innerRadius(9.15)
    .outerRadius(9.15)
    .startAngle(-0.3 * Math.PI)
    .endAngle(0.3 * Math.PI);

  // Left penalty box arc
  svg
    .append("path")
    .attr("d", arcGenerator())
    .attr("transform", "translate(11,40) rotate(90,0,0)")
    .attr("fill", "none")
    .attr("class", "line");

  // Right penalty box arc
  const arcGeneratorRight = d3
    .arc()
    .innerRadius(9.15)
    .outerRadius(9.15)
    .startAngle(0.7 * Math.PI)
    .endAngle(1.3 * Math.PI);

  svg
    .append("path")
    .attr("d", arcGeneratorRight())
    .attr("transform", "translate(109,40) rotate(90,0,0)")
    .attr("fill", "none")
    .attr("class", "line");
}
const svg1 = d3.select("#pitch1");
const defs = svg1.append("defs");
passes.forEach((d, i) => {
  let color = d.outcome === 1.0 ? "green" : "red";
  if (d.type === "Dribble") color = "gray";
  const strokeWidth = 1.2 + i * 0.3; // adjust multiplier as needed

  defs
    .append("marker")
    .attr("id", `arrow-${i}`)
    .attr("viewBox", "0 0 10 10")
    .attr("refX", 2)
    .attr("refY", 5)
    .attr("markerWidth", strokeWidth) // scale arrow size with stroke
    .attr("markerHeight", strokeWidth)
    .attr("orient", "auto")
    .attr("markerUnits", "strokeWidth")
    .append("path")
    .attr("d", "M 0 0 L 10 5 L 0 10 z")
    .attr("fill", color);
});

drawFootballPitch(svg1);
const tooltip1 = d3
  .select("body")
  .append("div")
  .style("position", "absolute")
  .style("background", "rgba(0,0,0,0.7)")
  .style("color", "white")
  .style("padding", "6px")
  .style("border-radius", "4px")
  .style("font-size", "12px")
  .style("pointer-events", "none") // so it doesn't block mouse events
  .style("opacity", 0);

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
function getOutcomeLabel(outcome) {
  switch (outcome) {
    case 0:
      return "Incomplete";
    case 1:
      return "Complete";
    default:
      return "unknown";
  }
}
svg1
  .selectAll(".pass")
  .data(passes)
  .join("line")
  .attr("class", "pass")
  .attr("x1", (d) => d.start[0])
  .attr("y1", (d) => d.start[1])
  .attr("x2", (d) => d.end[0])
  .attr("y2", (d) => d.end[1])
  .attr("stroke", (d) => {
    if (d.type === "Dribble") return "gray";
    return d.outcome === 1.0 ? "green" : "red";
  })
  .attr("stroke-dasharray", (d) => {
    if (d.type === "Dribble") return "1 1"; // dashed for dribbles
    return "none"; // solid for passes
  })
  .attr("stroke-width", (d, i) => 0.4 + i * 0.1)
  .attr("marker-end", (d, i) => `url(#arrow-${i})`)
  .on("mouseover", (event, d) => {
    tooltip1.style("opacity", 1).html(`
        <strong>Pass</strong><br/>
        Outcome: ${getOutcomeLabel(d.outcome)}<br/>
        Type: ${d.type}<br/>
        Height: ${getHeightLabel(d.height)}
      `);
  })
  .on("mousemove", (event) => {
    tooltip1
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY + 10 + "px");
  })
  .on("mouseout", () => {
    tooltip1.style("opacity", 0);
  });
svg1
  .selectAll(".dribble")
  .data(lamineDribbles)
  .join("line")
  .attr("class", "dribble")
  .attr("x1", (d) => d.start[0])
  .attr("y1", (d) => d.start[1])
  .attr("x2", (d) => d.end[0])
  .attr("y2", (d) => d.end[1])
  .attr("stroke-width", 0.5)
  .attr("stroke-dasharray", "1 1");
const pathPoints = passes.flatMap((pass) => [pass.start, pass.end]);

// Convert [x, y] pairs to {x, y} objects
const points = pathPoints.map(([x, y]) => ({ x, y }));

// Append ball image
const BALL_SIZE = 6; // adjust to suit scale
const ball = svg1
  .append("image")
  .attr("href", "assets/Soccerball.png")
  .attr("width", BALL_SIZE)
  .attr("height", BALL_SIZE)
  .attr("x", -BALL_SIZE / 2)
  .attr("y", -BALL_SIZE / 2);

function animateSegments(index = 0) {
  if (index >= points.length - 1) return; // stop at last segment

  const start = points[index];
  const end = points[index + 1];
  const duration = (index / 2) % 2 === 0 ? 1000 : 1500; // Alternate speed per segment
  const easefn = index % 2 === 0 ? d3.easeLinear : d3.easeCubicInOut;

  ball
    .attr("x", start.x - BALL_SIZE / 2)
    .attr("y", start.y - BALL_SIZE / 2)
    .transition(easefn)
    .duration(duration)
    .attr("x", end.x - BALL_SIZE / 2)
    .attr("y", end.y - BALL_SIZE / 2)
    .on("end", () => animateSegments(index + 1));
}
// animateSegments();
// setInterval(animateSegments, 13000);

const reversedPasses = passes.reverse();
const passesFormatted = reversedPasses.flatMap(
  ({ start, end, type, outcome, height }) => [
    start[0],
    start[1],
    end[0],
    end[1],
    outcome,
    type,
    getHeightLabel(height),
  ]
);
const resultBox = document.getElementById("yamalChancexG");
try {
  const response = await fetch(
    "https://stockfishforsoccer.onrender.com/predict",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ features: passesFormatted }),
    }
  );

  const result = await response.json();
  if (result.prediction !== undefined) {
    resultBox.innerHTML = `The probability of this pass sequence leading to a goal is ${
      100 * result.prediction.toFixed(4)
    }%`;
  } else {
    resultBox.innerText = `Error: ${result.error}`;
  }
} catch (error) {
  resultBox.innerText = `Fetch error: ${error}`;
}
async function sendApiRequest(passesFormatted) {
  const resultBox = document.getElementById("yamalChancexG");
  try {
    const response = await fetch(
      "https://stockfishforsoccer.onrender.com/predict",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: passesFormatted }),
      }
    );

    const result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}
setInterval(sendApiRequest, 10 * 60 * 1000);

const svg2 = d3.select("#pitch2");
const lamineOptions = await fetch("lamineOptions.json");
const lamineOptionsData = await lamineOptions.json();
const endPoints = Object.values(lamineOptionsData).map((d) => d.end);
const startPoint = lamineOptionsData.option1.start;
const defs2 = svg2.append("defs");
passesV2.forEach((d, i) => {
  let color = d.outcome === 1.0 ? "green" : "red";
  if (d.type === "Dribble") color = "gray";
  const strokeWidth = 1.2 + i * 0.1; // adjust multiplier as needed

  defs2
    .append("marker")
    .attr("id", `arrow2-${i}`)
    .attr("viewBox", "0 0 10 10")
    .attr("refX", 2)
    .attr("refY", 5)
    .attr("markerWidth", strokeWidth) // scale arrow size with stroke
    .attr("markerHeight", strokeWidth)
    .attr("orient", "auto")
    .attr("markerUnits", "strokeWidth")
    .append("path")
    .attr("d", "M 0 0 L 10 5 L 0 10 z")
    .attr("fill", color);
});
defs2
  .append("marker")
  .attr("id", "arrow2green")
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

defs2
  .append("marker")
  .attr("id", "arrow2red")
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
drawFootballPitch(svg2);

const tooltip2 = d3
  .select("#graphic-item-3")
  .append("div")
  .style("position", "fixed")
  .style("background", "rgba(0,0,0,0.7)")
  .style("color", "white")
  .style("padding", "6px")
  .style("border-radius", "4px")
  .style("font-size", "12px")
  .style("pointer-events", "none") // so it doesn't block mouse events
  .style("opacity", 0);

svg2
  .selectAll(".pass")
  .data(passesV2)
  .join("line")
  .attr("class", "pass")
  .attr("x1", (d) => d.start[0])
  .attr("y1", (d) => d.start[1])
  .attr("x2", (d) => d.end[0])
  .attr("y2", (d) => d.end[1])
  .attr("stroke", (d) => {
    if (d.type === "Dribble") return "gray";
    return d.outcome === 1.0 ? "green" : "red";
  })
  .attr("stroke-dasharray", (d) => {
    if (d.type === "Dribble") return "1 1"; // dashed for dribbles
    return "none"; // solid for passes
  })
  .attr("stroke-width", (d, i) => 0.5 + i * 0.1)
  .attr("marker-end", (d, i) => `url(#arrow2-${i})`);
svg2
  .selectAll(".dribble")
  .data(lamineDribbles)
  .join("line")
  .attr("class", "dribble")
  .attr("x1", (d) => d.start[0])
  .attr("y1", (d) => d.start[1])
  .attr("x2", (d) => d.end[0])
  .attr("y2", (d) => d.end[1])
  .attr("stroke-width", 0.5)
  .attr("stroke-dasharray", "1 1");
svg2
  .append("circle")
  .attr("cx", startPoint[0])
  .attr("cy", startPoint[1])
  .attr("r", 1)
  .attr("fill", "black");
svg2
  .append("text")
  .attr("x", startPoint[0] - 8) // slight offset to the right
  .attr("y", startPoint[1] + 0.8) // slight offset above
  .text("Start")
  .attr("font-size", "3px")
  .attr("fill", "black");
svg2
  .selectAll(".option-circle")
  .data(endPoints)
  .enter()
  .append("circle")
  .attr("class", "option-circle")
  .attr("cx", (d) => d[0])
  .attr("cy", (d) => d[1])
  .attr("r", 1)
  .attr("fill", "blue")
  .on("click", async (event, d) => {
    svg2.selectAll(".selected-arrow").remove();
    // Draw new arrow
    svg2
      .append("line")
      .attr("class", "selected-arrow")
      .attr("x1", startPoint[0])
      .attr("y1", startPoint[1])
      .attr("x2", d[0])
      .attr("y2", d[1])
      .attr("stroke", "green")
      .attr("stroke-width", (d, i) => 0.5 + 5 * 0.2)
      .attr("marker-end", "url(#arrow2green)");
    if (passesV2.length === 5) {
      passesV2 = passesV2.slice(0, 4);
    }
    passesV2.push({
      outcome: 1.0,
      start: [85.3, 34.5],
      end: [d[0], d[1]],
      type: "Pass",
      height: 0.0,
    });

    try {
      const reversedPassesV2 = passesV2.reverse();
      const passesFormattedV2 = reversedPassesV2.flatMap(
        ({ start, end, type, outcome, height }) => [
          start[0],
          start[1],
          end[0],
          end[1],
          outcome,
          type,
          getHeightLabel(height),
        ]
      );
      console.log(passesFormattedV2);
      const response = await fetch(
        "https://stockfishforsoccer.onrender.com/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ features: passesFormattedV2 }),
        }
      );

      const result = await response.json();
      console.log(result);
      if (result.prediction !== undefined) {
        tooltip2
          .style("opacity", 1)
          .html(
            `
                        Pass sequence xG: ${(
                          100 * result.prediction.toFixed(4)
                        ).toFixed(2)}%.      
                    `
          )
          .style("left", `${event.clientX + 10}px`)
          .style("top", `${event.clientY + 10}px`);
        console.log(tooltip2);
      } else {
        tooltip2.html(`Error: ${result.error}`);
      }
    } catch (error) {
      tooltip2.html(`Fetch error: ${error}`);
    }
    passesV2 = passesV2.reverse();
  });

svg2
  .selectAll(".option-label")
  .data(endPoints)
  .enter()
  .append("text")
  .attr("class", "option-label")
  .attr("x", (d) => d[0] - 9) // use d[0] for x
  .attr("y", (d) => d[1] + 1) // use d[1] for y
  .text((d, i) => "Option " + (i + 1))
  .attr("font-size", "2px")
  .attr("fill", "black")
  .style("pointer-events", "none");

// euroSequences.map(d => {
//   d.pass_height = parseInt(d.pass_height);
//   if (d.pass_height === 0) d.pass_height = "Ground";
//   else if (d.pass_height === 1) d.pass_height = "Low";
//   else if (d.pass_height === 2) d.pass_height = "High";
//   return d;
// });
const topTenSequences = euroSequences
  .filter((seq) => parseInt(seq.all_successful) === 1)
  .sort((a, b) => b.sequence_pred - a.sequence_pred)
  .slice(0, 10);

function getPassLocationsWithMetadata(sequence) {
  const passes = [];

  // Previous passes 4 to 1
  for (let i = 4; i >= 1; i--) {
    const x1 = parseFloat(sequence[`prev_pass${i}_x1`]);
    const y1 = parseFloat(sequence[`prev_pass${i}_y1`]);
    const x2 = parseFloat(sequence[`prev_pass${i}_x2`]);
    const y2 = parseFloat(sequence[`prev_pass${i}_y2`]);
    const outcome = parseFloat(sequence[`prev_pass${i}_outcome`]);
    const height = parseFloat(sequence[`prev_pass${i}_height`]);
    const type = sequence[`prev_pass${i}_type`];
    const possession = parseInt(sequence.possession);
    if (!isNaN(x1) && !isNaN(y1) && !isNaN(x2) && !isNaN(y2)) {
      passes.push({
        start: [x1, y1],
        end: [x2, y2],
        outcome: isNaN(outcome) ? null : outcome,
        height: isNaN(height) ? null : height,
        type: type,
        sequence_pred: sequence.sequence_pred,
        team: sequence.team,
        possession: possession,
      });
    }
  }

  // Final (current) pass
  const finalX1 = parseFloat(sequence.x1);
  const finalY1 = parseFloat(sequence.y1);
  const finalX2 = parseFloat(sequence.x2);
  const finalY2 = parseFloat(sequence.y2);
  const finalOutcome = parseFloat(sequence.outcome);
  const finalHeight = parseFloat(sequence.pass_height);
  const finalType = sequence.type || "Pass";
  const finalPossession = parseInt(sequence.possession);

  if (
    !isNaN(finalX1) &&
    !isNaN(finalY1) &&
    !isNaN(finalX2) &&
    !isNaN(finalY2)
  ) {
    passes.push({
      start: [finalX1, finalY1],
      end: [finalX2, finalY2],
      outcome: isNaN(finalOutcome) ? null : finalOutcome,
      height: isNaN(finalHeight) ? null : finalHeight,
      type: finalType,
      sequence_pred: sequence.sequence_pred,
      team: sequence.team,
      possession: finalPossession,
    });
  }

  return passes;
}

const topTenSequencePasses = topTenSequences.map(getPassLocationsWithMetadata);
const topTenSequenceDribbles = topTenSequencePasses.map(getDribblesFromPasses);
const svg3 = d3.select("#pitch3");
const defs3 = svg3.append("defs");

let currentSequenceIndex = 0;

function updateArrowDefs() {
  // Clear existing markers
  defs3.selectAll("marker").remove();

  topTenSequencePasses[currentSequenceIndex].forEach((d, i) => {
    const color = d.outcome === 1.0 ? "green" : "red";
    const strokeWidth = 1.2 + i * 0.1;

    defs3
      .append("marker")
      .attr("id", `arrow3-${i}`)
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 2)
      .attr("refY", 5)
      .attr("markerWidth", strokeWidth)
      .attr("markerHeight", strokeWidth)
      .attr("orient", "auto")
      .attr("markerUnits", "strokeWidth")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", color);
  });
}

function updatePassDisplay() {
  updateArrowDefs();

  // Update sequence header
  const currentSequence = topTenSequencePasses[currentSequenceIndex][0];
  d3.select("#sequence-header").html(
    `<div class="country-sequence">Team: ${
      currentSequence.team
    }<br>Sequence Probability: ${(currentSequence.sequence_pred * 100).toFixed(
      2
    )}%</div>`
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
    .attr("stroke-width", (d, i) => 0.5 + i * 0.2)
    .attr("marker-end", (d, i) => `url(#arrow3-${i})`)
    .on("mouseover", (event, d) => {
      tooltip3.style("opacity", 1).html(`
              <strong>Pass</strong><br/>
              Outcome: ${getOutcomeLabel(d.outcome)}<br/>
              Type: ${d.type}<br/>
              Height: ${getHeightLabel(d.height)}
            `);
    })
    .on("mousemove", (event) => {
      tooltip3
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY + 10 + "px");
    })
    .on("mouseout", () => {
      tooltip3.style("opacity", 0);
    });

  svg3
    .selectAll(".dribble")
    .data(topTenSequenceDribbles[currentSequenceIndex])
    .join("line")
    .attr("class", "dribble")
    .attr("x1", (d) => d.start[0])
    .attr("y1", (d) => d.start[1])
    .attr("x2", (d) => d.end[0])
    .attr("y2", (d) => d.end[1])
    .attr("stroke-width", 0.5)
    .attr("stroke-dasharray", "1 1");
  // Update sequence counter display
  d3.select("#sequence-counter").text(
    `Sequence ${currentSequenceIndex + 1} of ${topTenSequencePasses.length}`
  );

  // Remove any existing last-pass indicator
  svg3.selectAll(".last-pass-indicator").remove();

  // Get the last pass
  const lastPass = topTenSequencePasses[currentSequenceIndex].slice(-1)[0];

  // Calculate midpoint of the last pass
  const midX = (lastPass.start[0] + lastPass.end[0]) / 2;
  const midY = (lastPass.start[1] + lastPass.end[1]) / 2;

  // Define direction for the arrow (e.g., from slightly left of midpoint)
  const arrowStartX = midX - 20;
  const arrowStartY = midY;

  // Define arrowhead marker if it doesn't exist
  if (defs3.select("#last-arrow-marker").empty()) {
    defs3
      .append("marker")
      .attr("id", "last-arrow-marker")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 5)
      .attr("refY", 5)
      .attr("markerWidth", 2)
      .attr("markerHeight", 2)
      .attr("orient", "auto")
      .attr("markerUnits", "strokeWidth")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", "blue");
  }

  // Draw the blue arrow pointing toward the midpoint
  svg3
    .append("line")
    .attr("class", "last-pass-indicator")
    .attr("x1", arrowStartX)
    .attr("y1", arrowStartY)
    .attr("x2", midX - 2)
    .attr("y2", midY)
    .attr("stroke", "blue")
    .attr("stroke-width", 0.5)
    .attr("marker-end", "url(#last-arrow-marker)");

  // Only show text for the first sequence
  if (currentSequenceIndex === 0) {
    // Remove any existing instruction text
    svg3.selectAll(".arrow-instruction").remove();

    // Get midpoint of last pass again (already calculated earlier)
    const lastPass = topTenSequencePasses[0].slice(-1)[0];
    const midX = (lastPass.start[0] + lastPass.end[0]) / 2;
    const midY = (lastPass.start[1] + lastPass.end[1]) / 2;

    // Add instruction text above the arrow
    svg3
      .append("text")
      .attr("class", "arrow-instruction")
      .attr("x", midX - 18)
      .attr("y", midY - 2)
      .attr("text-anchor", "middle")
      .style("font-size", "1.5px")
      .style("fill", "blue")
      .text("The blue arrow points towards the last pass!");
  } else {
    // Remove instruction if not the first sequence
    svg3.selectAll(".arrow-instruction").remove();
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
const controlsContainer = d3
  .select("#pitch3-container")
  .append("div")
  .style("text-align", "center")
  .style("margin-top", "10px");

controlsContainer
  .append("span")
  .attr("id", "sequence-counter")
  .style("margin", "0 10px")
  .style("font-size", "12px")
  .text(`Sequence 1 of ${topTenSequencePasses.length}`);

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

let filteredEuroSequences = euroSequences;
//for pie and bar charts this is the average pass sequence xG per possession for a team.
const teamsPreds = d3.rollup(
  euroSequences,
  (v) => d3.max(v, (d) => d.sequence_pred), // Get max pred for each possession
  (d) => d.team,
  (d) => d.possession, // Group by team and possession
  (d) => d.match_id
);
// Calculate mean of possession max predictions per team
const teamAverages = Array.from(teamsPreds.entries()).map(
  ([team, possessions]) => {
    const possessionValues = Array.from(possessions.values());
    return {
      team: team,
      avgPred: d3.mean(possessionValues),
    };
  }
);
const teamSums = Array.from(teamsPreds.entries()).map(([team, possessions]) => {
  const possessionValues = Array.from(possessions.values());
  return {
    team: team,
    sumPred: d3.sum(possessionValues),
  };
});

const stagePreds = d3.rollup(
  euroSequences,
  (v) => d3.sum(v, (d) => d.sequence_pred), // Get max pred for each possession
  (d) => d.competition_stage
);
let clickedStage = "";

function createPieChart() {
  d3.select("#pie-chart").selectAll("*").remove(); // clear old

  const stageData = Array.from(stagePreds, ([stage, value]) => ({
    stage,
    value,
  }));
  const pieChart = d3.select("#pie-chart");
  const chartRect = pieChart.node().getBoundingClientRect();
  const pieWidth = 0.5 * chartRect.width; // Pie takes half width
  const legendWidth = 200; // Width reserved for legend
  const svgWidth = pieWidth + legendWidth + 60; // Add some spacing
  const pieHeight = 0.8 * chartRect.height;
  const svgHeight = pieHeight;

  const radius = Math.min(pieWidth, pieHeight) / 2.5;

  const svg = pieChart
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // Position pie in the left half
  const pieSvg = svg
    .append("g")
    .attr("transform", `translate(${pieWidth / 2 + 40}, ${pieHeight / 2})`);

  const color = d3
    .scaleOrdinal()
    .domain(stageData.map((d) => d.stage))
    .range(d3.schemeCategory10);

  const pie = d3.pie().value((d) => d.value);
  const arc = d3.arc().innerRadius(0).outerRadius(radius);

  const arcs = pieSvg
    .selectAll("g")
    .data(pie(stageData))
    .enter()
    .append("g")
    .attr("class", "arc");

  arcs
    .append("path")
    .attr("d", arc)
    .attr("fill", (d) => color(d.data.stage))
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .on("click", (event, d) => {
      // Reset all slices
      arcs
        .selectAll("path")
        .classed("active", false)
        .transition()
        .duration(200)
        .attr("transform", null);

      if (clickedStage === d.data.stage) {
        clickedStage = "";
        updateBarChart("");
      } else {
        clickedStage = d.data.stage;

        // Animate clicked slice
        const [x, y] = arc.centroid(d);
        const offset = 20;
        const angle = Math.atan2(y, x);
        const dx = Math.cos(angle) * offset;
        const dy = Math.sin(angle) * offset;

        d3.select(event.currentTarget)
          .classed("active", true)
          .transition()
          .duration(200)
          .attr("transform", `translate(${dx}, ${dy}) scale(1.15)`);

        updateBarChart(clickedStage);
      }
    });

  const legendItemHeight = 24;
  const legendHeight = stageData.length * legendItemHeight;

  // Position the legend to the right of the pie chart, vertically centered
  const legend = svg
    .append("g")
    .attr("id", "pie-legend")
    .attr(
      "transform",
      `translate(${pieWidth + 30}, ${pieHeight / 2 - legendHeight / 2})`
    );

  const legendItems = legend
    .selectAll(".legend-item")
    .data(stageData)
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform", (d, i) => `translate(60, ${i * legendItemHeight})`);

  legendItems
    .append("rect")
    .attr("width", 16)
    .attr("height", 16)
    .attr("fill", (d) => color(d.stage));

  legendItems
    .append("text")
    .attr("x", 22)
    .attr("y", 13)
    .text((d) => d.stage)
    .style("font-size", "14px");
}

// Sort teams by sum prediction descending
teamSums.sort((a, b) => b.sumPred - a.sumPred);
// Function to create/update bar chart
function updateBarChart(stage) {
  filteredEuroSequences = euroSequences;
  if (stage === "") {
    filteredEuroSequences = euroSequences;
  } else {
    filteredEuroSequences = filteredEuroSequences.filter(
      (d) => d.competition_stage === stage
    );
  }
  filteredEuroSequences = filteredEuroSequences.sort(
    (a, b) => a.sequence_pred - b.sequence_pred
  );
  const teamsPreds = d3.rollup(
    filteredEuroSequences,
    (v) => d3.max(v, (d) => d.sequence_pred), // Get max pred for each possession
    (d) => d.team,
    (d) => d.possession, // Group by team and possession
    (d) => d.match_id
  );
  const flattened = [];

  for (const [team, possessionMap] of teamsPreds.entries()) {
    for (const [possession, matchMap] of possessionMap.entries()) {
      for (const [match_id, max_pred] of matchMap.entries()) {
        flattened.push({ team, possession, match_id, max_pred });
      }
    }
  }
  const teamMatchSums = d3.rollup(
    flattened,
    (v) => d3.sum(v, (d) => d.max_pred),
    (d) => d.team,
    (d) => d.match_id
  );
  // Calculate mean of possession max predictions per team
  const teamAverages = Array.from(teamMatchSums.entries()).map(
    ([team, matchMap]) => {
      const matchSums = Array.from(matchMap.values());
      return {
        team,
        avgPred: d3.mean(matchSums),
      };
    }
  );
  const teamSums = Array.from(teamsPreds.entries()).map(
    ([team, possessions]) => {
      const possessionValues = Array.from(possessions.values());
      return {
        team: team,
        sumPred: d3.sum(possessionValues),
      };
    }
  );
  teamAverages.sort((a, b) => b.avgPred - a.avgPred);
  // Clear existing chart
  d3.select("#bar-chart").selectAll("*").remove();

  const barChart = d3.select("#bar-chart");
  const barWidth = 0.8 * barChart.node().getBoundingClientRect().width;
  const barHeight = 0.7 * barChart.node().getBoundingClientRect().height;
  const barMargin = {
    top: 80,
    right: 20,
    bottom: 60,
    left: 60,
  };

  // Create SVG container
  const barSvg = d3
    .select("#bar-chart")
    .append("svg")
    .attr("width", barWidth + barMargin.left + barMargin.right)
    .attr("height", barHeight + barMargin.top + barMargin.bottom)
    .append("g")
    .attr("transform", `translate(${barMargin.left},${barMargin.top})`);

  // Create scales
  const x = d3
    .scaleBand()
    .range([0, barWidth])
    .domain(teamAverages.map((d) => d.team))
    .padding(0.2);

  const y = d3
    .scaleLinear()
    .range([barHeight, 0])
    .domain([0, d3.max(teamAverages, (d) => d.avgPred)]);

  // Add X axis
  barSvg
    .append("g")
    .attr("transform", `translate(0,${barHeight})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Add Y axis
  barSvg.append("g").call(d3.axisLeft(y));

  // Add bars
  barSvg
    .selectAll("rect")
    .data(teamAverages)
    .join("rect")
    .attr("x", (d) => x(d.team))
    .attr("y", (d) => y(d.avgPred))
    .attr("width", x.bandwidth())
    .attr("height", (d) => barHeight - y(d.avgPred))
    .attr("fill", (d) => {
      switch (d.team.toLowerCase()) {
        case "spain":
          return "#FFD700"; // Gold
        case "england":
          return "#C0C0C0"; // Silver
        case "netherlands":
        case "france":
          return "#CD7F32"; // Bronze
        default:
          return "#d0e7ff"; // Default
      }
    });

  // Add title
  barSvg
    .append("text")
    .attr("x", barWidth / 2)
    .attr("y", -50)
    .attr("text-anchor", "middle")
    .style("font-size", "32px")
    .style("font-weight", "bold")
    .text("Spain's Passing Dominance");
  barSvg
    .append("text")
    .attr("x", barWidth / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("Average Expected Goals per Game from Pass Sequences");

  // Add Y axis label
  barSvg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", -(barHeight / 2))
    .attr("text-anchor", "middle")
    .text("Average Expected Goals per Game");
}
function createStageLegend(data) {
  const desiredOrder = [
    "Group Stage",
    "Round of 16",
    "Quarter-finals",
    "Semi-finals",
    "Final",
  ];

  const stages = Array.from(new Set(data.map((d) => d.competition_stage)))
    .filter(Boolean)
    .sort((a, b) => desiredOrder.indexOf(a) - desiredOrder.indexOf(b));

  let currentStage = ""; // Track currently selected stage ("All" by default)

  const legend = d3.select("#bar-chart-legend");
  legend.selectAll("*").remove(); // Clear previous

  legend
    .append("div")
    .attr("class", "legend-title")
    .text("Filter by Competition Stage:");

  const buttons = legend
    .selectAll(".stage-button")
    .data(["All", ...stages])
    .join("button")
    .attr("class", "stage-button")
    .text((d) => d)
    .on("click", function (event, stage) {
      const selectedStage = stage === "All" ? "" : stage;

      if (currentStage === selectedStage) {
        // If clicked again, unselect and reset to All
        currentStage = "";
        d3.selectAll(".stage-button").classed("active", false);
        d3.select(this).classed("active", false);
        updateBarChart("");
      } else {
        // Apply filter
        currentStage = selectedStage;
        d3.selectAll(".stage-button").classed("active", false);
        d3.select(this).classed("active", true);
        updateBarChart(selectedStage);
      }
    });
}

function safeCreateBarChart() {
  const barChartEl = document.getElementById("bar-chart");
  if (!barChartEl) return;

  const width = barChartEl.getBoundingClientRect().width;
  const height = barChartEl.getBoundingClientRect().height;

  if (width > 0 && height > 0) {
    updateBarChart(""); // your main chart function
  } else {
    requestAnimationFrame(safeCreateBarChart); // try again on next frame
  }
}
function safeCreatePieChart() {
  const pieEl = document.getElementById("pie-chart");
  if (!pieEl) return;

  const width = pieEl.getBoundingClientRect().width;
  const height = pieEl.getBoundingClientRect().height;

  if (width > 0 && height > 0) {
    createPieChart();
  } else {
    requestAnimationFrame(safeCreatePieChart); // Try again when layout is ready
  }
}

// Run once DOM and layout are ready
window.addEventListener("load", () => {
  createStageLegend(euroSequences);
  safeCreateBarChart();
  //safeCreatePieChart();
});
// Update on window resize
window.addEventListener("resize", () => {
  createStageLegend(euroSequences);
  updateBarChart("");
  //createPieChart();
});

// Create a new SVG for the pass visualization
const pitch4 = d3.select("#pitch4");
const svgHeat = d3.select("#pitch5");

const heatContainer = d3.select("#heatmap-container");
// Clear any existing elements
pitch4.selectAll("*").remove();
drawFootballPitch(pitch4);
heatContainer.style("display", "flex");
pitch4.style("display", "none");

// Get the best sequence for each possession
const teamsLastPreds = d3.rollup(
  filteredEuroSequences,
  (v) => d3.max(v, (d) => d.sequence_pred),
  (d) => d.match_id,
  (d) => d.possession
);

// All rows with max prediction for each possession
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
let start = 0.45;
let end = 0.55;
let globalType = "";
let globalHeight = "";
let accuracy = 0;

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

function updatePasses(lower, upper, type, height) {
  pitch4.selectAll("*").remove();
  drawFootballPitch(pitch4);

  const lowerPredThreshold = d3.quantileSorted(sortedPreds, lower);
  const upperPredThreshold = d3.quantileSorted(sortedPreds, upper);
  // Filter based on thresholds
  matchedRows = matchedRowsFull.filter(
    (d) =>
      d.sequence_pred >= lowerPredThreshold &&
      d.sequence_pred <= upperPredThreshold
  );
  if (globalType !== "") {
    matchedRows = matchedRows.filter((d) => d.type === globalType);
  }
  if (globalHeight !== "") {
    matchedRows = matchedRows.filter((d) => d.pass_height === globalHeight);
  }
  accuracy =
    matchedRows.filter((d) => parseInt(d.outcome) === 1).length /
    matchedRows.length;

  // Draw passes
  pitch4
    .selectAll("line")
    .data(matchedRows)
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

let animationInterval;

function animateBrushRight(step = 0.01, delay = 500) {
  if (animationInterval) clearInterval(animationInterval);

  animationInterval = setInterval(() => {
    const brushNode = svg.select(".brush").node();
    const currentSelection = d3.brushSelection(brushNode);

    if (!currentSelection) return;

    let [startPx, endPx] = currentSelection;
    let startVal = x.invert(startPx) + step;
    let endVal = x.invert(endPx) + step;

    // If we've reached or exceeded 1, reset to start
    if (endVal >= 1) {
      startVal = 0;
      endVal = 0.1; // Width of the brush window (adjustable)
    }

    svg.select(".brush").call(brush.move, [x(startVal), x(endVal)]);
  }, delay);
}

// // Slider config
const margin = { top: 20, right: 50, bottom: 20, left: 50 };
const width = 500 - margin.left - margin.right;
const height = 80;

const svg = d3
  .select("#slider-container")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);
svg
  .append("text")
  .attr("x", width / 2)
  .attr("y", 0) // Position it above the slider
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .style("font-weight", "bold")
  .text("Select the percentile of pass xG for passes displayed");

const x = d3.scaleLinear().domain([0, 1]).range([0, width]);

function ordinalSuffix(n) {
  const s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
svg
  .append("g")
  .attr("transform", `translate(0,${height / 2})`)
  .call(
    d3
      .axisBottom(x)
      .ticks(10)
      .tickFormat((d) => ordinalSuffix(Math.round(d * 100)))
  );

const brush = d3
  .brushX()
  .extent([
    [0, 0],
    [width, height],
  ])
  .on("start", () => {
    // Stop animation if brush is manually interacted with
    clearInterval(animationInterval);
  })
  .on("brush end", ({ selection }) => {
    if (selection) {
      start = x.invert(selection[0]);
      end = x.invert(selection[1]);

      updatePasses(start, end, globalType, globalHeight);
      createPassTypePieChart();
      createPassHeightPieChart();
      drawAccuracyChart(accuracy);
      createHeatmap();
      //clearInterval(animationInterval);
    }
  });

svg
  .append("g")
  .attr("class", "brush")
  .call(brush)
  .call(brush.move, [0.45, 0.55].map(x)); // Initial range: 10%–90%

let progress = 0;
const windowSize = 0.1; // size of the sliding window (10%)
const step = 0.01; // how much to move per tick
const intervalDelay = 150; // milliseconds between steps

let sliderAnimationInterval = setInterval(() => {
  if (progress + windowSize > 1) {
    clearInterval(sliderAnimationInterval); // Stop at end
    return;
  }

  const startPixel = x(progress);
  const endPixel = x(progress + windowSize);

  svg.select(".brush").call(brush.move, [startPixel, endPixel]);

  progress += step;
}, intervalDelay);

function startSliderAnimation(resetProgress = false) {
  if (resetProgress) {
    progress = 0;
  }
  clearInterval(sliderAnimationInterval);

  sliderAnimationInterval = setInterval(() => {
    // Dynamically get brush width (in pixels) and convert it to a fraction of the x domain
    const brushSelection = d3.brushSelection(svg.select(".brush").node());
    if (!brushSelection) return;

    const [startPixel, endPixel] = brushSelection;
    const currentWindowSize = x.invert(endPixel) - x.invert(startPixel);

    if (progress + currentWindowSize > 1) {
      clearInterval(sliderAnimationInterval);
      return;
    }

    const start = x(progress);
    const end = x(progress + currentWindowSize);

    svg.select(".brush").call(brush.move, [start, end]);

    progress += step;
  }, intervalDelay);
}

startSliderAnimation();

document.getElementById("start-animation-btn").addEventListener("click", () => {
  startSliderAnimation();
});

let isPaused = false;

document.getElementById("start-animation-btn").addEventListener("click", () => {
  // Start fresh from the beginning
  startSliderAnimation(true);
  isPaused = false;
  document.getElementById("pause-animation-btn").textContent =
    "Pause Slider Animation";
});

document.getElementById("pause-animation-btn").addEventListener("click", () => {
  if (isPaused) {
    // Resume without resetting progress
    startSliderAnimation(false);
    document.getElementById("pause-animation-btn").textContent =
      "Pause Slider Animation";
  } else {
    // Pause animation
    clearInterval(sliderAnimationInterval);
    document.getElementById("pause-animation-btn").textContent =
      "Resume Slider Animation";
  }
  isPaused = !isPaused;
});

function createPassTypePieChart() {
  d3.select("#pass-type-pie-chart").selectAll("*").remove(); // clear previous chart

  // Count pass types
  const passTypeCounts = d3.rollup(
    matchedRows,
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
    .select("#pass-type-pie-chart")
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
      .on("mouseover", function () {
        if (globalType !== d.data.type) {
          const [x, y] = arc.centroid(d);
          d3.select(this)
            .transition()
            .duration(200)
            .attr("transform", `translate(${x * 0.1}, ${y * 0.1})`);
        }
      })
      .on("mouseout", function () {
        if (globalType !== d.data.type) {
          d3.select(this).transition().duration(200).attr("transform", null);
        }
      })
      .on("click", function (event, d) {
        handleClick(d.data.type, d, this); // <- Fix here
      });

    pathMap.set(d.data.type, path);
  });

  function handleClick(type, d, element) {
    // Reset all
    arcs
      .selectAll("path")
      .classed("active", false)
      .transition()
      .duration(200)
      .attr("transform", null);

    if (globalType === type) {
      globalType = "";
      updatePasses(start, end, globalType, globalHeight);
      createPassTypePieChart();
      createPassHeightPieChart();
      drawAccuracyChart(accuracy);
      createHeatmap();
    } else {
      globalType = type;

      const [x, y] = arc.centroid(d);
      const offset = 20;
      const angle = Math.atan2(y, x);
      const dx = Math.cos(angle) * offset;
      const dy = Math.sin(angle) * offset;

      d3.select(element)
        .classed("active", true)
        .transition()
        .duration(200)
        .attr("transform", `translate(${dx}, ${dy}) scale(1.1)`);
      updatePasses(start, end, globalType, globalHeight);
      createPassTypePieChart();
      createPassHeightPieChart();
      drawAccuracyChart(accuracy);
      createHeatmap();
    }
  }

  // Create legend
  const legend = svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${pieWidth + 20}, 20)`);

  const legendItems = legend
    .selectAll(".legend-item")
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
// Call the function to create pie chart
createPassTypePieChart();

function createPassHeightPieChart() {
  d3.select("#pass-height-pie-chart").selectAll("*").remove();

  const passHeightCounts = d3.rollup(
    matchedRows,
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
    .select("#pass-height-pie-chart")
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

  function handleClick(height, d, element) {
    arcs
      .selectAll("path")
      .classed("active", false)
      .transition()
      .duration(200)
      .attr("transform", null);

    if (globalHeight === height) {
      globalHeight = "";
    } else {
      globalHeight = height;

      const [x, y] = arc.centroid(d);
      const angle = Math.atan2(y, x);
      const dx = Math.cos(angle) * 20;
      const dy = Math.sin(angle) * 20;

      d3.select(element)
        .classed("active", true)
        .transition()
        .duration(200)
        .attr("transform", `translate(${dx}, ${dy}) scale(1.1)`);
    }

    // Apply filter with both height and type
    let filtered = matchedRowsFull.filter(
      (d) =>
        d.sequence_pred >= d3.quantileSorted(sortedPreds, start) &&
        d.sequence_pred <= d3.quantileSorted(sortedPreds, end)
    );

    if (globalType !== "") {
      filtered = filtered.filter((d) => d.type === globalType);
      updatePasses(start, end, globalType, globalHeight);
      createPassTypePieChart();
      createPassHeightPieChart();
      drawAccuracyChart(accuracy);
      createHeatmap();
    }
    if (globalHeight !== "") {
      filtered = filtered.filter((d) => d.height === globalHeight);
      updatePasses(start, end, globalType, globalHeight);
      createPassTypePieChart();
      createPassHeightPieChart();
      drawAccuracyChart(accuracy);
      createHeatmap();
    }

    updatePasses(start, end, globalType, globalHeight);
    createPassTypePieChart();
    createPassHeightPieChart();
    drawAccuracyChart(accuracy);
    createHeatmap();
  }

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
createPassHeightPieChart();

function createHeatmap() {
  svgHeat.selectAll("*").remove();
  drawFootballPitch(svgHeat);
  const svgWidthHeat = +svgHeat.attr("width");
  const svgHeightHeat = +svgHeat.attr("height");

  // Dimensions of the pitch
  const pitchWidth = 120;
  const pitchHeight = 80;

  // Grid
  const gridCols = 60; // more = smoother
  const gridRows = 40;
  const cellWidth = pitchWidth / gridCols;
  const cellHeight = pitchHeight / gridRows;

  const completePasses = matchedRows.filter((d) => parseInt(d.outcome) === 1);
  const incompletePasses = matchedRows.filter((d) => parseInt(d.outcome) !== 1);

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
  //const maxDiff = 4.5;

  const colorDiff = d3
    .scaleDiverging()
    .domain([-maxDiff, 0, maxDiff])
    .interpolator(d3.interpolateRdYlGn);

  // Draw
  svgHeat
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

  const svgLegend = d3.select("#legend");

  // Clear previous content
  svgLegend.selectAll("*").remove();

  const legendWidth = +svgLegend.attr("width");
  const legendHeight = +svgLegend.attr("height");

  const marginHeat = { top: 20, right: 60, bottom: 20, left: 40 };
  const widthHeat = legendWidth - marginHeat.left - marginHeat.right;
  const heightHeat = legendHeight - marginHeat.top - marginHeat.bottom;

  const legendG = svgLegend
    .append("g")
    .attr("transform", `translate(${marginHeat.left},${marginHeat.top})`);

  // Create a defs and linearGradient for the color bar
  const defsHeat = svgLegend.append("defs");

  const gradientHeat = defsHeat
    .append("linearGradient")
    .attr("id", "legend-gradient")
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
    .style("fill", "url(#legend-gradient)")
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
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .style("font-weight", "bold")
    .style("font-size", "12px")
    .text("Comp - Incomp");
}

createHeatmap();
const toggleButton = document.getElementById("toggle-heatmap");

// heatContainer.style("display", "flex");
// pitch4.style("display", "none");
// toggleButton.textContent = "Toggle Passmap"; // Since heatmap is showing

toggleButton.addEventListener("click", () => {
  if (heatContainer.style("display") === "none") {
    // Show heatmap, hide passes
    heatContainer.style("display", "flex");
    pitch4.style("display", "none");
    toggleButton.textContent = "Toggle Passmap";
  } else {
    // Show passes, hide heatmap
    heatContainer.style("display", "none");
    pitch4.style("display", "inline");
    toggleButton.textContent = "Toggle Heatmap";
  }
});

function drawAccuracyChart(percentile) {
  const width = 200;
  const height = 200;
  const radius = 80;
  const thickness = 15;
  const svg = d3
    .select("#accuracy-chart")
    .attr("width", width)
    .attr("height", height);
  svg.selectAll("*").remove();

  const g = svg
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  // Background arc
  const backgroundArc = d3
    .arc()
    .innerRadius(radius - thickness)
    .outerRadius(radius)
    .startAngle(0)
    .endAngle(2 * Math.PI);

  g.append("path").attr("d", backgroundArc).attr("fill", "#eee");

  // Foreground arc (progress)
  const foregroundArc = d3
    .arc()
    .innerRadius(radius - thickness)
    .outerRadius(radius)
    .startAngle(0)
    .endAngle(2 * Math.PI * percentile);

  g.append("path").attr("d", foregroundArc).attr("fill", "#4caf50");

  // Center text
  g.append("text")
    .attr("class", "percent-text")
    .text(`Pass Accuracy: ${Math.round(percentile * 100)}%`)
    .style("font-size", "15px");
}
drawAccuracyChart(accuracy);

animateBrushRight();

const onePassSequences = euroSequences.filter(
  (sequence) => sequence.prev_pass1_x1 === ""
);
const twoPassSequences = euroSequences.filter(
  (sequence) => sequence.prev_pass1_x1 !== "" && sequence.prev_pass2_x1 === ""
);
const threePassSequences = euroSequences.filter(
  (sequence) => sequence.prev_pass2_x1 !== "" && sequence.prev_pass3_x1 === ""
);
const fourPassSequences = euroSequences.filter(
  (sequence) => sequence.prev_pass3_x1 !== "" && sequence.prev_pass4_x1 === ""
);
const fivePassSequences = euroSequences.filter(
  (sequence) => sequence.prev_pass4_x1 !== ""
);
// Get first pass from each sequence by taking first object in each list

// Calculate average sequence_pred for each pass position
const firstPassAvgPred = d3.mean(
  onePassSequences.filter((d) => d !== undefined),
  (d) => d.sequence_pred
);
const secondPassAvgPred = d3.mean(
  twoPassSequences.filter((d) => d !== undefined),
  (d) => d.sequence_pred
);
const thirdPassAvgPred = d3.mean(
  threePassSequences.filter((d) => d !== undefined),
  (d) => d.sequence_pred
);
const fourthPassAvgPred = d3.mean(
  fourPassSequences.filter((d) => d !== undefined),
  (d) => d.sequence_pred
);
const fifthPassAvgPred = d3.mean(
  fivePassSequences.filter((d) => d !== undefined),
  (d) => d.sequence_pred
);

const allPassMetaData = fivePassSequences.map(getPassLocationsWithMetadata);

// Create bar chart for pass position averages
const passPositionData = [
  { position: "One Pass", avg: firstPassAvgPred },
  { position: "Two Passes", avg: secondPassAvgPred },
  { position: "Three Passes", avg: thirdPassAvgPred },
  { position: "Four Passes", avg: fourthPassAvgPred },
  { position: "Five Passes", avg: fifthPassAvgPred },
].filter((d) => !isNaN(d.avg)); // Filter out any NaN values

const barMargin = { top: 30, right: 20, bottom: 60, left: 40 };
const barWidth = 620 - barMargin.left - barMargin.right;
const barHeight = 600 - barMargin.top - barMargin.bottom;

const barSvg = d3
  .select(".chart-top-left")
  .append("svg")
  .attr("width", barWidth + barMargin.left + barMargin.right)
  .attr("height", barHeight + barMargin.top + barMargin.bottom)
  .append("g")
  .attr("transform", `translate(${barMargin.left},${barMargin.top})`);

const xPassPosition = d3
  .scaleBand()
  .range([0, barWidth])
  .domain(passPositionData.map((d) => d.position))
  .padding(0.1);

const yPassPosition = d3
  .scaleLinear()
  .range([barHeight, 0])
  .domain([0, d3.max(passPositionData, (d) => d.avg)]);

barSvg
  .append("g")
  .attr("transform", `translate(0,${barHeight})`)
  .call(d3.axisBottom(xPassPosition))
  .selectAll("text")
  .attr("transform", "rotate(-40)")
  .style("text-anchor", "end")
  .attr("dx", "-0.8em")
  .attr("dy", "0.15em");

barSvg.append("g").call(d3.axisLeft(yPassPosition));

barSvg
  .selectAll("rect")
  .data(passPositionData)
  .enter()
  .append("rect")
  .attr("x", (d) => xPassPosition(d.position))
  .attr("y", (d) => yPassPosition(d.avg))
  .attr("width", xPassPosition.bandwidth())
  .attr("height", (d) => barHeight - yPassPosition(d.avg))
  .attr("fill", "#4caf50");

// Add title
barSvg
  .append("text")
  .attr("x", barWidth / 2)
  .attr("y", -10)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .style("font-weight", "bold")
  .text("Average Pass Sequence xG by Number of Passes in Sequence");
const lastBar = passPositionData[passPositionData.length - 1];
const xLastBar =
  xPassPosition(lastBar.position) + xPassPosition.bandwidth() / 2;
const yLastBar = yPassPosition(lastBar.avg);

// Draw arrow line
barSvg
  .append("line")
  .attr("x1", xLastBar)
  .attr("y1", yLastBar + 10)
  .attr("x2", xLastBar - 60)
  .attr("y2", yLastBar + 50)
  .attr("stroke", "black")
  .attr("stroke-width", 2)
  .attr("marker-end", "url(#arrow)");

// Add arrowhead marker definition
barSvg
  .append("defs")
  .append("marker")
  .attr("id", "arrow")
  .attr("viewBox", "0 0 10 10")
  .attr("refX", 0)
  .attr("refY", 5)
  .attr("markerWidth", 6)
  .attr("markerHeight", 6)
  .attr("orient", "auto-start-reverse")
  .append("path")
  .attr("d", "M 0 0 L 10 5 L 0 10 z")
  .attr("fill", "black");

// Add annotation text
barSvg
  .append("text")
  .attr("x", xLastBar - 170)
  .attr("y", yLastBar + 70)
  .attr("text-anchor", "start")
  .style("font-size", "12px")
  .style("font-weight", "bold")
  .text("75th percentile of pass sequence xGs");
const firstBar = passPositionData[0];
const xFirstBar =
  xPassPosition(firstBar.position) + xPassPosition.bandwidth() / 2;
const yFirstBar = yPassPosition(firstBar.avg);

// Draw arrow line
barSvg
  .append("line")
  .attr("x1", xFirstBar)
  .attr("y1", yFirstBar + 10)
  .attr("x2", xFirstBar + 60)
  .attr("y2", yFirstBar - 50)
  .attr("stroke", "black")
  .attr("stroke-width", 2)
  .attr("marker-end", "url(#arrow)");

// Add arrowhead marker definition
// barSvg
//   .append("defs")
//   .append("marker")
//   .attr("id", "arrow")
//   .attr("viewBox", "0 0 10 10")
//   .attr("refX", 0)
//   .attr("refY", 5)
//   .attr("markerWidth", 6)
//   .attr("markerHeight", 6)
//   .attr("orient", "auto-start-reverse")
//   .append("path")
//   .attr("d", "M 0 0 L 10 5 L 0 10 z")
//   .attr("fill", "black");

// Add annotation text
barSvg
  .append("text")
  .attr("x", xFirstBar + 10)
  .attr("y", yFirstBar - 70)
  .attr("text-anchor", "start")
  .style("font-size", "12px")
  .style("font-weight", "bold")
  .text("55th percentile of pass sequence xGs");

const allPassMetaDataWithPosition = allPassMetaData.flatMap((seq) =>
  seq.map((pass, i) => ({
    ...pass,
    position: [
      "Fifth Pass",
      "Fourth Pass",
      "Third Pass",
      "Second Pass",
      "First Pass",
    ].reverse()[i],
  }))
);
const marginStacked = { top: 60, right: 160, bottom: 60, left: 50 };
const widthStacked = 620 - marginStacked.left - marginStacked.right;
const heightStacked = 600 - marginStacked.top - marginStacked.bottom;

const passPositions = [
  "First Pass",
  "Second Pass",
  "Third Pass",
  "Fourth Pass",
  "Fifth Pass",
];
const passTypes = Array.from(
  new Set(allPassMetaDataWithPosition.map((d) => d.type))
);

// Color
const customColors = [
  d3.schemeTableau10[0], // First Pass
  d3.schemeTableau10[1], // Second Pass
  d3.schemeTableau10[2], // Third Pass
  d3.schemeTableau10[3], // Fourth Pass
  "#2ca02c", // Fifth Pass - brighter green
];

const colorStacked = d3
  .scaleOrdinal()
  .domain(passPositions)
  .range(customColors);

// Aggregate
const grouped = d3.group(
  allPassMetaDataWithPosition,
  (d) => d.type,
  (d) => d.position
);
const data = Array.from(grouped, ([type, positionMap]) => {
  const obj = { type };
  passPositions.forEach((pos) => {
    const entries = positionMap.get(pos) || [];
    const total = d3.sum(entries, (d) => d.sequence_pred || 1);
    obj[pos] = total;
  });
  return obj;
});

const totalByType = data.map((d) => {
  const total = passPositions.reduce((sum, pos) => sum + d[pos], 0);
  passPositions.forEach((pos) => (d[pos] = d[pos] / (total || 1))); // normalize
  return d;
});

// Stack
const stack = d3.stack().keys(passPositions);
const series = stack(totalByType);

// Scales
const xStacked = d3
  .scaleBand()
  .domain(totalByType.map((d) => d.type))
  .range([0, widthStacked])
  .padding(0.2);

const yStacked = d3.scaleLinear().domain([0, 1]).range([heightStacked, 0]);

// SVG
const svgStacked = d3
  .select(".chart-bottom-right")
  .append("svg")
  .attr("width", widthStacked + marginStacked.left + marginStacked.right)
  .attr("height", heightStacked + marginStacked.top + marginStacked.bottom)
  .append("g")
  .attr("transform", `translate(${marginStacked.left},${marginStacked.top})`);
svgStacked
  .append("text")
  .attr("x", widthStacked / 2)
  .attr("y", -20)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .style("font-weight", "bold")
  .text("Distribution of Pass Position by Pass Type");

// Bars
svgStacked
  .selectAll("g.layer")
  .data(series)
  .enter()
  .append("g")
  .attr("class", "layer")
  .attr("fill", (d) => {
    const color = colorStacked(d.key);
    if (color === "#2ca02c") {
      return color; // Full opacity for green (fifth pass)
    } else {
      const rgb = d3.color(color);
      return `rgba(${rgb.r},${rgb.g},${rgb.b},0.6)`; // 0.6 opacity
    }
  })
  .selectAll("rect")
  .data((d) => d)
  .enter()
  .append("rect")
  .attr("x", (d) => xStacked(d.data.type))
  .attr("y", (d) => yStacked(d[1]))
  .attr("height", (d) => yStacked(d[0]) - yStacked(d[1]))
  .attr("width", xStacked.bandwidth());

// Axes
svgStacked
  .append("g")
  .attr("transform", `translate(0,${heightStacked})`)
  .call(d3.axisBottom(xStacked))
  .selectAll("text")
  .attr("transform", "rotate(-30)") // Angle of rotation
  .style("text-anchor", "end")
  .attr("dx", "-0.8em") // Horizontal adjustment
  .attr("dy", "0.15em");

svgStacked.append("g").call(d3.axisLeft(yStacked).tickFormat(d3.format(".0%")));

// Legend
const legendStacked = svgStacked
  .append("g")
  .attr("transform", `translate(${widthStacked + 20}, 0)`);

legendStacked
  .selectAll("rect")
  .data(passPositions)
  .enter()
  .append("rect")
  .attr("y", (d, i) => i * 20)
  .attr("width", 10)
  .attr("height", 10)
  .attr("fill", (d) => colorStacked(d));

legendStacked
  .selectAll("text")
  .data(passPositions)
  .enter()
  .append("text")
  .attr("x", 15)
  .attr("y", (d, i) => i * 20 + 9)
  .text((d) => d)
  .style("font-size", "12px");

svgStacked
  .append("line")
  .attr("x1", 130)
  .attr("y1", 370)
  .attr("x2", 415)
  .attr("y2", 320)
  .attr("stroke", "black")
  .attr("stroke-width", 2)
  .attr("marker-end", "url(#arrowStack)");
svgStacked
  .append("line")
  .attr("x1", 230)
  .attr("y1", 190)
  .attr("x2", 410)
  .attr("y2", 300)
  .attr("stroke", "black")
  .attr("stroke-width", 2)
  .attr("marker-end", "url(#arrowStack)");
svgStacked
  .append("line")
  .attr("x1", 380)
  .attr("y1", 150)
  .attr("x2", 420)
  .attr("y2", 280)
  .attr("stroke", "black")
  .attr("stroke-width", 2)
  .attr("marker-end", "url(#arrowStack)");

// Add arrowhead marker definition
svgStacked
  .append("defs")
  .append("marker")
  .attr("id", "arrowStack")
  .attr("viewBox", "0 0 10 10")
  .attr("refX", 0)
  .attr("refY", 5)
  .attr("markerWidth", 6)
  .attr("markerHeight", 6)
  .attr("orient", "auto-start-reverse")
  .append("path")
  .attr("d", "M 0 0 L 10 5 L 0 10 z")
  .attr("fill", "black");

// Add annotation text
svgStacked
  .append("text")
  .attr("x", 425)
  .attr("y", 305)
  .attr("text-anchor", "start")
  .style("font-size", "13px")
  .style("font-weight", "bold")
  .text("Sequence Ending Passes!");

const flat_passes = euroSequences.map(getPassLocationsWithMetadata).flat();
const pitch6 = d3.select("#pitch6");
drawFootballPitch(pitch6);

const fieldWidth = 120;
const fieldHeight = 80;
const xBins = 12;
const yBins = 8;
const binWidth = fieldWidth / xBins; // 10
const binHeight = fieldHeight / yBins;
const binnedPasses = Array.from({ length: xBins }, () =>
  Array.from({ length: yBins }, () => [])
);

flat_passes.forEach((pass) => {
  const [x, y] = pass.start;
  const xi = Math.min(Math.floor(x / binWidth), xBins - 1);
  const yi = Math.min(Math.floor(y / binHeight), yBins - 1);

  if (xi >= 0 && xi < xBins && yi >= 0 && yi < yBins) {
    binnedPasses[xi][yi].push(pass);
  }
});
const bestPassTypePerBin = [];

for (let xi = 0; xi < xBins; xi++) {
  bestPassTypePerBin[xi] = [];
  for (let yi = 0; yi < yBins; yi++) {
    const passes = binnedPasses[xi][yi];
    const predSums = {};
    const counts = {};

    // Accumulate sequence_pred per pass type
    passes.forEach((p) => {
      const type = p.type;
      const pred = parseFloat(p.sequence_pred);

      if (!isNaN(pred)) {
        predSums[type] = (predSums[type] || 0) + pred;
        counts[type] = (counts[type] || 0) + 1;
      }
    });

    // Compute mean sequence_pred for each type
    let maxType = null;
    let maxMean = -Infinity;

    for (const type in predSums) {
      if (counts[type] >= 3) {
        // Only consider if at least 2 passes
        const mean = predSums[type] / counts[type];
        if (mean > maxMean) {
          maxMean = mean;
          maxType = type;
        }
      }
    }

    bestPassTypePerBin[xi][yi] = maxType;
  }
}

const passTypeColor = d3
  .scaleOrdinal()
  .domain([
    "Pass",
    "Through Ball",
    "Switch",
    "Cross",
    "Free Kick",
    "Cut Back",
    "Corner",
    "Throw In",
  ])
  .range(d3.schemeCategory10);

const cellWidth = 120 / xBins;
const cellHeight = 80 / yBins;

//now computing the angle and distance for best type passes

const angleDistanceStats = Array.from({ length: xBins }, () =>
  Array.from({ length: yBins }, () => ({
    weightedAngle: 0,
    weightedDistance: 0,
    totalWeight: 0,
  }))
);

// Utility: angle in radians and Euclidean distance
function getAngleAndDistance(start, end) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const distance = Math.sqrt(dx ** 2 + dy ** 2);
  const angle = Math.atan2(dy, dx); // radians
  return { distance, angle };
}

// Compute weighted stats
flat_passes.forEach((pass) => {
  const [x, y] = pass.start;
  const binX = Math.floor(x / binWidth);
  const binY = Math.floor(y / binHeight);
  if (binX < 0 || binX >= xBins || binY < 0 || binY >= yBins) return;

  const bestType = bestPassTypePerBin[binX]?.[binY];
  if (!bestType || pass.type !== bestType) return;

  const { distance, angle } = getAngleAndDistance(pass.start, pass.end);
  const weight = parseFloat(pass.sequence_pred ?? 0);
  if (isNaN(weight) || weight <= 0) return;

  const bin = angleDistanceStats[binX][binY];
  bin.weightedDistance += distance * weight;
  bin.weightedAngle += angle * weight;
  bin.totalWeight += weight;
});

// Normalize
for (let xi = 0; xi < xBins; xi++) {
  for (let yi = 0; yi < yBins; yi++) {
    const bin = angleDistanceStats[xi][yi];
    if (bin.totalWeight > 0) {
      bin.avgDistance = bin.weightedDistance / bin.totalWeight;
      bin.avgAngle = bin.weightedAngle / bin.totalWeight;
    } else {
      bin.avgDistance = 0;
      bin.avgAngle = 0;
    }
  }
}
pitch6
  .append("defs")
  .append("marker")
  .attr("id", "arrowType")
  .attr("viewBox", "0 -5 10 10")
  .attr("refX", 1) // smaller refX shifts the arrowhead closer to the line end
  .attr("refY", 0)
  .attr("markerWidth", 3) // smaller width
  .attr("markerHeight", 3) // smaller height
  .attr("orient", "auto")
  .append("path")
  .attr("d", "M0,-5L10,0L0,5")
  .attr("fill", "black");

for (let xi = 0; xi < xBins; xi++) {
  for (let yi = 0; yi < yBins; yi++) {
    const type = bestPassTypePerBin[xi]?.[yi] || "Unknown";

    pitch6
      .append("rect")
      .attr("x", xi * cellWidth)
      .attr("y", yi * cellHeight)
      .attr("width", cellWidth)
      .attr("height", cellHeight)
      .attr("fill", passTypeColor(type))
      .attr("opacity", 0.5)
      .attr("class", "bin-cell");

    pitch6
      .append("text")
      .attr("x", xi * cellWidth + cellWidth / 2)
      .attr("y", yi * cellHeight + cellHeight / 2)
      .text(type) // first word only to avoid overflow
      .attr("font-size", "1px")
      .attr("class", "bin-label");
  }
}

for (let xi = 0; xi < xBins; xi++) {
  for (let yi = 0; yi < yBins; yi++) {
    const bin = angleDistanceStats[xi][yi];
    if (bin.totalWeight === 0) continue;

    const centerX = xi * binWidth + binWidth / 2;
    const centerY = yi * binHeight + binHeight / 2;
    const unscaledLen = bin.avgDistance;

    const dxTrue = Math.cos(bin.avgAngle) * unscaledLen;
    const dyTrue = Math.sin(bin.avgAngle) * unscaledLen;

    // Hover-visible unnormalized arrow (initially hidden)
    const hoverArrow = pitch6
      .append("line")
      .attr("x1", centerX)
      .attr("y1", centerY)
      .attr("x2", centerX + dxTrue)
      .attr("y2", centerY + dyTrue)
      .attr("stroke", "black")
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrowType)")
      .style("display", "none");

    // Transparent rect for hover
    pitch6
      .append("rect")
      .attr("x", xi * binWidth)
      .attr("y", yi * binHeight)
      .attr("width", binWidth)
      .attr("height", binHeight)
      .attr("fill", "transparent")
      .on("mouseover", () => {
        hoverArrow.style("display", "inline");
      })
      .on("mouseout", () => {
        hoverArrow.style("display", "none");
      });
  }
}
// Create a shared tooltip element
const tooltip = document.createElement("div");
tooltip.id = "tooltip";
document.body.appendChild(tooltip);

// Function to handle tooltip display
function setupTooltip(selectElement) {
  selectElement.addEventListener("mousemove", (e) => {
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const tip = selectedOption.getAttribute("data-tooltip");
    if (tip) {
      tooltip.textContent = tip;
      tooltip.style.left = e.pageX + 15 + "px";
      tooltip.style.top = e.pageY + 10 + "px";
      tooltip.style.opacity = 1;
    }
  });

  selectElement.addEventListener("mouseleave", () => {
    tooltip.style.opacity = 0;
  });
}

// Apply to all game dropdowns
setupTooltip(document.getElementById("passType2"));
setupTooltip(document.getElementById("passHeight2"));
setupTooltip(document.getElementById("passType"));
setupTooltip(document.getElementById("passHeight"));
