import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Activity, Clock, Globe } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

function ActivityLogs() {
  // Example Data
  const visitorsData = [
    { name: "USA", value: 400 },
    { name: "Canada", value: 300 },
    { name: "India", value: 200 },
    { name: "Germany", value: 100 },
  ];

  const activityTrend = [
    { day: "Mon", visits: 120 },
    { day: "Tue", visits: 200 },
    { day: "Wed", visits: 150 },
    { day: "Thu", visits: 280 },
    { day: "Fri", visits: 300 },
    { day: "Sat", visits: 250 },
    { day: "Sun", visits: 400 },
  ];

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f"];

  const logs = [
    { id: 1, user: "Alice", action: "Visited Homepage", time: "2 mins ago" },
    { id: 2, user: "Bob", action: "Viewed Projects", time: "10 mins ago" },
    { id: 3, user: "Charlie", action: "Downloaded Resume", time: "20 mins ago" },
    { id: 4, user: "Diana", action: "Visited Certifications Page", time: "1 hour ago" },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-200 p-8">
      <h1 className="text-4xl font-bold text-white mb-8">📊 Activity Logs Dashboard</h1>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 text-white">
        <Card className="bg-[#1a1a1a] rounded-2xl shadow-lg">
          <CardContent className="p-6 flex items-center space-x-4">
            <Users className="text-blue-400" size={36} />
            <div>
              <p className="text-gray-400 text-sm">Total Visitors</p>
              <h2 className="text-2xl font-bold">12,345</h2>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] rounded-2xl shadow-lg">
          <CardContent className="p-6 flex items-center space-x-4">
            <Activity className="text-green-400" size={36} />
            <div>
              <p className="text-gray-400 text-sm">Active Users</p>
              <h2 className="text-2xl font-bold">356</h2>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] rounded-2xl shadow-lg">
          <CardContent className="p-6 flex items-center space-x-4">
            <Clock className="text-yellow-400" size={36} />
            <div>
              <p className="text-gray-400 text-sm">Avg Session Time</p>
              <h2 className="text-2xl font-bold">5m 42s</h2>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] rounded-2xl shadow-lg">
          <CardContent className="p-6 flex items-center space-x-4">
            <Globe className="text-pink-400" size={36} />
            <div>
              <p className="text-gray-400 text-sm">Countries</p>
              <h2 className="text-2xl font-bold">42</h2>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card className="bg-[#1a1a1a] rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Visitors by Country</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={visitorsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey="value"
              >
                {visitorsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-[#1a1a1a] rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Weekly Visit Trends</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={activityTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Line type="monotone" dataKey="visits" stroke="#82ca9d" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity Logs */}
      <Card className="bg-[#1a1a1a] rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent User Activity</h2>
        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between border-b border-gray-700 pb-2"
            >
              <div>
                <p className="font-semibold text-white">{log.user}</p>
                <p className="text-gray-400 text-sm">{log.action}</p>
              </div>
              <span className="text-gray-500 text-sm">{log.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default ActivityLogs;
