import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, serverTimestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase"; 

export default function SetupAdmin() {
  const [setups, setSetups] = useState([]);
  const [form, setForm] = useState({ shape: "", description: "", sellPrice: "" });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchSetups = async () => {
    try {
      const snapshot = await getDocs(collection(db, "setups"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSetups(data);
    } catch (error) { console.error("Fetch error:", error); }
  };

  useEffect(() => { fetchSetups(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.shape || !form.sellPrice) {
      alert("Shape and Sell Price are required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        shape: form.shape.toUpperCase(),
        description: form.description || "set-up of machines + sewing templates + sewing jigs",
        sellPrice: Number(form.sellPrice),
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, "setups", editingId), payload);
        setEditingId(null);
      } else {
        await addDoc(collection(db, "setups"), { ...payload, createdAt: serverTimestamp() });
      }

      setForm({ shape: "", description: "", sellPrice: "" });
      await fetchSetups();
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this setup fee?")) {
      await deleteDoc(doc(db, "setups", id));
      fetchSetups();
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({ shape: item.shape, description: item.description, sellPrice: item.sellPrice });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#0D004C]">Setup Costs Admin</h1>

      {/* Form Section */}
      <div className="bg-white p-6 rounded-xl shadow mb-10 border-t-4 border-[#3D85C6]">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          {editingId ? "✏️ Edit Setup Fee" : "➕ Add New Setup Fee"}
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <input name="shape" value={form.shape} onChange={handleChange} placeholder="Shape (e.g., DIAMOND)" className="border p-3 rounded" />
          <input name="sellPrice" type="number" value={form.sellPrice} onChange={handleChange} placeholder="Sell Price ($)" className="border p-3 rounded" />
          <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border p-3 rounded" />
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleSubmit} disabled={loading} className="px-6 py-2 bg-[#0D004C] text-white rounded hover:bg-opacity-90">
            {loading ? "Saving..." : editingId ? "Update Setup" : "Add Setup"}
          </button>
          {editingId && <button onClick={() => { setEditingId(null); setForm({ shape: "", description: "", sellPrice: "" }); }} className="px-6 py-2 bg-gray-200 rounded">Cancel</button>}
        </div>
      </div>

      {/* List Section */}
      <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-4 text-sm font-bold uppercase text-gray-600">Shape</th>
              <th className="p-4 text-sm font-bold uppercase text-gray-600">Description</th>
              <th className="p-4 text-sm font-bold uppercase text-gray-600">Fixed Cost</th>
              <th className="p-4 text-right text-sm font-bold uppercase text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {setups.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-bold text-[#0D004C]">{item.shape}</td>
                <td className="p-4 text-sm text-gray-500">{item.description}</td>
                <td className="p-4 font-bold text-[#3D85C6]">${item.sellPrice?.toLocaleString()}</td>
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