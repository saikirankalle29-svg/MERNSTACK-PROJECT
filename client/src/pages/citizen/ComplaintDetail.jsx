import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getComplaintByIdApi, addCitizenFeedbackApi } from '../../services/complaintService';
import { exportComplaintPDF } from '../../utils/pdfExport';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import StatusBadge from '../../components/ui/StatusBadge';
import Timeline from '../../components/ui/Timeline';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import {
  Download,
  Sparkles,
  MapPin,
  Calendar,
  User,
  ShieldCheck,
  Star,
  CheckCircle2,
  Building2,
  ArrowLeft,
  FileText
} from 'lucide-react';

const ComplaintDetail = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const res = await getComplaintByIdApi(id);
      if (res.success) {
        setComplaint(res.complaint);
      }
    } catch (err) {
      toast.error('Failed to load complaint details');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingFeedback(true);
    try {
      const res = await addCitizenFeedbackApi(id, { rating, comment: feedbackComment });
      if (res.success) {
        toast.success('Thank you! Feedback recorded & complaint ticket closed.');
        setShowFeedbackModal(false);
        fetchComplaint();
      }
    } catch (err) {
      toast.error('Failed to submit feedback.');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <Loader label="Loading ticket timeline details..." />
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
        <p className="text-sm text-slate-400">Complaint ticket not found.</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isDashboard={true} />

      <div className="flex-1 flex">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 lg:pl-64 p-6 sm:p-8 max-w-5xl mx-auto w-full space-y-6">
          
          {/* Header Action Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white transition"
            >
              <ArrowLeft size={16} />
              <span>Back to Complaints</span>
            </button>

            <button
              onClick={() => exportComplaintPDF(complaint)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 text-xs font-bold transition shadow-sm"
            >
              <Download size={16} />
              <span>Download Official PDF Report</span>
            </button>
          </div>

          {/* Main Card Header */}
          <div className="p-8 rounded-3xl glass-card border border-slate-800 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <StatusBadge status={complaint.status} />
                  <StatusBadge status={complaint.priority} type="priority" />
                  <span className="text-xs text-indigo-400 font-mono">ID: #{complaint._id.slice(-8)}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">{complaint.title}</h1>
                <div className="flex items-center space-x-4 text-xs text-slate-400">
                  <span className="flex items-center space-x-1.5"><MapPin size={14} className="text-indigo-400" /><span>{complaint.location}</span></span>
                  <span className="flex items-center space-x-1.5"><Calendar size={14} className="text-indigo-400" /><span>{new Date(complaint.createdAt).toLocaleString()}</span></span>
                </div>
              </div>

              {complaint.status === 'Resolved' && !complaint.citizenFeedback?.rating && (
                <button
                  onClick={() => setShowFeedbackModal(true)}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition flex items-center space-x-2 shrink-0"
                >
                  <Star size={16} className="fill-amber-400 text-amber-400" />
                  <span>Rate Resolution & Close Ticket</span>
                </button>
              )}
            </div>

            {/* Groq AI Analysis Summary Banner */}
            {complaint.summary && (
              <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/25 space-y-2">
                <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold">
                  <Sparkles size={16} />
                  <span>Groq AI Structured Incident Summary</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{complaint.summary}</p>
                {complaint.improvedComplaint && (
                  <p className="text-xs text-slate-300 italic pt-1 border-t border-indigo-500/20">
                    <span className="font-semibold text-indigo-300">Official Municipal Dispatch Text:</span> "{complaint.improvedComplaint}"
                  </p>
                )}
              </div>
            )}

            {/* Complaint Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Original Citizen Description</h4>
                <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
                  {complaint.description}
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Department</span>
                  <span className="font-bold text-indigo-300">{complaint.departmentName}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Assigned Officer</span>
                  <span className="font-bold text-sky-300">{complaint.officerId ? complaint.officerId.name : 'Awaiting Dispatch'}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Category Sector</span>
                  <span className="font-bold text-emerald-300">{complaint.category}</span>
                </div>
              </div>
            </div>

            {/* Photos (Initial & Resolution Proof) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              {complaint.image && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Submitted Issue Photo</h4>
                  <img src={complaint.image} alt="Issue" className="w-full h-48 rounded-2xl object-cover border border-slate-800" />
                </div>
              )}

              {complaint.resolutionImage && (
                <div>
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Verified Officer Resolution Proof</h4>
                  <img src={complaint.resolutionImage} alt="Resolution Proof" className="w-full h-48 rounded-2xl object-cover border border-emerald-500/30" />
                </div>
              )}
            </div>

            {/* Timeline Audit Logs */}
            <div className="pt-6 border-t border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Workflow Progress Audit Trail</h3>
              <Timeline items={complaint.timeline || []} />
            </div>

            {/* Feedback display if closed */}
            {complaint.citizenFeedback?.rating && (
              <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Citizen Rating & Feedback</h4>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} className={star <= complaint.citizenFeedback.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'} />
                    ))}
                  </div>
                </div>
                {complaint.citizenFeedback.comment && (
                  <p className="text-xs text-slate-300 italic">"{complaint.citizenFeedback.comment}"</p>
                )}
              </div>
            )}

          </div>

          {/* Rating Feedback Modal */}
          <Modal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} title="Citizen Feedback & Rating">
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <p className="text-xs text-slate-300">How satisfied are you with the municipal officer's resolution of this issue?</p>
              
              <div className="flex items-center justify-center space-x-2 py-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-2 transition transform hover:scale-125"
                  >
                    <Star size={28} className={star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'} />
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Remarks / Suggestions</label>
                <textarea
                  rows={3}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Great resolution speed! Cleaned up perfectly."
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingFeedback}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Submit Rating & Close Ticket
              </button>
            </form>
          </Modal>

        </main>
      </div>
    </div>
  );
};

export default ComplaintDetail;
