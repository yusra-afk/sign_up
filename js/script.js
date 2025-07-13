// Connects to CSUMB APIs and validates form logic

document.addEventListener("DOMContentLoaded", () => {
    loadStates();
  
    document.getElementById("zip")?.addEventListener("change", updateCityInfo);
    document.getElementById("state")?.addEventListener("change", updateCounties);
    document.getElementById("username")?.addEventListener("input", checkUsername);
    document.getElementById("password")?.addEventListener("focus", suggestPassword);
  
    document.getElementById("signupForm")?.addEventListener("submit", validateForm);
  });
  
  async function loadStates() {
    const res = await fetch("https://csumb.space/api/allStatesAPI.php");
    const data = await res.json();
    const stateSelect = document.getElementById("state");
    if (!stateSelect) return;
    data.forEach(state => {
      const opt = document.createElement("option");
      opt.value = state.usps.toLowerCase();
      opt.textContent = state.state;
      stateSelect.appendChild(opt);
    });
  }
  
  async function updateCityInfo() {
    const zip = document.getElementById("zip").value;
    const citySpan = document.getElementById("city");
    const latSpan = document.getElementById("latitude");
    const lonSpan = document.getElementById("longitude");
    const zipError = document.getElementById("zipError");
  
    const res = await fetch(`https://csumb.space/api/cityInfoAPI.php?zip=${zip}`);
    const data = await res.json();
  
    if (!data || data == false) {
      citySpan.textContent = latSpan.textContent = lonSpan.textContent = "";
      zipError?.classList.remove("d-none");
    } else {
      citySpan.textContent = data.city;
      latSpan.textContent = data.latitude;
      lonSpan.textContent = data.longitude;
      zipError?.classList.add("d-none");
    }
  }
  
  async function updateCounties() {
    const state = document.getElementById("state").value;
    const county = document.getElementById("county");
    county.innerHTML = "";
    const res = await fetch(`https://csumb.space/api/countyListAPI.php?state=${state}`);
    const data = await res.json();
    data.forEach(obj => {
      const opt = document.createElement("option");
      opt.textContent = obj.county;
      county.appendChild(opt);
    });
  }
  
  async function checkUsername() {
    const username = document.getElementById("username").value;
    const res = await fetch(`https://csumb.space/api/usernamesAPI.php?username=${username}`);
    const data = await res.json();
    const msg = document.getElementById("usernameMsg");
  
    if (data.available) {
      msg.textContent = "Username available";
      msg.className = "available";
    } else {
      msg.textContent = "Username not available";
      msg.className = "unavailable";
    }
  }
  
  async function suggestPassword() {
    const res = await fetch("https://csumb.space/api/suggestedPassword.php?length=8");
    const data = await res.json();
    const suggestion = document.getElementById("suggestedPwd");
    suggestion.textContent = "Suggested: " + data.password;
  }
  
  function validateForm(e) {
    const pass = document.getElementById("password").value;
    const retype = document.getElementById("retypePassword").value;
    const error = document.getElementById("passwordError");
  
    if (pass.length < 6) {
      error.textContent = "Password must be at least 6 characters.";
      e.preventDefault();
    } else if (pass !== retype) {
      error.textContent = "Passwords do not match.";
      e.preventDefault();
    } else {
      error.textContent = "";
    }
  }
  