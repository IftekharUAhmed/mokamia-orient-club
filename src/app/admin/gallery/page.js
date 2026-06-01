"use client";
import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";

export default function UploadGallery() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("football");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cloudinary theke chobi upload holei ei function run hobe ar URL ta pabe
  const handleUploadSuccess = (result) => {
    setImageUrl(result.info.secure_url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageUrl) return alert("❌ Bhai, aage ekta chobi upload koro!");
    setIsSubmitting(true);

    const res = await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, category, imageUrl, description: "" }),
    });

    const data = await res.json();
    if (data.success) {
      alert("🎉 Magic! Chobi successfully database-e save hoyeche!");
      setTitle("");
      setImageUrl(""); // Form reset
    } else {
      alert("❌ Error: " + data.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold mb-8 text-[#2D1B4E] font-serif border-b-4 border-[#7CD326] pb-2 inline-block">
          📸 MOC Upload Portal
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-xl border border-gray-200">
          <div>
            <label className="block font-bold text-gray-700 mb-2">Album/Photo Title *</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. MPL 6th Edition Final" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#7CD326] outline-none transition-all" />
          </div>
          
          <div>
            <label className="block font-bold text-gray-700 mb-2">Category *</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#7CD326] outline-none">
              <option value="football">⚽ Football</option>
              <option value="cricket">🏏 Cricket</option>
              <option value="badminton">🏸 Badminton</option>
              <option value="social">🤝 Social Work</option>
            </select>
          </div>

          <div className="border-2 border-dashed border-[#7CD326] bg-green-50/30 p-8 text-center rounded-xl transition-all hover:bg-green-50">
            <CldUploadWidget uploadPreset="moc_gallery" onSuccess={handleUploadSuccess}>
              {({ open }) => (
                <button type="button" onClick={() => open()} className="bg-[#2D1B4E] hover:bg-[#1A0F2E] text-white px-6 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105">
                  {imageUrl ? "✅ Chobi Uploaded! Change korte chaile click koro" : "📤 Click kore Chobi Upload Dao"}
                </button>
              )}
            </CldUploadWidget>
            
            {imageUrl && (
              <div className="mt-6">
                <p className="text-xs text-gray-500 mb-2">Preview:</p>
                <img src={imageUrl} alt="preview" className="h-40 mx-auto rounded-lg shadow-md border-2 border-[#2D1B4E] object-cover" />
              </div>
            )}
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-[#7CD326] hover:bg-[#68B61D] text-[#2D1B4E] font-extrabold py-4 rounded-xl shadow-lg transition-all text-lg disabled:opacity-50">
            {isSubmitting ? "Processing..." : "🚀 Publish to Gallery"}
          </button>
        </form>
      </div>
    </div>
  );
}