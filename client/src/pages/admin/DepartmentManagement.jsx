import React, { useState, useEffect } from 'react';
import { getDepartmentsApi } from '../../services/complaintService';
import { createDepartmentApi, updateDepartmentApi, deleteDepartmentApi, getUsersApi } from '../../services/adminService';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import { Building2, PlusCircle, UserCheck, Trash2, Edit } from 'lucide-react';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [deptForm, setDeptForm] = useState({
    departmentName: '',
    code: '',
    description: '',
    officerId: '',
    email: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [deptRes, userRes] = await Promise.all([
        getDepartmentsApi(),
        getUsersApi({ role: 'Department Officer' })
      ]);
      if (deptRes.success) setDepartments(deptRes.departments || []);
      if (userRes.success) setOfficers(userRes.users || []);
    } catch (err) {
      toast.error('Failed to load department registry');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    try {
      const res = await createDepartmentApi(deptForm);
      if (res.success) {
        toast.success('Department created successfully!');
        setShowModal(false);
        setDeptForm({ departmentName: '', code: '', description: '', officerId: '', email: '' });
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create department');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      const res = await deleteDepartmentApi(id);
      if (res.success) {
        toast.success('Department deleted');
        fetchData();
      }
    } catch (err) {
      toast.error('Failed to delete department');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isDashboard={true} />

      <div className="flex-1 flex">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 lg:pl-64 p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-6">
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-white">Municipal Department Registry</h1>
              <p className="text-xs text-slate-400 mt-1">Manage civic departments, assigned head officers & codes</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center space-x-2"
            >
              <PlusCircle size={16} />
              <span>Create Department</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full"><Loader label="Fetching departments..." /></div>
            ) : (
              departments.map((dept) => (
                <div key={dept._id} className="p-6 rounded-3xl glass-card border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-extrabold text-xs">
                      {dept.code}
                    </div>
                    <button onClick={() => handleDelete(dept._id)} className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <h3 className="text-base font-bold text-white">{dept.departmentName}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{dept.description}</p>
                  
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Head Officer:</span>
                    <span className="font-bold text-sky-300">{dept.officer ? dept.officer.name : 'Unassigned'}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Department">
            <form onSubmit={handleCreateDepartment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Department Name</label>
                <input
                  type="text"
                  required
                  value={deptForm.departmentName}
                  onChange={(e) => setDeptForm({ ...deptForm, departmentName: e.target.value })}
                  placeholder="e.g. Roads & Bridges"
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Department Code (3 Letters)</label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={deptForm.code}
                  onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. RND"
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Assign Head Officer</label>
                <select
                  value={deptForm.officerId}
                  onChange={(e) => setDeptForm({ ...deptForm, officerId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs bg-slate-900"
                >
                  <option value="">-- Select Officer --</option>
                  {officers.map((o) => (
                    <option key={o._id} value={o._id}>{o.name} ({o.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  rows={3}
                  value={deptForm.description}
                  onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                  placeholder="Handles road maintenance and asphalt surfacing."
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition"
              >
                Create Department
              </button>
            </form>
          </Modal>

        </main>
      </div>
    </div>
  );
};

export default DepartmentManagement;
