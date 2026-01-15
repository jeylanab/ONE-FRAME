import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, serverTimestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase"; 

export default function ShapeAdmin() {
  const [shapes, setShapes] = useState([]);
  const [form, setForm] = useState({ size: "", description: "", sellLM: "" });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchShapes = async () => {
    try {
      const snapshot = await getDocs(collection(db, "shapes"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setShapes(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => { fetchShapes(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.size || !form.description) {
      alert("Please fill in Size and Description");
      return;
    }

    setLoading(true); // Button changes to "Saving..."
    
    try {
      if (editingId) {
        // UPDATE
        const docRef = doc(db, "shapes", editingId);
        await updateDoc(docRef, {
          size: form.size.toUpperCase(),
          description: form.description,
          sellLM: form.sellLM,
          updatedAt: serverTimestamp(),
        });
        setEditingId(null);
      } else {
        // CREATE
        await addDoc(collection(db, "shapes"), {
          size: form.size.toUpperCase(),
          description: form.description,
          sellLM: form.sellLM,
          createdAt: serverTimestamp(),
        });
      }

      setForm({ size: "", description: "", sellLM: "" });
      await fetchShapes();
      setLoading(false); // Button changes back
    } catch (error) {
      setLoading(false); // Ensure button resets on error
      console.error("Firebase Error:", error);
      alert("Error saving: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this shape?")) {
      await deleteDoc(doc(db, "shapes", id));
      fetchShapes();
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({ size: item.size, description: item.description, sellLM: item.sellLM || "" });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#0D004C]">Shape Admin</h1>

      <div className="bg-white p-6 rounded-xl shadow mb-10 border-t-4 border-[#0D004C]">
        <h2 className="text-lg font-semibold mb-4">{editingId ? "Edit Shape" : "Add New Shape"}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <input name="size" value={form.size} onChange={handleChange} placeholder="Size (e.g. SQUARE)" className="border p-3 rounded" />
          <input name="sellLM" value={form.sellLM} onChange={handleChange} placeholder="Sell/LM" className="border p-3 rounded" />
          <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border p-3 rounded" />
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleSubmit} disabled={loading} className="px-6 py-2 bg-[#0D004C] text-white rounded">
            {loading ? "Saving..." : editingId ? "Update Shape" : "Add Shape"}
          </button>
          {editingId && (
            <button onClick={() => { setEditingId(null); setForm({ size: "", description: "", sellLM: "" }); }} className="px-6 py-2 bg-gray-200 rounded">
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-sm font-bold uppercase text-gray-600">Size</th>
              <th className="p-3 text-sm font-bold uppercase text-gray-600">Description</th>
              <th className="p-3 text-sm font-bold uppercase text-gray-600">Sell/LM</th>
              <th className="p-3 text-right text-sm font-bold uppercase text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shapes.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-semibold">{item.size}</td>
                <td className="p-3 text-sm text-gray-600">{item.description}</td>
                <td className="p-3 text-sm font-medium">{item.sellLM}</td>
                <td className="p-3 text-right space-x-3">
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