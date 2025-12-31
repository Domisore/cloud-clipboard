This PRD focuses on the "Universal Sync" engine. To maintain the drive.io "zero-friction" mantra, we will provide all three pairing methods (QR, Link, OTP) simultaneously on a single screen. This ensures the user never has to "choose" a method; they just use whichever one is easiest for their current hardware.  
PRD: Drive.io Universal Sync & Join  
Version: 1.1  
Feature Set: Ephemeral Session Pairing  
Status: High Priority (Core Utility)  
1\. Objective  
To allow users to create a "Private Bridge" between multiple devices (Mac, PC, Android) without creating an account. This bridge enables a shared "Recent Uploads" history across all paired devices.  
2\. The "Sync Hub" UI Requirements  
When a user clicks the \[ SYNC\_DEVICES \] button, a modal or dedicated view must appear with the following "Brutalist" components:  
 \* The OTP (Desktop-to-Desktop): Large, bold 6-digit number (e.g., 882 104\) in a monospaced font.  
 \* The QR Code (Desktop-to-Mobile): A high-contrast, black-and-white QR code generated client-side.  
 \* The Magic Link (Remote-to-Remote): A "Copy Pairing Link" button that copies a URL containing a one-time-use token.  
 \* The Expiry Ticker: A 120-second countdown timer. If the timer hits zero, the session token is invalidated, and the UI refreshes.  
3\. Technical Logic & Tech Stack  
3.1 Backend Architecture (Redis)  
We will use Redis to handle the high-speed, ephemeral nature of pairing.  
 \* Store 1 (The Token): pair\_token:\[6\_DIGIT\_OTP\] \-\> \[SESSION\_ID\]  
   \* TTL: 120 seconds.  
 \* Store 2 (The Mapping): session:\[SESSION\_ID\] \-\> \[LIST\_OF\_CLIPS\]  
   \* TTL: 24 hours (Sliding window).  
3.2 The Handshake Workflow  
 \* Generation: Device A (The "Master") calls /api/sync/generate. The server generates a random 6-digit OTP and a long UUID.  
 \* Display: Device A displays all three pairing methods.  
 \* Submission: Device B (The "Joiner") submits the OTP via /api/sync/join.  
 \* Authorization: The server validates the OTP, retrieves the SESSION\_ID associated with it, and drops a secure, HTTP-only cookie on Device B containing that ID.  
 \* Success: Both devices now query the same Redis list for "Recent Uploads."  
4\. Feature Requirements  
| Requirement | Description | Test Case |  
|---|---|---|  
| Simultaneous View | QR, OTP, and Link must all be visible at once without scrolling. | Open Sync Hub; verify all 3 methods are visible. |  
| Auto-Refresh | When the 120s timer expires, a new OTP/QR must generate automatically. | Wait 120s; verify the 6-digit code changes. |  
| Single-Use Tokens | Once an OTP is used to pair a device, it is immediately deleted from Redis. | Attempt to use the same OTP on a third device. |  
| PWA Web Share | The "Magic Link" should trigger the native Share Sheet on mobile. | Tap "Copy Link" on Android; verify system share menu opens. |  
5\. Development Phases  
Phase 1: The OTP Handshake (Core Logic)  
 \* Goal: Successfully link two browser windows using only the 6-digit code.  
 \* Test: Type code from PC into Mac; verify "Recent" list matches.  
Phase 2: The Visual Bridge (QR & Link)  
 \* Goal: Implement qrcode.react for the QR code and the clipboard API for the Magic Link.  
 \* Test: Scan QR with Android; verify instant sync.  
Phase 3: Real-Time Socket Update (The "Teleport" Vibe)  
 \* Goal: Use WebSockets (Socket.io) or Server-Sent Events (SSE) so that when Device A pastes a file, Device B’s UI updates automatically without a refresh.  
 \* Test: Paste on PC; observe item appearing on Android in \< 500ms.  
6\. Hacker-Aesthetic Constraints  
 \* Typography: The 6-digit OTP should use a "Large-Scale" font (text-6xl) to make it readable from a distance.  
 \* QR Styling: No rounded corners on the QR pixels. Pure squares only.  
 \* Feedback: When a device joins, show a terminal-style notification: \[ SYSTEM \]: NEW\_DEVICE\_PAIRED\_SUCCESSFULLY.  
Security Note: "The Burn-Link"  
If a user fears their session is compromised, adding a \[ RESET\_SESSION \] button is mandatory. This will invalidate the SESSION\_ID across all paired devices and force them to re-pair, effectively "kicking" everyone out of the digital pocket.