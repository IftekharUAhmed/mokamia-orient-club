"use client";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // API theke data ana
  const fetchRegistrations = () => {
    fetch('/api/admin')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setRegistrations(data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  // Status Approve/Reject kora
  const handleStatusUpdate = async (id, newStatus) => {
    const isConfirmed = confirm(`Are you sure you want to mark this as ${newStatus}?`);
    if (!isConfirmed) return;

    try {
      const res = await fetch('/api/admin/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      const result = await res.json();
      
      if (result.success) {
        alert(`Successfully marked as ${newStatus}`);
        fetchRegistrations(); // Table ta notun kore load hobe
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      alert("Server Error");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F1] p-8 md:p-12">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-8 border-b border-[rgba(27,77,62,0.1)] pb-6">
          <div>
            <h1 className="font-playfair text-3xl font-black text-[#1B4D3E]">MOC Admin Panel</h1>
            <p className="text-[#6B7280] font-syne text-sm mt-1">Manage Reunion Registrations</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white px-5 py-2 rounded-lg border border-gray-200 shadow-sm">
              <span className="text-[#4B5563] text-sm font-semibold">Total: </span>
              <span className="text-[#D4AF37] font-black text-lg">{registrations.length}</span>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1B4D3E] text-white font-syne text-[13px] uppercase tracking-wider">
                  <th className="p-4">Name & Batch</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">TrxID</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr><td colSpan="5" className="p-8 text-center text-[#6B7280]">Loading data...</td></tr>
                ) : registrations.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-[#6B7280]">No registrations found.</td></tr>
                ) : (
                  registrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-[#F9F7F1] transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-[#2C3539]">{reg.fullName}</div>
                        <div className="text-[12px] text-[#6B7280] font-semibold">Batch: {reg.batchPassingYear}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-[#2C3539]">{reg.mobileNumber}</div>
                        <div className="text-[12px] text-[#6B7280]">{reg.currentLocation}</div>
                      </td>
                      <td className="p-4 text-sm font-mono text-[#6B7280]">{reg.transactionId}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${
                          reg.paymentStatus === 'APPROVED' ? 'bg-[#E6F4EA] text-[#1E8E3E]' :
                          reg.paymentStatus === 'REJECTED' ? 'bg-[#FCE8E6] text-[#D93025]' :
                          'bg-[rgba(212,175,55,0.15)] text-[#8A6A28]'
                        }`}>
                          {reg.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right flex gap-2 justify-end">
                        {reg.paymentStatus === 'PENDING' && (
                          <>
                            <button onClick={() => handleStatusUpdate(reg.id, 'APPROVED')} className="px-3 py-1.5 bg-[#1B4D3E] text-white text-xs rounded hover:bg-[#29725C] transition-colors">Approve</button>
                            <button onClick={() => handleStatusUpdate(reg.id, 'REJECTED')} className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 text-xs rounded hover:bg-red-100 transition-colors">Reject</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}