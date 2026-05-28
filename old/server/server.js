require("dotenv").config(); //to load environment variables from .env file. Use node server/server.js to start the server and load environment variables.

const express = require("express"); //to use express framework for server
const cors = require("cors"); //to use cors for cross-origin resource sharing

const app = express(); // Middleware for the app

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); //to parse JSON bodies

//api routes

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/collector", require("./routes/collectorRoutes"));
app.use("/api/household", require("./routes/householdRoutes"));

app.get("/", (req, res) => { res.send("API running"); }); //to test if the server is running by sending a GET request to the root endpoint

const PORT = process.env.PORT || 5000; //to set the port for the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});