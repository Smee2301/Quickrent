# Profile Management Fixes

## Overview
Fixed the owner and renter profile management systems to properly save and retrieve user data from the database, including profile pictures, automatic calculation of statistics, and proper field mapping.

## Issues Fixed

### 1. "User Not Found" Error
**Problem**: When saving profile details in Ownerdetail or Rentprofset, the system showed "User not found" error.

**Root Cause**: The `/api/users/:id` endpoint was looking for a `User` model, but the application uses separate `Owner` and `Renter` models stored in different MongoDB collections.

**Solution**: Updated the users routes to check both Owner and Renter collections:
```javascript
// Try Owner collection first
let user = await Owner.findById(req.params.id).select('-passwordHash');

// If not found, try Renter collection
if (!user) {
  user = await Renter.findById(req.params.id).select('-passwordHash');
}
```

---

### 2. Phone Number Auto-Population
**Problem**: Phone number wasn't being auto-populated from signup data.

**Solution**: 
- Phone number is now automatically loaded from the database
- Field is marked as read-only (cannot be changed after signup)
- Displays the phone number used during signup
- Shows in both Ownerdetail and Rentprofset components

---

### 3. Total Vehicles and Bookings Count
**Problem**: Total vehicles and bookings weren't being calculated automatically based on owner performance.

**Solution**: 
- Added `calculateTotals()` function that fetches data from APIs
- Automatically counts vehicles from `/api/vehicles/owner/:ownerId`
- Automatically counts bookings from `/api/bookings/owner/:ownerId`
- Calculates total earnings from completed bookings
- These fields are now read-only and auto-calculated
- Added "Refresh Totals" button for manual refresh

---

### 4. Profile Image Upload
**Problem**: Profile images weren't being saved properly.

**Solution**:
- Fixed file upload handling with proper validation
- Supports JPG, JPEG, and PNG formats
- Maximum file size: 5MB
- Images saved to server's `uploads` directory
- Image URLs properly stored in database
- Preview updates immediately after upload

---

### 5. Field Mapping Issues
**Problem**: Form field names didn't match database field names.

**Solution**: Added proper field mapping:

**Frontend → Backend Mapping:**
- `fullName` → `name`
- `fullAddress` → `address`
- All other fields preserved as-is

**Protected Fields (Cannot be changed):**
- `email` - Read-only after signup
- `phone` - Read-only after signup
- `totalVehicles` - Auto-calculated
- `totalBookings` - Auto-calculated
- `totalEarnings` - Auto-calculated
- `joinDate` - Account creation date

---

## File Changes

### Backend (Server)

#### 1. `server/routes/users.routes.js`
**Changes:**
- Updated imports to use `Owner` and `Renter` models instead of `User`
- Modified GET `/:id` to check both collections
- Modified PUT `/:id` to update in correct collection
- Added field protection (email, phone can't be changed)
- Fixed password change to use `passwordHash` field
- Updated to handle both Owner and Renter password changes

**Key Functions:**
```javascript
// Get user profile - checks both collections
router.get('/:id', authRequired, async (req, res) => {
  let user = await Owner.findById(req.params.id).select('-passwordHash');
  if (!user) {
    user = await Renter.findById(req.params.id).select('-passwordHash');
  }
  // ...
});

// Update profile - with field protection
router.put('/:id', authRequired, upload.single('profileImage'), async (req, res) => {
  const updateData = { ...req.body };
  delete updateData.email;  // Can't change email
  delete updateData.phone;  // Can't change phone
  // ...
});
```

#### 2. `server/models/Renter.js`
**Changes:**
- Added `gender` field with enum validation
- Added `pincode` field for address
- Both fields properly integrated with schema

---

### Frontend (Client)

#### 3. `client/src/components/Ownerdetail.jsx`
**Changes:**
- Fixed user data loading from API
- Added proper fallback to localStorage if API fails
- Implemented automatic statistics calculation
- Fixed field mapping (fullName → name)
- Added phone number auto-population
- Phone number is now read-only
- Email is now read-only
- Total vehicles/bookings/earnings are read-only
- Added "Refresh Totals" button
- Fixed profile image upload and display
- Success/error message handling

**Key Functions:**
```javascript
// Calculate totals automatically
const calculateTotals = async () => {
  // Fetch vehicles count
  const vehiclesResponse = await fetch(`/api/vehicles/owner/${user.id}`);
  const vehicles = await vehiclesResponse.json();
  totalVehicles = vehicles.length;
  
  // Fetch bookings count and earnings
  const bookingsResponse = await fetch(`/api/bookings/owner/${user.id}`);
  const bookings = await bookingsResponse.json();
  totalBookings = bookings.length;
  totalEarnings = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.totalAmount, 0);
};

// Field mapping for save
const apiData = {
  name: formData.fullName,
  city: formData.city
};
```

#### 4. `client/src/components/Rentprofset.jsx`
**Changes:**
- Complete rewrite with API integration
- Added `useNavigate` for redirect if not logged in
- Fetch user data from `/api/users/:id`
- Auto-populate phone number from signup
- Phone, email, and name are read-only
- Fixed profile image upload with validation
- Added proper field mapping
- Added loading state during save
- Error message display with custom styling
- Success message on save
- Automatic data refresh after save

**Key Features:**
```javascript
// Load data from API
const loadUserData = async () => {
  const response = await fetch(`/api/users/${user.id}`);
  const apiData = await response.json();
  // Auto-populate all fields including phone
  setFormData({
    fullName: apiData.name,
    phone: apiData.phone, // Auto-populated
    // ... other fields
  });
};

// Field mapping for save
const apiData = {
  name: formData.fullName,
  city: formData.city,
  dateOfBirth: formData.dateOfBirth,
  gender: formData.gender,
  address: formData.fullAddress,
  pincode: formData.pincode
};
```

---

## Usage Guide

### For Owners (Ownerdetail Page)

1. **Viewing Profile:**
   - Navigate to "Owner Details" from dashboard
   - All fields auto-load from database
   - Phone number shows the number used at signup
   - Total vehicles, bookings, and earnings calculated automatically

2. **Updating Profile:**
   - Upload profile picture (JPG/PNG, max 5MB)
   - Update name and city (editable fields)
   - Email and phone are read-only
   - Statistics are auto-calculated
   - Click "Save Details" to update
   - Click "Refresh Totals" to recalculate statistics

3. **Auto-Calculated Fields:**
   - **Total Vehicles**: Count of vehicles you've listed
   - **Total Bookings**: Count of all bookings for your vehicles
   - **Total Earnings**: Sum of completed booking amounts

### For Renters (Rentprofset Page)

1. **Viewing Profile:**
   - Navigate to "Profile Settings" from dashboard
   - Name, email, and phone auto-loaded
   - Phone shows number from signup
   - All fields properly populated from database

2. **Updating Profile:**
   - Upload profile picture (JPG/PNG, max 5MB)
   - Name, email, phone are read-only
   - Update date of birth, gender
   - Update full address, city, pincode
   - Click "Save details" to update
   - Success/error messages display clearly

---

## API Endpoints

### GET `/api/users/:id`
**Purpose**: Fetch user profile data  
**Authentication**: Required (JWT token)  
**Authorization**: User can only fetch their own profile  
**Response**: User object with all profile fields (without password)  

**Collections Checked:**
1. Owners collection
2. Renters collection (if not found in owners)

### PUT `/api/users/:id`
**Purpose**: Update user profile  
**Authentication**: Required (JWT token)  
**Authorization**: User can only update their own profile  
**Body**: FormData with profile fields and optional profile image  
**Protected Fields**: email, phone, passwordHash  
**Response**: Updated user object  

**Collections Updated:**
1. Tries Owners collection first
2. Falls back to Renters collection

### PUT `/api/users/:id/change-password`
**Purpose**: Change user password  
**Authentication**: Required (JWT token)  
**Body**: `{ currentPassword, newPassword }`  
**Validation**: 
- Current password must be correct
- New password minimum 8 characters
**Response**: Success message

---

## Database Schema

### Owner Model Fields
```javascript
{
  name: String (required)
  email: String (required, unique)
  phone: String (required)
  city: String
  passwordHash: String (required)
  profileImage: String
  address: String
  dateOfBirth: Date
  totalVehicles: Number (default: 0)
  totalBookings: Number (default: 0)
  totalEarnings: Number (default: 0)
  // ... other fields
}
```

### Renter Model Fields
```javascript
{
  name: String (required)
  email: String (required, unique)
  phone: String (required)
  city: String
  passwordHash: String (required)
  profileImage: String
  address: String
  dateOfBirth: Date
  gender: String (enum: ['Male', 'Female', 'Other', ''])
  pincode: String
  isVerified: Boolean (default: false)
  // ... other fields
}
```

---

## Testing Guide

### Test Owner Profile:

1. **Login as Owner**
   ```
   Navigate to: http://localhost:5173/owner/login
   ```

2. **Add Vehicles**
   - Go to "Add Vehicle"
   - Add 2-3 test vehicles
   - Note: This increases total vehicles count

3. **View Owner Details**
   - Navigate to "Owner Details"
   - Verify phone number is auto-populated
   - Check total vehicles count matches what you added
   - Click "Refresh Totals" to recalculate

4. **Update Profile**
   - Upload a profile picture
   - Change city name
   - Click "Save Details"
   - Verify success message appears
   - Refresh page - data should persist

5. **Test Read-Only Fields**
   - Try to edit email (should be disabled)
   - Try to edit phone (should be disabled)
   - Statistics fields should be disabled

### Test Renter Profile:

1. **Login as Renter**
   ```
   Navigate to: http://localhost:5173/renter/login
   ```

2. **View Profile Settings**
   - Navigate to "Profile Settings"
   - Verify phone number shows signup phone
   - All fields should load from database

3. **Update Profile**
   - Upload profile picture
   - Add date of birth
   - Select gender
   - Add full address with city and pincode
   - Click "Save details"
   - Verify success message
   - Refresh page - data persists

4. **Test Validation**
   - Try uploading large file (>5MB) - should show error
   - Try uploading wrong file type - should show error
   - Name, email, phone should be read-only

---

## Error Messages

### Proper Error Handling:
- ✅ "User not found" - Fixed by checking both collections
- ✅ File validation errors display clearly
- ✅ API errors show descriptive messages
- ✅ Success messages confirm save completion
- ✅ Loading states prevent duplicate submissions

---

## Security Features

1. **Authentication**: All endpoints require valid JWT token
2. **Authorization**: Users can only view/edit their own profiles
3. **Field Protection**: Critical fields (email, phone) cannot be changed
4. **File Validation**: Image uploads validated for type and size
5. **Password Hashing**: Passwords stored as bcrypt hashes
6. **Data Sanitization**: Fields cleaned before database save

---

## Troubleshooting

### Profile Not Saving:
- Check browser console for API errors
- Verify JWT token exists in localStorage
- Ensure MongoDB is running
- Check server logs for errors

### Phone Number Not Showing:
- Verify phone was provided during signup
- Check localStorage: `qr_user` object
- Check database: user record has phone field
- Clear cache and reload

### Statistics Not Calculating:
- Verify you have added vehicles
- Check vehicles belong to your owner ID
- Click "Refresh Totals" button
- Check browser console for API errors

### Profile Image Not Uploading:
- File must be JPG, JPEG, or PNG
- File size must be under 5MB
- Check uploads directory exists on server
- Check file permissions on server

---

## Future Enhancements

1. Add ability to change email with verification
2. Add ability to change phone with OTP verification
3. Add real-time statistics updates via Socket.IO
4. Add profile completion percentage
5. Add more detailed earnings breakdown
6. Add profile privacy settings
7. Add profile verification badges
8. Add profile activity timeline

---

Enjoy the improved profile management system! 👤📸✨
