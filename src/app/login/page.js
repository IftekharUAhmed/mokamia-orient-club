"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [memberId, setMemberId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Backend API te Data pathacchi check korar jonno
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, password }),
      });
      const result = await res.json();

      if (result.success) {
        // 🚀 Login Success! Browser e user er data save kore rakhlam
        localStorage.setItem("moc_user", JSON.stringify(result.user));
        
        // Portal e niye jacchi (Etai ashol theek niyam, etate r atke jabe na)
        window.location.href = "/portal";
      } else {
        // ID ba Password vul hole error dekhabo
        setError(result.message);
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border-t-4 border-[#004D98]">
        <div className="text-center mb-6">
          <img src="/moc-logo.jpeg" alt="MOC Logo" className="h-16 mx-auto mb-2" onError={(e) => { e.target.style.display='none'; }} />
          <h1 className="text-2xl font-bold text-[#004D98] uppercase">MOC Portal</h1>
          <p className="text-sm text-gray-500">Authorized Personnel Only</p>
        </div>

        {/* Error Message Dekhanor Box */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">System ID</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. MOC-26-001"
              value={memberId} 
              onChange={(e) => setMemberId(e.target.value)} 
              className="w-full border p-2 rounded focus:outline-none focus:border-[#337AB7]" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required 
              placeholder="Enter your password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full border p-2 rounded focus:outline-none focus:border-[#337AB7]" 
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#D9534F] hover:bg-[#C9302C] text-white font-bold py-2 rounded transition-colors mt-2"
          >
            {isLoading ? "Verifying..." : "Secure Login"}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <a href="/" className="text-sm text-[#337AB7] hover:underline">&larr; Back to Home</a>
        </div>
      </div>
    </div>
  );
}