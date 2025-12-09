// --- Configuration: YOUR GOOGLE FORM DETAILS ---
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdi_RoP4stn4sagiKm4VXdhThYskpvTr_IHg0vkZQDuaIVsyw/formResponse';

// Mapping HTML Fields to Google Form Entry IDs
const FIELD_MAPPING = {
    name: 'entry.2005620554',    
    mobile: 'entry.1166974658',  
    email: 'entry.1045781291',   
    city: 'entry.1065046570',   
    
    // IMPORTANT: Replace 'entry.YOUR_NEW_SOURCE_ID' with the number you got for the "Source" column
    source: 'entry.YOUR_NEW_SOURCE_ID' 
};

// ---------------------------------------------------------

// --- 1. Dark Mode Logic (System Sync + Manual Toggle) ---
const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;

function applyTheme(isDark) {
    if (isDark) {
        body.classList.add('dark-mode');
        toggleBtn.classList.replace('fa-moon', 'fa-sun'); 
    } else {
        body.classList.remove('dark-mode');
        toggleBtn.classList.replace('fa-sun', 'fa-moon');
    }
}

// Initial Check
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

if (savedTheme === 'dark') { applyTheme(true); } 
else if (savedTheme === 'light') { applyTheme(false); } 
else { applyTheme(systemPrefersDark.matches); }

// Toggle Click
toggleBtn.addEventListener('click', () => {
    const isDarkModeNow = body.classList.contains('dark-mode');
    if (isDarkModeNow) {
        applyTheme(false);
        localStorage.setItem('theme', 'light');
    } else {
        applyTheme(true);
        localStorage.setItem('theme', 'dark');
    }
});

// System Change Listener
systemPrefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) { applyTheme(e.matches); }
});

// --- 2. Mobile Menu Logic ---
const hamburger = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = hamburger.querySelector('i');
    if (navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close Menu on Link Click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = hamburger.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// --- 3. Smooth scrolling ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.getAttribute('href') !== '#') {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// --- 4. Modal Logic ---
function openModal() { document.getElementById("brochureModal").style.display = "block"; }
function closeModal() { document.getElementById("brochureModal").style.display = "none"; }
window.onclick = function(event) {
    if (event.target == document.getElementById("brochureModal")) { closeModal(); }
}

// --- 5. UNIVERSAL FUNCTION TO SEND DATA TO GOOGLE ---
function sendToGoogle(name, mobile, email, city, source) {
    const formData = new FormData();
    formData.append(FIELD_MAPPING.name, name);
    formData.append(FIELD_MAPPING.mobile, mobile);
    formData.append(FIELD_MAPPING.email, email);
    formData.append(FIELD_MAPPING.city, city);
    formData.append(FIELD_MAPPING.source, source);

    return fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        mode: 'no-cors', 
        body: formData
    });
}

// --- 6. HANDLE BROCHURE FORM ---
document.getElementById('brochureForm').addEventListener('submit', function(e) {
    e.preventDefault(); 
    const btn = this.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = "Processing...";
    btn.disabled = true;

    const name = document.getElementById('name').value;
    const mobile = document.getElementById('mobile').value;
    const email = document.getElementById('email').value;
    const city = document.getElementById('city').value;

    sendToGoogle(name, mobile, email, city, "Brochure Download")
    .then(() => {
        alert("Thank you " + name + "! Your details are saved. Downloading brochure...");
        
        var link = document.createElement('a');
        link.href = 'brochure.pdf'; 
        link.download = 'HaritCity_Brochure.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        closeModal();
        this.reset();
    })
    .catch(err => alert("Error saving details."))
    .finally(() => {
        btn.innerText = originalText;
        btn.disabled = false;
    });
});

// --- 7. HANDLE FOOTER ENQUIRY FORM ---
document.getElementById('enquiryForm').addEventListener('submit', function(e) {
    e.preventDefault(); 
    const btn = this.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = "Sending...";
    btn.disabled = true;

    const name = document.getElementById('enq-name').value;
    const mobile = document.getElementById('enq-mobile').value;
    const email = document.getElementById('enq-email').value;
    const city = document.getElementById('enq-city').value;

    sendToGoogle(name, mobile, email, city, "Footer Enquiry")
    .then(() => {
        alert("Thank you " + name + "! We have received your enquiry from " + city + ".");
        this.reset();
    })
    .catch(err => alert("Something went wrong."))
    .finally(() => {
        btn.innerText = originalText;
        btn.disabled = false;
    });
});