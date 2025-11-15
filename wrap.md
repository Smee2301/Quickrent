# QuickRent – Project Wrap

A full‑stack web app enabling peer‑to‑peer vehicle rentals in India. It provides separate experiences for vehicle owners and renters, including authentication, listings, document handling, dashboards, and basic account security.

---

## Monorepo layout

- client/ – React (Vite) SPA
  - src/App.jsx – Route map for the whole SPA
  - src/components/* – Feature components (owners, renters, shared)
  - src/styles/* – Component styles
  - index.html, src/main.jsx – Vite entry
- server/ – Express + MongoDB API
  - index.js – Server bootstrap, CORS, static uploads, route mounts
  - routes/* – REST endpoints (auth, users, vehicles, documents, bookings, maintenance)
  - middleware/* – JWT auth, file upload (multer)
  - models/* – Mongoose models (User, Vehicle, Maintenance)

---

## Tech stack

- Frontend: React 18, React Router 6, Vite, Font Awesome, react-icons, CSS
- Backend: Node.js, Express, Mongoose/MongoDB, JWT, bcryptjs, Multer, CORS, dotenv

---

## Running locally

1) Install dependencies
- Client: `cd client && npm install`
- Server: `cd ../server && npm install`

2) Configure backend environment (server/.env)
- PORT=4000
- MONGO_URI=mongodb://127.0.0.1:27017/quickrent
- JWT_SECRET=your_secret
- CLIENT_ORIGIN=http://localhost:5173

3) Start services
- Server: `npm run dev` (in server/)
- Client: `npm run dev` (in client/)

Default URLs
- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- Health: GET http://localhost:4000/api/health

Build
- Client: `npm run build` then `npm run preview` (default 5174)
- Server: `npm start`

---

## Frontend overview

Routing (src/App.jsx)
- / – Home and marketing pages (About, How It Works, Contact, Terms)
- Auth: /owner/login, /owner/signup, /renter/login, /renter/signup, /forgot-password*, /change-password, /logout
- Owner dashboard/features
  - /owner/dashboard – main owner hub
  - /owner/add-vehicle – add new vehicle (with photo + RC/insurance/pollution)
  - /owner/edit-vehicle/:id – edit listing
  - /owner/view-vehicles – list owner vehicles
  - /owner/upload-doc – general owner document upload (idProof, license, rc, insurance, pollution)
  - /owner/maintenance – maintenance records UI
  - /owner/vehiclefulldetail/:id – full vehicle detail
  - /owner/Bookingrequest – booking requests
  - /owner/Paymenthistory – owner payment history (mock data)
  - /owner/vehicle-security – vehicle security settings
  - /owner/Ologhistory – owner login history
  - /owner/Owneridver – owner ID verification
  - /owner/Earningsummery – earnings summary
  - /owner/Ownerdetails – owner profile details
  - /owner/security-settings – password + 2FA + sessions (partly mocked)
- Renter dashboard/features
  - /renter/dashboard – renter hub
  - /renter/browse-vehicles – browse listings
  - /renter/my-bookings – list bookings
  - /renter/Rentidverify – renter ID verification
  - /rental-history, /saved-vehicles, /profile, /profile-settings, /support – additional renter/utility pages

State and auth
- Client stores authenticated user in localStorage: `qr_token` (JWT) and `qr_user` (JSON)
- Owner UI guards rely on presence/role of `qr_user` and `qr_token` and redirect when missing

Notable components involved in owner flows
- OwnerDashboard.jsx: loads dashboard stats via GET /api/dashboard/owner/:id (note: endpoint not present on server; this is a UI placeholder)
- AddVehicle.jsx: posts multipart FormData to POST /api/vehicles (requires Bearer token); enforces file types/sizes; delays then navigates to /owner/view-vehicles
- UploadDoc.jsx: OTP verify (via /api/auth/send-otp and /api/auth/verify-otp), then multipart upload to POST /api/documents/upload
- Ownerdetail.jsx: reads/updates owner via /api/users/:id (GET/PUT) and loads login history and totals; image upload via field `profileImage`
- SecuritySettings.jsx: change password via PUT /api/users/:id/change-password; 2FA workflow using send-otp/verify-otp endpoints; session list is mocked client-side
- Paymenthistory.jsx: local fake data with optional export (expects jsPDF/SheetJS on window if provided)

UI patterns
- Layout.jsx renders Header + ChatWidget around routes
- Font Awesome loaded from CDN in client/index.html
- Styling is plain CSS under src/styles per feature component

---

## Backend overview

Server entry (server/index.js)
- CORS: origin from CLIENT_ORIGIN (default http://localhost:5173)
- Parses JSON/urlencoded
- Static `/uploads` folder served for uploaded files
- Routes mounted under /api: auth, vehicles, maintenance, documents, users, bookings
- Health endpoint: GET /api/health

Auth middleware (middleware/auth.js)
- Expects Authorization: Bearer <JWT>
- Verifies JWT_SECRET and sets req.userId and req.userRole

Upload middleware (middleware/upload.js)
- Multer disk storage to server/uploads with 5 MB file size limit
- Accepts images and PDFs

Models (Mongoose)
- User
  - name, email (unique), phone, city, role (owner|renter)
  - passwordHash, profileImage, twoFactorEnabled
  - totalVehicles, totalBookings, totalEarnings
- Vehicle
  - ownerId (ref User), brand, model, type, year, color, vehicleNumber
  - fuelType, transmission, mileage, rentPerHour, rentPerDay, securityDeposit
  - availableFrom, maxDistance, pickupLocation, returnLocation
  - features[], photo, images[]
  - documents: rc, insurance, pollution (required)
  - notes, isAvailable, status
- Maintenance
  - ownerId, vehicleId, serviceType, date, cost, notes
  - documents[], serviceCenter, technician, nextServiceDate, status

Routes (selected)
- /api/auth
  - POST /register – create user
  - POST /login – returns JWT + user payload
  - POST /check-existing – check email/phone availability
  - POST /send-otp – send OTP for password reset (email/phone)
  - POST /reset-password – verify OTP and update password
  - POST /verify-otp – verify OTP for 2FA and enable twoFactorEnabled
  - POST /check-account – help find account by email/phone
- /api/users (authRequired)
  - GET /:id – fetch own profile (excludes password)
  - PUT /:id – update profile (multipart field `profileImage`)
  - PUT /:id/change-password – change own password
  - GET /:id/login-history – returns mock history
- /api/vehicles
  - GET / – list vehicles (optional ?ownerId=)
  - GET /owner/:ownerId – list own vehicles (auth, must match)
  - POST / – create vehicle (multipart fields: photo, documents.rc, documents.insurance, documents.pollution)
  - GET /vehicle/:id – get by id
  - PUT /vehicle/:id – update (multipart allowed for same fields)
  - DELETE /vehicle/:id – delete (owner only)
- /api/documents (authRequired)
  - POST /upload – fields: idProof, license, rc, insurance, pollution
- /api/maintenance (authRequired)
  - GET /owner/:ownerId – list own maintenance records
  - POST / – create maintenance record (single `documents` file)
  - GET /record/:id, PUT /record/:id, DELETE /record/:id
- /api/bookings (authRequired)
  - GET /owner/:ownerId – mocked data per user
  - GET /renter/:renterId – mocked data filter
  - POST / – create mock booking
  - PUT /:bookingId/status – update status on mock record

Uploads
- Files are saved to server/uploads and served at GET /uploads/<filename>
- Client links directly (e.g., http://localhost:4000/uploads/<file>) after successful upload

---

## Key user flows

Owner – Add Vehicle
1) Owner logs in to obtain JWT and `qr_user`
2) AddVehicle.jsx validates fields and files, builds FormData
3) POST /api/vehicles (auth) with photo + RC + insurance + pollution
4) On success, navigates to /owner/view-vehicles

Owner – Upload Documents (KYC/vehicle)
1) Optionally verify mobile via OTP: POST /api/auth/send-otp, then /api/auth/verify-otp
2) POST /api/documents/upload (auth) with selected files
3) Client shows links to /uploads/*

Owner – Profile Details
1) Ownerdetail.jsx loads user via GET /api/users/:id and login history
2) PUT /api/users/:id with multipart `profileImage` and fields

Owner – Security Settings
1) Change password: PUT /api/users/:id/change-password
2) 2FA: /api/auth/send-otp then /api/auth/verify-otp; UI toggles stored flag
3) Session management list is mocked on the client

Renter – Browse and booking flows
- UI present; backend bookings are mocked. Extend with a real Booking model as needed.

---

## Notes and gaps

- Paymenthistory.jsx uses mock data; PDF/Excel export relies on jsPDF/autoTable and SheetJS being present on `window` (not currently bundled)
- Bookings are stored in memory (mock) and reset on server restart; replace with a Booking model
- Dashboard stats endpoint referenced by OwnerDashboard.jsx (`/api/dashboard/owner/:id`) is not present on the server; either implement or adjust UI
- users.routes change‑password handler mixes `password` vs `passwordHash` fields; align to `passwordHash` consistently
- Vehicle model requires `documents.pollution`; client enforces via required file input

---

## Extending the project

- Replace mock booking/payment logic with persistent models and services
- Add role‑based route guards on the frontend (owners vs renters)
- Centralize API client with token refresh handling
- Add automated tests (unit + integration) and CI
- Add rate limiting and production OTP/SMS/email services
- Harden security headers and validation across endpoints

---

## Manual smoke test checklist

- Auth
  - Register owner; login; JWT stored; protected pages accessible
- Owner flows
  - Add vehicle (validates files and numeric fields; visible in view list)
  - Upload documents (OTP verify then upload; file links open)
  - Edit vehicle; delete vehicle; access rules enforced
  - Profile update with image; login history loads
  - Change password; verify error states and success path
  - Security 2FA OTP send/verify toggles flag
- Renter flows
  - Signup/login; browse page loads
- Static uploads
  - Access GET /uploads/<filename> returns uploaded files

---

## License

MIT