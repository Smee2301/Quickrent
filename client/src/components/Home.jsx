import { useNavigate } from 'react-router-dom';
import Welcome from './welcome.jsx';

export default function Home() {
  const navigate = useNavigate();
  function redirectToRole(rolePath) { if (rolePath) navigate(rolePath); }

  return (
    <div>
      <Welcome />
    </div>
  );
}
