"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { name: "Analytics", path: "/dashboard" },
  { name: "Bot Accounts", path: "/dashboard/bots" },
  { name: "Users", path: "/dashboard/users" },
  { name: "Settings", path: "/dashboard/settings" },
  { name: "Template Store", path: "/dashboard/templates" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r shadow-sm">
      <div className="p-6 text-lg font-semibold">Dashboard</div>

      <nav className="space-y-2 px-4">
        {menu.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`block px-4 py-2 rounded-lg text-sm transition ${
              pathname === item.path
                ? "bg-blue-100 text-blue-600 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}