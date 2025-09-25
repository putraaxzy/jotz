export const API_BASE_URL = "https://jotz.ptraazxtt.my.id";

export const createSession = async (name: string) => {
  const response = await fetch(`${API_BASE_URL}/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to create session");
  }
  return response.json();
};

export const getSessionContent = async (sessionName: string) => {
  const response = await fetch(`${API_BASE_URL}/${sessionName}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to fetch session content");
  }
  return response.json();
};

export const createNote = async (
  sessionName: string,
  title: string,
  content: string
) => {
  const response = await fetch(`${API_BASE_URL}/${sessionName}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, content }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to create note");
  }
  return response.json();
};

export const updateNote = async (
  sessionName: string,
  noteId: number,
  title: string,
  content: string
) => {
  const response = await fetch(
    `${API_BASE_URL}/${sessionName}/notes/${noteId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to update note");
  }
  return response.json();
};

export const deleteNote = async (sessionName: string, noteId: number) => {
  const response = await fetch(
    `${API_BASE_URL}/${sessionName}/notes/${noteId}`,
    {
      method: "DELETE",
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to delete note");
  }
  return response.json();
};

export const uploadFile = async (sessionName: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/${sessionName}/files`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to upload file");
  }
  return response.json();
};

export const downloadFileUrl = (sessionName: string, fileId: number) => {
  return `${API_BASE_URL}/${sessionName}/files/${fileId}/download`;
};

export const deleteFile = async (sessionName: string, fileId: number) => {
  const response = await fetch(
    `${API_BASE_URL}/${sessionName}/files/${fileId}`,
    {
      method: "DELETE",
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to delete file");
  }
  return response.json();
};

// Define types based on schemas.py
export interface SessionCreate {
  name: string;
}

export interface SessionResponse {
  name: string;
  url: string;
}

export const getAllActiveSessions = async () => {
  const response = await fetch(`${API_BASE_URL}/sessions`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to fetch active sessions");
  }
  return response.json();
};

export const downloadAllActiveSessionFiles = () => {
  window.open(`${API_BASE_URL}/sessions/active/files/download_all`, "_blank");
};

export interface NoteCreate {
  title?: string;
  content?: string;
}

export interface NoteUpdate {
  title?: string;
  content?: string;
}

export interface NoteResponse {
  id: number;
  title?: string;
  content?: string;
  created_at: string;
  updated_at: string;
}

export interface FileResponse {
  id: number;
  filename: string;
  mimetype?: string;
  size: number;
  created_at: string;
}

export interface SessionContentResponse {
  notes: NoteResponse[];
  files: FileResponse[];
}
