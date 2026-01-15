import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, serverTimestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase"; 

export default function PreBuildAdmin() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ shape: "", description: "full-prebuild to view prior to dispatch", sell: "" });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchServices = async () => {
    try {
      const snapshot = await getDocs(collection(db, "prebuilds"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setServices(data);
    } catch (error) { console.error("Fetch error:", error); }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.shape || !form.sell) {
      alert("Shape and Sell Price are required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        shape: form.shape.toUpperCase(),
        description: form.description,
        sell: Number(form.sell),
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, "prebuilds", editingId), payload);
        setEditingId(null);
      } else {
        await addDoc(collection(db, "prebuilds"), { ...payload, createdAt: serverTimestamp() });
      }

      setForm({ shape: "", description: "full-prebuild to view prior to dispatch", sell: "" });
      await fetchServices();
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this pre-build service?")) {
      await deleteDoc(doc(db, "prebuilds", id));
      fetchServices();
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({ shape: item.shape, description: item.description, sell: item.sell });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#0D004C]">Pre-Build Services Admin</h1>

      {/* Form Section */}
      <div className="bg-white p-6 rounded-xl shadow mb-10 border-t-4 border-[#3D85C6]">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          {editingId ? "✏️ Edit Service" : "➕ Add Pre-Build Option"}
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <input name="shape" value={form.shape} onChange={handleChange} placeholder="Shape (e.g. ROUND)" className="border p-3 rounded" />
          <input name="sell" type="number" value={form.sell} onChange={handleChange} placeholder="Sell Price ($)" className="border p-3 rounded" />
          <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border p-3 rounded" />
        </div>
        <button onClick={handleSubmit} disabled={loading} className="mt-4 px-6 py-2 bg-[#0D004C] text-white rounded">
          {loading ? "Saving..." : editingId ? "Update Service" : "Add Service"}
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-gray-50 text-xs font-bold uppercase text-gray-600">
              <th className="p-4">Shape</th>
              <th className="p-4">Description</th>
              <th className="p-4">Fixed Sell Price</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-bold text-[#0D004C]">{item.shape}</td>
                <td className="p-4 text-sm text-gray-500">{item.description}</td>
                <td className="p-4 font-bold text-[#3D85C6]">${item.sell}</td>
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