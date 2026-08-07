import React, { useState, useEffect } from 'react';
import { getComplaintsApi, updateComplaintStatusApi } from '../../services/complaintService';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import StatusBadge from '../../components/ui/StatusBadge';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import { CheckCircle2, Clock, Upload, MessageSquare, ShieldCheck, MapPin, Eye, Sparkles, Send } from 'lucide-react';

const AssignedComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [newStatus, setNewStatus] = useState('In Progress');
  const [remarks, setRemarks] = useState('');
  const [resolutionImage, setResolutionImage] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchAssigned();
  }, []);

  const fetchAssigned = async () => {
    setLoading(true);
    try {
      const res = await getComplaintsApi();
      if (res.success) {
        setComplaints(res.complaints || []);
      }
    } catch (err) {
      toast.error('Failed to fetch assigned complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenActionModal = (complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status === 'Submitted' ? 'In Progress' : complaint.status);
    setRemarks('');
    setResolutionImage(null);
    setShowModal(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append('status', newStatus);
      if (remarks) formData.append('remarks', remarks);
      if (resolutionImage) formData.append('resolutionImage', resolutionImage);

      const res = await updateComplaintStatusApi(selectedComplaint._id, formData);
      if (res.success) {
        toast.success(`Complaint status updated to ${newStatus}`);
        setShowModal(false);
        fetchAssigned();
      }
    } catch (err) {
      toast.error('Failed to update complaint status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isDashboard={true} />

      <div className="flex-1 flex">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 lg:pl-64 p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-6">
          
          <div>
            <h1 className="text-2xl font-extrabold text-white">Assigned Department Complaints</h1>
            <p className="text-xs text-slate-400 mt-1">Review municipal tickets, accept dispatch & upload resolution proof</p>
          </div>

          <div className="p-6 rounded-3xl glass-card border border-slate-800 overflow-x-auto">
            {loading ? (
              <Loader label="Loading assigned queue..." />
            ) : complaints.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No tickets currently assigned.
              </div>
            ) : (
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="p-3.5 rounded-l-xl">Ticket Title</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Location</th>
                    <th className="p-3.5">Priority</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right rounded-r-xl">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {complaints.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-900/40 transition">
                      <td className="p-3.5 font-bold text-white max-w-xs truncate">{item.title}</td>
                      <td className="p-3.5 font-medium text-slate-300">{item.category}</td>
                      <td className="p-3.5 text-slate-400 max-w-xs truncate">{item.location}</td>
                      <td className="p-3.5"><StatusBadge status={item.priority} type="priority" /></td>
                      <td className="p-3.5"><StatusBadge status={item.status} /></td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleOpenActionModal(item)}
                          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] shadow-sm transition"
                        >
                          Update / Resolve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Action Modal */}
          {selectedComplaint && (
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`Action Ticket #${selectedComplaint._id.slice(-6)}`}>
              <form onSubmit={handleUpdateStatus} className="space-y-4">
                
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-white text-sm">{selectedComplaint.title}</h4>
                  <p className="text-xs text-slate-300">{selectedComplaint.description}</p>
                  {selectedComplaint.summary && (
                    <div className="text-[11px] text-indigo-300 pt-2 border-t border-slate-800 flex items-center space-x-1">
                      <Sparkles size={14} className="text-amber-400 shrink-0" />
                      <span>Groq AI Summary: {selectedComplaint.summary}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Update Workflow Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-input text-xs bg-slate-900"
                  >
                    <option value="In Progress">In Progress (Dispatch Team)</option>
                    <option value="Resolved">Resolved (Work Complete)</option>
                    <option value="Rejected">Rejected (Invalid Report)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Officer Action Remarks / Work Notes
                  </label>
                  <textarea
                    rows={3}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="E.g. Dispatched maintenance truck #42. Repaired pipeline leak."
                    className="w-full px-4 py-3 rounded-xl glass-input text-xs resize-none"
                  />
                </div>

                {newStatus === 'Resolved' && (
                  <div>
                    <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                      Upload Resolution Proof Image (Required for Verification)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setResolutionImage(e.target.files[0])}
                      className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600/20 file:text-emerald-300 cursor-pointer"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                >
                  Save & Update Ticket Status
                </button>

              </form>
            </Modal>
          )}

        </main>
      </div>
    </div>
  );
};

export default AssignedComplaints;
