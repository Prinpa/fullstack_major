"use client"
import { useState } from 'react';
import { CreateUserData } from 'types';
//import { useRouter } from 'next/navigation';
import { addUser } from 'components/authFunctions';

export default function SignUp() {
  //const router = useRouter();
  const [formData, setFormData] = useState<CreateUserData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Partial<CreateUserData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateUserData> = {};
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const response = addUser(formData);
        //router.push('/login'); // Redirect to login page after successful signup
      } catch (error) {
        console.error('Signup error:', error);
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
    <div className="flex bg-gray-50 px-4">
      <div className=" p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor='firstName' className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                aria-label='firstName'
                id='firstName'
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label htmlFor='lastName' className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                aria-label="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor='email' className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              aria-label="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor='password' className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                aria-label="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <div>
              <label htmlFor='confirmPassword' className="block text-sm font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                aria-label="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors mt-4"
              role='button'
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}