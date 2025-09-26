"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSession } from "../lib/api";

export default function HomePage() {
  const [sessionName, setSessionName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCreateOrJoinSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!sessionName.trim()) {
      setError("Nama sesi tidak boleh kosong.");
      setLoading(false);
      return;
    }

    try {
      const response = await createSession(sessionName);
      router.push(`/${response.name}`);
    } catch (err: any) {
      if (err.message.includes("Session name already exists")) {
        router.push(`/${sessionName}`);
      } else {
        setError(err.message || "Gagal membuat atau bergabung sesi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card p-8 rounded-2xl w-full max-w-md relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-lg"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-lg"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-center mb-4 flex items-center justify-center text-force-black">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Jotz</span>
            <span className="ml-2">👻</span>
          </h1>
          <p className="text-center text-force-black mb-8 text-lg font-bold">
            <span>Catatan & Berkas Ephemeral</span>
          </p>

          <form onSubmit={handleCreateOrJoinSession} className="space-y-6">
            <div>
              <label
                htmlFor="sessionName"
                className="block text-sm font-bold text-force-black mb-2"
              >
                Nama Sesi
              </label>
              <input
                type="text"
                id="sessionName"
                className="glass block w-full px-4 py-3 rounded-xl text-force-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base transition-all duration-300"
                placeholder="Masukkan nama sesi"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                disabled={loading}
              />
            </div>
            {error && <p className="text-red-600 dark:text-red-400 text-sm text-center bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">{error}</p>}
            <button
              type="submit"
              className="glass-button w-full flex justify-center py-3 px-4 rounded-xl text-base font-bold text-force-black disabled:opacity-50 transition-all duration-300 hover:scale-105"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Buat atau Gabung Sesi"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
