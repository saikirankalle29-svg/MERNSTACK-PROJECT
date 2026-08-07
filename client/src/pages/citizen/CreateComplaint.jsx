import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createComplaintApi } from '../../services/complaintService';
import { analyzeComplaintApi } from '../../services/aiService';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import { Sparkles, MapPin, Upload, AlertTriangle, Send, Loader2, CheckCircle2 } from 'lucide-react';

const CreateComplaint = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: 'Garbage',
    priority: 'Medium'
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiPreview, setAiPreview] = useState(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Run Groq AI Analysis Preview
  const handleAiAnalyze = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Please enter Title and Description first for Groq AI Analysis.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await analyzeComplaintApi(formData.title, formData.description);
      if (res.success) {
        setAiPreview(res.data);
        setFormData((prev) => ({
          ...prev,
          category: res.data.category || prev.category,
          priority: res.data.priority || prev.priority
        }));
        setShowAiModal(true);
        toast.success('Groq AI Complaint Analysis complete!');
      }
    } catch (err) {
      toast.error('Groq AI Analysis failed. Using standard routing.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.location) {
      toast.error('Title, Description, and Location are required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('location', formData.location);
      data.append('category', formData.category);
      data.append('priority', formData.priority);

      if (imageFile) {
        data.append('image', imageFile);
      }

      const res = await createComplaintApi(data);
      if (res.success) {
        toast.success('Complaint registered & routed to department successfully!');
        navigate('/citizen/my-complaints');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit complaint.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isDashboard={true} />

      <div className="flex-1 flex">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 lg:pl-64 p-6 sm:p-8 max-w-4xl mx-auto w-full">
          <div className="mb-8">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles size={16} className="text-amber-400" />
              <span>Groq AI Powered Form</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Register Civic Complaint</h1>
            <p className="text-xs text-slate-400 mt-1">Submit your issue to automatically route it to municipal officers.</p>
          </div>

          <div className="p-8 rounded-3xl glass-card border border-slate-800 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Complaint Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Street Light Not Working near bus stop"
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs"
                />
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Detailed Description *
                  </label>
                  <button
                    type="button"
                    onClick={handleAiAnalyze}
                    disabled={isAnalyzing}
                    className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition"
                  >
                    {isAnalyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles size={14} className="text-amber-400" />}
                    <span>Groq AI Auto-Analyze</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the issue, duration, landmark, and public hazard..."
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs resize-none"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Location / Area / Landmark *
                </label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Madhapur Bus Stop, Colony Road #4, Cyberabad"
                    className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              {/* Category & Priority Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Category (Auto-Detected)
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass-input text-xs bg-slate-900"
                  >
                    <option value="Road">Road</option>
                    <option value="Drainage">Drainage</option>
                    <option value="Garbage">Garbage</option>
                    <option value="Street Light">Street Light</option>
                    <option value="Water Supply">Water Supply</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Traffic">Traffic</option>
                    <option value="Public Property">Public Property</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Urgency Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass-input text-xs bg-slate-900"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Critical">Critical Emergency</option>
                  </select>
                </div>
              </div>

              {/* Upload Image */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Upload Issue Photo (Optional)
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border border-dashed border-slate-700 hover:border-indigo-500 bg-slate-900/40 cursor-pointer text-xs text-slate-400 hover:text-white transition">
                    <Upload size={18} />
                    <span>{imageFile ? imageFile.name : 'Choose JPG/PNG file...'}</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-slate-700" />
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end space-x-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition flex items-center space-x-2"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send size={16} />}
                  <span>Submit & Dispatch Complaint</span>
                </button>
              </div>

            </form>
          </div>

          {/* AI Analysis Preview Modal */}
          {aiPreview && (
            <Modal isOpen={showAiModal} onClose={() => setShowAiModal(false)} title="Groq AI Routing Report">
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-start space-x-3">
                  <Sparkles size={20} className="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Groq AI Categorization Successful</h4>
                    <p className="text-slate-300 mt-1">Llama 3.3 model analyzed your report parameters.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Auto Category</span>
                    <p className="font-bold text-indigo-300 text-xs mt-0.5">{aiPreview.category}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Target Department</span>
                    <p className="font-bold text-sky-300 text-xs mt-0.5">{aiPreview.department}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">AI Executive Summary</span>
                  <p className="text-slate-200 mt-1">{aiPreview.summary}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Polished Work Order Format</span>
                  <p className="text-slate-300 italic mt-1">{aiPreview.improvedComplaint}</p>
                </div>

                <button
                  onClick={() => setShowAiModal(false)}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                >
                  Accept & Use AI Recommendation
                </button>
              </div>
            </Modal>
          )}

        </main>
      </div>
    </div>
  );
};

export default CreateComplaint;
