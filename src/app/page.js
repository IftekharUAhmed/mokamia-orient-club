"use client";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");

  // --- REUNION FORM STATE ---
  const [reunionData, setReunionData] = useState({
    fullName: "", mobileNumber: "", batchPassingYear: "", tShirtSize: "M", currentLocation: "", transactionId: ""
  });
  const [isReunionSubmitting, setIsReunionSubmitting] = useState(false);

  // --- JOIN CLUB FORM STATE ---
  const [joinData, setJoinData] = useState({
    fullName: "", mobileNumber: "", bloodGroup: "A+", presentAddress: "", occupation: ""
  });
  const [isJoinSubmitting, setIsJoinSubmitting] = useState(false);

  // Handlers
  const handleReunionChange = (e) => setReunionData({ ...reunionData, [e.target.name]: e.target.value });
  const handleJoinChange = (e) => setJoinData({ ...joinData, [e.target.name]: e.target.value });

  // Reunion Submit (With Validation)
  const handleReunionSubmit = async (e) => {
    e.preventDefault();
    const mobileRegex = /^01\d{9}$/; 
    if (!mobileRegex.test(reunionData.mobileNumber)) {
      alert("❌ Error: Please enter a valid 11-digit Bangladeshi mobile number (e.g., 018XXXXXXX).");
      return;
    }
    if (reunionData.transactionId.length < 5) {
      alert("❌ Error: Transaction ID is too short. Please enter a valid bKash TrxID.");
      return;
    }
    setIsReunionSubmitting(true);
    try {
      const res = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reunionData) });
      const result = await res.json();
      if (result.success) {
        alert("🎉 Reunion Registration Successful!");
        setReunionData({ fullName: "", mobileNumber: "", batchPassingYear: "", tShirtSize: "M", currentLocation: "", transactionId: "" });
      } else alert("❌ Error: " + result.message);
    } catch (err) { alert("Server Error!"); }
    finally { setIsReunionSubmitting(false); }
  };

  // Join Club Submit (With Validation)
  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    const mobileRegex = /^01\d{9}$/; 
    if (!mobileRegex.test(joinData.mobileNumber)) {
      alert("❌ Error: Please enter a valid 11-digit Bangladeshi mobile number.");
      return;
    }
    setIsJoinSubmitting(true);
    try {
      const res = await fetch('/api/join', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(joinData) });
      const result = await res.json();
      if (result.success) {
        alert("✅ Application Submitted! Committee will review it.");
        setJoinData({ fullName: "", mobileNumber: "", bloodGroup: "A+", presentAddress: "", occupation: "" });
      } else alert("❌ Error: " + result.message);
    } catch (err) { alert("Server Error!"); }
    finally { setIsJoinSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      {/* 1. TOP HEADER */}
      <header className="bg-[#2D1B4E] text-white">
        <div className="max-w-[1200px] mx-auto px-4 flex justify-between items-center h-10 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-[#7CD326] text-lg">🌟</span>
            <span className="hidden sm:inline font-serif italic text-gray-300 tracking-wide">"Fostering Brotherhood & Village Pride Since 1985"</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="bg-[#7CD326] px-4 py-1 rounded text-[#2D1B4E] font-bold hover:bg-[#68B61D] transition-colors flex items-center gap-1">🔒 Portal Login</Link>
          </div>
        </div>
      </header>

      {/* 2. MAIN NAVBAR */}
      <nav className="bg-white border-b border-[#E0E4E8] shadow-sm sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
             <img src="/moc-logo.jpeg" alt="MOC Logo" className="h-12 w-auto rounded-full border-2 border-[#7CD326]" onError={(e) => { e.target.style.display='none'; }} />
             <div>
               <h1 className="text-[#2D1B4E] font-bold text-xl md:text-2xl uppercase tracking-wide">Mokamia Orient Club</h1>
               <p className="text-[#7CD326] text-xs font-bold tracking-wider hidden sm:block">Est. 1985 • Social & Sports Organization</p>
             </div>
          </div>
          <div className="flex gap-4 font-bold text-[#2D1B4E] text-sm md:text-base overflow-x-auto">
            <button onClick={() => setActiveTab("home")} className={`hover:text-[#7CD326] whitespace-nowrap ${activeTab === 'home' ? 'border-b-4 border-[#7CD326] pb-1' : ''}`}>HOME</button>
            <button onClick={() => setActiveTab("reunion")} className={`hover:text-[#7CD326] whitespace-nowrap ${activeTab === 'reunion' ? 'border-b-4 border-[#7CD326] pb-1' : ''}`}>SCHOOL REUNION</button>
            <button onClick={() => setActiveTab("join")} className={`hover:text-[#7CD326] whitespace-nowrap ${activeTab === 'join' ? 'border-b-4 border-[#7CD326] pb-1' : ''}`}>JOIN CLUB</button>
          </div>
        </div>
      </nav>

      {/* 🌟 LIVE UPDATE BAR 🌟 */}
      <div className="bg-[#7CD326] text-[#2D1B4E] px-4 py-2 text-xs md:text-sm font-bold flex justify-center items-center gap-2 border-b border-[#68B61D]">
         <span className="bg-[#2D1B4E] text-white px-2 py-0.5 rounded text-[10px] uppercase animate-pulse">Live</span>
         <span>🚨 Registration for Mokamia Govt. Primary School Reunion is now OPEN! Secure your spot today.</span>
      </div>

      {/* 3. DYNAMIC CONTENT AREA */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto p-4 md:p-8">
        
        {/* --- HOME TAB --- */}
        {activeTab === "home" && (
          <div className="animate-fade-in">
            
            {/* Hero Banner */}
            <div className="relative rounded-2xl overflow-hidden mb-10 shadow-2xl flex flex-col items-center justify-center text-center px-6 py-20 md:py-32 bg-[#2D1B4E]">
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2D1B4E] via-[#7CD326] to-[#2D1B4E]"></div>
               
               <div className="relative z-10 text-white w-full max-w-4xl mx-auto">
                 <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-[#7CD326] text-xs font-bold tracking-widest mb-6 uppercase">
                   Est. 1985 • Mokamia, Bangladesh
                 </span>
                 <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight font-serif">
                   Built on <span className="text-[#7CD326] italic">Brotherhood</span> <br/> & Village Pride
                 </h2>
                 <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-gray-200 font-light leading-relaxed">
                   What started as a group of passionate sports lovers has evolved into a thriving community club of 200+ active members uniting brothers across generations.
                 </p>
                 <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                   <button onClick={() => setActiveTab("reunion")} className="w-full sm:w-auto bg-[#7CD326] hover:bg-[#68B61D] text-[#2D1B4E] px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(124,211,38,0.4)]">
                     🎓 Register for Primary School Reunion
                   </button>
                 </div>
               </div>
            </div>

            {/* Club Statistics */}
            <div className="bg-white border-b-4 border-[#7CD326] rounded-xl p-8 mb-12 shadow-lg flex flex-wrap justify-around items-center text-center">
               <div className="p-4"><h4 className="text-4xl font-extrabold text-[#2D1B4E] font-serif mb-1">200+</h4><p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Active Members</p></div>
               <div className="w-px h-12 bg-gray-200 hidden md:block"></div>
               <div className="p-4"><h4 className="text-4xl font-extrabold text-[#2D1B4E] font-serif mb-1">1985</h4><p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Established</p></div>
               <div className="w-px h-12 bg-gray-200 hidden md:block"></div>
               <div className="p-4"><h4 className="text-4xl font-extrabold text-[#2D1B4E] font-serif mb-1">⚽</h4><p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Sports Focus</p></div>
            </div>

            {/* 🌟 THE LEGACY / ABOUT US SECTION 🌟 */}
            <div className="bg-white rounded-xl p-8 mb-12 shadow-lg border border-gray-100 flex flex-col md:flex-row items-center gap-10">
               <div className="md:w-1/3 flex justify-center">
                 <div className="relative w-48 h-48">
                   <div className="absolute inset-0 bg-[#7CD326] rounded-full blur-2xl opacity-30 animate-pulse"></div>
                   <img src="/moc-logo.jpeg" alt="MOC Legacy" className="w-full h-full object-cover rounded-full border-4 border-[#2D1B4E] relative z-10 shadow-xl" onError={(e) => { e.target.style.display='none'; }} />
                 </div>
               </div>
               <div className="md:w-2/3 text-center md:text-left">
                 <span className="text-[#7CD326] font-bold tracking-wider text-sm uppercase">Our Legacy</span>
                 <h3 className="text-[#2D1B4E] font-bold text-2xl md:text-4xl font-serif mb-4 mt-2">The Pride of Mokamia</h3>
                 <p className="text-gray-600 mb-4 leading-relaxed">
                   For nearly four decades, Mokamia Orient Club has been the heartbeat of our village. We believe that sports build character, and true brotherhood builds a strong, united community.
                 </p>
                 <p className="text-gray-600 leading-relaxed">
                   From organizing local football leagues and grand reunions to stepping up for social volunteering, MOC stands as a symbol of unity, respect, and progress in Bangladesh.
                 </p>
               </div>
            </div>

            {/* Club Activities Grid */}
            <div className="mb-12">
              <div className="text-center mb-8">
                <h3 className="text-[#2D1B4E] font-bold text-2xl md:text-3xl font-serif">Our Core Focus</h3>
                <div className="w-16 h-1 bg-[#7CD326] mx-auto mt-3 rounded"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#7CD326] transition-all group">
                  <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform text-[#2D1B4E]">⚽</div>
                  <h4 className="font-bold text-[#2D1B4E] mb-2">Sports & Tournaments</h4>
                  <p className="text-sm text-gray-500">Organizing regular football matches and the signature Post-Eid Mini Football Tournament.</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#7CD326] transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-[#FF3B30] text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">ONGOING</div>
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform text-[#7CD326]">🎓</div>
                  <h4 className="font-bold text-[#2D1B4E] mb-2">Primary School Reunion</h4>
                  <p className="text-sm text-gray-500">Bringing childhood friends together for the grand Mokamia Govt. Primary School Reunion event.</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#7CD326] transition-all group">
                  <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform text-[#FF6600]">❤️</div>
                  <h4 className="font-bold text-[#2D1B4E] mb-2">Social Volunteering</h4>
                  <p className="text-sm text-gray-500">Giving back to the community through active social work and local development initiatives.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- REUNION FORM TAB --- */}
        {activeTab === "reunion" && (
          <div className="animate-fade-in max-w-3xl mx-auto">
             <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
               <div className="bg-[#2D1B4E] text-white px-6 py-5 border-b-4 border-[#7CD326]">
                 <h2 className="text-xl font-bold uppercase flex items-center gap-2">🎓 Govt. Primary School Reunion</h2>
                 <p className="text-sm text-gray-300 mt-1">Fill out the form below to register for the grand event.</p>
               </div>
               <div className="p-6">
                 <form onSubmit={handleReunionSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div><label className="block text-sm font-bold text-[#2D1B4E] mb-1">Full Name *</label><input required name="fullName" value={reunionData.fullName} onChange={handleReunionChange} type="text" className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:border-[#7CD326] focus:ring-1 focus:ring-[#7CD326]" /></div>
                      <div><label className="block text-sm font-bold text-[#2D1B4E] mb-1">Batch (Passing Year) *</label><input required name="batchPassingYear" value={reunionData.batchPassingYear} onChange={handleReunionChange} type="text" className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:border-[#7CD326] focus:ring-1 focus:ring-[#7CD326]" /></div>
                      <div><label className="block text-sm font-bold text-[#2D1B4E] mb-1">Mobile Number *</label><input required name="mobileNumber" value={reunionData.mobileNumber} onChange={handleReunionChange} type="tel" className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:border-[#7CD326] focus:ring-1 focus:ring-[#7CD326]" placeholder="e.g. 017XXXXXXXX" /></div>
                      <div><label className="block text-sm font-bold text-[#2D1B4E] mb-1">Current Location</label><input name="currentLocation" value={reunionData.currentLocation} onChange={handleReunionChange} type="text" className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:border-[#7CD326] focus:ring-1 focus:ring-[#7CD326]" /></div>
                      <div><label className="block text-sm font-bold text-[#2D1B4E] mb-1">T-Shirt Size *</label><select name="tShirtSize" value={reunionData.tShirtSize} onChange={handleReunionChange} className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:border-[#7CD326] focus:ring-1 focus:ring-[#7CD326]"><option value="M">M</option><option value="L">L</option><option value="XL">XL</option><option value="XXL">XXL</option></select></div>
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-sm mt-4">
                      <p className="font-bold text-[#2D1B4E] mb-1">Payment Instructions:</p>
                      Send Registration Fee via bKash to: <strong className="text-[#7CD326] text-lg">01867552069</strong>
                    </div>
                    
                    <div><label className="block text-sm font-bold text-[#2D1B4E] mb-1">Transaction ID (TrxID) *</label><input required name="transactionId" value={reunionData.transactionId} onChange={handleReunionChange} type="text" className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:border-[#7CD326] focus:ring-1 focus:ring-[#7CD326]" /></div>
                    
                    <button type="submit" disabled={isReunionSubmitting} className="w-full bg-[#7CD326] text-[#2D1B4E] font-bold py-3 rounded-lg mt-6 hover:bg-[#68B61D] transition-colors shadow-md text-lg">
                      {isReunionSubmitting ? 'Submitting...' : 'Submit Registration'}
                    </button>
                 </form>
               </div>
             </div>
          </div>
        )}

        {/* --- JOIN CLUB FORM TAB --- */}
        {activeTab === "join" && (
          <div className="animate-fade-in max-w-3xl mx-auto">
             <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
               <div className="bg-[#2D1B4E] text-white px-6 py-5 border-b-4 border-[#7CD326]">
                 <h2 className="text-xl font-bold uppercase flex items-center gap-2">🤝 Membership Application Form</h2>
                 <p className="text-sm text-gray-300 mt-1">Join Mokamia Orient Club and become part of our brotherhood.</p>
               </div>
               <div className="p-6">
                 <form onSubmit={handleJoinSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div><label className="block text-sm font-bold text-[#2D1B4E] mb-1">Full Name *</label><input required name="fullName" value={joinData.fullName} onChange={handleJoinChange} type="text" className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:border-[#7CD326] focus:ring-1 focus:ring-[#7CD326]" /></div>
                      <div><label className="block text-sm font-bold text-[#2D1B4E] mb-1">Mobile Number *</label><input required name="mobileNumber" value={joinData.mobileNumber} onChange={handleJoinChange} type="tel" className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:border-[#7CD326] focus:ring-1 focus:ring-[#7CD326]" placeholder="e.g. 017XXXXXXXX" /></div>
                      <div>
                        <label className="block text-sm font-bold text-[#2D1B4E] mb-1">Blood Group *</label>
                        <select name="bloodGroup" value={joinData.bloodGroup} onChange={handleJoinChange} className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:border-[#7CD326] focus:ring-1 focus:ring-[#7CD326]">
                          <option value="A+">A+</option><option value="B+">B+</option><option value="O+">O+</option><option value="AB+">AB+</option>
                          <option value="A-">A-</option><option value="B-">B-</option><option value="O-">O-</option><option value="AB-">AB-</option>
                        </select>
                      </div>
                      <div><label className="block text-sm font-bold text-[#2D1B4E] mb-1">Occupation</label><input name="occupation" value={joinData.occupation} onChange={handleJoinChange} type="text" className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:border-[#7CD326] focus:ring-1 focus:ring-[#7CD326]" placeholder="e.g. Student, Job, Business" /></div>
                    </div>
                    <div><label className="block text-sm font-bold text-[#2D1B4E] mb-1">Present Address *</label><textarea required name="presentAddress" value={joinData.presentAddress} onChange={handleJoinChange} className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:border-[#7CD326] focus:ring-1 focus:ring-[#7CD326] h-24"></textarea></div>
                    
                    <button type="submit" disabled={isJoinSubmitting} className="w-full bg-[#7CD326] text-[#2D1B4E] font-bold py-3 rounded-lg mt-6 hover:bg-[#68B61D] transition-colors shadow-md text-lg">
                      {isJoinSubmitting ? 'Submitting...' : 'Apply for Membership'}
                    </button>
                 </form>
               </div>
             </div>
          </div>
        )}
      </main>

      {/* --- 🌟 PREMIUM FOOTER & CONTACT SECTION 🌟 --- */}
      <footer className="bg-[#1A0F2E] text-gray-300 py-12 border-t-4 border-[#7CD326] mt-auto">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-[#7CD326] text-lg font-bold mb-4 font-serif uppercase tracking-wider">Mokamia Orient Club</h3>
            <p className="text-sm leading-relaxed mb-4 text-gray-400">
              A legacy of brotherhood, sports, and social development since 1985. We strive to unite our community and uplift our village through sports and charity.
            </p>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-4 font-serif">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button onClick={() => setActiveTab("home")} className="hover:text-[#7CD326] transition-colors">Home Page</button></li>
              <li><button onClick={() => setActiveTab("reunion")} className="hover:text-[#7CD326] transition-colors">School Reunion Registration</button></li>
              <li><button onClick={() => setActiveTab("join")} className="hover:text-[#7CD326] transition-colors">Apply for Membership</button></li>
              <li><Link href="/committee" className="hover:text-[#7CD326] transition-colors">Our Executive Committee</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-4 font-serif">Get In Touch</h3>
            <ul className="space-y-3 text-sm mb-6 text-gray-400">
              <li className="flex items-center gap-3"><span className="text-[#7CD326] text-lg">📍</span> Mokamia, Bangladesh</li>
              <li className="flex items-center gap-3"><span className="text-[#7CD326] text-lg">📞</span> 01644874309 (WhatsApp)</li>
            </ul>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/share/1N3nMC2X5C/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#2D1B4E] border border-gray-600 flex items-center justify-center hover:bg-[#1877F2] hover:border-[#1877F2] text-white transition-all duration-300 shadow-lg hover:-translate-y-1"><span className="font-bold text-sm">fb</span></a>
              <a href="https://www.instagram.com/ifti_a_56?igsh=MXB6cGtlZ2wyeDB6Yg==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#2D1B4E] border border-gray-600 flex items-center justify-center hover:bg-[#E4405F] hover:border-[#E4405F] text-white transition-all duration-300 shadow-lg hover:-translate-y-1"><span className="font-bold text-sm">ig</span></a>
            </div>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 mt-10 pt-6 border-t border-gray-700/50 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Mokamia Orient Club. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Developed with ❤️ by <span className="text-[#7CD326] font-bold">Iftekhar Uddin Ahmed</span></p>
        </div>
      </footer>

      {/* --- FLOATING WHATSAPP BUTTON --- */}
      <a href="https://wa.me/8801644874309" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center text-3xl shadow-[0_4px_15px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform z-50 animate-bounce" title="Chat with us on WhatsApp">💬</a>
    </div>
  );
}