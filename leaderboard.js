const leaderboard = document.getElementById("leaderboard");
const submitBtn = document.getElementById("submitBtn");
const nameInput = document.getElementById("nameInput");

submitBtn.addEventListener("click", function (event) {
  event.preventDefault();
  const name = nameInput.value.trim();
  const prediction = localStorage.getItem("prediction");
  if (name && prediction) {
    fetch("https://soccer-events-server.vercel.app/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name, score: prediction }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Score submitted successfully:", data);
        nameInput.value = ""; // Clear input field
        getLeaderboard(); // Refresh leaderboard
      })
      .catch((error) => {
        console.error("Error submitting score:", error);
        leaderboard.innerHTML =
          "<p>Error submitting score. Please try again later.</p>";
      });
  } else {
    if (!name) {
      alert("Please enter your name.");
    }
    if (!prediction) {
      alert("Please make a prediction first.");
    }
  }
});

function getLeaderboard() {
  fetch("https://soccer-events-server.vercel.app/api/leaderboard", {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data && data.leaderboard.length > 0) {
        const table = document.createElement("table");
        table.classList.add("leaderboard-table");

        const headerRow = document.createElement("tr");
        headerRow.innerHTML = "<th>Rank</th><th>Name</th><th>Score</th>";
        table.appendChild(headerRow);

        data.leaderboard.forEach((team, index) => {
          const row = document.createElement("tr");
          row.innerHTML = `<td>${index + 1}</td><td>${team.name}</td><td>${
            team.score
          }%</td>`;
          table.appendChild(row);
        });

        leaderboard.innerHTML = ""; // Clear previous content
        leaderboard.appendChild(table);
      } else {
        leaderboard.innerHTML = ""; // Clear previous content
        const noDataMessage = document.createElement("p");
        noDataMessage.textContent = "No leaderboard data available.";
        leaderboard.appendChild(noDataMessage);
      }
    })
    .catch((error) => {
      console.error("Error fetching leaderboard:", error);
      leaderboard.innerHTML =
        "<p>Error loading leaderboard. Please try again later.</p>";
    });
}

getLeaderboard();
