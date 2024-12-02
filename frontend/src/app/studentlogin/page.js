'use client';

import { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGraduationCap, faEye, faEyeSlash, faCircleQuestion } from "@fortawesome/free-solid-svg-icons"


export default function StudentLogin() {
  // State Management
  const [formData, setFormData] = useState({
    studentId: '',
    password: '',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Form Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.studentId || !formData.password) {
      setError('Please enter both Student ID and Password');
      setIsLoading(false);
      return;
    }

    try {
      /**
       * @TODO Backend Integration Required:
       * 
       * Express.js endpoint: POST /api/auth/student/login
       * 
       * Request: {
       *   studentId: string,
       *   password: string,
       *   rememberMe: boolean
       * }
       * 
       * Response: {
       *   success: boolean,
       *   token?: string,
       *   error?: string,
       *   student?: {
       *     id: string,
       *     name: string
       *   }
       * }
       * 
       * Example implementation once backend is ready:
       * const response = await fetch('/api/auth/student/login', {
       *   method: 'POST',
       *   headers: {
       *     'Content-Type': 'application/json',
       *   },
       *   body: JSON.stringify(formData)
       * });
       * 
       * const data = await response.json();
       * 
       * if (data.success) {
       *   localStorage.setItem('authToken', data.token);
       *   window.location.href = '/student/dashboard';
       * } else {
       *   throw new Error(data.error || 'Login failed');
       * }
       */

      // Temporary mock response until backend is ready
      await new Promise(resolve => setTimeout(resolve, 1000));
      throw new Error('Authentication system not yet implemented');
      
    } catch (err) {
      setError('Invalid Student ID or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldHelp = (fieldName) => {
    switch(fieldName) {
      case 'studentId':
        return "Enter your Student ID number that was assigned to you by the university.";
      case 'password':
        return "Enter your password. If you've forgotten your password, click the 'Forgot password?' link below.";
      default:
        return "";
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 md:p-[32px]">
      <div className="flex flex-col items-center justify-center gap-4 text-[32px] sm:text-[48px] mb-8">
        <FontAwesomeIcon icon={faGraduationCap} className="text-[48px] sm:text-[64px]" />
        <h1 className="font-bold text-center">Student Login</h1>
      </div>
      
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-gray-300">
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Error Display */}
          {error && (
            <div className="p-4 text-red-500 bg-red-50 rounded-lg border border-red-200 text-center animate-fade-in">
              {error}
            </div>
          )}
          
          {/* Student ID Field */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label htmlFor="studentId" className="text-sm font-semibold text-gray-600">
                Student ID
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowHelp(true);
                  setFocusedField('studentId');
                }}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Help for Student ID field"
              >
                <FontAwesomeIcon icon={faCircleQuestion} />
              </button>
            </div>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              onFocus={() => setFocusedField('studentId')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your Student ID"
              required
              autoComplete="username"
            />
            {showHelp && focusedField === 'studentId' && (
              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
                {getFieldHelp('studentId')}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-sm font-semibold text-gray-600">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowHelp(true);
                  setFocusedField('password');
                }}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Help for password field"
              >
                <FontAwesomeIcon icon={faCircleQuestion} />
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {showHelp && focusedField === 'password' && (
              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
                {getFieldHelp('password')}
              </div>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            {/* @TODO: Implement forgot password functionality */}
            <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors duration-200"          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help? Contact the IT Help Desk at (555) 123-4567
          </p>
        </div>
      </div>
    </div>
  );
}