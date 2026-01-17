// app/(admin)/admin/page.tsx
export default function AdminDashboardPage() {
  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Total Courses</p>
          <h3 className="text-2xl font-bold">12</h3>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Total Students</p>
          <h3 className="text-2xl font-bold">340</h3>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Active Enrollments</p>
          <h3 className="text-2xl font-bold">215</h3>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Revenue</p>
          <h3 className="text-2xl font-bold">₹1,25,000</h3>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h4 className="text-xl font-semibold mb-4">
          Recent Enrollments
        </h4>

        <div className="text-gray-600">
          No recent enrollments
        </div>
      </div>
    </div>
  )
}
