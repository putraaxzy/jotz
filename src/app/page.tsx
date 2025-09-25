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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-4 flex items-center justify-center space-x-2">
          <span>Jotz</span> <span className="text-indigo-600">👻</span>
        </h1>
        <p className="text-center text-gray-600 mb-8 text-lg">
          Catatan & Berkas Ephemeral
        </p>

        <form onSubmit={handleCreateOrJoinSession} className="space-y-6">
          <div>
            <label
              htmlFor="sessionName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nama Sesi
            </label>
            <input
              type="text"
              id="sessionName"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
              placeholder="Masukkan nama sesi"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              disabled={loading}
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Buat atau Gabung Sesi"}
          </button>
        </form>
      </div>
    </div>
  );
}
