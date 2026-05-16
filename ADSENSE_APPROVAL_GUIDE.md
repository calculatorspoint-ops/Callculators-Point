# 🎯 Google AdSense Approval Guide for CalcPoint

## ✅ What's Already Done (Built into this project)

### Legal Pages (REQUIRED by AdSense)
- [x] Privacy Policy (`/privacy-policy`) — Full GDPR/CCPA compliant policy
- [x] Terms of Service (`/terms-of-service`) — Complete legal terms
- [x] Disclaimer (`/disclaimer`) — Covers financial, health and accuracy disclaimers
- [x] Contact Page (`/contact`) — With working contact form
- [x] About Page (`/about`) — Explains who you are and your mission

### Technical Requirements
- [x] HTTPS (Firebase Hosting provides this automatically)
- [x] Mobile-responsive design (Tailwind CSS, tested)
- [x] Fast load speed (Vite build, code splitting, Firebase CDN)
- [x] Clean navigation (Navbar + Footer on every page)
- [x] No broken links
- [x] Unique, quality content on every page
- [x] robots.txt — allows Google crawling
- [x] sitemap.xml — helps Google index all pages
- [x] Open Graph meta tags
- [x] JSON-LD structured data
- [x] Advertising disclosure in footer
- [x] "Advertisement" labels above ad units

### Content Requirements
- [x] 50+ calculators (unique, useful tools)
- [x] H1, H2 headings on every page
- [x] Long-form content (400+ words per calculator page)
- [x] FAQ sections with 5+ questions per calculator
- [x] No copyrighted content
- [x] No adult/violent/illegal content

---

## 📋 Checklist Before Applying

### Step 1: Deploy the Site
```bash
npm run build
firebase deploy
```
Your site must be live at a real domain (not localhost).

### Step 2: Get a Custom Domain
AdSense requires a domain you OWN (not a subdomain like calcpoint.web.app).
- Buy a domain (Namecheap, GoDaddy, Google Domains — ~$10/year)
- Point it to Firebase Hosting
- Enable HTTPS (Firebase does this automatically)

### Step 3: Add Real Content
Before applying, make sure:
- [ ] Your site has been live for at least 2–4 weeks
- [ ] You have at least 10–15 pages of unique content
- [ ] Each page has at least 400+ words of original content
- [ ] Regular content updates (add new calculators weekly)

### Step 4: Get Organic Traffic
AdSense reviewers check:
- [ ] Submit sitemap.xml to Google Search Console
- [ ] Verify your domain in Google Search Console
- [ ] Get indexed by Google (wait 1-2 weeks after submission)
- [ ] Aim for at least 50–100 daily visitors before applying
- [ ] Get backlinks from other websites

### Step 5: Set Up Google Search Console
1. Go to search.google.com/search-console
2. Add your domain property
3. Verify ownership via Firebase Hosting HTML tag
4. Submit your sitemap: https://yourdomain.com/sitemap.xml
5. Request indexing for key pages

### Step 6: Apply for AdSense
1. Go to adsense.google.com
2. Sign in with your Google account
3. Enter your website URL
4. Fill in payment information (name, address)
5. Paste the AdSense verification code in index.html
6. Wait for approval (usually 1-7 days for new accounts)

---

## 🔧 Activating AdSense After Approval

### Step 1: Add the AdSense script to index.html
In `/index.html`, find the commented AdSense block and uncomment it:

```html
<!-- UNCOMMENT THIS AFTER APPROVAL -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
  crossorigin="anonymous"></script>
```
Replace `ca-pub-XXXXXXXXXXXXXXXX` with your actual Publisher ID.

### Step 2: Update AdUnit.jsx
In `/src/components/ui/AdUnit.jsx`:
```js
const PUBLISHER_ID = "ca-pub-YOUR_ACTUAL_ID"; // Replace this
```

And remove `data-adtest="on"` from the `<ins>` element.

### Step 3: Replace slot IDs
In `AdUnit.jsx`, replace placeholder slot IDs with your actual ones from AdSense dashboard:
```js
const slots = {
  top:       "YOUR_ACTUAL_SLOT_1",
  bottom:    "YOUR_ACTUAL_SLOT_2",
  sidebar:   "YOUR_ACTUAL_SLOT_3",
  inContent: "YOUR_ACTUAL_SLOT_4",
  afterCalc: "YOUR_ACTUAL_SLOT_5",
};
```

### Step 4: Add Ad Units to Pages
In `Calculator.jsx` (after the calculator widget):
```jsx
import { AdBanner } from "../components/ui/AdUnit.jsx";

// After the calculator widget:
<AdBanner position="afterCalc" />

// In the sidebar:
<AdBanner position="sidebar" />
```

In `Home.jsx`:
```jsx
<AdBanner position="top" />     // After hero
<AdBanner position="bottom" />  // Before footer
```

### Step 5: Deploy
```bash
npm run build
firebase deploy
```

---

## 🚨 Common Rejection Reasons & How We Avoid Them

| Rejection Reason | How This Site Avoids It |
|---|---|
| Insufficient content | 50+ calculators + 400+ words each |
| No privacy policy | Full privacy policy page included |
| No contact information | Dedicated contact page with form |
| Site not accessible | HTTPS + mobile responsive + no errors |
| Copyrighted content | All original content and formulas |
| Adult/gambling content | Pure educational calculator tools |
| Site under construction | Fully built before applying |
| Invalid traffic | No bot traffic, genuine users only |
| No original content | Every page has unique content |

---

## 📈 After Approval: Maximizing AdSense Revenue

### High-Revenue Ad Positions (Finance Calculators pay $5–50 CPM)
1. **After calculator result** — highest CTR position
2. **Between input and result** — high engagement zone  
3. **Sidebar** (desktop only) — always visible
4. **Bottom of FAQ section** — engaged readers

### Recommended Ad Types
- Display ads: sidebar and bottom positions
- In-article ads: between content sections
- Auto ads: let Google optimize placement (enable in AdSense dashboard)

### Finance Calculators = Highest CPM
EMI, SIP, investment calculators attract financial ads at premium rates.
Focus SEO efforts on:
- "EMI calculator" — High CPC
- "SIP calculator" — Very high CPC
- "compound interest calculator" — High CPC
- "loan calculator" — Very high CPC

---

## 📊 Expected Timeline

| Week | Action |
|------|--------|
| Week 1 | Deploy site, submit to Search Console, add sitemap |
| Week 2 | Get indexed, start getting search traffic |
| Week 3-4 | Build up to 50+ daily visitors |
| Week 4 | Apply for AdSense |
| Week 5-6 | Receive AdSense decision |
| Week 6+ | Enable ads, monitor revenue |

---

## ✅ Final Pre-Application Checklist

Before clicking "Apply" on AdSense:
- [ ] Site is live at custom domain with HTTPS
- [ ] Privacy Policy page is accessible and complete
- [ ] Terms of Service page is accessible and complete
- [ ] Contact page has real contact information
- [ ] About page explains your site and mission
- [ ] All pages load without errors
- [ ] Site is mobile-friendly (test at web.dev/measure)
- [ ] Google Search Console is set up and verified
- [ ] Sitemap is submitted to Search Console
- [ ] Site has been live for 2+ weeks
- [ ] You have 50+ daily organic visitors
- [ ] Content is original and valuable
- [ ] No placeholder text on any page
- [ ] Your payment information is ready (name, address, tax ID)

Good luck with your AdSense application! 🚀
