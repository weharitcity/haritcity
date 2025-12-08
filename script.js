// --- Configuration: YOUR GOOGLE FORM DETAILS ---
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdi_RoP4stn4sagiKm4VXdhThYskpvTr_IHg0vkZQDuaIVsyw/formResponse';

// Mapping HTML Fields to Google Form Entry IDs
const FIELD_MAPPING = {
    name: 'entry.2005620554',    // Existing Name ID
    mobile: 'entry.1166974658',  // Existing Mobile ID
    email: 'entry.1045781291',   // Existing Email ID
    city: 'entry.1065046570',    // Existing City ID
    
    // --- PASTE YOUR NEW ID BELOW ---
    source: 'entry.562185822' 
};

// ---------------------------------------------------------

// --- 1. Smooth scrolling ---
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

// --- 2. Modal Logic ---
function openModal() { document.getElementById("brochureModal").style.display = "block"; }
function closeModal() { document.getElementById("brochureModal").style.display = "none"; }
window.onclick = function(event) {
    if (event.target == document.getElementById("brochureModal")) { closeModal(); }
}

// --- 3. UNIVERSAL FUNCTION TO SEND DATA TO GOOGLE ---
function sendToGoogle(name, mobile, email, city, source) {
    const formData = new FormData();
    formData.append(FIELD_MAPPING.name, name);
    formData.append(FIELD_MAPPING.mobile, mobile);
    formData.append(FIELD_MAPPING.email, email);
    formData.append(FIELD_MAPPING.city, city);
    formData.append(FIELD_MAPPING.source, source); // Sends the label

    return fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        mode: 'no-cors', 
        body: formData
    });
}

// --- 4. HANDLE BROCHURE FORM (Source = "Brochure Download") ---
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

    // We pass "Brochure Download" as the source
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

// --- 5. HANDLE FOOTER ENQUIRY FORM (Source = "Footer Enquiry") ---
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

    // We pass "Footer Enquiry" as the source
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