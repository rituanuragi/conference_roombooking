// const express = require("express");
// const bodyParser = require("body-parser");
// const mysql = require("mysql");
// const cors = require("cors"); // Import cors middleware

// const app = express();
// app.use(cors()); // Enable CORS for all routes
// app.use(express.static(__dirname));
// app.use(bodyParser.urlencoded({ extended: true }));

// const pool = mysql.createPool({
//   connectionLimit: 10,
//   host: "localhost",
//   user: "root",
//   password: "Rishav@123",
//   database: "conferoombooking",
// });

// app.use(express.static(__dirname));
// app.use(bodyParser.urlencoded({ extended: true }));

// app.get("/", function (req, res) {
//   res.sendFile(__dirname + "/index.html");
// });

// app.get("/bookings", function (req, res) {
//   pool.query("SELECT * FROM room_bookings", function (error, results, fields) {
//     if (error) {
//       console.error("Error fetching data from database:", error);
//       res
//         .status(500)
//         .send("An error occurred while fetching data from database.");
//       return;
//     }
//     res.json(results);
//   });
// });

// app.listen(4500, function () {
//   console.log("Server started on port:4500");
// });
