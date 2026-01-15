import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, serverTimestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase"; 

export default function FrameAdmin() {
  const [frames, setFrames] = useState([]);
  const [form, setForm] = useState({ 
    ofCode: "", size: "", type: "", description: "", weight: "", sellLM: "" 
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchFrames = async () => {
    try {
      const snapshot = await getDocs(collection(db, "frames"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFrames(data);
    } catch (error) { console.error("Fetch error:", error); }
  };

  useEffect(() => { fetchFrames(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.ofCode || !form.sellLM) {
      alert("OF Code and Sell/LM are required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ofCode: form.ofCode.toUpperCase(),
        size: form.size,
        type: form.type.toUpperCase(), // e.g., WALL, 3D, RAIL
        description: form.description,
        weight: Number(form.weight) || 0,
        sellLM: Number(form.sellLM),
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, "frames", editingId), payload);
        setEditingId(null);
      } else {
        await addDoc(collection(db, "frames"), { ...payload, createdAt: serverTimestamp() });
      }

      setForm({ ofCode: "", size: "", type: "", description: "", weight: "", sellLM: "" });
      await fetchFrames();
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this frame profile?")) {
      await deleteDoc(doc(db, "frames", id));
      fetchFrames();
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({ 
      ofCode: item.ofCode, size: item.size, type: item.type, 
      description: item.description, weight: item.weight, sellLM: item.sellLM 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#0D004C]">Frame Inventory Admin</h1>

      {/* Form Section */}
      <div className="bg-white p-6 rounded-xl shadow mb-10 border-t-4 border-[#0D004C]">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          {editingId ? "✏️ Edit Frame Profile" : "➕ Add New Frame Profile"}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <input name="ofCode" value={form.ofCode} onChange={handleChange} placeholder="OF CODE" className="border p-2 rounded" />
          <input name="size" value={form.size} onChange={handleChange} placeholder="Size (15mm)" className="border p-2 rounded" />
          <input name="type" value={form.type} onChange={handleChange} placeholder="Type (WALL)" className="border p-2 rounded" />
          <input name="weight" type="number" step="0.001" value={form.weight} onChange={handleChange} placeholder="KG/LM" className="border p-2 rounded" />
          <input name="sellLM" type="number" value={form.sellLM} onChange={handleChange} placeholder="Sell/LM ($)" className="border p-2 rounded" />
          <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border p-2 rounded col-span-2 lg:col-span-1" />
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleSubmit} disabled={loading} className="px-6 py-2 bg-[#0D004C] text-white rounded hover:bg-opacity-90">
            {loading ? "Saving..." : editingId ? "Update Frame" : "Add Frame"}
          </button>
          {editingId && (
            <button onClick={() => { setEditingId(null); setForm({ ofCode: "", size: "", type: "", description: "", weight: "", sellLM: "" }); }} className="px-6 py-2 bg-gray-200 rounded">
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b bg-gray-50 text-xs font-bold uppercase text-gray-600">
              <th className="p-3">OF Code</th>
              <th className="p-3">Size</th>
              <th className="p-3">Type</th>
              <th className="p-3">Description</th>
              <th className="p-3">Weight (KG/LM)</th>
              <th className="p-3">Sell/LM</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {frames.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-bold text-[#0D004C]">{item.ofCode}</td>
                <td className="p-3">{item.size}</td>
                <td className="p-3"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">{item.type}</span></td>
                <td className="p-3 text-gray-500">{item.description}</td>
                <td className="p-3">{item.weight}</td>
                <td className="p-3 font-bold text-[#3D85C6]">${item.sellLM?.toLocaleString()}</td>
                <td className="p-3 text-right space-x-2">
                  <button onClick={() => startEdit(item)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}