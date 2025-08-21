import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useCustomer } from '../../context/CustomerContext';
import { getStoreNameFromTitle } from '../../utils/storeUtils';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, loading } = useCustomer();
  
  // Get the return path from location state, or default to '/'
  const from = location.state?.from || '/';



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password, getStoreNameFromTitle());
      // Navigate to the attempted URL or home
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled by the context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Login</h2>
          <p className="mt-2 text-gray-600">
            Welcome back! Please login to your account at <span className="font-semibold text-primary">{getStoreNameFromTitle()}</span>
          </p>
        </div>

        {error && <div className="text-red-500 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>


          {/* <div className="flex items-center justify-between"> */}
            {/* <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div> */}

            {/* <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-primary hover:text-primary/80">
                Forgot password?
              </Link>
            </div> */}
          {/* </div> */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <i className="ri-google-fill mr-2"></i>
              Google
            </button>
            <button
              type="button"
              className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <i className="ri-facebook-fill mr-2"></i>
              Facebook
            </button>
          </div>
        </div> */}

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary hover:text-primary/80">
              Sign up
            </Link>
          </p>
          <Link
            to="/"
            className="inline-block mt-3 text-sm text-gray-500 hover:text-gray-700"
          >
            Continue as guest →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;