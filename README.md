# Timeless Trips — Website Documentation

## File Structure

```
timelesstrips/
├── index.html          ← Homepage
├── about.html          ← About Us page
├── domestic.html       ← Domestic packages listing
├── international.html  ← International packages listing (add next)
├── contact.html        ← Contact / Enquiry page
├── shimla-manali.html  ← Example package detail page
├── style.css           ← ALL styles (single file)
├── main.js             ← ALL JavaScript (single file)
└── README.md           ← This file
```

---

## How to Add a New Package Page

1. Copy `shimla-manali.html` and rename it (e.g. `kerala-5n6d.html`)
2. Update these fields:
   - `<title>` tag
   - `<meta name="description">`
   - `<link rel="canonical">`
   - The hero `<h1>` title
   - The `pkg-meta-bar` (days, pickup, altitude)
   - The gallery images
   - The itinerary days
   - The inclusions/exclusions list
   - The price in the sidebar
   - The WhatsApp pre-filled message text (replace package name)
3. Add the package card to `domestic.html` or `international.html`
4. Add a card to the `packages-grid` section in `index.html` if it's trending

---

## How to Add a New Destination Category Page

1. Copy `domestic.html`, rename (e.g. `himachal.html`)  
2. Update the hero title and description
3. Add package cards linking to individual package pages
4. Update the nav dropdown links in ALL pages (find all `<ul class="dropdown">`)

---

## Key Customisation Points in style.css

```css
:root {
  --gold:     #c9a96e;   /* ← Change brand gold colour here */
  --dark:     #1a1a18;   /* ← Change dark/background colour */
  --wa-green: #25d366;   /* ← WhatsApp button colour */
  --max-w:    1200px;    /* ← Max content width */
}
```

---

## WhatsApp Integration

All enquiry forms use this pattern (in main.js):
```
https://api.whatsapp.com/send/?phone=918396000504&text=ENCODED_MESSAGE
```

To change the WhatsApp number, search and replace `918396000504` across ALL files.

---

## Payment Gateway Integration (Future)

When ready to add payment, in the booking sidebar:
1. Add a "Pay Now" button below the WhatsApp button
2. Integrate Razorpay/PayU SDK in the `<head>` of package pages
3. The `enquiry-form` class in main.js can be modified to call payment API

### Razorpay Quick Start
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
<button onclick="payNow()">Pay ₹5,000 Advance</button>
<script>
function payNow() {
  var rzp = new Razorpay({
    key: 'YOUR_KEY_ID',
    amount: 500000, // in paise
    currency: 'INR',
    name: 'Timeless Trips',
    description: 'Trip Booking Advance',
    handler: function(response) {
      // redirect to thank you page
    }
  });
  rzp.open();
}
</script>
```

---

## SEO Notes

- Each page has unique `<title>`, `<meta description>`, and `<link rel="canonical">`
- Schema.org JSON-LD markup on homepage and package pages
- All images have descriptive `alt` text
- `loading="lazy"` on all below-fold images
- `loading="eager"` + `fetchpriority="high"` on hero images
- Mobile-first responsive at 480px, 768px, 1024px breakpoints

---

## Performance Tips

- Images are served from existing CDN (media.clicksites.ai) — no self-hosting needed
- Google Fonts uses `preconnect` for faster loading
- No heavy frameworks — pure HTML/CSS/JS
- CSS/JS are single files for minimal HTTP requests
- Intersection Observer for lazy scroll animations (no library needed)

---

## Contact / Socials to Update

- Phone: `+918396000504` (search & replace across all files)
- Instagram: `https://www.instagram.com/time_lesstrips/`
- Address: No. #1659, Urban State, Jind, Haryana – 126102
