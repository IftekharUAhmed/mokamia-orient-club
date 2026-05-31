"use client";
import { useState, useEffect } from "react";

export default function PortalDashboard() {
  // 1. SHOB STATES EKDOM UPORE (Etai React er niyam)
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [reunionData, setReunionData] = useState([]);
  const [membershipData, setMembershipData] = useState([]);
  const [committeeData, setCommitteeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Committee States
  const [newCommittee, setNewCommittee] = useState({ fullName: "", designation: "", mobileNumber: "", email: "", bloodGroup: "A+", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Reunion States
  const [editingReunionId, setEditingReunionId] = useState(null);
  const [editReunionData, setEditReunionData] = useState({ fullName: "", batchPassingYear: "", mobileNumber: "", transactionId: "", tShirtSize: "M" });

  // Membership States
  const [editingJoinId, setEditingJoinId] = useState(null);
  const [editJoinData, setEditJoinData] = useState({ fullName: "", mobileNumber: "", bloodGroup: "A+", presentAddress: "" });

  // Admin User State
  const [adminUser, setAdminUser] = useState(null);

  // 2. FETCH DATA & ROUTE PROTECTION
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [reunionRes, memberRes, commRes] = await Promise.all([
        fetch('/api/register'), fetch('/api/join'), fetch('/api/committee')
      ]);
      const reunionJson = await reunionRes.json();
      const memberJson = await memberRes.json();
      const commJson = await commRes.json();

      if (reunionJson.success) setReunionData(reunionJson.data);
      if (memberJson.success) setMembershipData(memberJson.data);
      if (commJson.success) setCommitteeData(commJson.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("moc_user");
    if (!user) {
      window.location.href = "/login"; // Login na thakle ber kore dibe
    } else {
      setAdminUser(JSON.parse(user));
      fetchDashboardData();
    }
  }, []);

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("moc_user");
      window.location.href = "/login";
    }
  };

  // -----------------------------------------
  // COMMITTEE LOGIC
  // -----------------------------------------
  const handleCommitteeChange = (e) => setNewCommittee({ ...newCommittee, [e.target.name]: e.target.value });
  
  const handleEditClick = (member) => {
    setEditingId(member.id);
    setNewCommittee({ fullName: member.fullName, designation: member.designation, mobileNumber: member.mobileNumber, email: member.email || "", bloodGroup: member.bloodGroup || "A+", password: "" });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const cancelEdit = () => {
    setEditingId(null);
    setNewCommittee({ fullName: "", designation: "", mobileNumber: "", email: "", bloodGroup: "A+", password: "" });
  };

  const handleCommitteeSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingId ? `/api/committee/${editingId}` : '/api/committee';
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newCommittee) });
      const result = await res.json();
      if (result.success) {
        alert(editingId ? "Updated Successfully!" : `Added! System ID: ${result.data.memberId}`);
        cancelEdit(); fetchDashboardData();
      } else alert("Error: " + result.message);
    } catch (error) { alert("Server error."); } 
    finally { setIsSubmitting(false); }
  };

  const handleDeleteCommittee = async (id) => {
    if (!confirm("⚠️ Delete this committee member permanently?")) return;
    try {
      const res = await fetch(`/api/committee/${id}`, { method: 'DELETE' });
      if ((await res.json()).success) { alert("Deleted!"); fetchDashboardData(); }
    } catch (error) { alert("Server error."); }
  };

  // -----------------------------------------
  // REUNION LOGIC
  // -----------------------------------------
  const handleEditReunionClick = (reg) => {
    setEditingReunionId(reg.id);
    setEditReunionData({ fullName: reg.fullName, batchPassingYear: reg.batchPassingYear, mobileNumber: reg.mobileNumber, transactionId: reg.transactionId, tShirtSize: reg.tShirtSize || "M" });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const cancelReunionEdit = () => setEditingReunionId(null);

  const handleReunionUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/register/${editingReunionId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editReunionData) });
      if ((await res.json()).success) { alert("Reunion Data Updated!"); cancelReunionEdit(); fetchDashboardData(); }
    } catch (error) { alert("Server error."); }
  };

  const handleDeleteReunion = async (id) => {
    if (!confirm("⚠️ Delete this Reunion Registration permanently?")) return;
    try {
      const res = await fetch(`/api/register/${id}`, { method: 'DELETE' });
      if ((await res.json()).success) { alert("Deleted!"); fetchDashboardData(); }
    } catch (error) { alert("Server error."); }
  };


  // --- EXCEL/CSV DOWNLOAD LOGIC ---
  const downloadReunionExcel = () => {
    if (reunionData.length === 0) {
      alert("No data available to download!");
      return;
    }

    // 1. Excel er Header banano
    const headers = ["Full Name", "Batch", "Mobile Number", "TrxID", "T-Shirt Size"];
    
    // 2. Data guloke row te sajano
    const rows = reunionData.map(reg => [
      reg.fullName,
      reg.batchPassingYear,
      reg.mobileNumber,
      reg.transactionId,
      reg.tShirtSize || "M"
    ]);

    // 3. CSV format e convert kora
    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    // 4. Download file toiri kora
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "MOC_Reunion_Data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // -----------------------------------------
  // MEMBERSHIP LOGIC
  // -----------------------------------------
  const handleApprove = async (id) => {
    if (!confirm("Approve this member?")) return;
    try {
      const res = await fetch(`/api/join/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: "APPROVED" }) });
      if ((await res.json()).success) { alert("Approved!"); fetchDashboardData(); }
    } catch (error) { alert("Server error."); }
  };

  const handleEditJoinClick = (app) => {
    setEditingJoinId(app.id);
    setEditJoinData({ fullName: app.fullName, mobileNumber: app.mobileNumber, bloodGroup: app.bloodGroup || "A+", presentAddress: app.presentAddress || "" });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const cancelJoinEdit = () => setEditingJoinId(null);

  const handleJoinUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/join/${editingJoinId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editJoinData) });
      if ((await res.json()).success) { alert("Membership Data Updated!"); cancelJoinEdit(); fetchDashboardData(); }
    } catch (error) { alert("Server error."); }
  };

  const handleDeleteJoin = async (id) => {
    if (!confirm("⚠️ Delete this Membership Application permanently?")) return;
    try {
      const res = await fetch(`/api/join/${id}`, { method: 'DELETE' });
      if ((await res.json()).success) { alert("Deleted!"); fetchDashboardData(); }
    } catch (error) { alert("Server error."); }
  };

  // -----------------------------------------
  // RENDER UI
  // -----------------------------------------
  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-[250px] bg-[#004D98] flex-shrink-0 md:min-h-screen flex flex-col">
        <div className="bg-[#00366D] p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded flex items-center justify-center font-bold text-[#004D98]">MOC</div>
          <div><h2 className="text-white font-bold text-lg leading-tight">Admin Portal</h2><p className="text-[#A2C4E1] text-xs">{adminUser ? adminUser.id : 'Loading...'}</p></div>
        </div>
        <div className="text-white text-xs font-bold uppercase px-4 py-3 mt-2 bg-[#00366D]">Main Navigation</div>
        <nav className="flex-1 flex flex-col">
          {['dashboard', 'reunion', 'membership', 'committee'].map((menu) => (
            <button key={menu} onClick={() => setActiveMenu(menu)} className={`text-left px-4 py-3 text-sm font-medium transition-colors border-b border-[#00366D] capitalize ${activeMenu === menu ? 'bg-[#00366D] text-white border-l-4 border-l-[#D9534F]' : 'text-gray-300 hover:bg-[#00366D] hover:text-white'}`}>
              {menu === 'dashboard' ? '📊 System Dashboard' : menu === 'reunion' ? '🌙 Reunion Registrations' : menu === 'membership' ? '👥 Membership Requests' : '⚙️ Manage Committee'}
            </button>
          ))}
        </nav>
        <div className="p-4 bg-[#00366D]"><button onClick={handleLogout} className="w-full bg-[#D9534F] hover:bg-[#C9302C] text-white text-sm font-bold py-2 rounded">Log Out</button></div>
      </aside>

      {/* CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-[#E0E4E8] h-[60px] flex items-center justify-between px-6 shadow-sm flex-shrink-0">
          <h1 className="text-[#333333] font-bold text-lg capitalize">{activeMenu.replace("-", " ")} Management</h1>
          <div className="flex items-center gap-3"><span className="text-sm text-gray-500">Welcome, {adminUser ? adminUser.name : 'Admin'}</span><div className="w-8 h-8 rounded-full bg-[#004D98] text-white flex items-center justify-center font-bold text-sm">A</div></div>
        </header>

        <div className="flex-1 p-6 overflow-y-auto bg-[#F5F7FA]">
          {isLoading ? (
             <div className="flex justify-center items-center h-full text-gray-500 font-bold">Loading system data...</div>
          ) : (
            <>
              {/* DASHBOARD TAB */}
              {activeMenu === "dashboard" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                  <div className="bg-white p-6 rounded border shadow-sm border-l-4 border-l-[#337AB7]"><h3 className="text-gray-500 text-sm font-bold uppercase mb-1">Total Reunion</h3><p className="text-3xl font-bold text-[#333333]">{reunionData.length}</p></div>
                  <div className="bg-white p-6 rounded border shadow-sm border-l-4 border-l-[#5CB85C]"><h3 className="text-gray-500 text-sm font-bold uppercase mb-1">Membership Apps</h3><p className="text-3xl font-bold text-[#333333]">{membershipData.length}</p></div>
                  <div className="bg-white p-6 rounded border shadow-sm border-l-4 border-l-[#D9534F]"><h3 className="text-gray-500 text-sm font-bold uppercase mb-1">Committee Members</h3><p className="text-3xl font-bold text-[#333333]">{committeeData.length}</p></div>
                </div>
              )}

              {/* REUNION TAB */}
              {activeMenu === "reunion" && (
                <div className="space-y-6 animate-fade-in">
                  {editingReunionId && (
                    <div className="bg-amber-50 border border-amber-400 rounded shadow-sm">
                      <div className="border-b border-amber-200 px-4 py-3 flex justify-between items-center"><h3 className="font-bold text-amber-700 text-sm">✏️ Edit Reunion</h3><button onClick={cancelReunionEdit} className="text-xs text-red-600 font-bold">Cancel</button></div>
                      <form onSubmit={handleReunionUpdate} className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input required value={editReunionData.fullName} onChange={(e)=>setEditReunionData({...editReunionData, fullName: e.target.value})} className="border p-2 text-sm rounded" placeholder="Name"/>
                        <input required value={editReunionData.batchPassingYear} onChange={(e)=>setEditReunionData({...editReunionData, batchPassingYear: e.target.value})} className="border p-2 text-sm rounded" placeholder="Batch"/>
                        <input required value={editReunionData.mobileNumber} onChange={(e)=>setEditReunionData({...editReunionData, mobileNumber: e.target.value})} className="border p-2 text-sm rounded" placeholder="Mobile"/>
                        <input required value={editReunionData.transactionId} onChange={(e)=>setEditReunionData({...editReunionData, transactionId: e.target.value})} className="border p-2 text-sm rounded" placeholder="TrxID"/>
                        <select value={editReunionData.tShirtSize} onChange={(e)=>setEditReunionData({...editReunionData, tShirtSize: e.target.value})} className="border p-2 text-sm rounded"><option value="M">M</option><option value="L">L</option><option value="XL">XL</option></select>
                        <button type="submit" className="bg-amber-600 text-white p-2 rounded text-sm font-bold">Update</button>
                      </form>
                    </div>
                  )}
                  <div className="bg-white border rounded shadow-sm">
                    <div className="bg-[#F5F5F5] border-b px-4 py-3 flex justify-between items-center">
  <h3 className="font-bold text-[#2D1B4E] text-sm">Reunion List</h3>
  <div className="flex gap-2">
    <button onClick={downloadReunionExcel} className="bg-[#7CD326] hover:bg-[#68B61D] text-[#2D1B4E] font-bold px-3 py-1 text-xs rounded shadow-sm flex items-center gap-1">
      📊 Export Excel
    </button>
    <button onClick={fetchDashboardData} className="bg-[#2D1B4E] text-white px-3 py-1 text-xs rounded hover:bg-[#1f1235]">
      🔄 Refresh
    </button>
  </div>
</div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-[#004D98] text-white"><tr><th className="p-2">Name</th><th className="p-2">Batch</th><th className="p-2">Mobile</th><th className="p-2">TrxID</th><th className="p-2 text-center">Actions</th></tr></thead>
                        <tbody>
                          {reunionData.map((reg) => (
                            <tr key={reg.id} className="border-b"><td className="p-2 font-bold text-[#004D98]">{reg.fullName}</td><td className="p-2">{reg.batchPassingYear}</td><td className="p-2">{reg.mobileNumber}</td><td className="p-2">{reg.transactionId}</td>
                            <td className="p-2 flex justify-center gap-2"><button onClick={() => handleEditReunionClick(reg)} className="bg-amber-500 text-white px-2 py-1 rounded text-xs">Edit</button><button onClick={() => handleDeleteReunion(reg.id)} className="bg-red-600 text-white px-2 py-1 rounded text-xs">Del</button></td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* MEMBERSHIP TAB */}
              {activeMenu === "membership" && (
                <div className="space-y-6 animate-fade-in">
                  {editingJoinId && (
                    <div className="bg-amber-50 border border-amber-400 rounded shadow-sm">
                      <div className="border-b border-amber-200 px-4 py-3 flex justify-between items-center"><h3 className="font-bold text-amber-700 text-sm">✏️ Edit Membership</h3><button onClick={cancelJoinEdit} className="text-xs text-red-600 font-bold">Cancel</button></div>
                      <form onSubmit={handleJoinUpdate} className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input required value={editJoinData.fullName} onChange={(e)=>setEditJoinData({...editJoinData, fullName: e.target.value})} className="border p-2 text-sm rounded" placeholder="Name"/>
                        <input required value={editJoinData.mobileNumber} onChange={(e)=>setEditJoinData({...editJoinData, mobileNumber: e.target.value})} className="border p-2 text-sm rounded" placeholder="Mobile"/>
                        <input required value={editJoinData.presentAddress} onChange={(e)=>setEditJoinData({...editJoinData, presentAddress: e.target.value})} className="border p-2 text-sm rounded" placeholder="Address"/>
                        <button type="submit" className="bg-amber-600 text-white p-2 rounded text-sm font-bold">Update</button>
                      </form>
                    </div>
                  )}
                  <div className="bg-white border rounded shadow-sm">
                    <div className="bg-[#F5F5F5] border-b px-4 py-3 flex justify-between items-center"><h3 className="font-bold text-sm">Membership Applications</h3><button onClick={fetchDashboardData} className="bg-[#337AB7] text-white px-3 py-1 text-xs rounded">Refresh</button></div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-[#5CB85C] text-white"><tr><th className="p-2">Name</th><th className="p-2">Mobile</th><th className="p-2">Status</th><th className="p-2 text-center">Actions</th></tr></thead>
                        <tbody>
                          {membershipData.map((app) => (
                            <tr key={app.id} className="border-b"><td className="p-2 font-bold text-[#004D98]">{app.fullName}</td><td className="p-2">{app.mobileNumber}</td>
                            <td className="p-2"><span className={`px-2 py-1 rounded text-xs font-bold ${app.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{app.status}</span></td>
                            <td className="p-2 flex justify-center gap-2">{app.status === 'PENDING' && <button onClick={() => handleApprove(app.id)} className="bg-[#337AB7] text-white px-2 py-1 rounded text-xs">Approve</button>}<button onClick={() => handleEditJoinClick(app)} className="bg-amber-500 text-white px-2 py-1 rounded text-xs">Edit</button><button onClick={() => handleDeleteJoin(app.id)} className="bg-red-600 text-white px-2 py-1 rounded text-xs">Del</button></td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* COMMITTEE TAB */}
              {activeMenu === "committee" && (
                <div className="space-y-6 animate-fade-in">
                  <div className={`bg-white border ${editingId ? 'border-amber-400 bg-amber-50' : 'border-[#E0E4E8]'} rounded shadow-sm`}>
                    <div className="border-b border-[#E0E4E8] px-4 py-3 flex justify-between"><h3 className="font-bold text-sm">{editingId ? "✏️ Edit Committee Member" : "➕ Add Member"}</h3>{editingId && <button onClick={cancelEdit} className="text-xs text-red-600 font-bold">Cancel</button>}</div>
                    <form onSubmit={handleCommitteeSubmit} className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input required name="fullName" value={newCommittee.fullName} onChange={handleCommitteeChange} placeholder="Name" className="border p-2 text-sm rounded"/>
                      <input required name="designation" value={newCommittee.designation} onChange={handleCommitteeChange} placeholder="Designation" className="border p-2 text-sm rounded"/>
                      <input required name="mobileNumber" value={newCommittee.mobileNumber} onChange={handleCommitteeChange} placeholder="Mobile" className="border p-2 text-sm rounded"/>
                      {!editingId && <input required name="password" value={newCommittee.password} onChange={handleCommitteeChange} placeholder="Password" className="border p-2 text-sm rounded"/>}
                      <div className={`md:col-span-${editingId ? '3' : '2'} flex justify-end`}><button type="submit" disabled={isSubmitting} className={`${editingId ? 'bg-amber-600' : 'bg-[#004D98]'} text-white px-6 py-2 rounded text-sm font-bold`}>{isSubmitting ? 'Saving...' : (editingId ? 'Update' : 'Save & Generate ID')}</button></div>
                    </form>
                  </div>
                  <div className="bg-white border rounded shadow-sm">
                    <div className="bg-[#004D98] text-white border-b px-4 py-3"><h3 className="font-bold text-sm">Committee Directory</h3></div>
                    <table className="w-full text-sm text-left">
                      <thead className="bg-[#F5F5F5]"><tr><th className="p-2">ID</th><th className="p-2">Name</th><th className="p-2">Designation</th><th className="p-2 text-center">Actions</th></tr></thead>
                      <tbody>
                        {committeeData.map((member) => (
                          <tr key={member.id} className="border-b"><td className="p-2 font-bold text-[#D9534F]">{member.memberId}</td><td className="p-2 text-[#004D98]">{member.fullName}</td><td className="p-2">{member.designation}</td>
                          <td className="p-2 flex justify-center gap-2"><button onClick={() => handleEditClick(member)} className="bg-amber-500 text-white px-2 py-1 rounded text-xs">Edit</button><button onClick={() => handleDeleteCommittee(member.id)} className="bg-red-600 text-white px-2 py-1 rounded text-xs">Del</button></td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}