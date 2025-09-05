import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Clear any stored tokens/user data
    localStorage.removeItem('qr_token');
    localStorage.removeItem('qr_user');
    // Redirect to home
    navigate('/');
  };

  return (
    <div style={{padding: 20, textAlign: 'center'}}>
      <h1>Logout</h1>
      <p>Are you sure you want to logout?</p>
      <button onClick={handleLogout} style={{padding: '10px 20px', margin: '10px'}}>
        Yes, Logout
      </button>
      <button onClick={() => navigate('/')} style={{padding: '10px 20px', margin: '10px'}}>
        Cancel
      </button>
    </div>
  );
}
