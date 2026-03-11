import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import ResolutionLogo from '../img/resolution_app_logo_mini.svg';

const SignUp = () => {
  const handleSuccess = async (credentialResponse) => {
    const { credential } = credentialResponse;
    
    try {
      const response = await axios.post('/auth/google-login', { token: credential });
      if (response.status === 200) {
        window.location.href = '/Home';
      }
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="card shadow p-3 rounded-lg border-0">
            <div className="d-flex justify-content-center align-items-center mb-4">
              <h2 className="m-0 font-weight-bold">Resolution</h2>
              <img
                src={ResolutionLogo}
                alt="Resolution Logo"
                style={{ width: "auto", height: "2.5em", marginLeft: "10px" }}
                className='bounce-img'
              />
            </div>
            <div className="d-flex justify-content-center mb-3">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => console.log('Login Failed')}
              />
            </div>
            <p className="text-center">Welcome</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
