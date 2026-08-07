import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import { User, Mail, Lock, Phone, MapPin, ArrowRight, Loader2, Building2 } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: 'Citizen'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await register(formData);
    setIsSubmitting(false);

    if (res.success) {
      if (res.role === 'Citizen') navigate('/citizen/dashboard');
      else if (res.role === 'Department Officer') navigate('/officer/dashboard');
      else if (res.role === 'Admin') navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-lg space-y-6">
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-600/30 mb-4">
              <Building2 size={26} />
            </div>
            <h2 className="text-2xl font-extrabold text-white">Create CivicRoute Account</h2>
            <p className="text-xs text-slate-400 mt-1">Register to file civic issues and track resolutions</p>
          </div>

          <div className="p-8 rounded-3xl glass-card border border-slate-800">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Verma"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="rahul@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 9876543210"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Account Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs bg-slate-900"
                  >
                    <option value="Citizen">Citizen</option>
                    <option value="Department Officer">Department Officer</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Residential Address / Locality
                </label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Sector 4, Hitech City, Hyderabad"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-400">
              Already registered?{' '}
              <Link to="/login" className="text-indigo-400 font-bold hover:underline">
                Sign In
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
