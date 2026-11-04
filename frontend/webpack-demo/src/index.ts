import { services, calculatePrice } from "./services";

import { MehandiArtist } from "./artist";

import { BookingStatus, createBooking } from "./booking";
import { fetchArtists } from "./api";

// Artist object
const artist = new MehandiArtist("Priya", 5, "Bridal Mehandi");

// Price calculation
const price = calculatePrice(1500, 2);

// Booking
const booking = createBooking("Bhavadharini", services[0]);

// Application output
const app = document.getElementById("app");

if (app) {
  app.innerHTML = `
    <div style="
      font-family: Arial;
      max-width: 900px;
      margin: 40px auto;
      padding: 30px;
      background: #f5f5f5;
      border-radius: 15px;
    ">

      <h1>Mehandi Management System</h1>

      <h2>Webpack Demonstration</h2>

      <hr />
      <p>${typeof APP_NAME !== "undefined" ? APP_NAME : ""}</p>

      <h3>Module</h3>
      <p>Services loaded: ${services.length}</p>

      <h3>Artist</h3>
      <p>${artist.getDetails()}</p>

      <h3>Price Calculation</h3>
      <p>Total Price: ₹${price}</p>

      <h3>Booking</h3>
      <p>${booking}</p>

      <h3>Booking Status</h3>
      <p>${BookingStatus.PENDING}</p>

      <h3>REST endpoint (GET /api/artist/approved)</h3>
      <ul id="artist-list"><li>Loading...</li></ul>

    </div>
  `;
}

// REST endpoint: load the approved artists from the real backend
const list = document.getElementById("artist-list");

if (list) {
  fetchArtists()
    .then((artists) => {
      list.innerHTML = artists.length
        ? artists
            .map((a) => `<li>${a.name} - ${a.location} - Rs.${a.pricePerHour}/hour</li>`)
            .join("")
        : "<li>No approved artists yet</li>";
    })
    .catch(() => {
      list.innerHTML = "<li>Backend is not running (start it with npm start)</li>";
    });
}
