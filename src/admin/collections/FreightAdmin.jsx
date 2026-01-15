import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, serverTimestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase"; 

export default function FreightAdmin() {
  const [freightData, setFreightData] = useState([]);
  const [form, setForm] = useState({ location: "", tier: "", description: "", sell: "", boxSize: "" });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchFreight = async () => {
    try {
      const snapshot = await getDocs(collection(db, "freight"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFreightData(data);
    } catch (error) { console.error("Fetch error:", error); }
  };

  useEffect(() => { fetchFreight(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.location || !form.tier || !form.sell) {
      alert("Location, Tier, and Sell Price are required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        location: form.location.toUpperCase(),
        tier: form.tier, // e.g., "Small - Complete"
        description: form.description,
        sell: Number(form.sell),
        boxSize: form.boxSize,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, "freight", editingId), payload);
        setEditingId(null);
      } else {
        await addDoc(collection(db, "freight"), { ...payload, createdAt: serverTimestamp() });
      }

      setForm({ location: "", tier: "", description: "", sell: "", boxSize: "" });
      await fetchFreight();
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this freight rate?")) {
      await deleteDoc(doc(db, "freight", id));
      fetchFreight();
    }
  };

  // Grouping data by location for a cleaner UI
  const groupedFreight = freightData.reduce((acc, item) => {
    if (!acc[item.location]) acc[item.location] = [];
    acc[item.location].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#0D004C]">Freight & Packaging Admin</h1>

      {/* Form Section */}
      <div className="bg-white p-6 rounded-xl shadow mb-10 border-t-4 border-[#3D85C6]">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          {editingId ? "✏️ Edit Freight Rate" : "➕ Add New Freight Rate"}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <input name="location" value={form.location} onChange={handleChange} placeholder="City (e.g. AUCKLAND)" className="border p-2 rounded" />
          <select name="tier" value={form.tier} onChange={handleChange} className="border p-2 rounded">
            <option value="">Select Tier</option>
            <option value="Fabric only">Fabric only</option>
            <option value="Small - complete">Small - complete</option>
            <option value="Medium - complete">Medium - complete</option>
            <option value="Large - complete">Large - complete</option>
            <option value="Pallet / Crate">Pallet / Crate</option>
          </select>
          <input name="sell" type="number" value={form.sell} onChange={handleChange} placeholder="Sell Price ($)" className="border p-2 rounded" />
          <input name="boxSize" value={form.boxSize} onChange={handleChange} placeholder="Box Size (e.g. 1800x120x120)" className="border p-2 rounded" />
          <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border p-2 rounded" />
        </div>
        <button onClick={handleSubmit} disabled={loading} className="mt-4 px-6 py-2 bg-[#0D004C] text-white rounded hover:bg-opacity-90 transition-all">
            {loading ? "Saving..." : editingId ? "Update Rate" : "Add Rate"}
        </button>
      </div>

      {/* Grouped Table View */}
      {Object.keys(groupedFreight).sort().map(city => (
        <div key={city} className="mb-10">
          <h3 className="text-lg font-bold text-white bg-[#0D004C] px-4 py-2 rounded-t-lg">{city}</h3>
          <div className="bg-white shadow overflow-x-auto rounded-b-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b text-xs font-bold uppercase text-gray-600">
                  <th className="p-4 w-1/4">Tier</th>
                  <th className="p-4">Box Size</th>
                  <th className="p-4 text-center">Sell Price</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupedFreight[city].map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{item.tier}</td>
                    <td className="p-4 text-sm text-gray-500">{item.boxSize || "N/A"}</td>
                    <td className="p-4 text-center font-bold text-[#3D85C6]">${item.sell.toFixed(2)}</td>
                    <td className="p-4 text-right space-x-3">
                      <button onClick={() => { setEditingId(item.id); setForm(item); }} className="text-blue-600 text-sm">Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-500 text-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}