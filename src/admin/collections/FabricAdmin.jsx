import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, serverTimestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase"; 

export default function FabricAdmin() {
  const [fabrics, setFabrics] = useState([]);
  const [form, setForm] = useState({ code: "", size: "", description: "", weightSQM: "", sellSQM: "" });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchFabrics = async () => {
    try {
      const snapshot = await getDocs(collection(db, "fabrics"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFabrics(data);
    } catch (error) { console.error("Fetch error:", error); }
  };

  useEffect(() => { fetchFabrics(); }, []);

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
        size: form.size, // e.g., 15mm, 120mm
        description: form.description,
        weightSQM: Number(form.weightSQM) || 0,
        sellSQM: Number(form.sellSQM),
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, "fabrics", editingId), payload);
        setEditingId(null);
      } else {
        await addDoc(collection(db, "fabrics"), { ...payload, createdAt: serverTimestamp() });
      }

      setForm({ code: "", size: "", description: "", weightSQM: "", sellSQM: "" });
      await fetchFabrics();
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this fabric?")) {
      await deleteDoc(doc(db, "fabrics", id));
      fetchFabrics();
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({ 
      code: item.code || "", 
      size: item.size, 
      description: item.description || "", 
      weightSQM: item.weightSQM, 
      sellSQM: item.sellSQM 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#0D004C]">Fabric Inventory Admin</h1>

      {/* Form Section */}
      <div className="bg-white p-6 rounded-xl shadow mb-10 border-t-4 border-[#3D85C6]">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          {editingId ? "✏️ Edit Fabric" : "➕ Add New Fabric"}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <input name="code" value={form.code} onChange={handleChange} placeholder="CODE" className="border p-3 rounded" />
          <input name="size" value={form.size} onChange={handleChange} placeholder="Size (e.g. 120mm)" className="border p-3 rounded" />
          <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border p-3 rounded" />
          <input name="weightSQM" type="number" step="0.01" value={form.weightSQM} onChange={handleChange} placeholder="Weight/SQM" className="border p-3 rounded" />
          <input name="sellSQM" type="number" value={form.sellSQM} onChange={handleChange} placeholder="Sell/SQM ($)" className="border p-3 rounded" />
        </div>
        <button onClick={handleSubmit} disabled={loading} className="mt-4 px-6 py-2 bg-[#0D004C] text-white rounded">
          {loading ? "Saving..." : editingId ? "Update Fabric" : "Add Fabric"}
        </button>
      </div>

      {/* List Section */}
      <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-gray-50 text-xs font-bold uppercase text-gray-600">
              <th className="p-4">Code</th>
              <th className="p-4">Size</th>
              <th className="p-4">Description</th>
              <th className="p-4">Weight (SQM)</th>
              <th className="p-4">Sell/SQM</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fabrics.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold text-[#0D004C]">{item.code || "-"}</td>
                <td className="p-4">{item.size}</td>
                <td className="p-4 text-gray-500 text-sm">{item.description}</td>
                <td className="p-4">{item.weightSQM} kg</td>
                <td className="p-4 font-bold text-[#3D85C6]">${item.sellSQM}</td>
                <td className="p-4 text-right space-x-3">
                  <button onClick={() => startEdit(item)} className="text-blue-600 text-sm">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500 text-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}