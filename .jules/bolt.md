# Bolt's Performance Journal

## 2025-02-08 - Optimized Screenshot Pipeline
**Learning:** Consolidating multiple `page.evaluate` calls into one reduces IPC overhead between the Node.js process and the browser. Additionally, hostname-based filtering with a `Set` is significantly more efficient than `url.includes` for request blocking when dealing with numerous requests.
**Action:** Always group related DOM manipulations into a single `page.evaluate` and use O(1) lookups for frequent checks like request blocking.
