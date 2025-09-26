"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  getSessionContent,
  createNote,
  updateNote,
  deleteNote,
  uploadFile,
  deleteFile,
  downloadFileUrl,
  NoteResponse,
  FileResponse,
} from "../../lib/api";
import Link from "next/link";
import { FaEdit, FaTrash, FaDownload, FaUpload, FaPlus } from "react-icons/fa"; // Import icons

export default function SessionPage() {
  const params = useParams();
  const sessionName = params.sessionName as string;

  const [notes, setNotes] = useState<NoteResponse[]>([]);
  const [files, setFiles] = useState<FileResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editingNoteTitle, setEditingNoteTitle] = useState("");
  const [editingNoteContent, setEditingNoteContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<"notes" | "files">("notes"); // State for active tab
  const [showNoteDetailModal, setShowNoteDetailModal] = useState(false);
  const [selectedNoteForDetail, setSelectedNoteForDetail] =
    useState<NoteResponse | null>(null);

  const fetchSessionData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getSessionContent(sessionName);
      setNotes(data.notes);
      setFiles(data.files);
    } catch (err: any) {
      setError(err.message || "Gagal memuat konten sesi.");
    } finally {
      setLoading(false);
    }
  }, [sessionName]);

  useEffect(() => {
    if (sessionName) {
      fetchSessionData();
    }
  }, [sessionName, fetchSessionData]);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!newNoteTitle.trim() && !newNoteContent.trim()) {
      setError("Judul atau konten catatan tidak boleh kosong.");
      return;
    }
    try {
      await createNote(sessionName, newNoteTitle, newNoteContent);
      setNewNoteTitle("");
      setNewNoteContent("");
      fetchSessionData();
    } catch (err: any) {
      setError(err.message || "Gagal membuat catatan.");
    }
  };

  const handleOpenNoteDetail = (note: NoteResponse) => {
    setSelectedNoteForDetail(note);
    setEditingNoteTitle(note.title || "");
    setEditingNoteContent(note.content || "");
    setShowNoteDetailModal(true);
  };

  const handleCloseNoteDetail = () => {
    setShowNoteDetailModal(false);
    setSelectedNoteForDetail(null);
    setEditingNoteTitle("");
    setEditingNoteContent("");
  };

  const handleUpdateNoteInModal = async () => {
    if (!selectedNoteForDetail) return;
    setError("");
    try {
      await updateNote(
        sessionName,
        selectedNoteForDetail.id,
        editingNoteTitle,
        editingNoteContent
      );
      fetchSessionData();
      handleCloseNoteDetail();
    } catch (err: any) {
      setError(err.message || "Gagal memperbarui catatan.");
    }
  };

  const handleUpdateNote = async (noteId: number) => {
    setError("");
    try {
      await updateNote(
        sessionName,
        noteId,
        editingNoteTitle,
        editingNoteContent
      );
      setEditingNoteId(null);
      setEditingNoteTitle("");
      setEditingNoteContent("");
      fetchSessionData();
    } catch (err: any) {
      setError(err.message || "Gagal memperbarui catatan.");
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    setError("");
    if (!confirm("Apakah Anda yakin ingin menghapus catatan ini?")) return;
    try {
      await deleteNote(sessionName, noteId);
      fetchSessionData();
    } catch (err: any) {
      setError(err.message || "Gagal menghapus catatan.");
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!selectedFile) {
      setError("Silakan pilih berkas untuk diunggah.");
      return;
    }
    try {
      await uploadFile(sessionName, selectedFile);
      setSelectedFile(null);
      fetchSessionData();
    } catch (err: any) {
      setError(err.message || "Gagal mengunggah berkas.");
    }
  };

  const handleDeleteFile = async (fileId: number) => {
    setError("");
    if (!confirm("Apakah Anda yakin ingin menghapus berkas ini?")) return;
    try {
      await deleteFile(sessionName, fileId);
      fetchSessionData();
    } catch (err: any) {
      setError(err.message || "Gagal menghapus berkas.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-700 dark:text-slate-300">Memuat sesi...</p>
      </div>
    );
  }

  if (error && error.includes("Session not found or expired")) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</p>
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 hover:underline">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="glass-card mx-auto rounded-2xl p-8 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-8 right-8 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-xl"></div>
          <div className="absolute bottom-8 left-8 w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-xl"></div>
          <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-gradient-to-br from-green-400 to-blue-400 rounded-full blur-lg"></div>
        </div>

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-slate-300/30 dark:border-slate-600/30">
            <h1 className="text-2xl sm:text-3xl font-bold text-force-black flex items-center space-x-2 mb-4 sm:mb-0">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Sesi: {sessionName}</span>
              <span>👻</span>
            </h1>
            <Link
              href="/"
              className="glass-button px-4 py-2 rounded-xl text-force-black hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 flex items-center space-x-2"
            >
              <span className="text-lg">←</span> <span>Kembali ke Beranda</span>
            </Link>
          </div>

          {error && (
            <p className="text-red-600 dark:text-red-400 text-sm mb-6 text-center bg-red-100 dark:bg-red-900/30 p-3 rounded-xl">{error}</p>
          )}

          {/* Tab Navigation */}
          <div className="flex mb-8 glass rounded-xl p-1">
            <button
              className={`flex-1 py-3 px-4 sm:px-6 text-base sm:text-lg font-bold rounded-lg transition-all duration-300 ${
                activeTab === "notes"
                  ? "glass-button text-force-black shadow-lg"
                  : "text-force-black hover:bg-white/10 dark:hover:bg-black/10"
              }`}
              onClick={() => setActiveTab("notes")}
            >
              📝 Catatan
            </button>
            <button
              className={`flex-1 py-3 px-4 sm:px-6 text-base sm:text-lg font-bold rounded-lg transition-all duration-300 ${
                activeTab === "files"
                  ? "glass-button text-force-black shadow-lg"
                  : "text-force-black hover:bg-white/10 dark:hover:bg-black/10"
              }`}
              onClick={() => setActiveTab("files")}
            >
              📁 Berkas
            </button>
          </div>

        {/* Notes Section */}
          {activeTab === "notes" && (
            <section className="space-y-6">
              <div className="glass p-4 sm:p-6 rounded-xl">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-6 flex items-center space-x-2">
                  <FaPlus className="text-indigo-600 dark:text-indigo-400" /> <span>Buat Catatan Baru</span>
                </h2>
                <form onSubmit={handleCreateNote} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Judul (opsional)"
                    className="glass w-full px-4 py-3 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base transition-all duration-300"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                  />
                  <textarea
                    placeholder="Konten (opsional)"
                    rows={4}
                    className="glass w-full px-4 py-3 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base transition-all duration-300 resize-none"
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                  ></textarea>
                  <button
                    type="submit"
                    className="glass-button px-6 py-3 rounded-xl text-slate-800 dark:text-slate-100 font-medium flex items-center space-x-2 transition-all duration-300 hover:scale-105"
                  >
                    <FaPlus /> <span>Tambah Catatan</span>
                  </button>
                </form>
              </div>

              <div className="space-y-4">
                {notes.length === 0 ? (
                  <div className="glass p-6 sm:p-8 rounded-xl text-center">
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                      📝 Belum ada catatan. Buat satu di atas!
                    </p>
                  </div>
                ) : (
                  notes.map((note) => (
                    <div key={note.id} className="glass p-4 sm:p-6 rounded-xl">
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                        <div className="mb-4 lg:mb-0 flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3 break-words">
                            {note.title || "📝 Catatan Tanpa Judul"}
                          </h3>
                          <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed mb-4 break-words">
                            {note.content}
                          </p>
                          <div className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
                            <p>📅 Dibuat: {new Date(note.created_at).toLocaleString("id-ID")}</p>
                            <p>🔄 Diperbarui: {new Date(note.updated_at).toLocaleString("id-ID")}</p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 lg:mt-0 w-full sm:w-auto">
                          <button
                            onClick={() => handleOpenNoteDetail(note)}
                            className="glass-button px-4 py-2 rounded-lg text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 flex items-center justify-center space-x-2"
                          >
                            <FaEdit /> <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="glass-button px-4 py-2 rounded-lg text-slate-800 dark:text-slate-100 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 flex items-center justify-center space-x-2"
                          >
                            <FaTrash /> <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {/* Files Section */}
          {activeTab === "files" && (
            <section className="space-y-6">
              <div className="glass p-4 sm:p-6 rounded-xl">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-6 flex items-center space-x-2">
                  <FaUpload className="text-green-600 dark:text-green-400" /> <span>Unggah Berkas Baru</span>
                </h2>
                <form onSubmit={handleFileUpload} className="space-y-4">
                  <input
                    type="file"
                    className="glass w-full px-4 py-3 rounded-xl text-slate-800 dark:text-slate-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-200 dark:file:bg-slate-700 file:text-slate-700 dark:file:text-slate-200 hover:file:bg-slate-300 dark:hover:file:bg-slate-600 transition-all duration-300"
                    onChange={(e) =>
                      setSelectedFile(e.target.files ? e.target.files[0] : null)
                    }
                  />
                  <button
                    type="submit"
                    className="glass-button px-6 py-3 rounded-xl text-slate-800 dark:text-slate-100 font-medium flex items-center space-x-2 transition-all duration-300 hover:scale-105 disabled:opacity-50"
                    disabled={!selectedFile}
                  >
                    <FaUpload /> <span>Unggah Berkas</span>
                  </button>
                </form>
              </div>

              <div className="space-y-4">
                {files.length === 0 ? (
                  <div className="glass p-6 sm:p-8 rounded-xl text-center">
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                      📁 Belum ada berkas. Unggah satu di atas!
                    </p>
                  </div>
                ) : (
                  files.map((file) => (
                    <div key={file.id} className="glass p-4 sm:p-6 rounded-xl">
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                        <div className="mb-4 lg:mb-0 flex-1 min-w-0">
                          <p className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-2 break-words">
                            📄 {file.filename}
                          </p>
                          <div className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
                            <p>📊 Ukuran: {(file.size / 1024).toFixed(2)} KB</p>
                            <p>📅 Diunggah: {new Date(file.created_at).toLocaleString("id-ID")}</p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                          <a
                            href={downloadFileUrl(sessionName, file.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-button px-4 py-2 rounded-lg text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 flex items-center justify-center space-x-2"
                          >
                            <FaDownload /> <span>Unduh</span>
                          </a>
                          <button
                            onClick={() => handleDeleteFile(file.id)}
                            className="glass-button px-4 py-2 rounded-lg text-slate-800 dark:text-slate-100 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 flex items-center justify-center space-x-2"
                          >
                            <FaTrash /> <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Note Detail Modal */}
      {showNoteDetailModal && selectedNoteForDetail && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Edit Catatan
            </h2>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
              value={editingNoteTitle}
              onChange={(e) => setEditingNoteTitle(e.target.value)}
              placeholder="Judul"
            />
            <textarea
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
              value={editingNoteContent}
              onChange={(e) => setEditingNoteContent(e.target.value)}
              placeholder="Konten"
            ></textarea>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseNoteDetail}
                className="bg-gray-400 text-white px-5 py-2 rounded-md hover:bg-gray-500 transition-colors duration-200"
              >
                Batal
              </button>
              <button
                onClick={handleUpdateNoteInModal}
                className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
