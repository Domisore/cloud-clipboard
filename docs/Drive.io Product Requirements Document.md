This Product Requirements Document (PRD) outlines the development of **Drive.io**, a high-utility, ephemeral storage PWA designed for maximum speed and zero friction.

# ---

**Product Requirements Document: Drive.io**

**Version:** 1.0

**Status:** Draft

**Tagline:** "Just drop it. Toss it here. Store your stuff."

## ---

**1\. Executive Summary**

Drive.io is a minimalist, ephemeral file and text sharing platform. It prioritizes "speed-to-link" functionality, allowing users to upload files or paste clipboard content (text/images) instantly. The goal is to provide a premium utility on a premium domain while maintaining a low-cost, high-performance architecture suitable for future resale.

## **2\. Technical Stack**

To ensure 100% PWA compliance, high speed, and low overhead, the following stack is required:

* **Frontend:** Next.js (App Router) or Vite \+ React.  
* **PWA Engine:** next-pwa or Vite PWA Plugin (Service Workers, Manifest.json, Offline caching).  
* **Backend:** Node.js (Hono or Fastify) for ultra-low latency.  
* **Storage:** \* **Files:** S3-compatible Object Storage (e.g., Cloudflare R2 for $0 egress fees).  
  * **Text/Metadata:** Redis (Upstash) for ephemeral key-value storage with automatic TTL.  
* **Deployment:** Vercel or Railway (Global Edge Network).

## ---

**3\. Core Business Logic & Features**

### **3.1 Upload Logic**

* **File Drop:** Drag-and-drop support for files up to 100MB (Free tier).  
* **Clipboard Listener:** Ctrl+V (or mobile long-press) detection.  
  * **Text:** If clipboard contains text, create a .txt file or a "Pastebin" view.  
  * **Image:** If clipboard contains an image (PNG/JPG), upload immediately as a file.  
* **Unique URL Generation:** Short, non-sequential Base62 IDs (e.g., drive.io/xK39j).

### **3.2 Ephemerality (The "Burn" Logic)**

* **Default Expiry:** All assets are deleted after 24 hours.  
* **Burn-on-Read:** Optional toggle to delete the asset immediately after the first successful download.  
* **Manual Delete:** A "Delete Link" provided only to the uploader via local browser storage (IndexedDB).

### **3.3 PWA Requirements**

* **Installability:** Must trigger "Add to Home Screen" prompts.  
* **Offline Mode:** Users should be able to view their "Recent Uploads" (metadata cached via Service Worker) even without a connection.  
* **Background Sync:** If an upload is interrupted, it should resume once the connection is restored.

## ---

**4\. Development Phases (Testable)**

### **Phase 1: The "Dumb" MVP (Core Utility)**

* **Testable Goal:** Does the site look "finished" while having 0% corporate energy?  
* **Metric:** A user should be able to identify the primary action (drop/paste) within **400ms** of page load.  
* **Success Metric:** A file uploaded at drive.io can be downloaded by a second device via URL.

### **Phase 2: The "Digital Pocket" (Clipboard & UI)**

* **Goal:** Implement the "Quick and Dirty" clipboard features.  
* **Technical Requirements:** \* JavaScript paste event listeners.  
  * Handling navigator.clipboard.read() for images.  
  * Dark-mode minimalist UI implementation.  
* **Success Metric:** User hits Ctrl+V with a screenshot in their clipboard, and a sharing link is generated within 2 seconds.

### **Phase 3: The "Ghost" Layer (Ephemerality & PWA)**

* **Goal:** 100% PWA Compliance \+ Total Layout Fluidity.  
* **Technical Requirements:**  
  * Configure viewport meta tags for fixed-scale rendering.  
  * Implement **CSS Clamp** for typography: font-size: clamp(1rem, 5vw, 2.5rem); so headers look good on all screens.  
  * Integrate the **Web Share API**: Allows mobile users to "Share" a file from their phone directly into the Drive.io app.  
* **Success Metric:** A Lighthouse **"Accessibility"** and **"PWA"** score of **100/100** across both Mobile and Desktop emulators.  
* 

### **Phase 4: Monetization & Exit Prep**

* **Goal:** Turn traffic into data/revenue.  
* **Technical Requirements:** \* Integration of Carbon Ads or a "Buy Me a Coffee" tip jar.  
  * Analytics dashboard (Privacy-first, e.g., Plausible) to show "Proof of Traffic" to potential domain buyers.  
  * "For Sale" banner in the header.

## ---

**5\. Page Adaptability & Responsiveness Requirements**

### **5.1 Fluid Layout Engine**

* **Mobile-First Grid:** The UI must be designed for the smallest mobile screen first, using a single-column layout, and progressively enhance to multi-column "Dashboard" views on desktop.  
* **Relative Units:** Strictly use rem, em, and vh/vw for spacing and sizing to ensure the UI scales proportionally with system font settings.  
* **The "Safe Area" Rule:** Implementation of env(safe-area-inset-\*) CSS variables to ensure the "Burn" toggle and "Recent Uploads" list are not obscured by notches, home indicators, or rounded corners on modern devices (iPhone 16/17, Pixel 9/10).

### **5.2 Dynamic Component States**

The interface must adapt its core interaction model based on the input device:

* **Touch Optimizations:** For mobile viewports, the "Drop Zone" becomes a large "Tap to Upload" button with a minimum touch target of **48x48px**.  
* **Desktop Hover States:** On hover-capable devices (laptops/desktops), the drop zone should pulse or change color when a file is dragged over the window.  
* **Clipboard Specifics:** Mobile users see a prominent "Paste from Clipboard" button (since Ctrl+V isn't a primary action), while desktop users get the background listener functionality.

### **5.3 Orientation & Resolution Handling**

* **Adaptive Breakpoints:**  
  * **Phone (\< 600px):** Vertical stack, hidden sidebar, bottom-fixed action buttons.  
  * **Tablet (600px \- 1024px):** Two-column layout (Drop Zone on left, Recent Uploads on right).  
  * **Desktop (\> 1024px):** Immersive "Center Stage" drop zone with persistent "For Sale" header and Carbon Ads in the corners.  
* **Asset Density:** Use srcset and WebP/AVIF formats for icons and brand assets to ensure they are crisp on Retina/High-DPI displays without bloating the 2G/3G mobile load times.

## 

## **6\. Business Logic for "Resale Readiness"**

Since your end goal is to sell **drive.io**, the responsiveness isn't just for users—it's for the **buyer's demo**.

* **Proof of Versatility:** By showing the buyer that the site works perfectly as a Windows/macOS desktop app and a mobile app, you increase the domain's perceived value from a "site" to a "cross-platform platform."

## **7\. Aesthetic Requirements: Neo-Brutalism & Hacker Utility**

### **7.1 Visual Philosophy**

* **Anti-Corporate:** No rounded corners (radius: 0), no soft gradients, and no "friendly" vector illustrations of people high-fiving.  
* **Raw Surface:** Use "System Mono" fonts (JetBrains Mono, Roboto Mono, or Fira Code) to give the impression of a terminal or IDE.  
* **Hard Shadows:** Buttons shouldn't have soft blurs. They use **"Hard-Pop" shadows**: a solid black offset rectangle (e.g., box-shadow: 5px 5px 0px 0px \#000;).

### **7.2 Color Palette (High-Contrast / Hacker)**

We will use a "Midnight & Matrix" palette that ensures accessibility and instant recognition of actions.

| Element | Hex Code | Purpose |
| :---- | :---- | :---- |
| **Primary Background** | \#0D0D0D | Deep "Ink" black for maximum OLED battery saving. |
| **Surface/Cards** | \#1A1A1A | Slightly lighter black for the drop zone. |
| **Accent (The "Hacker" Pop)** | \#00FF41 | "Matrix Green" or "Terminal Green" for active links/success. |
| **Action Button** | \#F0F0F0 | Stark White—impossible to miss against the dark background. |
| **Danger/Burn** | \#FF3E3E | High-vis Red for the "Self-Destruct" toggle. |
| **Border/Stroke** | \#333333 | Subtle grey for layout lines; turns White on focus. |

### **7.3 Action & Interaction Logic (Zero Friction)**

* **The "Focus" Drop Zone:** The entire viewport (except the header) acts as a drop zone. On file-drag-over, the border of the entire screen should flash Terminal Green.  
* **Micro-Interactions:** When a user clicks a "Copy Link" button, the button text doesn't just change; it should "glitch" briefly or show a \> \_ terminal cursor.  
* **The "Vanish" Animation:** When a file is "burned," use a pixelation or "static noise" exit animation rather than a smooth fade.

## ---

**8\. Interface Component Specifications**

### **8.1 The Header (The "Sales Pitch")**

* **Left:** DRIVE.IO in heavy, all-caps bold.  
* **Center:** A scrolling "ticker" (like a stock exchange) showing real-time (anonymized) stats: 302 FILES DROPPED TODAY // 4.2GB WIPED // DOMAIN FOR SALE: CONTACT@DRIVE.IO.  
* **Right:** A simple "Install" icon that only appears if the PWA isn't yet installed.

### **8.2 The Drop Zone (The "Engine")**

* **Visuals:** A dashed-line box (2px stroke). Inside: \[ DROP\_FILE \] or \[ PASTE\_STUFF \].  
* **No Buttons Required:** The logic is "Action-First." If the user starts typing, it automatically becomes a text-paste. If they drop a file, it starts the upload. No "Select File" button is needed (though a small \+ icon can exist for mobile).

### **8.3 The "Recent" List (The "History")**

* **Table Style:** No alternating row colors. Use thin \#333 lines.  
* Format:  
  \> my\_code.py ..... \[COPY\_LINK\] ... \[BURN\_NOW\]  
  \> image\_01.png ... \[COPY\_LINK\] ... \[BURN\_NOW\]

## ---

**9\. Technical Implementation for Aesthetics**

* **CSS Architecture:** Use **Tailwind CSS** with a custom configuration to disable all default border-radii.  
* **Custom Cursor:** On desktop, replace the standard pointer with a custom green block cursor (█) that blinks.  
* **Loading State:** Instead of a spinning circle, use a "Matrix-style" vertical character rain or a simple ASCII progress bar: \[||||||||---\] 75%.

## **10\. Receiver Experience: The "Safe View" Page**

### **10.1 Access Flow**

* **Zero Authentication:** The link recipient must **never** be asked to sign up or log in.  
* **The "Peek" Feature:** If the content is an image or text, show a low-resolution or truncated "Preview" box. If it’s a file (ZIP, PDF), show a high-contrast icon.  
* **Instant Action:** A massive, high-contrast **\[ DOWNLOAD\_NOW \]** button is the focal point.

### **10.2 Metadata & Anti-Leak Requirements**

To ensure the sender is protected, the share page must perform **Active Metadata Scrubbing**:

* **Sender Anonymity:** The page must not display the sender's IP, original local file path (e.g., C:/Users/John/Desktop/...), or email address.  
* **File Scrubbing:** Upon upload, the backend should strip EXIF data (GPS coordinates, camera model) from images and "Author" tags from PDFs/Docs.  
* **Safe-List Metadata Only:** Only display the following on the share page:  
  * FILE\_NAME: (Sanitized for special characters).  
  * FILE\_SIZE: (e.g., 4.2 MB).  
  * TIME\_LEFT: (Countdown timer until "Burn").  
  * MIME\_TYPE: (e.g., application/zip).

## ---

**11\. Design Requirements (Brutalist Share Page)**

The share page should mirror the "Hacker" aesthetic but with a "Read-Only" UI layout.

### **11.1 The Layout**

* **The "Receipt" Header:** A thin green border at the top with a ticking clock showing the file's remaining life.  
* **The Info Block:** A box with a 3px solid white border containing the scrubbed metadata in a monospace font.  
* **The Action Zone:** The DOWNLOAD button uses the hacker-green shadow to indicate it is the primary interaction.

### **11.2 Branding & Call-to-Action**

* **"Tossed via Drive.io":** A subtle watermark or footer that reminds the receiver where the file came from.  
* **Viral Loop:** A small button at the bottom: \[ I\_WANT\_TO\_TOSS\_A\_FILE\_TOO \] which redirects to the main landing page.

## ---

**12\. Technical Requirements for Share Page**

| Requirement | Description | Test Case |
| :---- | :---- | :---- |
| **No-Index Meta** | The page must have noindex, nofollow to keep files out of Google Search. | Verify robots.txt and meta tags. |
| **CORS Policy** | Download links must be signed and restricted to prevent hotlinking. | Attempt to download file from a direct link without the share page. |
| **Mime-Type Sniffing** | Browser must be told specifically how to handle the file (Content-Disposition). | Verify .zip files download instead of opening as text. |
| **Virus Scan Hook** | (Phase 4\) API hook to show "Clean / Scanned" status. | Upload a test file; check for "Safe" badge. |

## ---

**13\. Updated PRD Phase (Testing the Share Flow)**

### **Phase 2.5: The "Safe-Handshake"**

* **Goal:** Ensure the receiver page is functional and private.  
* Testable Logic: 1\. Upload an image containing GPS data.  
  2\. Open the resulting drive.io/xxxx link.  
  3\. Check if the GPS data is visible in the UI or the downloaded file's properties.  
* **Success Metric:** Zero sender-identifying information leaked; download completes in \< 3 clicks.