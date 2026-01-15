import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, serverTimestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase"; 

export default function DesignTypeAdmin() {
  const [designTypes, setDesignTypes] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", price: "" });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchDesignTypes = async () => {
    const snapshot = await getDocs(collection(db, "designTypes"));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setDesignTypes(data);
  };

  useEffect(() => { fetchDesignTypes(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.title || !form.price) {
      alert("Title and price are required");
      return;
    }
    setLoading(true);
    try {
      if (editingId) {
        // UPDATE
        await updateDoc(doc(db, "designTypes", editingId), {
          ...form,
          price: Number(form.price),
          updatedAt: serverTimestamp(),
        });
        setEditingId(null);
      } else {
        // CREATE
        await addDoc(collection(db, "designTypes"), {
          ...form,
          price: Number(form.price),
          createdAt: serverTimestamp(),
        });
      }
      setForm({ title: "", description: "", price: "" });
      await fetchDesignTypes();
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this item?")) {
      await deleteDoc(doc(db, "designTypes", id));
      fetchDesignTypes();
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({ title: item.title, description: item.description, price: item.price });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#0D004C]">Design Types – Admin</h1>

      <div className="bg-white p-6 rounded-xl shadow mb-10">
        <h2 className="text-lg font-semibold mb-4">{editingId ? "Edit Design" : "Add New Design"}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="border p-3 rounded" />
          <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" className="border p-3 rounded" />
          <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border p-3 rounded" />
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleSubmit} disabled={loading} className="px-6 py-2 bg-[#0D004C] text-white rounded">
            {loading ? "Saving..." : editingId ? "Update Design" : "Add Design Type"}
          </button>
          {editingId && <button onClick={() => { setEditingId(null); setForm({ title: "", description: "", price: "" }); }} className="px-6 py-2 bg-gray-200 rounded">Cancel</button>}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Existing Design Types</h2>
        <div className="space-y-4">
          {designTypes.map((item) => (
            <div key={item.id} className="flex justify-between items-center border p-4 rounded">
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-bold text-[#3D85C6]">${item.price?.toLocaleString()}</p>
                <button onClick={() => startEdit(item)} className="text-blue-600 text-sm underline">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="text-red-600 text-sm underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}