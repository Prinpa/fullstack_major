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
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      {loginError && (
        <div className="login-error">
          {loginError}
        </div>
      )}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            name="email"
            aria-label='email'
            value={formData.email}
            onChange={handleChange}
            className="form-input"
          />
          {errors.email && (
            <p className="form-error">{errors.email}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor='password' className="form-label">Password</label>
          <input
            type="password"
            name="password"
            aria-label='password'
            value={formData.password}
            onChange={handleChange}
            className="form-input"
          />
          {errors.password && (
            <p className="form-error">{errors.password}</p>
          )}
        </div>
        <button
          type="submit"
          className="login-button"
          role="button"
        >
          Log in
        </button>
      </form>
    </div>
  );
}