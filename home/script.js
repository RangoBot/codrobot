//loading 
 let gridSize = localStorage.getItem("cell-size") ? parseInt(localStorage.getItem("cell-size")) : 5; // Default grid size
 let intx = localStorage.getItem("initX") ? parseInt(localStorage.getItem("initX")) : 5;
 let inty = localStorage.getItem("initY") ? parseInt(localStorage.getItem("initY")) : 3;
 let gridWidth = localStorage.getItem('gridWidth') ? parseInt(localStorage.getItem('gridWidth')) : 5; // Default grid width


 let dir = 0; // 1 - Right, 2 - Up, 3 - Left, 4 - Down
 let direction = 2; // 1 - Right, 2 - Down, 3 - Left, 4 - Up

  let posX=intx; // Initial position X
  let posY=inty; // Initial position Y

 const grid = document.getElementById('grid');

// Update the value display with the current direction
function updateValueDisplay() {
  document.getElementById('valueDisplay').innerText = "dir = " + dir * 1+ "° \n posx="+posX *1 + " \n posy=" + posY*1+"\n ";
}

// Move to the settings page
function goToSettings() {
  window.location.href = "../settings/settings.html"; // Change this to your actual settings page URL
}

// Build a dynamic grid based on the provided rows and columns
function buildGrid(rows, cols) {
  grid.innerHTML = "";  // Clear the grid before rebuilding it
  
  // Update the grid CSS dynamically based on the number of rows and columns
  grid.style.gridTemplateColumns = `repeat(${cols}, 30px)`;  // Set column sizes
  grid.style.gridTemplateRows = `repeat(${rows}, 30px)`;  // Set row sizes

  // Loop through the grid positions to create cells
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      // Check if the current cell is the active one
      if (x === posX && y === posY) {
        cell.classList.add("active");
        // Set the arrow character to point right (→)
        cell.innerHTML = "→"; // Use the right arrow as the starting point
        // Rotate the arrow based on direction (0, 90, 180, 270)
        cell.style.transform = `rotate(${direction}deg)`; // Apply rotation
        updateValueDisplay();
      }

      grid.appendChild(cell);
    }
  }
}

// Move and send command
function sendCommand(cmd) {
 /* const rows = grid.style.gridTemplateRows.split(" ").length;  // Number of rows
  const cols = grid.style.gridTemplateColumns.split(" ").length;  // Number of columns
*/ rows = gridWidth; // Number of rows
 cols = gridWidth; // Number of columns
  if (cmd === "F") {
    if (dir === 0  && posX<cols-1) posX++; // Up
    else if (dir === 1 && posY < rows - 1) posY++; // Right
    else if (dir === 2 && posX >0) posX--; // Down
    else if (dir === 3 && posY > 0) posY--; // Left
  } else if (cmd === "B") {
    if (dir === 0 && posX>0) posX--; // Down
    else if (dir === 1 && posY > 0) posY--; // Right
    else if (dir === 2 && posX< cols-1) posX++; // Left
    else if (dir === 3 && posY < rows - 1) posY++; // Up
  } else if (cmd === "R") {
    dir = (dir + 1) % 4; // Turn right
    direction = (direction + 90) % 360; // Rotate arrow
  } else if (cmd === "L") {
    dir = (dir + 3) % 4; // Turn left
    direction = (direction - 90 + 360) % 360; // Rotate arrow
  } else if (cmd === "S") {
    dir = 0; // Stop
    direction = 0; // Reset rotation
    posX=intx; // Reset position
    posY=inty; // Reset position
  }
  
  buildGrid(gridWidth,gridWidth); // Rebuild the grid to reflect the new position
  
  const selectedIP = localStorage.getItem('esp32_ip') || 'Not set';
  // Send GET request to ESP32 (optional)
  fetch(`http://${selectedIP}/cmd?val=${cmd}`)
    .then(res => console.log("Sent:", cmd))
    .catch(err => console.error("Failed to send", cmd, err));
}

// Initial call to build a grid with custom rows and columns
//buildGrid(gridSize,gridSize);  // Example: build a 5x5 grid

function updateStatus() {
  // Get the values from localStorage
  const gridWidth = localStorage.getItem('gridWidth') || 'Not set';
  const cellSize = localStorage.getItem('cell-size') || 'Not set';
  const initX = localStorage.getItem('initX') || 'Not set';
  const initY = localStorage.getItem('initY') || 'Not set';
  const selectedIP = localStorage.getItem('esp32_ip') || 'Not set';
  //buildGrid(gridWidth,gridWidth);
  // Display the values in the status container
  document.getElementById('status-grid').innerHTML = `<strong>Grid Size:</strong> ${gridWidth} x ${gridWidth} <strong>Cell Size:</strong> ${cellSize}px`;
  document.getElementById('status-position').innerHTML = `<strong>Initial Position:</strong> X: ${initX}, Y: ${initY}`;
  document.getElementById('status-ip').innerHTML = `<strong>Selected IP:</strong> ${selectedIP}`;
}

// Call the updateStatus function when the page loads

window.onload = () => {
  updateStatus();

  // Update position from localStorage if available
  posX = localStorage.getItem("initX") ? parseInt(localStorage.getItem("initX")) : posX;
  posY = localStorage.getItem("intY") ? parseInt(localStorage.getItem("initY")) : posY;
  gridSize = localStorage.getItem("cellSize") ? parseInt(localStorage.getItem("cellSize")) : gridSize; // Default grid size
  gridWidth = localStorage.getItem('gridWidth') ? parseInt(localStorage.getItem('gridWidth')) : gridWidth; // Default grid width
  buildGrid(gridWidth, gridWidth);
  //buildGrid(gridWidth,gridWidth);
};


