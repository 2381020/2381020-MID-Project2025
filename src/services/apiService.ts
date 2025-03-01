const API_URL = "https://dummyjson.com";

// Fungsi untuk mengambil data
export const fetchData = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(`${API_URL}/${endpoint}`);
  if (!response.ok) throw new Error("Failed to fetch data");
  return response.json();
};

// Fungsi untuk membuat data baru
export const createData = async <T>(endpoint: string, data: object): Promise<T> => {
  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to create data");
  return response.json();
};

// Fungsi untuk memperbarui data
export const updateData = async <T>(endpoint: string, id: number, data: object): Promise<T> => {
  const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
    method: "PUT", // Bisa juga "PATCH"
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to update data");
  return response.json();
};

// Fungsi untuk menghapus data
export const deleteData = async (endpoint: string, id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete data");
};
