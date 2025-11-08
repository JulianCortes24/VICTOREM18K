Victorem backend (Express + Postgres)

This backend provides endpoints for:
- Authentication (register, login, logout, me) using HttpOnly session cookies stored in Postgres
- Cart management (get, add, update, delete items)
- Checkout (create order from cart; payment is simulated, ready for Stripe/PayPal integration)

Quickstart

1. Create Postgres DB:
   - Example: createdb victorem

2. Copy `.env.example` to `.env` and update `DATABASE_URL` and `SESSION_SECRET`.

3. Install and run:

```powershell
cd "c:\Users\USUARIO\Desktop\Victorem Remaster\VICTOREM18K\backend"
npm install
npm run dev
```

4. Open http://localhost:3001

Notes for deployment

- In production set `NODE_ENV=production` and run behind HTTPS. Set `SESSION_COOKIE.secure=true` in the code (it's already controlled by NODE_ENV).
- Use a strong `SESSION_SECRET` and rotate it carefully.
- Integrate a payment provider (Stripe recommended). To add Stripe:
  - Create a PaymentIntent server-side with the total amount.
  - Return the client secret to the frontend, complete payment on client and verify via webhooks before marking order as paid.

Files created

- `index.js` - server bootstrap
- `db.js` - Postgres pool + init
- `routes/auth.js`, `routes/cart.js`, `routes/checkout.js`
- `.env.example`, `package.json`, `README.md`
 - `Dockerfile`

Additional deployment helpers added in this repo:

 - `docker-compose.yml` - compose file for local testing (Postgres + web)
 - `.dockerignore` - files excluded from Docker build
 - `DEPLOY_RAILWAY.md` - step-by-step guide for quick deploy on Railway.app (recommended for junior devs)
Next steps I can take for you (pick one):
- Convert frontend to call these APIs (auth / cart / checkout). I'll update `catalogo.js`, `miperfil.js`, `personalizacion.js`, `checkout.js`.
- Add Stripe integration (server and client snippets) and a webhook handler.
- Add Dockerfile + docker-compose for a ready deployment stack (Postgres + backend).
