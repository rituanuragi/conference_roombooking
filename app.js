const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const moment = require("moment"); // Import moment.js for date formatting

const app = express();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "Rishav@123",
  database: "conferoombooking",
});

pool.query(
  `CREATE TABLE IF NOT EXISTS room_bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  department VARCHAR(255),
  date DATE,
  checkin TIME,
  checkout TIME,
  purpose TEXT,
  message TEXT,
  room VARCHAR(255)
)`,
  (error, results, fields) => {
    if (error) {
      console.error("Error creating table:", error);
      return;
    }
    console.log("Table room_bookings created or already exists.");
  }
);

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

function formatTime(time) {
  const [hours, minutes] = time.split(":");
  const formattedHours = (parseInt(hours) % 12 || 12)
    .toString()
    .padStart(2, "0");
  const formattedMinutes = minutes.padStart(2, "0");
  const ampm = parseInt(hours) < 12 ? "AM" : "PM";
  return `${formattedHours}:${formattedMinutes}:00`; // Corrected format
}

// Function to send confirmation email
function sendConfirmationEmail(
  na,
  comm,
  department,
  formattedCheckin,
  formattedCheckout,
  purpose,
  room
) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "rituanuragi1@gmail.com",
      pass: "geon ylan rgeq mfld",
    },
  });

  const mailOptions = {
    from: "rituanuragi1@gmail.com",
    to: "rituf2fintech@gmail.com",
    cc: "",
    subject: "Thanks For Informing, HR TEAM",
    text:
      `Name: ${na}\n` +
      `Message: ${comm}\n` +
      `Department: ${department}\n` +
      `Check-in Time: ${formattedCheckin}\n` +
      `Check-out Time: ${formattedCheckout}\n` +
      `Purpose: ${purpose}\n` +
      `Room: ${room}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error("Error sending email:", error);
      return;
    }
    console.log("Email sent:", info.response);
  });
}

app.post("/", function (req, res) {
  const {
    nameofperson: na,
    department,
    checkin,
    checkout,
    purpose,
    message: comm,
    room,
  } = req.body;

  const formattedCheckin = formatTime(checkin);
  const formattedCheckout = formatTime(checkout);
  const formattedDate = moment().format("YYYY-MM-DD"); // Format the date correctly

  // Room is available, proceed with booking
  pool.query(
    "INSERT INTO room_bookings (name, department, date, checkin, checkout, purpose, message, room) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      na,
      department,
      formattedDate,
      formattedCheckin,
      formattedCheckout,
      purpose,
      comm,
      room,
    ],
    function (error, results, fields) {
      if (error) {
        console.error("Error inserting into database:", error);
        res.status(500).send("An error occurred while processing the booking.");
        return;
      }

      sendConfirmationEmail(
        na,
        comm,
        department,
        formattedCheckin,
        formattedCheckout,
        purpose,
        room
      );
      res.redirect("/thankyou.html");
    }
  );
});

app.get("/bookings", function (req, res) {
  pool.query("SELECT * FROM room_bookings", function (error, results, fields) {
    if (error) {
      console.error("Error fetching data from database:", error);
      res
        .status(500)
        .send("An error occurred while fetching data from database.");
      return;
    }
    // Format dates before sending to frontend
    results.forEach((booking) => {
      booking.date = moment(booking.date).format("YYYY-MM-DD");
    });
    res.json(results);
  });
});

app.put("/bookings/:id", function (req, res) {
  const bookingId = req.params.id;
  const { checkout } = req.body;

  pool.query(
    "UPDATE room_bookings SET checkout = ? WHERE id = ?",
    [checkout, bookingId],
    function (error, results, fields) {
      if (error) {
        console.error("Error updating checkout time in database:", error);
        res.status(500).send("An error occurred while updating checkout time.");
        return;
      }
      res.status(200).send("Checkout time updated successfully.");
    }
  );
});

app.delete("/bookings/:id", function (req, res) {
  const bookingId = req.params.id;

  // Delete the booking from the database
  pool.query(
    "DELETE FROM room_bookings WHERE id = ?",
    [bookingId],
    function (error, results, fields) {
      if (error) {
        console.error("Error deleting booking from database:", error);
        res.status(500).send("An error occurred while deleting booking.");
        return;
      }
      res.status(200).send("Booking deleted successfully.");
    }
  );
});

app.listen(5500, function () {
  console.log("Server started on port 5500");
});
