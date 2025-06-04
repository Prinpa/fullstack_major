"use client"
import { useState } from 'react';
import { CreateUserData } from 'types';
import { loginUser } from 'components/authFunctions';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Partial<CreateUserData>>({});
  const [loginError, setLoginError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateUserData> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    
    if (validateForm()) {
      try {
        const response = await loginUser(formData);
        if (response.error) {
          setLoginError(response.error);
        }
        window.location.href = '/';
        // The redirect will be handled in loginUser function
      } catch (error) {
        console.error('Login error:', error);
        setLoginError('An error occurred during login');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign in</h2>
      {loginError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {loginError}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}