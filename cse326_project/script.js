// 1. Vehicles Fleet Array
let vehicles = [
  { name: "Maruti Swift Dzire", type: "Car", price: 1800, specs: "Petrol • Manual", status: "Available", maintNote: "Serviced OK" },
  { name: "Hyundai Creta", type: "Car", price: 2800, specs: "Diesel • Automatic", status: "Available", maintNote: "Serviced OK" },
  { name: "Royal Enfield Classic 350", type: "Bike", price: 900, specs: "Petrol • 350cc", status: "Available", maintNote: "Chain & Oil Checked" },
  { name: "Yamaha MT-15", type: "Bike", price: 850, specs: "Petrol • 155cc", status: "Maintenance", maintNote: "Brake Pad Replacement" },
  { name: "Honda Activa 6G", type: "Scooter", price: 450, specs: "Petrol • Automatic", status: "Available", maintNote: "Serviced OK" },
  { name: "TVS Jupiter", type: "Scooter", price: 400, specs: "Petrol • Automatic", status: "Available", maintNote: "Serviced OK" }
];

// 2. Bookings, Registered User, aur Reviews Arrays
let bookings = [];
let reviews = [
  { user: "Rohan Sharma", vehicle: "Hyundai Creta", rating: "★★★★★ (5/5)", comment: "Smooth pickup and super clean car!" },
  { user: "Ananya Verma", vehicle: "Honda Activa 6G", rating: "★★★★☆ (4/5)", comment: "Affordable daily rate for college commute." }
];
let registeredUser = "";

// Helper Function: Top Notification Banner Update
function showNotification(message) {
  document.getElementById("notificationBar").innerText = "Notification: " + message;
}

// 3. Switch Between Customer Portal and Admin Dashboard
function switchTab(tab) {
  let custSec = document.getElementById("customerSection");
  let adminSec = document.getElementById("adminSection");
  let btnCust = document.getElementById("btnCustomer");
  let btnAdmin = document.getElementById("btnAdmin");

  if (tab === "customer") {
    custSec.classList.remove("hidden");
    adminSec.classList.add("hidden");
    btnCust.classList.add("active");
    btnAdmin.classList.remove("active");
    renderAll();
  } else {
    adminSec.classList.remove("hidden");
    custSec.classList.add("hidden");
    btnAdmin.classList.add("active");
    btnCust.classList.remove("active");
    renderAdminDashboard();
  }
}

// 4. Customer Registration
function registerUser() {
  let name = document.getElementById("regName").value.trim();
  let email = document.getElementById("regEmail").value.trim();
  let phone = document.getElementById("regPhone").value.trim();

  if (name === "" || email === "" || phone === "") {
    alert("Please fill Name, Email, and Phone to register!");
    return;
  }

  registeredUser = name;
  document.getElementById("activeUserDisplay").innerText = `Registered Customer: ${name} (${email} | ${phone})`;
  showNotification(`Welcome ${name}! Your profile is registered for online booking.`);
}

// 5. Render Vehicle Cards & Populate Dropdowns
function renderVehicles() {
  let filter = document.getElementById("categoryFilter").value;
  let grid = document.getElementById("vehicleGrid");
  grid.innerHTML = "";

  for (let i = 0; i < vehicles.length; i++) {
    let v = vehicles[i];

    if (filter === "All" || v.type === filter) {
      let badgeClass = v.status === "Available" ? "badge-ok" : "badge-maint";

      grid.innerHTML += `
        <div class="v-card">
          <span class="badge ${badgeClass}">${v.status}</span>
          <h3>${v.name}</h3>
          <p><strong>Category:</strong> ${v.type}</p>
          <p><strong>Specs:</strong> ${v.specs}</p>
          <p class="v-price">₹${v.price} / day</p>
          <button class="btn-primary" onclick="selectForBooking(${i})">Select to Book</button>
        </div>
      `;
    }
  }
  updateDropdowns();
}

function updateDropdowns() {
  let c1 = document.getElementById("compareSelect1");
  let c2 = document.getElementById("compareSelect2");
  let bookSel = document.getElementById("bookVehicleSelect");
  let revSel = document.getElementById("revVehicle");

  c1.innerHTML = "";
  c2.innerHTML = "";
  bookSel.innerHTML = "";
  revSel.innerHTML = "";

  for (let i = 0; i < vehicles.length; i++) {
    let opt = `<option value="${i}">${vehicles[i].name} (₹${vehicles[i].price}/day)</option>`;
    c1.innerHTML += opt;
    c2.innerHTML += opt;
    bookSel.innerHTML += opt;
    revSel.innerHTML += `<option value="${vehicles[i].name}">${vehicles[i].name}</option>`;
  }
  calculateTotal();
}

function selectForBooking(index) {
  document.getElementById("bookVehicleSelect").value = index;
  calculateTotal();
  showNotification(`Selected ${vehicles[index].name}. Complete dates & payment below.`);
}

// 6. Compare Two Vehicles
function compareVehicles() {
  let i1 = Number(document.getElementById("compareSelect1").value);
  let i2 = Number(document.getElementById("compareSelect2").value);
  let v1 = vehicles[i1];
  let v2 = vehicles[i2];

  document.getElementById("compareResult").innerHTML = `
    <table>
      <tr><th>Feature</th><th>${v1.name}</th><th>${v2.name}</th></tr>
      <tr><td>Category</td><td>${v1.type}</td><td>${v2.type}</td></tr>
      <tr><td>Price per Day</td><td>₹${v1.price}</td><td>₹${v2.price}</td></tr>
      <tr><td>Specifications</td><td>${v1.specs}</td><td>${v2.specs}</td></tr>
      <tr><td>Availability</td><td>${v1.status}</td><td>${v2.status}</td></tr>
    </table>
  `;
}

// 7. Live Rent Calculation & Booking Submission
function calculateTotal() {
  let index = Number(document.getElementById("bookVehicleSelect").value);
  let days = Number(document.getElementById("rentalDays").value);
  let total = vehicles[index].price * days;
  document.getElementById("totalCostText").innerText = total;
}

function confirmBooking() {
  if (registeredUser === "") {
    alert("Please register your details in Section 1 before booking!");
    return;
  }

  let index = Number(document.getElementById("bookVehicleSelect").value);
  let pickup = document.getElementById("pickupDate").value;
  let retDate = document.getElementById("returnDate").value;
  let days = Number(document.getElementById("rentalDays").value);
  let payment = document.getElementById("paymentMethod").value;
  let v = vehicles[index];

  if (v.status === "Maintenance") {
    alert("This vehicle is currently under maintenance. Please choose an available vehicle.");
    return;
  }

  if (pickup === "" || retDate === "") {
    alert("Please select both Pickup Date and Return Date!");
    return;
  }

  let newBooking = {
    id: "BK-" + (1000 + bookings.length + 1),
    customer: registeredUser,
    vehicle: v.name,
    dates: `${pickup} to ${retDate} (${days}d)`,
    total: v.price * days,
    payment: payment,
    status: "Confirmed"
  };

  bookings.push(newBooking);
  renderCustomerBookings();
  showNotification(`Booking ${newBooking.id} confirmed for ${v.name}!`);
  alert(`Booking Confirmed!\nID: ${newBooking.id}\nTotal Paid: ₹${newBooking.total} via ${payment}`);
}

// 8. Customer Booking History Table
function renderCustomerBookings() {
  let tbody = document.getElementById("customerBookingTable");
  tbody.innerHTML = "";

  if (bookings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">No bookings yet. Register and book a vehicle above!</td></tr>`;
    return;
  }

  for (let i = 0; i < bookings.length; i++) {
    let b = bookings[i];
    tbody.innerHTML += `
      <tr>
        <td>${b.id}</td>
        <td>${b.customer}</td>
        <td>${b.vehicle}</td>
        <td>${b.dates}</td>
        <td>₹${b.total} (${b.payment})</td>
        <td><strong>${b.status}</strong></td>
      </tr>
    `;
  }
}

// 9. Customer Reviews Section
function renderReviews() {
  let container = document.getElementById("reviewsList");
  container.innerHTML = "";

  for (let i = 0; i < reviews.length; i++) {
    let r = reviews[i];
    container.innerHTML += `
      <div class="review-item">
        <strong>${r.user}</strong> — <span>${r.vehicle}</span><br>
        <span>${r.rating}</span>
        <p>${r.comment}</p>
      </div>
    `;
  }
}

function addReview() {
  let user = document.getElementById("revName").value.trim();
  let vehicle = document.getElementById("revVehicle").value;
  let rating = document.getElementById("revRating").value;
  let comment = document.getElementById("revComment").value.trim();

  if (user === "" || comment === "") {
    alert("Please enter your name and review comment.");
    return;
  }

  reviews.push({ user: user, vehicle: vehicle, rating: rating, comment: comment });
  document.getElementById("revName").value = "";
  document.getElementById("revComment").value = "";
  renderReviews();
  showNotification("Thank you! Your customer review has been posted.");
}

// 10. Provider / Admin Dashboard Functions
function addNewVehicle() {
  let name = document.getElementById("newVehName").value.trim();
  let type = document.getElementById("newVehType").value;
  let price = Number(document.getElementById("newVehPrice").value);
  let specs = document.getElementById("newVehSpecs").value.trim();

  if (name === "" || price <= 0 || specs === "") {
    alert("Please fill all new vehicle details!");
    return;
  }

  vehicles.push({
    name: name,
    type: type,
    price: price,
    specs: specs,
    status: "Available",
    maintNote: "Newly Added"
  });

  document.getElementById("newVehName").value = "";
  document.getElementById("newVehPrice").value = "";
  document.getElementById("newVehSpecs").value = "";
  renderAdminDashboard();
  showNotification(`Admin added ${name} to the rental fleet.`);
}

function toggleMaintenance(index) {
  if (vehicles[index].status === "Available") {
    vehicles[index].status = "Maintenance";
    vehicles[index].maintNote = "Scheduled Service";
  } else {
    vehicles[index].status = "Available";
    vehicles[index].maintNote = "Ready for Rent";
  }
  renderAdminDashboard();
}

function changeBookingStatus(index, newStatus) {
  bookings[index].status = newStatus;
  renderAdminDashboard();
  showNotification(`Booking ${bookings[index].id} status updated to ${newStatus}.`);
}

function renderAdminDashboard() {
  let availableCount = 0;
  let totalRevenue = 0;

  for (let i = 0; i < vehicles.length; i++) {
    if (vehicles[i].status === "Available") {
      availableCount++;
    }
  }
  for (let i = 0; i < bookings.length; i++) {
    totalRevenue += bookings[i].total;
  }

  document.getElementById("statTotalVehicles").innerText = vehicles.length;
  document.getElementById("statAvailable").innerText = availableCount;
  document.getElementById("statBookings").innerText = bookings.length;
  document.getElementById("statRevenue").innerText = "₹" + totalRevenue;

  let fleetBody = document.getElementById("adminFleetTable");
  fleetBody.innerHTML = "";
  for (let i = 0; i < vehicles.length; i++) {
    let v = vehicles[i];
    fleetBody.innerHTML += `
      <tr>
        <td>${v.name}</td>
        <td>${v.type}</td>
        <td>₹${v.price}</td>
        <td><strong>${v.status}</strong></td>
        <td>${v.maintNote}</td>
        <td><button class="btn-secondary" onclick="toggleMaintenance(${i})">Toggle Status</button></td>
      </tr>
    `;
  }

  let bookBody = document.getElementById("adminBookingTable");
  bookBody.innerHTML = "";
  if (bookings.length === 0) {
    bookBody.innerHTML = `<tr><td colspan="7">No customer bookings yet.</td></tr>`;
    return;
  }

  for (let i = 0; i < bookings.length; i++) {
    let b = bookings[i];
    bookBody.innerHTML += `
      <tr>
        <td>${b.id}</td>
        <td>${b.customer}</td>
        <td>${b.vehicle}</td>
        <td>${b.dates} (₹${b.total})</td>
        <td>${b.payment}</td>
        <td><strong>${b.status}</strong></td>
        <td>
          <select onchange="changeBookingStatus(${i}, this.value)">
            <option value="Confirmed" ${b.status === "Confirmed" ? "selected" : ""}>Confirmed</option>
            <option value="Active Rental" ${b.status === "Active Rental" ? "selected" : ""}>Active Rental</option>
            <option value="Completed" ${b.status === "Completed" ? "selected" : ""}>Completed</option>
          </select>
        </td>
      </tr>
    `;
  }
}

function renderAll() {
  renderVehicles();
  renderCustomerBookings();
  renderReviews();
}

// Initial Load
renderAll();