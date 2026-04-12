const API = "http://localhost:5000";


function goTo(path) {
  window.location.href = path;
}

function selectRole(role) {
  if (role === "player") {
    window.location.href = "http://172.17.105.224:8000/";
    return;
  }

  if (role === "collector") {
    goTo("/collector-auth");
    return;
  }

  goTo("/auth");
}

/* ---------- HOUSEHOLD LOGIN ---------- */
const authForm = document.getElementById("authForm");

if (authForm) {
  authForm.addEventListener("submit", e => {
    e.preventDefault();

    const phone = document.getElementById("number");
    const password = document.getElementById("password");

    if (!phone || !password) {
      alert("Login form broken");
      return;
    }

    fetch("/api/login/household", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: phone.value,
        password: password.value
      })
    })
    .then(r => {
      if (!r.ok) throw 0;
      return r.json();
    })
    .then(() => goTo("/household"))
    .catch(() => alert("Invalid household login"));
  });
}

/* ---------- COLLECTOR LOGIN ---------- */
const collectorForm = document.getElementById("collectorAuthForm");

if (collectorForm) {
  collectorForm.addEventListener("submit", e => {
    e.preventDefault();

    const phone = document.getElementById("number");
    const password = document.getElementById("password");

    if (!phone || !password) {
      alert("Collector form broken");
      return;
    }

    fetch("/api/login/collector", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: phone.value,
        password: password.value
      })
    })
    .then(r => {
      if (!r.ok) throw 0;
      return r.json();
    })
    .then(() => goTo("/collector"))
    .catch(() => alert("Invalid collector login"));
  });
}

/* ---------- SIGNUP ---------- */
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("name");
    const phone = document.getElementById("phone");
    const password = document.getElementById("password");
    const location = document.getElementById("location");

    if (!name || !phone || !password || !location) {
      alert("Signup form broken");
      return;
    }

    fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.value,
        phone: phone.value,
        password: password.value,
        location: location.value
      })
    })
    .then(r => {
      if (!r.ok) throw 0;
      return r.json();
    })
    .then(() => goTo("/household"))
    .catch(() => alert("Account already exists"));
  });
}

/* ---------- DISTRICT → CITY DROPDOWNS ---------- */
const districtSelect = document.getElementById("districtSelect");
const citySelect = document.getElementById("citySelect");

let districtData = [];

if (districtSelect && citySelect) {
  fetch("/api/districts")
    .then(r => r.json())
    .then(data => {
      districtData = data;

      data.forEach(d => {
        const opt = document.createElement("option");
        opt.value = d.district;
        opt.textContent = d.district;
        districtSelect.appendChild(opt);
      });
    });

  districtSelect.addEventListener("change", () => {
    citySelect.innerHTML = '<option value="">Select city</option>';

    const selected = districtData.find(
      d => d.district === districtSelect.value
    );

    if (!selected) return;

    ["city1", "city2", "city3", "city4"].forEach(key => {
      if (selected[key]) {
        const opt = document.createElement("option");
        opt.value = selected[key];
        opt.textContent = selected[key];
        citySelect.appendChild(opt);
      }
    });
  });
}

/* ---------- PICKUP REQUEST ---------- */
const submitPickup = document.getElementById("submitPickup");

if (submitPickup) {
  submitPickup.addEventListener("click", () => {
    const district = document.getElementById("districtSelect").value;
    const city = document.getElementById("citySelect").value;
    const address = document.getElementById("address").value;
    const notes = document.getElementById("notes").value;

    if (!district || !city || !address) {
      alert("Please fill all location fields");
      return;
    }

    // TEMP: household_id = 1 (replace with session later)
    fetch("/api/pickup-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        household_id: 1,
        notes: `District: ${district}, City: ${city}, Address: ${address}. ${notes}`
      })
    })
    .then(r => {
      if (!r.ok) throw 0;
      return r.json();
    })
    .then(() => alert("Pickup request placed"))
    .catch(() => alert("Failed to place request"));
  });
}
