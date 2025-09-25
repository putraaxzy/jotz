# Proyek Jotz

Proyek ini adalah sebuah API sederhana untuk mengelola sesi, catatan, dan file, dibangun menggunakan kerangka kerja FastAPI dan ORM SQLAlchemy. API ini menyediakan fungsionalitas untuk membuat dan mengelola sesi pengguna, menambahkan catatan ke dalam sesi tertentu, dan menangani unggahan file yang terkait dengan sesi tersebut.

## Fitur Utama

- **Manajemen Sesi**:
  - Membuat sesi baru untuk pengguna.
  - Mengambil detail sesi berdasarkan nama sesi.
  - Menghapus sesi yang sudah tidak diperlukan.
  - Setiap sesi memiliki waktu kedaluwarsa yang dapat dikonfigurasi.
- **Pencatatan (Notes)**:
  - Menambahkan catatan teks ke sesi tertentu.
  - Mengambil semua catatan yang terkait dengan sebuah sesi.
  - Mengambil, memperbarui, dan menghapus catatan individual.
  - Catatan mencakup judul dan konten, serta timestamp pembuatan dan pembaruan.
- **Penanganan File**:
  - Mengunggah file dan mengaitkannya dengan sesi.
  - Mengambil daftar file yang terkait dengan sebuah sesi.
  - Mengunduh dan menghapus file individual.
  - Informasi file yang disimpan meliputi nama file, path, tipe MIME, ukuran, dan waktu unggah.
- **Basis Data SQLite**:
  - Menggunakan SQLite sebagai sistem manajemen basis data yang ringan dan mudah diatur.
  - Skema basis data dikelola oleh SQLAlchemy, yang memungkinkan definisi model Python dipetakan ke tabel basis data.

## Instalasi

Untuk menjalankan proyek ini di lingkungan lokal Anda, ikuti langkah-langkah berikut:

1.  **Kloning Repositori** (jika proyek ini berasal dari repositori Git, jika tidak, pastikan Anda memiliki semua file proyek).
2.  **Masuk ke Direktori Proyek**:
    ```bash
    cd jotz
    ```
3.  **Buat Lingkungan Virtual** (sangat disarankan untuk mengisolasi dependensi proyek):
    ```bash
    python -m venv venv
    ```
4.  **Aktifkan Lingkungan Virtual**:
    - **Untuk Pengguna Windows**:
      ```bash
      .\venv\Scripts\activate
      ```
    - **Untuk Pengguna macOS/Linux**:
      ```bash
      source venv/bin/activate
      ```
5.  **Instal Semua Dependensi Proyek**:
    ```bash
    pip install -r requirements.txt
    ```
    File `requirements.txt` berisi daftar semua pustaka Python yang dibutuhkan, seperti `fastapi`, `uvicorn`, `sqlalchemy`, dan `pydantic`.

## Penggunaan

Untuk menjalankan aplikasi FastAPI setelah instalasi:

1.  **Pastikan Lingkungan Virtual Anda Sudah Aktif.**
2.  **Jalankan Aplikasi Menggunakan Uvicorn**:

    ```bash
    uvicorn main:app --reload
    ```

    - `main:app`: Menunjukkan bahwa aplikasi FastAPI (`app`) berada di dalam file `main.py`.
    - `--reload`: Mengaktifkan fitur _auto-reloading_, yang sangat berguna selama pengembangan karena aplikasi akan otomatis memuat ulang setiap kali ada perubahan pada kode sumber.

3.  **Akses API**:
    - API akan tersedia di alamat `http://127.0.0.1:8000`.
    - Anda dapat mengakses dokumentasi API interaktif (Swagger UI) di `http://127.0.0.1:8000/docs`. Dokumentasi ini secara otomatis dihasilkan oleh FastAPI dan memungkinkan Anda untuk menguji _endpoint_ API langsung dari _browser_.

## Struktur Proyek

Berikut adalah gambaran singkat mengenai struktur direktori dan file utama dalam proyek ini:

- `main.py`: Ini adalah file utama aplikasi FastAPI. Di sinilah semua _endpoint_ API didefinisikan, logika bisnis utama diimplementasikan, dan interaksi dengan basis data serta skema data diatur.
- `models.py`: File ini berisi definisi model basis data menggunakan SQLAlchemy. Setiap kelas dalam file ini merepresentasikan sebuah tabel dalam basis data (misalnya, `SessionModel`, `Note`, `File`) dan mendefinisikan kolom serta relasi antar tabel.
- `schemas.py`: File ini mendefinisikan skema data menggunakan Pydantic. Skema ini digunakan untuk validasi data permintaan (input) dan serialisasi data respons (output) API, memastikan data yang masuk dan keluar sesuai dengan format yang diharapkan.
- `requirements.txt`: Berisi daftar semua pustaka Python pihak ketiga yang diperlukan oleh proyek ini, beserta versi spesifiknya. Ini digunakan oleh `pip` untuk menginstal dependensi.
- `database.db`: Ini adalah file basis data SQLite yang akan secara otomatis dibuat di direktori root proyek saat aplikasi dijalankan untuk pertama kalinya. File ini menyimpan semua data sesi, catatan, dan file.

## Basis Data

Proyek ini memanfaatkan SQLite sebagai basis data relasionalnya. SQLite adalah pilihan yang baik untuk proyek kecil hingga menengah atau untuk pengembangan lokal karena tidak memerlukan server basis data terpisah.

- **Lokasi**: File basis data `database.db` akan dibuat di direktori yang sama dengan file `main.py`.
- **ORM**: SQLAlchemy digunakan sebagai _Object Relational Mapper_ (ORM), yang memungkinkan Anda berinteraksi dengan basis data menggunakan objek Python daripada menulis kueri SQL mentah. Ini menyederhanakan pengembangan dan pemeliharaan kode.
- **Migrasi**: Saat ini, proyek ini tidak menyertakan alat migrasi basis data (seperti Alembic). Perubahan pada model basis data mungkin memerlukan penghapusan `database.db` dan membiarkan aplikasi membuatnya kembali, atau mengelola perubahan skema secara manual.

## Endpoint API (Dugaan)

Berdasarkan analisis file `main.py` dan `schemas.py`, berikut adalah daftar _endpoint_ API yang kemungkinan tersedia:

- **`/sessions`**:

  - `POST /sessions`: Membuat sesi baru.
    - **Request Body**: `SessionCreate` (misalnya, `{"name": "NamaSesiBaru"}`)
    - **Response**: `SessionResponse` (detail sesi yang baru dibuat, termasuk URL)
  - `GET /sessions/{session_name}`: Mengambil detail sesi berdasarkan nama.
    - **Path Parameter**: `session_name` (string)
    - **Response**: `SessionContentResponse` (detail sesi beserta catatan dan file terkait)
  - `DELETE /sessions/{session_name}`: Menghapus sesi berdasarkan nama.
    - **Path Parameter**: `session_name` (string)
    - **Response**: Pesan konfirmasi penghapusan.

- **`/sessions/{session_name}/notes`**:

  - `POST /sessions/{session_name}/notes`: Menambahkan catatan baru ke sesi.
    - **Path Parameter**: `session_name` (string)
    - **Request Body**: `NoteCreate` (misalnya, `{"title": "Judul Catatan", "content": "Isi catatan..."}`)
    - **Response**: `NoteResponse` (detail catatan yang baru dibuat)
  - `GET /sessions/{session_name}/notes`: Mengambil semua catatan untuk sesi tertentu.
    - **Path Parameter**: `session_name` (string)
    - **Response**: `List[NoteResponse]` (daftar catatan)

- **`/sessions/{session_name}/notes/{note_id}`**:

  - `GET /sessions/{session_name}/notes/{note_id}`: Mengambil catatan spesifik dari sesi.
    - **Path Parameters**: `session_name` (string), `note_id` (integer)
    - **Response**: `NoteResponse` (detail catatan)
  - `PUT /sessions/{session_name}/notes/{note_id}`: Memperbarui catatan spesifik dalam sesi.
    - **Path Parameters**: `session_name` (string), `note_id` (integer)
    - **Request Body**: `NoteUpdate` (misalnya, `{"title": "Judul Baru", "content": "Isi baru..."}`)
    - **Response**: `NoteResponse` (detail catatan yang diperbarui)
  - `DELETE /sessions/{session_name}/notes/{note_id}`: Menghapus catatan spesifik dari sesi.
    - **Path Parameters**: `session_name` (string), `note_id` (integer)
    - **Response**: Pesan konfirmasi penghapusan.

- **`/sessions/{session_name}/files`**:

  - `POST /sessions/{session_name}/files`: Mengunggah file ke sesi.
    - **Path Parameter**: `session_name` (string)
    - **Request Body**: `UploadFile` (file yang akan diunggah)
    - **Response**: `FileResponse` (detail file yang diunggah)
  - `GET /sessions/{session_name}/files`: Mengambil semua file untuk sesi tertentu.
    - **Path Parameter**: `session_name` (string)
    - **Response**: `List[FileResponse]` (daftar file)

- **`/sessions/{session_name}/files/{file_id}`**:
  - `GET /sessions/{session_name}/files/{file_id}`: Mengunduh file spesifik dari sesi.
    - **Path Parameters**: `session_name` (string), `file_id` (integer)
    - **Response**: File biner untuk diunduh.
  - `DELETE /sessions/{session_name}/files/{file_id}`: Menghapus file spesifik dari sesi.
    - **Path Parameters**: `session_name` (string), `file_id` (integer)
    - **Response**: Pesan konfirmasi penghapusan.

Mohon merujuk pada file `main.py` untuk definisi _endpoint_ yang lebih akurat dan model permintaan/respons yang tepat, karena daftar ini adalah hasil inferensi.
