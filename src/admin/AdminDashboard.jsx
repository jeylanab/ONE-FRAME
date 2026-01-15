export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#0D004C] mb-4">
        Admin Dashboard
      </h1>

      <p className="text-gray-600 mb-8">
        Manage all pricing, options, and configurations used in the quote
        calculator. Changes here immediately affect the quote builder.
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        <Card title="Quote Steps">
          Intro, Design Type, Shape, Measurements, Corners, Frame, Fabric,
          Lighting, Acoustics, Prebuild, Freight
        </Card>

        <Card title="Pricing Control">
          All prices are editable and stored in Firestore. No hardcoded values
          in the frontend.
        </Card>

        <Card title="Validation">
          Quote cannot be completed unless all required steps are filled or set
          to N/A.
        </Card>
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{children}</p>
    </div>
  );
}
