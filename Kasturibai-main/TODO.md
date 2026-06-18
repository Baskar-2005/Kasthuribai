# API Server Razorpay Setup TODO

## Status: Starting implementation

**Steps from approved plan:**

- [x] 1. Edit artifacts/api-server/package.json (add dotenv)\n- [x] 2. Edit artifacts/api-server/src/app.ts (add dotenv.config())\n- [x] 3. Edit artifacts/api-server/start.sh (pnpm fixes)
- [x] 4. cd artifacts/api-server && pnpm install
- [ ] 5. User: Create Razorpay test account at dashboard.razorpay.com, copy Key ID/Secret to .env
- [ ] 6. Test: cd artifacts/api-server && pnpm run dev (starts at localhost:8080)  [./start.sh after chmod +x]
- [ ] 7. Test user command: cd artifacts/api-server && node -e \"require('dotenv').config(); console.log(...)\"
- [x] Previous TODO items already marked complete
