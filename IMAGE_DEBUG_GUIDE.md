# Profile Image Troubleshooting Guide

## Issue
Profile image doesn't appear when navigating back to Ownerdetail or Rentprofset page after uploading.

## Debugging Steps

### 1. Check Browser Console
Open the browser console (F12) and look for these messages when the page loads:

**Expected Messages:**
```
Loading profile image: http://localhost:4000/uploads/[filename].jpg
```

**If you see:**
```
No profile image found in user data
```
This means the image wasn't saved to the database.

### 2. Check API Response
In browser console, after uploading image, check the Network tab:

1. Find the PUT request to `/api/users/[userId]`
2. Click on it and check the Response tab
3. Look for `profileImage` field in the response
4. It should contain the filename like: `"profileImage": "1234567890-profile.jpg"`

### 3. Check Database
Using MongoDB Compass or command line:

```javascript
// Connect to MongoDB
use quickrent

// Find your user (replace with your email)
db.owners.findOne({ email: "your@email.com" })
// OR
db.renters.findOne({ email: "your@email.com" })
```

**Check if `profileImage` field exists and has a value.**

### 4. Check File Upload
Verify the file was uploaded to the server:

**Windows:**
```powershell
Get-ChildItem "C:\Users\mjpat\OneDrive\Desktop\Quickrent\server\uploads" | Sort-Object LastWriteTime -Descending | Select-Object -First 10
```

**You should see your uploaded image file with a timestamp in the filename.**

### 5. Check localStorage
In browser console:
```javascript
// Check if user data has profileImage
const user = JSON.parse(localStorage.getItem('qr_user'));
console.log('User data:', user);
console.log('Profile Image:', user.profileImage);
```

### 6. Test Image URL Directly
Copy the image URL from console (e.g., `http://localhost:4000/uploads/1234567890-profile.jpg`) and paste it directly in browser address bar.

**Expected:** Image should display  
**If 404:** File doesn't exist on server or wrong path

---

## Common Issues & Solutions

### Issue 1: Image not saved to database
**Symptoms:** 
- API response doesn't include `profileImage` field
- Database record doesn't have `profileImage` field
- Console shows "No profile image found in user data"

**Solution:**
```javascript
// Check if multer middleware is working
// In server/routes/users.routes.js, add debug log:
router.put('/:id', authRequired, upload.single('profileImage'), async (req, res) => {
  console.log('Uploaded file:', req.file); // Should show file details
  // ... rest of code
});
```

**Fix:** Make sure the form is submitting with `enctype="multipart/form-data"`

---

### Issue 2: Image file not uploaded to server
**Symptoms:**
- Database has `profileImage` field with filename
- But file doesn't exist in uploads folder
- Accessing URL returns 404

**Solution:**
1. Check uploads directory exists:
   ```powershell
   Test-Path "C:\Users\mjpat\OneDrive\Desktop\Quickrent\server\uploads"
   ```
   
2. If not, create it:
   ```powershell
   New-Item -ItemType Directory -Path "C:\Users\mjpat\OneDrive\Desktop\Quickrent\server\uploads"
   ```

3. Check folder permissions (should be writable by Node.js)

---

### Issue 3: Image loads once but disappears on page reload
**Symptoms:**
- Image shows immediately after upload
- After navigating away and back, image is gone
- API response has `profileImage` field

**Cause:** localStorage not being updated with new profileImage

**Solution:** Already implemented in the fix - verify this code exists:

```javascript
// In Ownerdetail.jsx / Rentprofset.jsx
const updatedUser = { 
  ...user, 
  name: responseData.name || user.name,
  city: responseData.city || user.city,
  profileImage: responseData.profileImage || user.profileImage // This is critical
};
localStorage.setItem("qr_user", JSON.stringify(updatedUser));
```

---

### Issue 4: CORS or path issue
**Symptoms:**
- Console shows 404 or CORS errors for image URL
- Image doesn't load in browser

**Solution:**
1. Verify server is serving static files:
   ```javascript
   // In server/index.js, should have:
   app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
   ```

2. Test static file serving:
   - Place a test image in uploads folder
   - Access: `http://localhost:4000/uploads/test.jpg`
   - Should display the image

---

## Step-by-Step Test Procedure

### Test 1: Upload New Image

1. **Login as Owner**
   - Go to http://localhost:5173/owner/login
   - Login with your credentials

2. **Navigate to Owner Details**
   - Click "Owner Details" from dashboard

3. **Open Browser Console** (F12)
   - Go to Console tab
   - Clear any existing messages

4. **Upload Profile Picture**
   - Click "Upload Photo"
   - Select an image (JPG/PNG, < 5MB)
   - Click "Save Details"

5. **Check Console Messages**
   - Should see: "Profile image updated: http://localhost:4000/uploads/[filename].jpg"

6. **Check Network Tab**
   - Find PUT request to `/api/users/[userId]`
   - Check Response - should include `profileImage` field

7. **Verify Image Displays**
   - Profile picture should update immediately

### Test 2: Check Persistence

1. **Navigate Away**
   - Click back to Owner Dashboard

2. **Return to Owner Details**
   - Click "Owner Details" again

3. **Check Console**
   - Should see: "Loading profile image: http://localhost:4000/uploads/[filename].jpg"

4. **Verify Image Displays**
   - Profile picture should show the uploaded image
   - NOT the default logo

5. **Refresh Page** (F5)
   - Image should still display

6. **Clear Console** - check for any errors

---

## Manual Fix Steps

If image is in database but not displaying:

### Step 1: Verify File Exists
```powershell
# Check if file exists
Get-ChildItem "C:\Users\mjpat\OneDrive\Desktop\Quickrent\server\uploads" | Where-Object { $_.Name -like "*profile*" }
```

### Step 2: Get profileImage from Database
```javascript
// In MongoDB
db.owners.findOne({ email: "your@email.com" }, { profileImage: 1 })
```

### Step 3: Manually Update localStorage
```javascript
// In browser console
const user = JSON.parse(localStorage.getItem('qr_user'));
user.profileImage = 'YOUR_FILENAME_FROM_DATABASE.jpg'; // Use actual filename
localStorage.setItem('qr_user', JSON.stringify(user));
location.reload(); // Reload page
```

### Step 4: Force Re-fetch from API
```javascript
// In Ownerdetail component, add this button temporarily:
<button onClick={() => {
  localStorage.removeItem('qr_user');
  location.reload();
}}>
  Force Reload User Data
</button>
```

---

## Verification Checklist

- [ ] Browser console shows "Loading profile image: ..." message
- [ ] No 404 errors in Network tab for image URL
- [ ] Image file exists in server/uploads folder
- [ ] Database record has profileImage field with correct filename
- [ ] localStorage qr_user has profileImage field
- [ ] Image URL is accessible directly in browser
- [ ] Image persists after page reload
- [ ] Image persists after navigating away and back

---

## Server Logs to Add (Temporary Debugging)

Add these to `server/routes/users.routes.js`:

```javascript
// In GET route
router.get('/:id', authRequired, async (req, res) => {
  // ... existing code ...
  
  console.log('📸 Fetching user profile, profileImage:', user.profileImage);
  
  res.json(user);
});

// In PUT route
router.put('/:id', authRequired, upload.single('profileImage'), async (req, res) => {
  console.log('📤 File uploaded:', req.file ? req.file.filename : 'No file');
  
  // ... existing code ...
  
  console.log('💾 Saved profileImage:', user.profileImage);
  
  res.json(user);
});
```

---

## Expected Flow

1. **Upload Image**
   - User selects image file
   - File uploaded via FormData
   - Multer saves file to `server/uploads/[timestamp]-[filename].jpg`
   - Database updated with filename
   - Response includes profileImage field

2. **Display Image**
   - Component fetches user data from API
   - API returns profileImage field
   - Component sets image URL: `http://localhost:4000/uploads/[filename].jpg`
   - localStorage updated with profileImage
   - Image displays on page

3. **Persistence**
   - On page load, component checks localStorage first
   - Then fetches from API
   - If profileImage exists, constructs URL and displays
   - Image should persist across page reloads and navigation

---

## If Nothing Works

Try this nuclear option:

1. **Clear Everything:**
   ```javascript
   // In browser console
   localStorage.clear();
   ```

2. **Delete all uploads:**
   ```powershell
   Remove-Item "C:\Users\mjpat\OneDrive\Desktop\Quickrent\server\uploads\*" -Force
   ```

3. **Restart Server:**
   ```powershell
   # Stop server (Ctrl+C)
   cd C:\Users\mjpat\OneDrive\Desktop\Quickrent\server
   npm run dev
   ```

4. **Login Fresh** and upload new image

---

## Contact Developer

If issue persists after all these steps:
1. Share browser console logs
2. Share server console logs
3. Share database query result for your user
4. Share uploads folder contents
5. Share Network tab screenshot of PUT request

---

Good luck debugging! 🐛🔍
