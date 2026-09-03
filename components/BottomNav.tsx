"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "首页", icon: "🏠" },
  { href: "/history", label: "历史", icon: "📋" },
];

export default function BottomNav() {
  const pathname = usePathname();

  // 记一笔页隐藏底部栏，改用保存操作条
  if (pathname === "/new") return null;

  return (
    <nav className="tabbar">
      <div className="tabbar-inner">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={`tab-item ${pathname === t.href ? "active" : ""}`}
          >
            <span className="tab-icon">{t.icon}</span>
            {t.label}
          </Link>
        ))}
        <Link href="/new" className="tab-fab" aria-label="记一笔">
          +
        </Link>
      </div>
    </nav>
  );
}
