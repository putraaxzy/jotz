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
        <p className="text-gray-700">Memuat sesi...</p>
      </div>
    );
  }

  if (error && error.includes("Session not found or expired")) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <Link href="/" className="text-indigo-600 hover:underline">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto rounded-lg shadow-xl p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <span>Sesi: {sessionName}</span>{" "}
            <span className="text-indigo-600">👻</span>
          </h1>
          <Link
            href="/"
            className="text-indigo-600 hover:underline flex items-center space-x-1"
          >
            <span className="text-lg">←</span> <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-3 px-6 text-lg font-medium ${
              activeTab === "notes"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("notes")}
          >
            Catatan
          </button>
          <button
            className={`py-3 px-6 text-lg font-medium ${
              activeTab === "files"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("files")}
          >
            Berkas
          </button>
        </div>

        {/* Notes Section */}
        {activeTab === "notes" && (
          <section className="mb-10 p-6 bg-indigo-50 rounded-lg shadow-inner border border-indigo-200">
            <h2 className="text-2xl font-semibold text-indigo-800 mb-5 flex items-center space-x-2">
              <FaPlus className="text-indigo-600" /> <span>Catatan</span>
            </h2>
            <form
              onSubmit={handleCreateNote}
              className="mb-8 p-5 border border-indigo-300 rounded-md bg-white shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="md:col-span-2">
                <h3 className="text-xl font-medium text-gray-800 mb-3">
                  Buat Catatan Baru
                </h3>
              </div>
              <input
                type="text"
                placeholder="Judul (opsional)"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
              />
              <textarea
                placeholder="Konten (opsional)"
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
              ></textarea>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center space-x-2 transition-colors duration-200"
                >
                  <FaPlus /> <span>Tambah Catatan</span>
                </button>
              </div>
            </form>

            <div className="space-y-6">
              {notes.length === 0 ? (
                <p className="text-gray-600 text-center py-4">
                  Belum ada catatan. Buat satu di atas!
                </p>
              ) : (
                notes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center"
                  >
                    <div className="mb-3 md:mb-0">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {note.title || "Catatan Tanpa Judul"}
                      </h3>
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {note.content}
                      </p>
                      <p className="text-sm text-gray-500 mt-3">
                        Dibuat:{" "}
                        {new Date(note.created_at).toLocaleString("id-ID")}
                      </p>
                      <p className="text-sm text-gray-500">
                        Terakhir Diperbarui:{" "}
                        {new Date(note.updated_at).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="flex space-x-3 mt-4 md:mt-0">
                      <button
                        onClick={() => handleOpenNoteDetail(note)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2 transition-colors duration-200"
                      >
                        <FaEdit /> <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center space-x-2 transition-colors duration-200"
                      >
                        <FaTrash /> <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* Files Section */}
        {activeTab === "files" && (
          <section className="p-6 bg-green-50 rounded-lg shadow-inner border border-green-200">
            <h2 className="text-2xl font-semibold text-green-800 mb-5 flex items-center space-x-2">
              <FaUpload className="text-green-600" /> <span>Berkas</span>
            </h2>
            <form
              onSubmit={handleFileUpload}
              className="mb-8 p-5 border border-green-300 rounded-md bg-white shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="md:col-span-2">
                <h3 className="text-xl font-medium text-gray-800 mb-3">
                  Unggah Berkas Baru
                </h3>
              </div>
              <input
                type="file"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-base file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                onChange={(e) =>
                  setSelectedFile(e.target.files ? e.target.files[0] : null)
                }
              />
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center space-x-2 transition-colors duration-200"
                  disabled={!selectedFile}
                >
                  <FaUpload /> <span>Unggah Berkas</span>
                </button>
              </div>
            </form>

            <div className="space-y-6">
              {files.length === 0 ? (
                <p className="text-gray-600 text-center py-4">
                  Belum ada berkas. Unggah satu di atas!
                </p>
              ) : (
                files.map((file) => (
                  <div
                    key={file.id}
                    className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center"
                  >
                    <div className="mb-3 sm:mb-0">
                      <p className="text-lg font-medium text-gray-900">
                        {file.filename}
                      </p>
                      <p className="text-sm text-gray-600">
                        Ukuran: {(file.size / 1024).toFixed(2)} KB
                      </p>
                      <p className="text-sm text-gray-500">
                        Diunggah:{" "}
                        {new Date(file.created_at).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <a
                        href={downloadFileUrl(sessionName, file.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2 transition-colors duration-200"
                      >
                        <FaDownload /> <span>Unduh</span>
                      </a>
                      <button
                        onClick={() => handleDeleteFile(file.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center space-x-2 transition-colors duration-200"
                      >
                        <FaTrash /> <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
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
