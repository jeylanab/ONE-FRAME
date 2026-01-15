import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, serverTimestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase"; 

export default function CornerAdmin() {
  const [corners, setCorners] = useState([]);
  const [form, setForm] = useState({ type: "", description: "", sellLM: "" });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchCorners = async () => {
    try {
      const snapshot = await getDocs(collection(db, "corners"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCorners(data);
    } catch (error) { console.error("Fetch error:", error); }
  };

  useEffect(() => { fetchCorners(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.type || !form.sellLM) {
      alert("Type and SELL/LM are required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        type: form.type.toUpperCase(),
        description: form.description,
        sellLM: Number(form.sellLM),
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, "corners", editingId), payload);
        setEditingId(null);
      } else {
        await addDoc(collection(db, "corners"), { ...payload, createdAt: serverTimestamp() });
      }

      setForm({ type: "", description: "", sellLM: "" });
      await fetchCorners();
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this corner type?")) {
      await deleteDoc(doc(db, "corners", id));
      fetchCorners();
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({ type: item.type, description: item.description, sellLM: item.sellLM });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#0D004C]">Corner Types Admin</h1>

      {/* Form Section */}
      <div className="bg-white p-6 rounded-xl shadow mb-10 border-t-4 border-[#0D004C]">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          {editingId ? "✏️ Edit Corner Type" : "➕ Add New Corner Type"}
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <input 
            name="type" 
            value={form.type} 
            onChange={handleChange} 
            placeholder="Type (e.g. 90-DEGREE - mitred)" 
            className="border p-3 rounded" 
          />
          <input 
            name="sellLM" 
            type="number" 
            value={form.sellLM} 
            onChange={handleChange} 
            placeholder="Sell/LM ($)" 
            className="border p-3 rounded" 
          />
          <input 
            name="description" 
            value={form.description} 
            onChange={handleChange} 
            placeholder="Description (e.g. mitre-cut corners)" 
            className="border p-3 rounded" 
          />
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleSubmit} disabled={loading} className="px-6 py-2 bg-[#0D004C] text-white rounded hover:bg-opacity-90 transition-all">
            {loading ? "Saving..." : editingId ? "Update Corner" : "Add Corner"}
          </button>
          {editingId && (
            <button 
              onClick={() => { setEditingId(null); setForm({ type: "", description: "", sellLM: "" }); }} 
              className="px-6 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-4 text-sm font-bold uppercase text-gray-600">Type</th>
              <th className="p-4 text-sm font-bold uppercase text-gray-600">Description</th>
              <th className="p-4 text-sm font-bold uppercase text-gray-600">Sell/LM</th>
              <th className="p-4 text-right text-sm font-bold uppercase text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {corners.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold text-[#0D004C]">{item.type}</td>
                <td className="p-4 text-sm text-gray-500">{item.description}</td>
                <td className="p-4 font-bold text-[#3D85C6]">${item.sellLM?.toLocaleString()}</td>
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