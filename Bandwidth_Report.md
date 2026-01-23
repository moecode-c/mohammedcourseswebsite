# Bandwidth Calculation Report

This report estimates the bandwidth consumption for your platform under two scenarios: **100 users** and **1000 users**. We consider both the Frontend (Assets/Build) and Backend (API/Data).

## 1. Per-User Estimation (Single Session)

| Category | Size Estimate | Notes |
| :--- | :--- | :--- |
| **Initial Bundle** | ~500 KB | Next.js JS/CSS chunks (Gzipped) |
| **Global Assets** | ~1.2 MB | 3D models (180KB), GIFs (~500KB total), Svgs/Icons |
| **API Data** | ~50 KB | Metadata for 20-30 course/progress requests |
| **Subtotal (No Video)** | **~1.75 MB** | This hits your server/hosting provider |
| **Video Stream** | ~450 MB | Based on 30 mins of 720p (YouTube/Bunny.net) |

## 2. Total Bandwidth Comparison

### Scenario A: 100 Monthly Active Users
*   **Infrastructure Bandwidth (Server/Vercel):** ~175 MB / Month
*   **Traffic Bandwidth (User Data/Video):** ~45 GB / Month

### Scenario B: 1000 Monthly Active Users
*   **Infrastructure Bandwidth (Server/Vercel):** ~1.75 GB / Month
*   **Traffic Bandwidth (User Data/Video):** ~450 GB / Month

## 3. Breakdown of "Frontend vs Backend"

### Frontend (User's Browser)
*   The frontend is responsible for **99% of the bandwidth** because it downloads the large JavaScript bundles and the high-resolution media (videos/GIFs).
*   **Loading the Home Page**: ~1.5 MB total.

### Backend (Server Logic)
*   The backend is extremely "light". It only sends JSON strings (text).
*   **Average API Response**: ~1 KB to 5 KB.
*   Even with 1000 users making 10 requests each, the backend only transfers about 50 MB of raw data.

## 4. Key Recommendations

1.  **Video Offloading**: Since your videos are on YouTube, they do **not** use your server's bandwidth. Your 1000-user scenario would only cost you ~1.75 GB of transfer on your host (e.g., Vercel/Netlify), which is well within the free tier.
2.  **Asset Optimization**: If you add more 3D models or large PNGs, your bandwidth will increase. Always use `.webp` for images and `.glb` (compressed) for 3D models.
3.  **Scale Safety**: Your current architecture is very efficient. You could likely handle 10,000+ users on a basic $20/month plan because the heavy lifting (video) is handled by YouTube.

> [!NOTE]
> If you switch to self-hosted video (e.g., Bunny.net), you will pay for that 450 GB. At Bunny.net's pricing ($0.01/GB), 1000 users would cost you **less than $5.00 / month**.
