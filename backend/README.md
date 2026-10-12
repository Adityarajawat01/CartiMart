# CartiMart backend setup

1. Copy `.env.example` to `.env` and set `MONGO_URI`, a random `JWT_SECRET` of at least 32 characters, and all four `ADMIN_*` values. Use a unique admin password of at least 12 characters. The API intentionally refuses to start if these required settings are missing or invalid.
2. Start the API with `npm run dev`.
3. Sign in at the storefront using the configured admin email and password. The admin account is seeded before the API starts; public signup always creates customer accounts.
4. Open `/admin` to manage products, review orders, and view store metrics.

Admin credentials are server-only. Admin access is checked against the current database role on every protected request. On startup, the configured account is the sole account with the admin role.

## Deployment

- Configure the same required variables in the backend host's secret/environment settings. Never put `ADMIN_PASSWORD`, `JWT_SECRET`, database credentials, Cloudinary secrets, or Razorpay secrets in frontend variables or commit a real `.env`.
- Set `CORS_ORIGINS` to a comma-separated list of exact HTTPS storefront origins in production (no trailing slash). Production API requests from unlisted browser origins are rejected.
- Set `VITE_API_URL` in the frontend build environment to the deployed API URL ending in `/api`, then run `npm run build` from `frontend`.
- Host the `frontend/dist` directory and configure the static host to serve `index.html` for client-side routes such as `/admin/products`.
- Deploy MongoDB with network access restricted to the backend host and transaction support (MongoDB Atlas or a replica set). Order placement, payment confirmation, and cancellation use database transactions. Use a persistent database: the configured admin account is synchronized from environment settings on each API startup.
- Configure Razorpay keys on the backend only if online payments are enabled. Configure Cloudinary credentials on the backend only if profile-image uploads are enabled.
- Signed-in customers' carts and wishlists are stored on their MongoDB user records and loaded using the authenticated account. Guest shopping data remains in that browser; guest items are not merged into a customer account.
- Health check: `GET /test`. Admin sign-in uses the regular `/login` screen with the configured administrator email and password.
