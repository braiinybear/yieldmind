"use client";

import React from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-5">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-3">
          <a
            href="/admin/dashboard"
            className="block hover:text-gray-300 cursor-pointer"
          >
            Dashboard
          </a>
          <a
            href="/admin/users"
            className="block hover:text-gray-300 cursor-pointer"
          >
            Users
          </a>
          <a
            href="/admin/courses"
            className="block hover:text-gray-300 cursor-pointer"
          >
            Courses
          </a>
          <a
            href="/admin/settings"
            className="block hover:text-gray-300 cursor-pointer"
          >
            Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">{children}</main>
    </div>
  );
}
