"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Error al cerrar sesión", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="text-xs px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-rose-500/20 hover:border-rose-500/30 text-slate-300 hover:text-rose-200 transition cursor-pointer flex items-center space-x-1.5 shadow-sm"
    >
      <LogOut className="w-3.5 h-3.5" />
      <span>{loading ? "Cerrando..." : "Cerrar Sesión"}</span>
    </button>
  );
}
