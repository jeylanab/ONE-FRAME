import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, serverTimestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase"; 

export default function LightingAdmin() {
  const [lightingItems, setLightingItems] = useState([]);
  const [form, setForm] = useState({ code: "", size: "", description: "", lumens: "", sellSQM: "" });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchLighting = async () => {
    try {
      const snapshot = await getDocs(collection(db, "lighting"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLightingItems(data);
    } catch (error) { console.error("Fetch error:", error); }
  };

  useEffect(() => { fetchLighting(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.size || !form.sellSQM) {
      alert("Size and Sell/SQM are required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        code: form.code.toUpperCase(),
        size: form.size, // e.g., 235mm - 6500K
        description: form.description,
        lumens: Number(form.lumens) || 0,
        sellSQM: Number(form.sellSQM),
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, "lighting", editingId), payload);
        setEditingId(null);
      } else {
        await addDoc(collection(db, "lighting"), { ...payload, createdAt: serverTimestamp() });
      }

      setForm({ code: "", size: "", description: "", lumens: "", sellSQM: "" });
      await fetchLighting();
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this lighting item?")) {
      await deleteDoc(doc(db, "lighting", id));
      fetchLighting();
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({ 
      code: item.code || "", 
      size: item.size, 
      description: item.description || "", 
      lumens: item.lumens, 
      sellSQM: item.sellSQM 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#0D004C]">Lighting Inventory Admin</h1>

      {/* Form Section */}
      <div className="bg-white p-6 rounded-xl shadow mb-10 border-t-4 border-[#FFD700]">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          {editingId ? "✏️ Edit Lighting" : "➕ Add New Lighting Option"}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <input name="code" value={form.code} onChange={handleChange} placeholder="CODE (e.g. 8W24V-W)" className="border p-3 rounded" />
          <input name="size" value={form.size} onChange={handleChange} placeholder="Size/Temp (e.g. 6500K)" className="border p-3 rounded" />
          <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border p-3 rounded" />
          <input name="lumens" type="number" value={form.lumens} onChange={handleChange} placeholder="Lumens" className="border p-3 rounded" />
          <input name="sellSQM" type="number" value={form.sellSQM} onChange={handleChange} placeholder="Sell/SQM ($)" className="border p-3 rounded" />
        </div>
        <button onClick={handleSubmit} disabled={loading} className="mt-4 px-6 py-2 bg-[#0D004C] text-white rounded hover:bg-opacity-90 transition-all">
          {loading ? "Saving..." : editingId ? "Update Lighting" : "Add Lighting"}
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50 text-xs font-bold uppercase text-gray-600">
              <th className="p-4">Code</th>
              <th className="p-4">Size/Kevlin</th>
              <th className="p-4">Description</th>
              <th className="p-4">Lumens</th>
              <th className="p-4">Sell/SQM</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lightingItems.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold text-[#0D004C]">{item.code || "-"}</td>
                <td className="p-4">{item.size}</td>
                <td className="p-4 text-gray-500 text-sm">{item.description}</td>
                <td className="p-4">{item.lumens?.toLocaleString()} lm</td>
                <td className="p-4 font-bold text-[#3D85C6]">${item.sellSQM?.toLocaleString()}</td>
                <td className="p-4 text-right space-x-3">
                  <button onClick={() => startEdit(item)} className="text-blue-600 text-sm font-medium">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500 text-sm font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}