// Save grid size and cell size to localStorage and update UI
document.getElementById('apply-grid-size').addEventListener('click', function () {
  const gridWidth = parseInt(document.getElementById('cells').value);
  const cellSize = parseInt(document.getElementById('cell-size').value);
  
  localStorage.setItem('gridWidth', gridWidth);
  localStorage.setItem('cell-size', cellSize);

  set_minMax();
  updateStatus();

  alert(`Grid Size: ${gridWidth} x ${gridWidth}, Cell Size: ${cellSize}px`);

  // Optional: notify other scripts to rebuild the grid
  document.dispatchEvent(new Event('gridSettingsChanged'));
});

// Save initial position
document.getElementById('apply-initial-pos').addEventListener('click', function () {
  const initX = parseInt(document.getElementById('init-x').value);
  const initY = parseInt(document.getElementById('init-y').value);

  localStorage.setItem('initX', initX);
  localStorage.setItem('initY', initY);

  updateStatus();
  alert(`Initial Position - X: ${initX}, Y: ${initY}`);
});

// Save IP address
document.getElementById('back-to-control').addEventListener('click', function () {
  window.location.href = '../home/index.html'; // Redirect to the main page
});

// Save ESP32 IP address
document.getElementById('apply-ip').addEventListener('click', function () {
  const ip = document.getElementById('ip-address').value.trim();

  if (!ip.match(/^(\d{1,3}\.){3}\d{1,3}$/)) {
    alert('Please enter a valid IP address.');
    return;
  }

  localStorage.setItem('esp32_ip', ip); // Save IP
  alert(`IP ${ip} saved successfully!`);
});
// ping ESP32
document.getElementById('ping-status').addEventListener('click', function () {
  const ip = document.getElementById('ip-address').value.trim();
  const pingBtn = document.getElementById('ping-status');

  pingBtn.textContent = 'Pinging...';
  pingBtn.style.color = 'black';

  // Validate IP format
  if (!ip.match(/^(\d{1,3}\.){3}\d{1,3}$/)) {
    pingBtn.textContent = 'Invalid IP';
    pingBtn.style.color = 'red';
    return;
  }

  // Ping ESP32 at /ping endpoint
  fetch(`http://${ip}/ping`, { method: 'GET', mode: 'cors' })
    .then(response => response.text())
    .then(data => {
      if (data.trim() === 'pong') {
        pingBtn.textContent = 'Valid IP';
        pingBtn.style.color = 'green';
      } else {
        pingBtn.textContent = 'Wrong response';
        pingBtn.style.color = 'red';
      }
    })
    .catch(error => {
      pingBtn.textContent = 'No response';
      pingBtn.style.color = 'red';
    });
});

// Update the status display
function updateStatus() {
  const gridWidth = localStorage.getItem('gridWidth') || 'Not set';
  const cellSize = localStorage.getItem('cell-size') || 'Not set';
  const initX = localStorage.getItem('initX') || 'Not set';
  const initY = localStorage.getItem('initY') || 'Not set';
  const selectedIP = localStorage.getItem('esp32_ip') || 'Not set';

  document.getElementById('status-grid').innerHTML =
    `<strong>Grid Size:</strong> ${gridWidth} x ${gridWidth} <strong>Cell Size:</strong> ${cellSize} px`;

  document.getElementById('status-position').innerHTML =
    `<strong>Initial Position:</strong> X: ${initX}, Y: ${initY}`;

  document.getElementById('status-ip').innerHTML =
    `<strong>Selected IP:</strong> ${selectedIP}`;
}

// Set min/max values for position based on grid size
function set_minMax() {
  const gridWidth = parseInt(localStorage.getItem('gridWidth')) || 10;

  const initX = document.getElementById('init-x');
  const initY = document.getElementById('init-y');

  initX.min = 1;
  initX.max = gridWidth;
  initY.min = 1;
  initY.max = gridWidth;

  // Optional: set defaults if inputs are empty
  if (!initX.value) initX.value = Math.floor(gridWidth / 2);
  if (!initY.value) initY.value = gridWidth ;
}

// On page load
window.onload = () => {
  // Restore inputs
  const gridWidth = parseInt(localStorage.getItem('gridWidth')) || 5;
  const cellSize = parseInt(localStorage.getItem('cell-size')) || 40;
  const posX = parseInt(localStorage.getItem('initX')) || 1;
  const posY = parseInt(localStorage.getItem('initY')) || 1;

  document.getElementById('cells').value = gridWidth;
  document.getElementById('cell-size').value = cellSize;
  document.getElementById('init-x').value = posX;
  document.getElementById('init-y').value = posY;

  set_minMax();
  updateStatus();
};
