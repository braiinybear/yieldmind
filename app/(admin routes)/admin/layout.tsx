// app/(admin routes)/admin/layout.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  LogOut,
  Menu,
  X,
  Briefcase,
  RefreshCcw,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/enrollments", label: "Enrollments", icon: Users },
  { href: "/admin/hiring", label: "Hiring", icon: Briefcase },
  { href: "/admin/course-updates", label: "Course-Update", icon: RefreshCcw },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get page title and description based on current route
  const getPageTitle = () => {
    switch (true) {
      case pathname === "/admin":
        return {
          title: "Admin Dashboard",
          description: "Manage your platform efficiently",
        };
      case pathname.startsWith("/admin/courses"):
        return { title: "Courses", description: "Manage your courses" };
      case pathname.startsWith("/admin/enrollments"):
        return {
          title: "Enrollments",
          description: "Manage student enrollments",
        };
      case pathname.startsWith("/admin/hiring"):
        return {
          title: "Hiring",
          description: "Manage job postings and applicants",
        };
      default:
        return {
          title: "Admin Dashboard",
          description: "Manage your platform efficiently",
        };
      case pathname.startsWith("/admin/course-updates"):
        return {
          title: "Course Updates",
          description: "Check and update drafted courses before publishing",
        };
    }
  };

  const pageInfo = getPageTitle();

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed */}
      <aside
        className={`${
          isMobile
            ? sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        } fixed md:static md:translate-x-0 h-screen z-50 w-64 bg-linear-to-b from-slate-900 to-slate-800 text-gray-100 flex flex-col transition-transform duration-300 ease-in-out md:transition-none shadow-2xl md:shadow-lg`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700">
          <div className="flex items-center mb-[-30] mt-[-30]">
            <Link href="/">
              <Image
                src="/logo.png"
                height={150}
                width={150}
                alt="YieldMind"
                className="rounded-lg block"
              />
            </Link>
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 md:hidden hover:bg-slate-700 rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 md:px-3 py-2 md:py-3 space-y-1 md:space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (pathname.startsWith(item.href + "/") && item.href !== "/admin");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (isMobile) setSidebarOpen(false);
                }}
                className={`
                  flex items-center gap-3 px-3 md:px-4 py-3 rounded-lg
                  transition-all duration-200 ease-in-out min-h-11 md:min-h-auto
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "text-gray-300 hover:bg-slate-700 hover:text-white"
                  }
                `}
              >
                <Icon size={20} className="shrink-0 md:size-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div className="px-3 py-4 border-t border-slate-700 space-y-3">
          <button onClick={()=>signOut()} className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-red-600/20 hover:text-red-400 rounded-lg transition-all duration-200">
            <LogOut  size={20} className="shrink-0" />
            <span className="text-sm font-medium">Logout</span>
          </button>
          <p className="text-xs text-gray-500 px-2 text-center">
            © {new Date().getFullYear()} YieldMind
          </p>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen w-full md:w-auto overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-3 md:py-4 shadow-sm shrink-0">
          <div className="flex items-center justify-between gap-4">
            {isMobile && !sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
              >
                <Menu size={24} className="text-slate-700" />
              </button>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 truncate">
                {pageInfo.title}
              </h2>
              <p className="text-xs md:text-sm text-slate-500 mt-0.5 md:mt-1 line-clamp-1">
                {pageInfo.description}
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div
          className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8"
          data-lenis-prevent
        >
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
