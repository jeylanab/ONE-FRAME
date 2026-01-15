import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, serverTimestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase"; 

export default function UserAdmin() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(data);
    } catch (error) { console.error("Fetch error:", error); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("All fields are required to create a user");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name.toUpperCase(),
        email: form.email.toLowerCase(),
        password: form.password, // In a production app, you would hash this
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, "users", editingId), payload);
        setEditingId(null);
      } else {
        await addDoc(collection(db, "users"), { ...payload, createdAt: serverTimestamp() });
      }

      setForm({ name: "", email: "", password: "" });
      await fetchUsers();
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to remove this user's access?")) {
      await deleteDoc(doc(db, "users", id));
      fetchUsers();
    }
  };

  const startEdit = (user) => {
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email, password: user.password });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#0D004C]">Authorized Staff Management</h1>

      {/* Form Section */}
      <div className="bg-white p-6 rounded-xl shadow mb-10 border-t-4 border-[#0D004C]">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          {editingId ? "✏️ Edit Staff Member" : "➕ Add New Staff Member"}
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. JACQUES" className="border p-3 rounded focus:ring-2 focus:ring-[#0D004C] outline-none" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 mb-1 uppercase">User Name (Email)</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@oneframe.co.nz" className="border p-3 rounded focus:ring-2 focus:ring-[#0D004C] outline-none" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 mb-1 uppercase">Password</label>
            <input name="password" type="text" value={form.password} onChange={handleChange} placeholder="Enter Password" className="border p-3 rounded focus:ring-2 focus:ring-[#0D004C] outline-none" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={handleSubmit} disabled={loading} className="px-8 py-3 bg-[#0D004C] text-white rounded font-bold hover:bg-opacity-90 transition-all">
            {loading ? "Processing..." : editingId ? "Update User" : "Add New User"}
          </button>
          {editingId && (
            <button onClick={() => { setEditingId(null); setForm({ name: "", email: "", password: "" }); }} className="px-8 py-3 bg-gray-200 text-gray-700 rounded font-bold">
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b text-xs font-bold uppercase text-gray-600">
              <th className="p-4">Name</th>
              <th className="p-4">User Name</th>
              <th className="p-4">Password</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-blue-50 transition-colors">
                <td className="p-4 font-bold text-[#0D004C] uppercase">{user.name}</td>
                <td className="p-4 text-blue-600 underline">{user.email}</td>
                <td className="p-4 font-mono text-gray-600">{user.password}</td>
                <td className="p-4 text-right space-x-4">
                  <button onClick={() => startEdit(user)} className="text-blue-600 font-semibold hover:underline">Update</button>
                  <button onClick={() => handleDelete(user.id)} className="text-red-500 font-semibold hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}