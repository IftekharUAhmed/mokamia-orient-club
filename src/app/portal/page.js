 "use client";
import { useState, useEffect, useRef } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import Pusher from "pusher-js";
import Link from "next/link";


// /portal/page.js
 

export default function PortalDashboard() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [reunionData, setReunionData] = useState([]);
  const [membershipData, setMembershipData] = useState([]);
  const [committeeData, setCommitteeData] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 📱 Mobile Sidebar State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  
  // 🌟 Notice & Chat States
  const [notices, setNotices] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [newNotice, setNewNotice] = useState({ title: "", content: "", isUrgent: false });
  
  // 🌟 Edit Chat States
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [editMsgInput, setEditMsgInput] = useState("");
  const [isNoticeSubmitting, setIsNoticeSubmitting] = useState(false);
  const chatEndRef = useRef(null);
  
  // 🌟 Sound Effect Ref
  const audioRef = useRef(typeof Audio !== "undefined" ? new Audio("/ting.mp3") : null);
  const prevMessageCount = useRef(0);

  // Form States
  const [newCommittee, setNewCommittee] = useState({ fullName: "", designation: "", mobileNumber: "", email: "", bloodGroup: "A+", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [editingReunionId, setEditingReunionId] = useState(null);
  const [editReunionData, setEditReunionData] = useState({ fullName: "", batchPassingYear: "", mobileNumber: "", transactionId: "", tShirtSize: "M" });
  
  const [editingJoinId, setEditingJoinId] = useState(null);
  const [editJoinData, setEditJoinData] = useState({ fullName: "", mobileNumber: "", bloodGroup: "A+", presentAddress: "" });
  
  const [adminUser, setAdminUser] = useState(null);

  // Gallery Upload & Edit States
  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryCategory, setGalleryCategory] = useState("football");
  const [galleryImages, setGalleryImages] = useState([]); 
  const [isGallerySubmitting, setIsGallerySubmitting] = useState(false);
  
  // 🌟 Album Edit States
  const [editingAlbumId, setEditingAlbumId] = useState(null);
  const [editAlbumData, setEditAlbumData] = useState({ title: "", category: "football" });

  // 🏆 Events Management State
  const [events, setEvents] = useState([]);
  const [isSubmittingEvent, setIsSubmittingEvent] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: "",
    tag: "Upcoming",
    time: "",
    image: "", 
    description: "",
    extraNote: "",
    category: "upcoming"
  });

  // 🏆 POINTS TABLE STATES
  const [pointsTable, setPointsTable] = useState([]);
  const [isSubmittingPoint, setIsSubmittingPoint] = useState(false);
  const [editingPointId, setEditingPointId] = useState(null);
  const [pointForm, setPointForm] = useState({ teamName: "", played: 0, won: 0, drawn: 0, lost: 0, points: 0 });

  // 🏃‍♂️ TACTICAL PLAYERS STATES
  const [tacticalPlayers, setTacticalPlayers] = useState([]);
  const [isSubmittingTactical, setIsSubmittingTactical] = useState(false);
  const [editingTacticalId, setEditingTacticalId] = useState(null);
  const [tacticalForm, setTacticalForm] = useState({ sport: "cricket", name: "", stats: "", tag: "", image: "", slot: 1 });

  // 🟢 Fetch Sports Analytics Data
  const fetchSportsStats = async () => {
    try {
      const [ptRes, tacRes] = await Promise.all([fetch("/api/points"), fetch("/api/tactical")]);
      const ptData = await ptRes.json();
      const tacData = await tacRes.json();
      if (ptData.success) setPointsTable(ptData.data);
      if (tacData.success) setTacticalPlayers(tacData.data);
    } catch (error) { console.error("Error fetching stats:", error); }
  };

  const handlePointSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingPoint(true);
    try {
      const url = editingPointId ? `/api/points/${editingPointId}` : "/api/points";
      const method = editingPointId ? "PATCH" : "POST";
      const payload = { ...pointForm, played: Number(pointForm.played), won: Number(pointForm.won), drawn: Number(pointForm.drawn), lost: Number(pointForm.lost), points: Number(pointForm.points) };
      
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if ((await res.json()).success) { 
        alert("Team Point Data Saved!"); 
        setEditingPointId(null); 
        setPointForm({ teamName: "", played: 0, won: 0, drawn: 0, lost: 0, points: 0 }); 
        fetchSportsStats(); 
      }
    } catch (error) { alert("Failed to save team data."); } finally { setIsSubmittingPoint(false); }
  };

  const handleTacticalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingTactical(true);
    try {
      const url = editingTacticalId ? `/api/tactical/${editingTacticalId}` : "/api/tactical";
      const method = editingTacticalId ? "PATCH" : "POST";
      const payload = { ...tacticalForm, slot: Number(tacticalForm.slot) };
      
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if ((await res.json()).success) { 
        alert("Player Stats Saved!"); 
        setEditingTacticalId(null); 
        setTacticalForm({ sport: "cricket", name: "", stats: "", tag: "", image: "", slot: 1 }); 
        fetchSportsStats(); 
      }
    } catch (error) { alert("Failed to save player stats."); } finally { setIsSubmittingTactical(false); }
  };

  const deletePoint = async (id) => { if (confirm("Delete Team from Point Table?")) { await fetch(`/api/points/${id}`, { method: "DELETE" }); fetchSportsStats(); } };
  const deleteTactical = async (id) => { if (confirm("Delete Player from Field?")) { await fetch(`/api/tactical/${id}`, { method: "DELETE" }); fetchSportsStats(); } };

  const fetchDashboardData = async (silently = false) => {
    if (!silently) setIsLoading(true);
    try {
      const [reunionRes, memberRes, commRes, galleryRes, noticeRes, chatRes] = await Promise.all([
        fetch('/api/register', { cache: 'no-store' }), 
        fetch('/api/join', { cache: 'no-store' }), 
        fetch('/api/committee', { cache: 'no-store' }), 
        fetch('/api/gallery', { cache: 'no-store' }),
        fetch('/api/notice', { cache: 'no-store' }),
        fetch('/api/chat', { cache: 'no-store' })
      ]);

      const reunionJson = await reunionRes.json();
      const memberJson = await memberRes.json();
      const commJson = await commRes.json();
      const galleryJson = await galleryRes.json();
      const noticeJson = await noticeRes.json();
      const chatJson = await chatRes.json();

      if (reunionJson.success) setReunionData(reunionJson.data);
      if (memberJson.success) setMembershipData(memberJson.data);
      if (commJson.success) setCommitteeData(commJson.data);
      if (galleryJson.success) setAlbums(galleryJson.data);
      if (noticeJson.success) setNotices(noticeJson.data);
      if (chatJson.success) setMessages(chatJson.data);
      
      fetchEvents(); 
      fetchStats();
      fetchSportsStats();
    } catch (error) { console.error("Error:", error); } 
    finally { if (!silently) setIsLoading(false); }
  };

  useEffect(() => {
    const user = localStorage.getItem("moc_user");
    if (!user) window.location.href = "/login";
    else { setAdminUser(JSON.parse(user)); fetchDashboardData(); }
  }, []);

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("moc_user");
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    if (activeMenu !== "chat") return;
    setTimeout(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, 100);

    if (!process.env.NEXT_PUBLIC_PUSHER_KEY) {
      console.error("❌ Pusher Key Missing! Vercel ba .env theke key load hoyni.");
      return; 
    }

    try {
      const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, { cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER });
      const channel = pusher.subscribe("moc-channel");

      channel.bind("new-message", (newMsg) => {
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
      });

      return () => {
        channel.unbind_all();
        channel.unsubscribe();
        pusher.disconnect(); 
      };
    } catch (error) { console.error("🔥 Pusher connection error:", error); }
  }, [activeMenu]);

  useEffect(() => {
    if (activeMenu === "chat") chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (messages.length > prevMessageCount.current) {
      const lastMessage = messages[messages.length - 1];
      const isMe = lastMessage?.senderName === adminUser?.name;
      if (!isMe && prevMessageCount.current !== 0 && audioRef.current) {
        audioRef.current.play().catch((err) => console.log("Audio play blocked by browser", err));
      }
    }
    prevMessageCount.current = messages.length;
  }, [messages, activeMenu, adminUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const currentInput = chatInput;
    setChatInput(""); 
    const tempMsg = { content: currentInput, senderName: adminUser?.name || "Admin", senderRole: "Committee" };
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(tempMsg) });
      if ((await res.json()).success) fetchDashboardData(true); 
    } catch (error) { alert("Failed to send."); }
  };

  const handleChatImageUpload = async (result) => {
    const imgUrl = result.info.secure_url;
    const tempMsg = { content: "📷 Photo attached", imageUrl: imgUrl, senderName: adminUser?.name || "Admin", senderRole: "Committee" };
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(tempMsg) });
      if ((await res.json()).success) fetchDashboardData(true);
    } catch (error) { alert("Failed to send image."); }
  };

  const handleDeleteChat = async (id) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this message?")) return;
    setMessages((prev) => prev.filter((m) => m.id !== id)); 
    try {
      const res = await fetch(`/api/chat/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("API Route Missing or Server Error");
      const data = await res.json();
      if (!data.success) { alert("Database Error: " + data.message); fetchDashboardData(true); } 
      else fetchDashboardData(true); 
    } catch (error) { alert("❌ Delete Failed: Check if [id] folder exists in api/chat/"); fetchDashboardData(true); }
  };

  const handleUpdateChat = async (e, id) => {
    e.preventDefault();
    if (!editMsgInput.trim() || !id) return;
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, content: editMsgInput } : m)); 
    setEditingMsgId(null);
    try {
      const res = await fetch(`/api/chat/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: editMsgInput }) });
      if (!res.ok) throw new Error("API Route Missing or Server Error");
      const data = await res.json();
      if (!data.success) { alert("Database Error: " + data.message); fetchDashboardData(true); } 
      else fetchDashboardData(true); 
    } catch (error) { alert("❌ Edit Failed: Check if [id] folder exists in api/chat/"); fetchDashboardData(true); }
  };

  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    setIsNoticeSubmitting(true);
    const payload = { ...newNotice, authorName: adminUser?.name || "Admin", authorRole: "System Admin" };
    try {
      const res = await fetch('/api/notice', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if ((await res.json()).success) { alert("Notice Published!"); setNewNotice({ title: "", content: "", isUrgent: false }); fetchDashboardData(true); }
    } catch (error) { alert("Failed to publish."); }
    finally { setIsNoticeSubmitting(false); }
  };

  const handleDeleteNotice = async (id) => {
    if (!confirm("Are you sure you want to delete this Notice?")) return;
    const prevNotices = [...notices];
    setNotices((prev) => prev.filter((n) => n.id !== id)); 
    try {
      const res = await fetch(`/api/notice/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Server error");
      fetchDashboardData(true);
    } catch (error) { alert("❌ Failed to delete notice. Please check backend."); setNotices(prevNotices); }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      if (data.success) setEvents(data.data);
    } catch (error) { console.error("Failed to fetch events:", error); }
  };
 
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingEvent(true);
    try {
      const url = editingEventId ? `/api/events/${editingEventId}` : "/api/events";
      const method = editingEventId ? "PATCH" : "POST";
      const res = await fetch(url, { method: method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(eventForm), });
      const data = await res.json();
      if (data.success) { alert(editingEventId ? "Event Successfully Updated!" : "Event Successfully Posted!"); cancelEventEdit(); fetchEvents(); } 
      else { alert("Error: " + data.message); }
    } catch (error) { alert("Failed to save event."); } 
    finally { setIsSubmittingEvent(false); }
  };

  const [stats, setStats] = useState([]);
  const [isSubmittingStat, setIsSubmittingStat] = useState(false);
  const [editingStatId, setEditingStatId] = useState(null);
  const [statForm, setStatForm] = useState({ title: "", value: "", icon: "👥" });

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (error) { console.error("Failed to fetch stats:", error); }
  };

  const handleStatSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingStat(true);
    try {
      const url = editingStatId ? `/api/stats/${editingStatId}` : "/api/stats";
      const method = editingStatId ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(statForm), });
      const data = await res.json();
      if (data.success) { alert(editingStatId ? "Stat Successfully Updated!" : "Stat Successfully Added!"); cancelStatEdit(); fetchStats(); } 
      else alert("Error: " + data.message);
    } catch (error) { alert("Failed to save stat."); } 
    finally { setIsSubmittingStat(false); }
  };

  const handleEditStatClick = (stat) => { setEditingStatId(stat.id); setStatForm({ title: stat.title, value: stat.value, icon: stat.icon }); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const cancelStatEdit = () => { setEditingStatId(null); setStatForm({ title: "", value: "", icon: "👥" }); };
  const handleDeleteStat = async (id) => { if (!confirm("Are you sure you want to delete this stat?")) return; try { const res = await fetch(`/api/stats/${id}`, { method: "DELETE" }); if ((await res.json()).success) fetchStats(); } catch (error) { alert("Failed to delete stat."); } };

  const handleEditEventClick = (event) => { setEditingEventId(event.id); setEventForm({ title: event.title, tag: event.tag || "", time: event.time || "", image: event.image || "", description: event.description || "", extraNote: event.extraNote || "", category: event.category || "upcoming" }); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const cancelEventEdit = () => { setEditingEventId(null); setEventForm({ title: "", tag: "Upcoming", time: "", image: "", description: "", extraNote: "", category: "upcoming" }); };
  const handleEventDelete = async (id) => { if (!confirm("Are you sure you want to delete this event?")) return; try { const res = await fetch(`/api/events/${id}`, { method: "DELETE" }); const data = await res.json(); if (data.success) { fetchEvents(); } } catch (error) { alert("Failed to delete event."); } };

  const handleCommitteeChange = (e) => setNewCommittee({ ...newCommittee, [e.target.name]: e.target.value });
  const handleEditClick = (member) => { setEditingId(member.id); setNewCommittee({ fullName: member.fullName, designation: member.designation, mobileNumber: member.mobileNumber, email: member.email || "", bloodGroup: member.bloodGroup || "A+", password: "" }); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const cancelEdit = () => { setEditingId(null); setNewCommittee({ fullName: "", designation: "", mobileNumber: "", email: "", bloodGroup: "A+", password: "" }); };
  const handleCommitteeSubmit = async (e) => { e.preventDefault(); setIsSubmitting(true); try { const url = editingId ? `/api/committee/${editingId}` : '/api/committee'; const method = editingId ? 'PATCH' : 'POST'; const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newCommittee) }); const result = await res.json(); if (result.success) { alert(editingId ? "Updated Successfully!" : `Added! System ID: ${result.data.memberId}`); cancelEdit(); fetchDashboardData(); } else alert("Error: " + result.message); } catch (error) { alert("Server error."); } finally { setIsSubmitting(false); } };
  const handleDeleteCommittee = async (id) => { if (!confirm("⚠️ Delete this committee member permanently?")) return; try { const res = await fetch(`/api/committee/${id}`, { method: 'DELETE' }); if ((await res.json()).success) { alert("Deleted!"); fetchDashboardData(); } } catch (error) { alert("Server error."); } };

  const handleEditReunionClick = (reg) => { setEditingReunionId(reg.id); setEditReunionData({ fullName: reg.fullName, batchPassingYear: reg.batchPassingYear, mobileNumber: reg.mobileNumber, transactionId: reg.transactionId, tShirtSize: reg.tShirtSize || "M" }); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const cancelReunionEdit = () => setEditingReunionId(null);
  const handleReunionUpdate = async (e) => { e.preventDefault(); try { const res = await fetch(`/api/register/${editingReunionId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editReunionData) }); if ((await res.json()).success) { alert("Reunion Data Updated!"); cancelReunionEdit(); fetchDashboardData(); } } catch (error) { alert("Server error."); } };
  const handleDeleteReunion = async (id) => { if (!confirm("⚠️ Delete this Reunion Registration permanently?")) return; try { const res = await fetch(`/api/register/${id}`, { method: 'DELETE' }); if ((await res.json()).success) { alert("Deleted!"); fetchDashboardData(); } } catch (error) { alert("Server error."); } };
  const downloadReunionExcel = () => { if (reunionData.length === 0) return alert("No data available!"); const headers = ["Full Name", "Batch", "Mobile Number", "TrxID", "T-Shirt Size"]; const rows = reunionData.map(reg => [reg.fullName, reg.batchPassingYear, reg.mobileNumber, reg.transactionId, reg.tShirtSize || "M"]); const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n"); const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }); const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.setAttribute("download", "MOC_Reunion_Data.csv"); document.body.appendChild(link); link.click(); document.body.removeChild(link); };

  const handleApprove = async (id) => { if (!confirm("Approve this member?")) return; try { const res = await fetch(`/api/join/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: "APPROVED" }) }); if ((await res.json()).success) { alert("Approved!"); fetchDashboardData(); } } catch (error) { alert("Server error."); } };
  const handleEditJoinClick = (app) => { setEditingJoinId(app.id); setEditJoinData({ fullName: app.fullName, mobileNumber: app.mobileNumber, bloodGroup: app.bloodGroup || "A+", presentAddress: app.presentAddress || "" }); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const cancelJoinEdit = () => setEditingJoinId(null);
  const handleJoinUpdate = async (e) => { e.preventDefault(); try { const res = await fetch(`/api/join/${editingJoinId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editJoinData) }); if ((await res.json()).success) { alert("Membership Data Updated!"); cancelJoinEdit(); fetchDashboardData(); } } catch (error) { alert("Server error."); } };
  const handleDeleteJoin = async (id) => { if (!confirm("⚠️ Delete this Membership Application permanently?")) return; try { const res = await fetch(`/api/join/${id}`, { method: 'DELETE' }); if ((await res.json()).success) { alert("Deleted!"); fetchDashboardData(); } } catch (error) { alert("Server error."); } };

  const handleGalleryUploadSuccess = (result) => { setGalleryImages((prev) => [...prev, result.info.secure_url]); };
  const handleGallerySubmit = async (e) => { e.preventDefault(); if (galleryImages.length === 0) return alert("❌ Bhai, kompokkhe ekta chobi upload koro!"); setIsGallerySubmitting(true); try { const res = await fetch("/api/gallery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: galleryTitle, category: galleryCategory, images: galleryImages }), }); const data = await res.json(); if (data.success) { alert("🎉 Album successfully database-e save hoyeche!"); setGalleryTitle(""); setGalleryImages([]); fetchDashboardData(); } else alert("❌ Error: " + data.message); } catch (error) { alert("Server error during gallery upload."); } finally { setIsGallerySubmitting(false); } };
  const handleDeleteAlbum = async (id) => { if (!confirm("⚠️ Tumi ki shotti ei Album ar er vitorer SHOB chobi muchhe felte chaw?")) return; try { const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' }); const data = await res.json(); if (data.success) { alert("✅ Album Deleted!"); fetchDashboardData(); } else alert("❌ Failed to delete!"); } catch (error) { alert("Server error."); } };

  const handleEditAlbumClick = (album) => { setEditingAlbumId(album.id); setEditAlbumData({ title: album.title, category: album.category }); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const cancelAlbumEdit = () => setEditingAlbumId(null);
  const handleAlbumUpdate = async (e) => { e.preventDefault(); try { const res = await fetch(`/api/gallery/${editingAlbumId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editAlbumData) }); const data = await res.json(); if (data.success) { alert("✅ Album Info Updated!"); cancelAlbumEdit(); fetchDashboardData(); } else alert("❌ Error: " + data.message); } catch (error) { alert("Server error."); } };

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex flex-col md:flex-row relative font-sans text-slate-800">
      
      {/* 📱 MOBILE HEADER */}
      <div className="md:hidden bg-[#0B1437] text-white p-4 flex justify-between items-center shadow-md z-40 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#7CD326] to-[#4CAE4C] rounded-lg flex items-center justify-center font-bold text-white text-xs">MOC</div>
          <h1 className="font-bold text-lg tracking-wider">Portal.</h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-2xl focus:outline-none bg-white/10 w-10 h-10 rounded-lg flex items-center justify-center border border-white/20">
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* 📱 MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* 🌟 PREMIUM RESPONSIVE SIDEBAR 🌟 */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-full max-w-[280px] bg-[#0B1437] text-white flex-shrink-0 md:min-h-screen flex flex-col shadow-[10px_0_20px_rgba(0,0,0,0.05)] transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 hidden md:flex items-center gap-4 border-b border-white/10">
          <div className="w-12 h-12 bg-gradient-to-br from-[#7CD326] to-[#4CAE4C] rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-green-500/30">MOC</div>
          <div>
            <h2 className="text-white font-extrabold text-xl tracking-wide">Portal<span className="text-[#7CD326]">.</span></h2>
            <p className="text-slate-400 text-xs font-medium mt-0.5">Admin Workspace</p>
          </div>
        </div>

        <div className="text-slate-500 text-[11px] font-bold uppercase tracking-widest px-6 py-4 mt-2">Menu Structure</div>
        
        <nav className="flex-1 flex flex-col px-4 gap-2 overflow-y-auto">
          {['dashboard', 'events', 'stats', 'reunion', 'membership', 'committee', 'gallery', 'notices', 'chat'].map((menu) => {
            const isActive = activeMenu === menu;
            return (
              <button 
                key={menu} 
                onClick={() => { setActiveMenu(menu); setIsMobileMenuOpen(false); }} 
                className={`relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 overflow-hidden group ${
                  isActive 
                    ? 'bg-[#111C44] text-white shadow-lg transform scale-[1.02]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5 hover:translate-x-1'
                }`}
              >
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#7CD326] rounded-r-full shadow-[0_0_10px_#7CD326]"></div>}
                <div className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300 ${
                  isActive ? 'bg-[#7CD326] text-[#0B1437] shadow-[0_0_15px_rgba(124,211,38,0.4)] scale-110' : 'bg-white/5 group-hover:bg-white/10'
                }`}>
                  <span className="text-sm">
                  {menu === 'dashboard' ? '📊' : menu === 'events' ? '🏆' : menu === 'stats' ? '📈' : menu === 'reunion' ? '🌙' : menu === 'membership' ? '👥' : menu === 'committee' ? '⚙️' : menu === 'gallery' ? '📸' : menu === 'notices' ? '📢' : '💬'}
                  </span>
                </div>
                <span className={`capitalize text-sm font-semibold tracking-wide transition-all ${isActive ? 'text-white' : ''}`}>
                  {menu.replace("-", " ")}
                </span>
              </button>
            )
          })}
        </nav>

        <div className="p-6">
          <div className="bg-gradient-to-br from-[#111C44] to-[#0B1437] border border-white/10 rounded-2xl p-4 text-center shadow-lg">
            <div className="w-10 h-10 bg-white/10 rounded-full mx-auto flex items-center justify-center mb-2 font-bold text-[#7CD326]">A</div>
            <p className="text-sm font-bold text-white truncate">{adminUser ? adminUser.name : 'Admin User'}</p>
            <button onClick={handleLogout} className="mt-4 w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-xs font-bold py-2 rounded-xl transition-colors duration-300">
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* 🌟 MAIN CONTENT AREA 🌟 */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#F4F7FE] w-full">
        
        {/* Glassmorphism Header */}
        <header className="hidden md:flex bg-white/70 backdrop-blur-xl border-b border-slate-200/50 h-[76px] items-center justify-between px-8 sticky top-0 z-10 shrink-0">
          <div>
            <h1 className="text-[#2B3674] font-extrabold text-2xl capitalize tracking-tight">
              {activeMenu.replace("-", " ")} Management
            </h1>
            <p className="text-slate-500 text-xs font-medium mt-0.5">Mokamia Orient Club Admin System</p>
          </div>
          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
            <span className="text-sm font-bold text-[#2B3674]">Welcome, {adminUser ? adminUser.name : 'Admin'}</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#7CD326] to-[#4CAE4C] text-white flex items-center justify-center font-bold shadow-md">A</div>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          {isLoading ? (
             <div className="flex justify-center items-center h-full">
               <div className="w-12 h-12 border-4 border-slate-200 border-t-[#7CD326] rounded-full animate-spin"></div>
             </div>
          ) : (
            <>
              {/* --- DASHBOARD TAB --- */}
              {activeMenu === "dashboard" && (
                <div className="space-y-8 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:-translate-y-1 transition-transform group">
                      <div className="flex justify-between items-center mb-4"><h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider">Total Reunion</h3><div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center text-xl group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-sm">🌙</div></div>
                      <p className="text-4xl font-extrabold text-[#2B3674]">{reunionData.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:-translate-y-1 transition-transform group">
                      <div className="flex justify-between items-center mb-4"><h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider">Membership Apps</h3><div className="w-12 h-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center text-xl group-hover:scale-110 group-hover:bg-green-500 group-hover:text-white transition-all shadow-sm">👥</div></div>
                      <p className="text-4xl font-extrabold text-[#2B3674]">{membershipData.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:-translate-y-1 transition-transform group">
                      <div className="flex justify-between items-center mb-4"><h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider">Committee Members</h3><div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center text-xl group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">⚙️</div></div>
                      <p className="text-4xl font-extrabold text-[#2B3674]">{committeeData.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:-translate-y-1 transition-transform group">
                      <div className="flex justify-between items-center mb-4"><h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider">Photo Albums</h3><div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center text-xl group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white transition-all shadow-sm">📸</div></div>
                      <p className="text-4xl font-extrabold text-[#2B3674]">{albums.length}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.03)] p-6 border border-slate-100">
                       <h3 className="text-[#2B3674] font-bold text-lg mb-6">Activity Overview</h3>
                       <div className="h-48 flex items-end justify-between gap-2 px-4">
                          {[40, 70, 45, 90, 65, 85, 30].map((h, i) => (
                             <div key={i} className="w-full bg-slate-100 rounded-t-lg relative group">
                                <div style={{height: `${h}%`}} className="absolute bottom-0 w-full bg-gradient-to-t from-[#4CAE4C] to-[#7CD326] rounded-t-lg transition-all duration-500 hover:opacity-80"></div>
                             </div>
                          ))}
                       </div>
                    </div>
                    <div className="bg-white rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.03)] p-6 border border-slate-100">
                       <h3 className="text-[#2B3674] font-bold text-lg mb-6">Recent Status</h3>
                       <div className="space-y-6">
                          <div className="flex gap-4 items-start">
                             <div className="w-3 h-3 rounded-full bg-[#7CD326] mt-1.5 shadow-[0_0_8px_#7CD326]"></div>
                             <div>
                               <p className="text-sm font-bold text-[#2B3674]">System Optimized</p>
                               <p className="text-xs text-slate-400 mt-1">Admin dashboard UI fully operational.</p>
                             </div>
                          </div>
                          <div className="flex gap-4 items-start">
                             <div className="w-3 h-3 rounded-full bg-blue-500 mt-1.5 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                             <div>
                               <p className="text-sm font-bold text-[#2B3674]">Database Synced</p>
                               <p className="text-xs text-slate-400 mt-1">All records secure.</p>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- EVENTS TAB --- */}
              {activeMenu === "events" && (
                <div className="space-y-8 animate-fade-in">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                     <div className="flex justify-between items-center mb-6">
                       <h3 className="text-xl font-bold text-gray-800">{editingEventId ? "✏️ Edit Event" : "➕ Create New Event"}</h3>
                       {editingEventId && <button onClick={cancelEventEdit} className="text-red-600 font-bold text-sm hover:underline">Cancel Edit</button>}
                     </div>
                    <form onSubmit={handleEventSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="text-xs font-bold text-gray-500 mb-1 block">Event Title *</label><input type="text" required value={eventForm.title} onChange={(e) => setEventForm({...eventForm, title: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm" placeholder="e.g., Winter Short Pitch" /></div>
                        <div><label className="text-xs font-bold text-gray-500 mb-1 block">Image URL (Cloudinary) *</label><input type="text" required value={eventForm.image} onChange={(e) => setEventForm({...eventForm, image: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm" placeholder="Paste image link here" /></div>
                        <div><label className="text-xs font-bold text-gray-500 mb-1 block">Status Tag</label><input type="text" value={eventForm.tag} onChange={(e) => setEventForm({...eventForm, tag: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm" placeholder="e.g., Just Concluded" /></div>
                        <div><label className="text-xs font-bold text-gray-500 mb-1 block">Time / Date</label><input type="text" value={eventForm.time} onChange={(e) => setEventForm({...eventForm, time: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm" placeholder="e.g., Dec / Jan" /></div>
                        <div><label className="text-xs font-bold text-gray-500 mb-1 block">Category</label><select value={eventForm.category} onChange={(e) => setEventForm({...eventForm, category: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm"><option value="upcoming">Mega Upcoming</option><option value="concluded">Just Concluded</option><option value="winter">Winter Sports</option><option value="tradition">Signature Tradition</option></select></div>
                      </div>
                      <div><label className="text-xs font-bold text-gray-500 mb-1 block">Description *</label><textarea required value={eventForm.description} onChange={(e) => setEventForm({...eventForm, description: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm h-24" placeholder="Event details..."></textarea></div>
                      <div><label className="text-xs font-bold text-gray-500 mb-1 block">Executive Notice (Optional)</label><input type="text" value={eventForm.extraNote} onChange={(e) => setEventForm({...eventForm, extraNote: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm" placeholder="Any special instruction..." /></div>
                      <button type="submit" disabled={isSubmittingEvent} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors shadow-md disabled:opacity-50">{isSubmittingEvent ? "Posting..." : "Publish Event"}</button>
                    </form>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Manage Events</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead><tr className="border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider"><th className="p-3">Title</th><th className="p-3">Category</th><th className="p-3">Time</th><th className="p-3">Action</th></tr></thead>
                        <tbody>
                          {events.length === 0 ? (
                            <tr><td colSpan="4" className="p-4 text-center text-gray-500 text-sm">No events found.</td></tr>
                          ) : (
                            events.map(event => (
                              <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="p-3 text-sm font-bold text-gray-700">{event.title}</td><td className="p-3 text-xs uppercase text-gray-500">{event.category}</td><td className="p-3 text-sm text-gray-600">{event.time}</td>
                                <td className="p-3"><button onClick={() => handleEventDelete(event.id)} className="bg-red-100 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded text-xs font-bold transition-colors">Delete</button><button onClick={() => handleEditEventClick(event)} className="bg-amber-100 text-amber-700 hover:bg-amber-600 hover:text-white px-3 py-1.5 rounded text-xs font-bold transition-colors mr-2">Edit</button></td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* --- STATS MANAGEMENT TAB --- */}
              {activeMenu === "stats" && (
                <div className="space-y-10 animate-fade-in max-w-6xl mx-auto">
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <div className="bg-[#2B3674] text-white p-4 rounded-xl mb-6 flex justify-between items-center"><h3 className="font-bold text-lg">🏆 MPL Point Table Manager</h3>{editingPointId && <button onClick={() => {setEditingPointId(null); setPointForm({ teamName: "", played: 0, won: 0, drawn: 0, lost: 0, points: 0 })}} className="text-xs bg-red-500 px-3 py-1 rounded shadow">Cancel Edit</button>}</div>
                    <form onSubmit={handlePointSubmit} className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div className="col-span-2 md:col-span-1"><label className="text-xs font-bold text-gray-500 mb-1 block">Team Name</label><input required value={pointForm.teamName} onChange={(e)=>setPointForm({...pointForm, teamName: e.target.value})} className="w-full p-2 border rounded outline-none text-sm" placeholder="e.g. Mokamia Lusitans" /></div>
                      <div><label className="text-xs font-bold text-gray-500 mb-1 block">Played (P)</label><input type="number" required value={pointForm.played} onChange={(e)=>setPointForm({...pointForm, played: e.target.value})} className="w-full p-2 border rounded outline-none text-sm" /></div>
                      <div><label className="text-xs font-bold text-gray-500 mb-1 block">Won (W)</label><input type="number" required value={pointForm.won} onChange={(e)=>setPointForm({...pointForm, won: e.target.value})} className="w-full p-2 border rounded outline-none text-sm" /></div>
                      <div><label className="text-xs font-bold text-gray-500 mb-1 block">Drawn (D)</label><input type="number" required value={pointForm.drawn} onChange={(e)=>setPointForm({...pointForm, drawn: e.target.value})} className="w-full p-2 border rounded outline-none text-sm" /></div>
                      <div><label className="text-xs font-bold text-gray-500 mb-1 block">Lost (L)</label><input type="number" required value={pointForm.lost} onChange={(e)=>setPointForm({...pointForm, lost: e.target.value})} className="w-full p-2 border rounded outline-none text-sm" /></div>
                      <div><label className="text-xs font-bold text-gray-500 mb-1 block">Total Points</label><input type="number" required value={pointForm.points} onChange={(e)=>setPointForm({...pointForm, points: e.target.value})} className="w-full p-2 border rounded outline-none text-sm border-[#7CD326]" /></div>
                      <div className="col-span-2 md:col-span-6 flex justify-end mt-2"><button type="submit" disabled={isSubmittingPoint} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2 rounded-lg text-sm transition-colors">{isSubmittingPoint ? "Saving..." : (editingPointId ? "Update Team" : "Add Team to Table")}</button></div>
                    </form>
                    <div className="overflow-x-auto border border-gray-100 rounded-xl">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-gray-100 text-gray-600 font-bold uppercase text-xs"><tr><th className="p-3">Team Name</th><th className="p-3">P</th><th className="p-3">W</th><th className="p-3">D</th><th className="p-3">L</th><th className="p-3 text-[#7CD326]">PTS</th><th className="p-3 text-right">Actions</th></tr></thead>
                        <tbody>{pointsTable.map(pt => (<tr key={pt.id} className="border-b hover:bg-gray-50"><td className="p-3 font-bold text-[#2B3674]">{pt.teamName}</td><td className="p-3">{pt.played}</td><td className="p-3">{pt.won}</td><td className="p-3">{pt.drawn}</td><td className="p-3">{pt.lost}</td><td className="p-3 font-black text-lg">{pt.points}</td><td className="p-3 text-right"><button onClick={() => {setEditingPointId(pt.id); setPointForm(pt); window.scrollTo({top:0});}} className="text-amber-600 font-bold text-xs mr-3">Edit</button><button onClick={()=>deletePoint(pt.id)} className="text-red-600 font-bold text-xs">Del</button></td></tr>))}</tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <div className="bg-emerald-700 text-white p-4 rounded-xl mb-6 flex justify-between items-center"><h3 className="font-bold text-lg">🏃‍♂️ Tactical Player Stats (Ground View)</h3>{editingTacticalId && <button onClick={() => {setEditingTacticalId(null); setTacticalForm({ sport: "cricket", name: "", stats: "", tag: "", slot: 1 })}} className="text-xs bg-red-500 px-3 py-1 rounded shadow">Cancel Edit</button>}</div>
                    <form onSubmit={handleTacticalSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                      <div><label className="text-xs font-bold text-gray-500 mb-1 block">Sport Type</label><select value={tacticalForm.sport} onChange={(e)=>setTacticalForm({...tacticalForm, sport: e.target.value})} className="w-full p-2 border rounded outline-none text-sm"><option value="cricket">🏏 Cricket</option><option value="football">⚽ Football</option><option value="badminton">🏸 Badminton</option></select></div>
                      <div><label className="text-xs font-bold text-gray-500 mb-1 block">Player Name (e.g. Ifti)</label><input required value={tacticalForm.name} onChange={(e)=>setTacticalForm({...tacticalForm, name: e.target.value})} className="w-full p-2 border rounded outline-none text-sm" placeholder="Name" /></div>
                      <div><label className="text-xs font-bold text-gray-500 mb-1 block">Key Stats (e.g. 143R + 8W)</label><input required value={tacticalForm.stats} onChange={(e)=>setTacticalForm({...tacticalForm, stats: e.target.value})} className="w-full p-2 border rounded outline-none text-sm" placeholder="Stats" /></div>
                      <div><label className="text-xs font-bold text-gray-500 mb-1 block">Field Slot Position (1 to 11)</label><input type="number" required value={tacticalForm.slot} onChange={(e)=>setTacticalForm({...tacticalForm, slot: e.target.value})} className="w-full p-2 border rounded outline-none text-sm" placeholder="e.g. 1" /></div>
                      <div><label className="text-xs font-bold text-gray-500 mb-1 block">Player Image URL</label><input value={tacticalForm.image} onChange={(e)=>setTacticalForm({...tacticalForm, image: e.target.value})} className="w-full p-2 border rounded outline-none text-sm" placeholder="e.g. /ifti.jpg" /></div>
                      <div className="md:col-span-4 flex justify-between items-center mt-2"><div className="w-1/2 pr-4"><label className="text-xs font-bold text-gray-500 mb-1 block">Optional Tag (e.g. Singles Champ / C / VC)</label><input value={tacticalForm.tag} onChange={(e)=>setTacticalForm({...tacticalForm, tag: e.target.value})} className="w-full p-2 border rounded outline-none text-sm" placeholder="Optional Badge" /></div><button type="submit" disabled={isSubmittingTactical} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-2.5 rounded-lg text-sm mt-4">{isSubmittingTactical ? "Saving..." : (editingTacticalId ? "Update Player" : "Add Player to Field")}</button></div>
                    </form>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tacticalPlayers.map(tp => (<div key={tp.id} className="border border-gray-200 rounded-xl p-4 flex justify-between items-center bg-gray-50"><div className="flex gap-3 items-center"><div className="w-10 h-10 rounded-full bg-[#2B3674] text-white flex items-center justify-center font-bold">{tp.name.charAt(0)}</div><div><p className="font-bold text-sm text-[#2B3674] leading-tight">{tp.name} <span className="text-[10px] text-gray-400">({tp.sport})</span></p><p className="text-xs font-black text-emerald-600">{tp.stats}</p>{tp.tag && <span className="text-[9px] bg-amber-100 text-amber-700 px-1 rounded uppercase font-bold">{tp.tag}</span>}</div></div><div className="flex flex-col gap-2"><button onClick={() => {setEditingTacticalId(tp.id); setTacticalForm(tp);}} className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">Edit</button><button onClick={() => deleteTactical(tp.id)} className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">Del</button></div></div>))}
                    </div>
                  </div>
                </div>
              )}

              {/* --- REUNION TAB --- */}
              {activeMenu === "reunion" && (
                <div className="space-y-6 animate-fade-in">
                  {editingReunionId && (
                    <div className="bg-amber-50 border border-amber-400 rounded-2xl shadow-sm p-6 mb-6">
                      <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-amber-700">✏️ Edit Reunion</h3><button onClick={cancelReunionEdit} className="text-red-600 font-bold text-sm hover:underline">Cancel</button></div>
                      <form onSubmit={handleReunionUpdate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input required value={editReunionData.fullName} onChange={(e)=>setEditReunionData({...editReunionData, fullName: e.target.value})} className="border border-amber-200 p-2.5 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="Name"/>
                        <input required value={editReunionData.batchPassingYear} onChange={(e)=>setEditReunionData({...editReunionData, batchPassingYear: e.target.value})} className="border border-amber-200 p-2.5 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="Batch"/>
                        <input required value={editReunionData.mobileNumber} onChange={(e)=>setEditReunionData({...editReunionData, mobileNumber: e.target.value})} className="border border-amber-200 p-2.5 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="Mobile"/>
                        <input required value={editReunionData.transactionId} onChange={(e)=>setEditReunionData({...editReunionData, transactionId: e.target.value})} className="border border-amber-200 p-2.5 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="TrxID"/>
                        <select value={editReunionData.tShirtSize} onChange={(e)=>setEditReunionData({...editReunionData, tShirtSize: e.target.value})} className="border border-amber-200 p-2.5 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 outline-none text-sm"><option value="M">M</option><option value="L">L</option><option value="XL">XL</option></select>
                        <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white p-2.5 rounded-xl font-bold shadow-md transition-all text-sm">Update Information</button>
                      </form>
                    </div>
                  )}
                  <div className="bg-white border-0 rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.03)] overflow-hidden">
                    <div className="bg-[#2B3674] text-white px-6 py-4 flex justify-between items-center">
                      <h3 className="font-bold">Reunion List</h3>
                      <div className="flex gap-2">
                        <button onClick={downloadReunionExcel} className="bg-[#7CD326] hover:bg-[#68B61D] text-[#1A0F2E] font-bold px-3 py-1.5 text-xs rounded-lg shadow-sm flex items-center gap-1">📊 Export Excel</button>
                        <button onClick={() => fetchDashboardData(false)} className="bg-white/20 text-white px-3 py-1.5 text-xs rounded-lg hover:bg-white/30 transition-colors">🔄 Refresh</button>
                      </div>
                    </div>
                    <div className="overflow-x-auto p-4">
                      <table className="w-full text-sm text-left">
                        <thead className="text-slate-400 border-b border-slate-100"><tr><th className="p-3 font-semibold">Name</th><th className="p-3 font-semibold">Batch</th><th className="p-3 font-semibold">Mobile</th><th className="p-3 font-semibold">TrxID</th><th className="p-3 font-semibold text-center">Actions</th></tr></thead>
                        <tbody>
                          {reunionData.map((reg) => (
                            <tr key={reg.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"><td className="p-3 font-bold text-[#2B3674]">{reg.fullName}</td><td className="p-3 text-slate-600">{reg.batchPassingYear}</td><td className="p-3 text-slate-600">{reg.mobileNumber}</td><td className="p-3 text-slate-600">{reg.transactionId}</td>
                            <td className="p-3 flex justify-center gap-2"><button onClick={() => handleEditReunionClick(reg)} className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-200">Edit</button><button onClick={() => handleDeleteReunion(reg.id)} className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-200">Del</button></td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* --- MEMBERSHIP TAB --- */}
              {activeMenu === "membership" && (
                <div className="space-y-6 animate-fade-in">
                  {editingJoinId && (
                    <div className="bg-amber-50 border border-amber-400 rounded-2xl shadow-sm p-6 mb-6">
                      <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-amber-700 text-sm">✏️ Edit Membership</h3><button onClick={cancelJoinEdit} className="text-xs text-red-600 font-bold hover:underline">Cancel</button></div>
                      <form onSubmit={handleJoinUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input required value={editJoinData.fullName} onChange={(e)=>setEditJoinData({...editJoinData, fullName: e.target.value})} className="border border-amber-200 p-2.5 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="Name"/>
                        <input required value={editJoinData.mobileNumber} onChange={(e)=>setEditJoinData({...editJoinData, mobileNumber: e.target.value})} className="border border-amber-200 p-2.5 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="Mobile"/>
                        <input required value={editJoinData.presentAddress} onChange={(e)=>setEditJoinData({...editJoinData, presentAddress: e.target.value})} className="border border-amber-200 p-2.5 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="Address"/>
                        <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white p-2.5 rounded-xl font-bold shadow-md transition-all text-sm">Update Information</button>
                      </form>
                    </div>
                  )}
                  <div className="bg-white border-0 rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.03)] overflow-hidden">
                    <div className="bg-[#2B3674] text-white px-6 py-4 flex justify-between items-center"><h3 className="font-bold">Membership Applications</h3><button onClick={() => fetchDashboardData(false)} className="bg-white/20 text-white px-3 py-1.5 text-xs rounded-lg hover:bg-white/30 transition-colors">Refresh</button></div>
                    <div className="overflow-x-auto p-4">
                      <table className="w-full text-sm text-left">
                        <thead className="text-slate-400 border-b border-slate-100"><tr><th className="p-3 font-semibold">Name</th><th className="p-3 font-semibold">Mobile</th><th className="p-3 font-semibold">Status</th><th className="p-3 font-semibold text-center">Actions</th></tr></thead>
                        <tbody>
                          {membershipData.map((app) => (
                            <tr key={app.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"><td className="p-3 font-bold text-[#2B3674]">{app.fullName}</td><td className="p-3 text-slate-600">{app.mobileNumber}</td>
                            <td className="p-3"><span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${app.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{app.status}</span></td>
                            <td className="p-3 flex justify-center gap-2">{app.status === 'PENDING' && <button onClick={() => handleApprove(app.id)} className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-200">Approve</button>}<button onClick={() => handleEditJoinClick(app)} className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-200">Edit</button><button onClick={() => handleDeleteJoin(app.id)} className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-200">Del</button></td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* --- COMMITTEE TAB --- */}
              {activeMenu === "committee" && (
                <div className="space-y-6 animate-fade-in">
                  <div className={`bg-white border-0 ${editingId ? 'ring-2 ring-amber-400 bg-amber-50/50' : ''} rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.03)] overflow-hidden`}>
                    <div className={`px-6 py-4 flex justify-between items-center ${editingId ? 'bg-amber-100' : 'bg-slate-50 border-b border-slate-100'}`}><h3 className="font-bold text-[#2B3674]">{editingId ? "✏️ Edit Committee Member" : "➕ Add Member"}</h3>{editingId && <button onClick={cancelEdit} className="text-xs text-red-600 font-bold hover:underline">Cancel</button>}</div>
                    <form onSubmit={handleCommitteeSubmit} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                      <input required name="fullName" value={newCommittee.fullName} onChange={handleCommitteeChange} placeholder="Name" className="border border-slate-200 bg-slate-50 p-3 text-sm rounded-xl focus:ring-2 focus:ring-[#2B3674] outline-none transition-all"/>
                      <input required name="designation" value={newCommittee.designation} onChange={handleCommitteeChange} placeholder="Designation" className="border border-slate-200 bg-slate-50 p-3 text-sm rounded-xl focus:ring-2 focus:ring-[#2B3674] outline-none transition-all"/>
                      <input required name="mobileNumber" value={newCommittee.mobileNumber} onChange={handleCommitteeChange} placeholder="Mobile" className="border border-slate-200 bg-slate-50 p-3 text-sm rounded-xl focus:ring-2 focus:ring-[#2B3674] outline-none transition-all"/>
                      {!editingId && <input required name="password" value={newCommittee.password} onChange={handleCommitteeChange} placeholder="Password" className="border border-slate-200 bg-slate-50 p-3 text-sm rounded-xl focus:ring-2 focus:ring-[#2B3674] outline-none transition-all"/>}
                      <div className={`md:col-span-${editingId ? '3' : '2'} flex justify-end`}><button type="submit" disabled={isSubmitting} className={`${editingId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#2B3674] hover:bg-[#111C44]'} text-white px-8 py-3 rounded-xl text-sm font-bold shadow-md transition-all`}>{isSubmitting ? 'Saving...' : (editingId ? 'Update' : 'Save & Generate ID')}</button></div>
                    </form>
                  </div>
                  <div className="bg-white border-0 rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.03)] overflow-hidden">
                    <div className="bg-[#2B3674] text-white px-6 py-4 flex justify-between items-center"><h3 className="font-bold">Committee Directory</h3></div>
                    <div className="overflow-x-auto p-4">
                      <table className="w-full text-sm text-left">
                        <thead className="text-slate-400 border-b border-slate-100"><tr><th className="p-3 font-semibold">ID</th><th className="p-3 font-semibold">Name</th><th className="p-3 font-semibold">Designation</th><th className="p-3 font-semibold text-center">Actions</th></tr></thead>
                        <tbody>
                          {committeeData.map((member) => (
                            <tr key={member.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"><td className="p-3 font-extrabold text-red-500">{member.memberId}</td><td className="p-3 font-bold text-[#2B3674]">{member.fullName}</td><td className="p-3 text-slate-600">{member.designation}</td>
                            <td className="p-3 flex justify-center gap-2"><button onClick={() => handleEditClick(member)} className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-200">Edit</button><button onClick={() => handleDeleteCommittee(member.id)} className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-200">Del</button></td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* --- GALLERY TAB --- */}
              {activeMenu === "gallery" && (
                <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
                  {editingAlbumId && (
                    <div className="bg-amber-50 border border-amber-400 rounded-2xl shadow-sm mb-6">
                      <div className="border-b border-amber-200 px-6 py-4 flex justify-between items-center">
                        <h3 className="font-bold text-amber-700 text-sm">✏️ Edit Album Information</h3>
                        <button onClick={cancelAlbumEdit} className="text-xs text-red-600 font-bold hover:underline">Cancel</button>
                      </div>
                      <form onSubmit={handleAlbumUpdate} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                          <div><label className="block text-sm font-bold text-slate-700 mb-2">Album Title *</label><input required value={editAlbumData.title} onChange={(e)=>setEditAlbumData({...editAlbumData, title: e.target.value})} className="w-full border border-amber-200 bg-white p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm" /></div>
                          <div><label className="block text-sm font-bold text-slate-700 mb-2">Category *</label><select value={editAlbumData.category} onChange={(e)=>setEditAlbumData({...editAlbumData, category: e.target.value})} className="w-full border border-amber-200 bg-white p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm"><option value="football">⚽ Football</option><option value="cricket">🏏 Cricket</option><option value="badminton">🏸 Badminton</option><option value="social">🤝 Social Work</option></select></div>
                        </div>
                        <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl shadow-md transition-all text-sm">Save Changes</button>
                      </form>
                    </div>
                  )}

                  <div className="bg-white border-0 rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.03)] overflow-hidden">
                    <div className="bg-[#2B3674] text-white px-8 py-5 flex justify-between items-center"><h2 className="text-lg font-bold">📸 Create Media Album</h2></div>
                    <div className="p-8">
                      <form onSubmit={handleGallerySubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div><label className="block text-sm font-bold text-slate-700 mb-2">Album Title *</label><input required value={galleryTitle} onChange={(e) => setGalleryTitle(e.target.value)} placeholder="e.g. Winter Badminton 2026" className="w-full border border-slate-200 bg-slate-50 p-3.5 rounded-xl focus:ring-2 focus:ring-[#7CD326] outline-none text-sm" /></div>
                          <div><label className="block text-sm font-bold text-slate-700 mb-2">Category *</label><select value={galleryCategory} onChange={(e) => setGalleryCategory(e.target.value)} className="w-full border border-slate-200 bg-slate-50 p-3.5 rounded-xl focus:ring-2 focus:ring-[#7CD326] outline-none text-sm"><option value="football">⚽ Football</option><option value="cricket">🏏 Cricket</option><option value="badminton">🏸 Badminton</option><option value="social">🤝 Social Work</option></select></div>
                        </div>

                        <div className="border-2 border-dashed border-slate-300 hover:border-[#7CD326] bg-slate-50 p-8 text-center rounded-2xl transition-all">
                          <CldUploadWidget uploadPreset="moc_gallery" options={{ multiple: true }} onSuccess={handleGalleryUploadSuccess}>
                            {({ open }) => (
                              <button type="button" onClick={() => open()} className="bg-white text-[#2B3674] px-6 py-3 rounded-xl shadow-sm border border-slate-200 text-sm font-bold transition-all hover:border-[#7CD326] hover:shadow-md">📤 Select Multiple Photos</button>
                            )}
                          </CldUploadWidget>
                          {galleryImages.length > 0 && (
                            <div className="mt-6 text-left">
                              <p className="text-sm font-bold text-slate-700 mb-3">Selected Photos ({galleryImages.length}):</p>
                              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                                {galleryImages.map((img, i) => (<div key={i} className="relative h-20 w-full rounded-lg overflow-hidden border border-slate-200 shadow-sm"><img src={img} alt="preview" className="h-full w-full object-cover" />{i === 0 && <span className="absolute bottom-1 right-1 bg-[#7CD326] text-[#1A0F2E] text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-sm">COVER</span>}</div>))}
                              </div>
                            </div>
                          )}
                        </div>
                        <button type="submit" disabled={isGallerySubmitting} className="w-full bg-gradient-to-r from-[#7CD326] to-[#4CAE4C] hover:from-[#68B61D] hover:to-[#3e8e3e] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-500/30 transition-all text-sm disabled:opacity-50">{isGallerySubmitting ? "Creating Album..." : "🚀 Publish Album"}</button>
                      </form>
                    </div>
                  </div>

                  <div className="bg-white border-0 rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.03)] overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between items-center"><h3 className="font-bold text-[#2B3674]">Manage Uploaded Albums</h3><button onClick={() => fetchDashboardData(false)} className="bg-white text-[#2B3674] border border-slate-200 px-3 py-1.5 text-xs rounded-lg font-bold shadow-sm hover:border-[#7CD326] transition-colors">Refresh List</button></div>
                    <div className="overflow-x-auto p-4">
                      <table className="w-full text-sm text-left">
                        <thead className="text-slate-400 border-b border-slate-100"><tr><th className="p-3 font-semibold">Cover</th><th className="p-3 font-semibold">Album Title</th><th className="p-3 font-semibold">Category</th><th className="p-3 font-semibold">Photos</th><th className="p-3 font-semibold text-center">Action</th></tr></thead>
                        <tbody>
                          {albums.length === 0 ? (
                            <tr><td colSpan="5" className="p-4 text-center text-slate-500">No albums found.</td></tr>
                          ) : (
                            albums.map((album) => (
                              <tr key={album.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                <td className="p-3"><Image src={album.coverImage || "https://placehold.co/100x100/png?text=No+Image"} alt="cover" width={48} height={48} className="object-cover rounded-lg border border-slate-200 shadow-sm h-12 w-12" /></td>
                                <td className="p-3 font-bold text-[#2B3674]">{album.title}</td><td className="p-3 text-[11px] font-bold uppercase tracking-widest text-slate-500">{album.category}</td><td className="p-3 font-bold text-slate-600">{album.photos?.length || 1}</td>
                                <td className="p-3 text-center flex justify-center gap-2"><button onClick={() => handleEditAlbumClick(album)} className="bg-amber-100 text-amber-700 hover:bg-amber-200 px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold transition-colors">Edit</button><button onClick={() => handleDeleteAlbum(album.id)} className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold transition-colors">Del</button></td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* --- NOTICES TAB --- */}
              {activeMenu === "notices" && (
                <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-[#2B3674] text-white px-8 py-5"><h2 className="text-lg font-bold">📢 Post a Notice</h2></div>
                    <form onSubmit={handleNoticeSubmit} className="p-8 space-y-5">
                      <input required value={newNotice.title} onChange={(e)=>setNewNotice({...newNotice, title: e.target.value})} placeholder="Notice Headline" className="w-full border border-slate-300 p-3.5 rounded-xl outline-none font-bold" />
                      <textarea required value={newNotice.content} onChange={(e)=>setNewNotice({...newNotice, content: e.target.value})} placeholder="Notice details..." rows="4" className="w-full border border-slate-300 p-3.5 rounded-xl outline-none" />
                      <div className="flex items-center gap-3"><input type="checkbox" id="urgent" checked={newNotice.isUrgent} onChange={(e)=>setNewNotice({...newNotice, isUrgent: e.target.checked})} className="w-5 h-5 accent-red-500" /><label htmlFor="urgent" className="font-bold text-slate-700 cursor-pointer">Mark as URGENT</label></div>
                      <button type="submit" disabled={isNoticeSubmitting} className="w-full bg-[#7CD326] text-[#0B1437] font-bold py-3.5 rounded-xl shadow-md">{isNoticeSubmitting ? "Publishing..." : "Post Notice"}</button>
                    </form>
                  </div>
                  {notices.map((notice) => (
                    <div key={notice.id} className={`bg-white rounded-2xl p-6 shadow-sm border-l-4 ${notice.isUrgent ? 'border-red-500 bg-red-50/10' : 'border-[#7CD326]'} relative group`}>
                      <button onClick={() => handleDeleteNotice(notice.id)} className="absolute top-4 right-4 bg-red-100 hover:bg-red-500 text-red-600 hover:text-white w-8 h-8 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-sm" title="Delete Notice">🗑️</button>
                      <div className="flex justify-between items-start mb-2 pr-10"><h3 className={`font-bold text-lg ${notice.isUrgent ? 'text-red-600' : 'text-[#2B3674]'}`}>{notice.isUrgent && "🚨 "} {notice.title}</h3><span className="text-xs font-bold text-slate-400 whitespace-nowrap">{new Date(notice.createdAt).toLocaleDateString()}</span></div>
                      <p className="text-slate-600 text-sm mb-4 whitespace-pre-wrap">{notice.content}</p>
                      <div className="text-xs font-bold text-slate-400 border-t border-gray-100 pt-3 flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-gray-600">{notice.authorName?.charAt(0) || 'A'}</div>Posted by {notice.authorName}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* --- CHAT TAB --- */}
              {activeMenu === "chat" && (
                <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden animate-fade-in shadow-sm">
                  <div className="bg-[#2B3674] text-white px-6 py-4 shadow-sm z-10"><h2 className="font-bold">💬 Committee Hub</h2></div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.length === 0 ? (<div className="h-full flex items-center justify-center text-slate-400 font-bold">Start the conversation!</div>) : (
                      messages.map((msg, idx) => {
                        const isMe = msg.senderName === adminUser?.name;
                        return (
                          <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`relative max-w-[85%] md:max-w-[70%] group ${isMe ? 'bg-[#7CD326] text-[#0B1437] rounded-l-xl rounded-tr-xl' : 'bg-white border border-slate-200 text-slate-700 rounded-r-xl rounded-tl-xl'} p-4 shadow-sm`}>
                              {!isMe && <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1.5">{msg.senderName}</p>}
                              {msg.imageUrl ? <img src={msg.imageUrl} className="rounded-xl w-full max-w-sm mb-2" alt="upload" /> : <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.content}</p>}
                              <span className="text-[9px] opacity-40 absolute bottom-1 right-3">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              {isMe && (
                                <button onClick={() => handleDeleteChat(msg.id)} className="absolute -left-10 top-1/2 -translate-y-1/2 bg-red-100 hover:bg-red-500 text-red-500 hover:text-white w-8 h-8 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-sm" title="Delete">🗑️</button>
                              )}
                            </div>
                          </div>
                        )
                      })
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="p-4 bg-white border-t border-slate-200">
                    <div className="flex gap-2 items-center">
                      <CldUploadWidget uploadPreset="moc_gallery" onSuccess={handleChatImageUpload}>
                        {({ open }) => (
                          <button type="button" onClick={() => open()} className="bg-slate-100 hover:bg-slate-200 text-slate-600 w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-inner text-xl">📎</button>
                        )}
                      </CldUploadWidget>
                      <form onSubmit={handleSendMessage} className="flex flex-1 gap-2">
                        <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type a message..." className="flex-1 border border-slate-300 rounded-full px-6 outline-none text-sm focus:border-[#2B3674] focus:ring-1 focus:ring-[#2B3674] transition-all" />
                        <button type="submit" disabled={!chatInput.trim()} className="bg-[#2B3674] hover:bg-[#111C44] text-white w-12 h-12 rounded-full flex items-center justify-center disabled:opacity-50 shadow-md transition-all active:scale-95 text-lg">➤</button>
                      </form>
                    </div>
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