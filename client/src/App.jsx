import { Routes, Route } from 'react-router-dom';
import { SocketProvider } from './contexts/SocketContext.jsx';
import Home from './components/Home.jsx';
import OwnerLogin from './components/OwnerLogin.jsx';
import RenterLogin from './components/RenterLogin.jsx';
import OwnerSignup from './components/OwnerSignup.jsx';
import RenterSignup from './components/RenterSignup.jsx';
import AddVehicle from './components/AddVehicle.jsx';
import OwnerDashboard from './components/OwnerDashboard.jsx';
import RenterDashboard from './components/RenterDashboard.jsx';
import ChangePassword from './components/ChangePassword.jsx';
import UploadDoc from './components/UploadDoc.jsx';
import Maintanancerec from './components/Maintanancerec.jsx';
import Fullvehicledetail from './components/Fullvehicledetail.jsx';
import Bookingreq from './components/Bookingreq.jsx'
import Ownerdetail from './components/Ownerdetail.jsx'
import Paymenthistory from './components/Paymenthistory.jsx'
import VehicleSecurity from './components/VehicleSecurity.jsx';
import Ologhistory from './components/Ologhistory.jsx';
import Profile from './components/Profile.jsx';
import Logout from './components/Logout.jsx';
import Layout from './components/Layout.jsx';
import Terms from './components/Terms.jsx';
import ViewListedVehicles from './components/ViewListedVehicles.jsx';
import ForgotPassword from './components/ForgotPassword.jsx';
import ForgotPasswordrent from './components/ForgotPasswordrent.jsx';
import EditVehicle from './components/EditVehicle.jsx';
import Owneridver from './components/Owneridver.jsx';
import Earningsummery from './components/Earningsummery.jsx';
import SecuritySettings from './components/SecuritySettings.jsx';
import Renterbrowse from './components/Renterbrowse.jsx';
import Rentermybooking from './components/Rentermybooking.jsx';
import Rentalhistory from './components/Rentalhistory.jsx';
import Rentsavehicle from './components/Rentsavehicle.jsx';
import Rentprofset from './components/Rentprofset.jsx';
import Rentgetsup from './components/Rentgetsup.jsx';
import Rentidverify from './components/Rentidverify.jsx';
import About from './components/About.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import ContactUs from './components/ContactUs.jsx';





export default function App() {
  return (
    <SocketProvider>
      <Layout>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/owner/login" element={<OwnerLogin />} />
        <Route path="/owner/signup" element={<OwnerSignup />} />
        <Route path="/owner/add-vehicle" element={<AddVehicle />} />
        <Route path="/owner/edit-vehicle/:id" element={<EditVehicle />} />
        <Route path="/owner/view-vehicles" element={<ViewListedVehicles />} />
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/renter/dashboard" element={<RenterDashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-passwordrent" element={<ForgotPasswordrent />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/renter/login" element={<RenterLogin />} />
        <Route path="/renter/signup" element={<RenterSignup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/owner/upload-doc" element={<UploadDoc />} />
        <Route path="/owner/maintenance" element={<Maintanancerec />} />
        <Route path="/owner/vehiclefulldetail/:id" element={<Fullvehicledetail />} />
        <Route path="/owner/Bookingrequest" element={<Bookingreq/>} />
        <Route path="/owner/Ownerdetails" element={<Ownerdetail/>} />
        <Route path="/owner/Paymenthistory" element={<Paymenthistory/>} />
        <Route path="/owner/vehicle-security" element={<VehicleSecurity/>} />
        <Route path="/owner/Ologhistory" element={<Ologhistory/>} />
        <Route path="/owner/Owneridver" element={<Owneridver/>}  />
        <Route path="/owner/Earningsummery" element={<Earningsummery/>} />
        <Route path="/owner/security-settings" element={<SecuritySettings/>} />
        <Route path="/renter/browse-vehicles" element={<Renterbrowse/>} />
        <Route path="/renter/my-bookings" element={<Rentermybooking/>} />
        <Route path="/rental-history" element={<Rentalhistory/>} />
        <Route path="/saved-vehicles" element={<Rentsavehicle/>} />
        <Route path="/profile-settings" element={<Rentprofset/>} />
        <Route path="/support" element={<Rentgetsup/>} />
        <Route path="/renter/Rentidverify" element={<Rentidverify />} />
        </Routes>
      </Layout>
    </SocketProvider>
  );
}


