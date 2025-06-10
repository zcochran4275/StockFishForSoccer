const canvas = document.getElementById("pitchCanvas2");
const ctx = canvas.getContext("2d");

const pitchWidth = 120;
const pitchHeight = 80;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const goalCoords = [120, 40]; // Center of goal on right side

let firstClick = true;
let startPos = [-1, -1];
let endPos = [-1, -1];
let shotTaken = false;

let collectedStats = []; // Array to store all submitted data

let showPromptArrow = true;

function drawPitch() {
  const ctx = canvas.getContext("2d");

  // Clear the pitch
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dimensions in meters mapped to canvas scale
  const fieldWidth = 120; // meters
  const fieldHeight = 80; // meters
  const scaleX = canvas.width / fieldWidth;
  const scaleY = canvas.height / fieldHeight;

  ctx.strokeStyle = "#fff";
  ctx.fillStyle = "#fff";
  ctx.lineWidth = 2;

  // Draw outer boundary
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // Midline
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();

  // Center circle
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 9.15 * scaleX, 0, 2 * Math.PI);
  ctx.stroke();

  // Center point
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 1.5, 0, 2 * Math.PI);
  ctx.fill();

  // Left penalty area
  ctx.strokeRect(
    0,
    (canvas.height - 40 * scaleY) / 2,
    18 * scaleX,
    40 * scaleY
  );
  // Right penalty area
  ctx.strokeRect(
    canvas.width - 18 * scaleX,
    (canvas.height - 40 * scaleY) / 2,
    18 * scaleX,
    40 * scaleY
  );

  // Left 6-yard box
  ctx.strokeRect(0, (canvas.height - 18 * scaleY) / 2, 6 * scaleX, 18 * scaleY);
  // Right 6-yard box
  ctx.strokeRect(
    canvas.width - 6 * scaleX,
    (canvas.height - 18 * scaleY) / 2,
    6 * scaleX,
    18 * scaleY
  );

  // Penalty spots
  ctx.beginPath();
  ctx.arc(11 * scaleX, canvas.height / 2, 1.5, 0, 2 * Math.PI);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(canvas.width - 11 * scaleX, canvas.height / 2, 1.5, 0, 2 * Math.PI);
  ctx.fill();

  // Set a uniform scale (important)
  const scale = canvas.width / 120; // assuming 120m field length
  const pitchHeight = 80 * scale;
  const centerY = canvas.height / 2;

  // Penalty spot positions
  const leftX = 11 * scale;
  const rightX = canvas.width - 12 * scale;

  // Arc radius (9.15m)
  const r = 9.15 * scale;

  const leftPenaltyX = 12 * scale;

  // Draw top quarter
  ctx.beginPath();
  ctx.arc(leftPenaltyX, centerY, r, 1.71 * Math.PI, 2 * Math.PI);
  ctx.stroke();

  // Draw bottom quarter
  ctx.beginPath();
  ctx.arc(leftPenaltyX, centerY, r, 0, 0.29 * Math.PI);
  ctx.stroke();
  // RIGHT penalty arc (same, flipped direction)
  ctx.beginPath();
  ctx.arc(rightX, centerY, r, 1.28 * Math.PI, 0.72 * Math.PI, true); // top half, reversed
  ctx.stroke();

  // Corner arcs
  [0, canvas.width].forEach((x) => {
    [0, canvas.height].forEach((y) => {
      ctx.beginPath();
      ctx.arc(x, y, 1 * scaleX, 0, 0.5 * Math.PI);
      if (x === 0 && y === 0) ctx.arc(x, y, 1 * scaleX, 0, 0.5 * Math.PI);
      if (x === 0 && y === canvas.height)
        ctx.arc(x, y, 1 * scaleX, 1.5 * Math.PI, 2 * Math.PI);
      if (x === canvas.width && y === 0)
        ctx.arc(x, y, 1 * scaleX, 0.5 * Math.PI, Math.PI);
      if (x === canvas.width && y === canvas.height)
        ctx.arc(x, y, 1 * scaleX, Math.PI, 1.5 * Math.PI);
      ctx.stroke();
    });
  });

  if (collectedStats.length === 0) {
    const start = scaleToCanvas(60, 40); // center of pitch
    const end = scaleToCanvas(100, 40); // pointing toward right goal
    drawArrow(start[0], start[1], end[0], end[1], "red");

    ctx.fillStyle = "red";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Attack this goal →", (start[0] + end[0]) / 2, end[1] - 10);
  }
}

function drawArrow(fromX, fromY, toX, toY, color = "white") {
  const headlen = 10;
  const angle = Math.atan2(toY - fromY, toX - fromX);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headlen * Math.cos(angle - Math.PI / 6),
    toY - headlen * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    toX - headlen * Math.cos(angle + Math.PI / 6),
    toY - headlen * Math.sin(angle + Math.PI / 6)
  );
  ctx.lineTo(toX, toY);
  ctx.fillStyle = ctx.strokeStyle;
  ctx.fill();
}

function scaleToPitch(x, y) {
  return [(x / canvasWidth) * pitchWidth, (y / canvasHeight) * pitchHeight];
}

function scaleToCanvas(x, y) {
  return [(x / pitchWidth) * canvasWidth, (y / pitchHeight) * canvasHeight];
}
let firstPassComplete = false;
let lastRedDot = null;
let passIndex = 1;
let passCount = 0;
let passNumber = 1;
let dribbleNumber = 1;
let dribbleIndex = 0;

let clickPhase = 0;
let lastEndPos = null;
let passType;
let passHeight;
let dribbles = [];

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const [xPitch, yPitch] = scaleToPitch(x, y);
  if (xPitch < 0 || xPitch > 120 || yPitch < 0 || yPitch > 80) return;

  if (collectedStats.length >= 5) {
    alert("Maximum 5 passes reached!");
    return;
  }
  if (shotTaken) {
    alert("Cannot add pass after shooting!");
    return;
  }

  const [cx, cy] = scaleToCanvas(xPitch, yPitch);

  switch (clickPhase) {
    case 0: // First click - green start dot
      startPos = [xPitch, yPitch];
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
      ctx.fillStyle = "green";
      ctx.fill();
      clickPhase = 1;
      break;

    case 1: // Second click - red dot and solid arrow (first real pass)
      endPos = [xPitch, yPitch];
      const [sx1, sy1] = scaleToCanvas(...startPos);
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();
      drawArrow(sx1, sy1, cx, cy);
      passType = document.getElementById("passType2").value;
      passHeight = document.getElementById("passHeight2").value;
      ctx.fillStyle = "black";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        passHeight + " " + passType + " (" + passNumber + ")",
        (sx1 + cx) / 2,
        (sy1 + cy) / 2 - 10
      );
      collectedStats.push({
        start: startPos,
        end: endPos,
        pass_outcome: 1,
        pass_type: passType,
        pass_height: passHeight,
      });
      showPromptArrow = false;
      drawPitch();
      collectedStats.forEach(drawEventFromStats);
      drawDribbles();

      passNumber++;
      lastEndPos = endPos;
      updatePredictBtn();
      clickPhase = 2;
      break;

    case 2: // Third click - dashed arrow = dribble
      startPos = [xPitch, yPitch];
      const [sx2, sy2] = scaleToCanvas(...lastEndPos);
      ctx.save();
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(sx2, sy2);
      ctx.lineTo(cx, cy);
      ctx.strokeStyle = "gray";
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
      ctx.fillStyle = "green";
      ctx.fill();

      // Save dribble
      dribbles.push({
        start: lastEndPos,
        end: [xPitch, yPitch],
      });

      clickPhase = 3;
      break;

    case 3: // Fourth click - pass
      endPos = [xPitch, yPitch];
      const [sx3, sy3] = scaleToCanvas(...startPos);
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();
      drawArrow(sx3, sy3, cx, cy);
      ctx.fillStyle = "black";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      passType = document.getElementById("passType2").value;
      passHeight = document.getElementById("passHeight2").value;
      ctx.fillText(
        passHeight + " " + passType + " (" + passNumber + ")",
        (sx3 + cx) / 2,
        (sy3 + cy) / 2 - 10
      );

      collectedStats.push({
        start: startPos,
        end: endPos,
        pass_outcome: 1,
        pass_type: passType,
        pass_height: passHeight,
      });
      passNumber++;
      lastEndPos = endPos;
      updatePredictBtn();
      clickPhase = 2; // return to dashed line phase
      break;
  }
  updatePredictBtn();
});

function drawEventFromStats(event, index) {
  const { start, end } = event;
  const [sx, sy] = scaleToCanvas(...start);
  const [ex, ey] = scaleToCanvas(...end);

  // if (index === 0) {
  ctx.beginPath();
  ctx.arc(sx, sy, 6, 0, 2 * Math.PI);
  ctx.fillStyle = "green";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(ex, ey, 6, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();

  const midX = (sx + ex) / 2;
  const midY = (sy + ey) / 2;

  drawArrow(sx, sy, ex, ey);
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.fillText(
    event.pass_height + " " + event.pass_type + " (" + (index + 1) + ")",
    midX,
    midY - 10
  );

  lastRedDot = [ex, ey];
}

function drawDribbles() {
  dribbleIndex = 0;
  dribbles.forEach(({ start, end }) => {
    const [sx, sy] = scaleToCanvas(...start);
    const [ex, ey] = scaleToCanvas(...end);
    const midX = (sx + ex) / 2;
    const midY = (sy + ey) / 2;

    ctx.save();
    ctx.strokeStyle = "gray";
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  });
}

document.getElementById("undoBtn2").addEventListener("click", () => {
  if (collectedStats.length === 0 && dribbles.length === 0) return;

  if (collectedStats.length <= 1) {
    collectedStats.pop();
    passNumber = Math.max(1, passNumber - 1);
    lastEndPos = null;
    clickPhase = 0;
    drawPitch();
    updatePredictBtn();
    return;
  } else if (collectedStats.length > 1 && dribbles.length > 0) {
    collectedStats.pop();
    dribbles.pop();
    if (clickPhase === 3) {
      dribbles.pop();
    }
    passNumber = Math.max(1, passNumber - 1);
    clickPhase = 2;
  }

  firstPassComplete = collectedStats.length > 0;
  lastRedDot = null;
  drawPitch();
  passIndex = 0;
  dribbleIndex = 0;
  collectedStats.forEach(drawEventFromStats);
  drawDribbles();
  updatePredictBtn();
  lastEndPos = collectedStats.at(-1).end;
});

document.getElementById("predictBtn2").addEventListener("click", async () => {
  if (collectedStats.length === 0) {
    alert("Please create at least one pass before predicting.");
    return;
  }
  const reversedStats = collectedStats.reverse();
  const formatted = reversedStats.flatMap(
    ({ start, end, pass_type, pass_height }) => [
      start[0],
      start[1],
      end[0],
      end[1],
      1,
      pass_type,
      pass_height,
    ]
  );
  const resultBox = document.getElementById("predictionResult2");
  const nameDiv = document.getElementById("name-div");

  resultBox.innerText = "";
  try {
    const response = await fetch(
      "https://stockfishforsoccer.onrender.com/predict",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: formatted }),
      }
    );

    const result = await response.json();
    if (result.prediction !== undefined) {
      resultBox.innerText = `Probability of Scoring Off Sequence: ${(
        result.prediction * 100
      ).toFixed(2)}%`;
      nameDiv.style.display = "flex";
      localStorage.setItem("prediction", (result.prediction * 100).toFixed(2));
    } else {
      resultBox.innerText = `Error: ${result.error}`;
    }
  } catch (error) {
    resultBox.innerText = `Fetch error: ${error}`;
  } finally {
    collectedStats = collectedStats.reverse();
  }
});

function updatePredictBtn() {
  const predictBtn = document.getElementById("predictBtn2");
  if (collectedStats.length > 0) {
    predictBtn.classList.add("active");
    predictBtn.disabled = false;
  } else {
    predictBtn.classList.remove("active");
    predictBtn.disabled = true;
  }
}

drawPitch();
updatePredictBtn();
