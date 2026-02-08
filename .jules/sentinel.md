## 2025-05-15 - [Secure Randomness for API Keys]
**Vulnerability:** The `generateApiKey` function used `Math.random()`, which is a non-cryptographically secure pseudo-random number generator (PRNG). This makes API keys predictable if an attacker can determine the PRNG's state.
**Learning:** Even in modern frameworks like Next.js, utility functions can sometimes fall back on insecure defaults. Using `globalThis.crypto.getRandomValues()` is a robust, cross-environment way to ensure cryptographic security.
**Prevention:** Always use the `crypto` module or `globalThis.crypto` for generating secrets, tokens, or identifiers that need to be unguessable. Avoid `Math.random()` for security-sensitive logic.
