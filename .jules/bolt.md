# Bolt's Performance Journal

## 2025-02-08 - Optimized Screenshot Pipeline
**Learning:** Consolidating multiple `page.evaluate` calls into one reduces IPC overhead between the Node.js process and the browser. Additionally, hostname-based filtering with a `Set` is significantly more efficient than `url.includes` for request blocking when dealing with numerous requests.
**Action:** Always group related DOM manipulations into a single `page.evaluate` and use O(1) lookups for frequent checks like request blocking.

## 2025-02-09 - Hybrid Image Delivery for Serverless Reliability
**Learning:** Returning large binary data as base64 in a JSON response can exceed serverless payload limits (e.g., Vercel's 4MB). However, relying solely on an external `serve` URL for immediate previews is unreliable in multi-instance environments because the file may not yet be available or reachable in `/tmp`.
**Action:** Implement a hybrid strategy: Use base64 data URLs for payloads under a safe limit (3MB) for instant reliability, and fallback to `serve` URLs for larger payloads to stay within platform constraints.
