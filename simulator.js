/**
 * IIT Mock Sensor Server (Edge Digital Twin)
 * Simulates continuous emission of physiological data via WebSocket.
 */
const { Server } = require("socket.io");

// Creates the server running on port 3000
const io = new Server(3000, {
  cors: {
    origin: "*", // Allows connection from the React Native app
  }
});

console.log("IIT Sensor Server started on port 3000...");
console.log("Waiting for mobile app connection...\n");

io.on("connection", (socket) => {
  console.log(`App connected! (ID: ${socket.id})`);
  console.log("Starting vital signs transmission...\n");

  // Loop that sends data every 2 seconds
  const interval = setInterval(() => {
    const baseHR = 75;
    const noise = (Math.random() * 10) - 5;
    
    // 40% chance to simulate an anomaly (Cardiac Crisis)
    const simulateAnomaly = Math.random() > 0.6;

    const sensorData = {
      heartRateBPM: simulateAnomaly ? (baseHR + 50 + noise) : (baseHR + noise),
      temperatureCelsius: 36.5 + (Math.random() * 0.5 - 0.25),
      movement: simulateAnomaly ? 1 : (Math.random() * 15), // Little movement during the crisis
      posture: simulateAnomaly ? 'Lying down' : 'Sitting'
    };

    // Sends the packet to the app with the "sensorData" event
    socket.emit("sensorData", sensorData);
    
    // Shows in the PC terminal what is being sent
    console.log(`[Sent] BPM: ${sensorData.heartRateBPM.toFixed(0)} | Temp: ${sensorData.temperatureCelsius.toFixed(1)}°C | Anomaly: ${simulateAnomaly ? 'YES' : 'NO'}`);
  }, 2000);

  // Logic for when the app is closed
  socket.on("disconnect", () => {
    console.log(`App disconnected. (ID: ${socket.id})\n`);
    clearInterval(interval);
  });
});