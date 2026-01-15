import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, serverTimestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase"; 

export default function ControlAdmin() {
  const [controls, setControls] = useState([]);
  const [form, setForm] = useState({ code: "", output: "", description: "", sellSQM: "" });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchControls = async () => {
    try {
      const snapshot = await getDocs(collection(db, "controls"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setControls(data);
    } catch (error) { console.error("Fetch error:", error); }
  };

  useEffect(() => { fetchControls(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.code || !form.sellSQM) {
      alert("Code and Sell/SQM are required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        code: form.code.toUpperCase(),
        output: form.output, // e.g., 24V/10A/240W
        description: form.description,
        sellSQM: Number(form.sellSQM),
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, "controls", editingId), payload);
        setEditingId(null);
      } else {
        await addDoc(collection(db, "controls"), { ...payload, createdAt: serverTimestamp() });
      }

      setForm({ code: "", output: "", description: "", sellSQM: "" });
      await fetchControls();
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this control item?")) {
      await deleteDoc(doc(db, "controls", id));
      fetchControls();
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({ code: item.code, output: item.output || "", description: item.description, sellSQM: item.sellSQM });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#0D004C]">Control & Driver Admin</h1>

      <div className="bg-white p-6 rounded-xl shadow mb-10 border-t-4 border-[#0D004C]">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          {editingId ? "✏️ Edit Control/Driver" : "➕ Add New Control/Driver"}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <input name="code" value={form.code} onChange={handleChange} placeholder="CODE (e.g. ELG240)" className="border p-3 rounded" />
          <input name="output" value={form.output} onChange={handleChange} placeholder="Output (e.g. 24V/10A/240W)" className="border p-3 rounded" />
          <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border p-3 rounded" />
          <input name="sellSQM" type="number" value={form.sellSQM} onChange={handleChange} placeholder="Sell/SQM ($)" className="border p-3 rounded" />
        </div>
        <button onClick={handleSubmit} disabled={loading} className="mt-4 px-6 py-2 bg-[#0D004C] text-white rounded hover:bg-opacity-90">
          {loading ? "Saving..." : editingId ? "Update Control" : "Add Control"}
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-gray-50 text-xs font-bold uppercase text-gray-600">
              <th className="p-4">Code</th>
              <th className="p-4">Output</th>
              <th className="p-4">Description</th>
              <th className="p-4">Sell/SQM</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {controls.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-bold text-[#0D004C]">{item.code}</td>
                <td className="p-4">{item.output || "N/A"}</td>
                <td className="p-4 text-gray-500 text-sm">{item.description}</td>
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