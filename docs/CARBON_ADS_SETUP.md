# Carbon Ads Setup Guide

## Overview
Carbon Ads has been strategically integrated into the homepage with custom styling that matches the neo-brutalist hacker theme.

## Placement Strategy
The ad is positioned **between the DropZone and RecentList** components for optimal visibility:
- ✅ Natural flow in the user journey
- ✅ Visible without being intrusive
- ✅ Blends seamlessly with the design
- ✅ Appears after user interaction with the main feature

## Design Integration
The Carbon Ad styling matches your theme perfectly:
- **Border**: 2px solid border matching the neo-brutalist aesthetic
- **Background**: Dark surface color (#1A1A1A)
- **Hover Effect**: Neon green border with hard shadow (signature hacker style)
- **Typography**: Monospace font (JetBrains Mono)
- **Colors**: Foreground text with accent highlights on hover

## Configuration Steps

### 1. Sign up for Carbon Ads
1. Visit [Carbon Ads](https://www.carbonads.net/)
2. Apply for an account (approval required)
3. Wait for approval (usually takes a few days)

### 2. Get Your Serve ID
Once approved, you'll receive:
- A **Serve ID** (e.g., `CEAI627Y`)
- A **Placement** value (e.g., `yourdomaincom`)

### 3. Update the Component
Edit `/src/components/ui/CarbonAd.tsx` and replace the placeholder:

```typescript
// Line 11 - Replace this:
script.src = '//cdn.carbonads.com/carbon.js?serve=YOUR_CARBON_SERVE_ID&placement=YOUR_PLACEMENT';

// With your actual values:
script.src = '//cdn.carbonads.com/carbon.js?serve=CEAI627Y&placement=yourdomaincom';
```

### 4. Test the Integration
1. Save the file
2. The dev server will auto-reload
3. Visit http://localhost:3000
4. You should see the Carbon Ad appear between the upload zone and recent uploads

## Customization Options

### Alternative Placements
If you want to move the ad to a different location:

**Option 1: Sidebar (Desktop Only)**
- Place it in a fixed sidebar on larger screens
- Less intrusive but lower visibility

**Option 2: Footer Area**
- Place above or within the footer
- Good for users who scroll down

**Option 3: After Recent Uploads**
- Place below the RecentList component
- Visible to engaged users

### Styling Adjustments
All Carbon Ads styles are in `/src/app/globals.css` starting at line 55.

You can customize:
- Border colors and thickness
- Hover effects
- Spacing and padding
- Font sizes
- Shadow effects

## Performance Notes
- The ad loads asynchronously (won't block page load)
- Proper cleanup on component unmount
- No layout shift (fixed dimensions)

## Revenue Optimization Tips
1. **Keep the current placement** - It's in the natural user flow
2. **Don't hide the ad** - Carbon requires visibility
3. **Monitor CTR** - Carbon provides analytics
4. **A/B test placements** - Try different positions after getting baseline data

## Current Status
- ✅ Component created
- ✅ Styling integrated
- ✅ Placement optimized
- ⏳ Awaiting your Carbon Ads credentials

Once you have your Carbon Ads account approved and credentials, just update the script URL in `CarbonAd.tsx` and you're all set!
