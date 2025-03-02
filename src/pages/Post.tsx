import { useState, useEffect } from "react";
import { fetchData, createData, updateData, deleteData } from "../services/apiService";

// Definisi Interface Post
interface Post {
  id: number;
  title: string;
  body: string;
}

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");

  useEffect(() => {
    fetchData<{ posts: Post[] }>("posts").then((data) => setPosts(data.posts));
  }, []);

  const addPost = async () => {
    if (!newTitle.trim() || !newBody.trim()) return;

    const tempId = Date.now(); // ID sementara
    const newPostItem: Post = { id: tempId, title: newTitle, body: newBody };
    
    setPosts((prev) => [newPostItem, ...prev]);
    setNewTitle("");
    setNewBody("");

    try {
      const postFromAPI = await createData<Post>("posts/add", { title: newTitle, body: newBody });
      setPosts((prev) =>
        prev.map((post) => (post.id === tempId ? { ...post, id: postFromAPI.id } : post))
      );
    } catch (error) {
      console.error("Gagal menambahkan post ke API:", error);
    }
  };

  const updatePost = async (id: number, title: string, body: string) => {
    const updatedTitle = prompt("Edit title:", title);
    const updatedBody = prompt("Edit body:", body);
    if (!updatedTitle || !updatedBody) return;

    const oldPosts = [...posts]; // Simpan state lama sebelum update
    setPosts(posts.map((post) => (post.id === id ? { ...post, title: updatedTitle, body: updatedBody } : post)));

    if (id >= 10 ** 12) return; // Jika ID sementara, update di frontend saja

    try {
      await updateData<Post>("posts", id, { title: updatedTitle, body: updatedBody });
    } catch (error) {
      console.error("Gagal mengupdate post:", error);
      setPosts(oldPosts); // Rollback jika gagal
    }
  };

  const removePost = async (id: number) => {
    console.log("Menghapus post dengan ID:", id);

    // Jika ID sementara, cukup hapus dari state saja
    setPosts((prev) => prev.filter((post) => post.id !== id));
    if (id >= 10 ** 12) return;

    try {
      await deleteData(`posts/${id}`, id);
    } catch (error) {
      console.error("Gagal menghapus post:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold text-center mb-4">Posts</h2>
      <div className="mb-4">
        <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Enter post title" className="w-full p-2 border border-gray-300 rounded mb-2" />
        <textarea value={newBody} onChange={(e) => setNewBody(e.target.value)} placeholder="Enter post body" className="w-full p-2 border border-gray-300 rounded mb-2" />
        <button onClick={addPost} className="mt-2 w-full bg-blue-500 text-white py-2 rounded">Add Post</button>
      </div>
      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="flex flex-col bg-white p-3 rounded shadow">
            <h3 className="font-bold text-lg">{post.title}</h3>
            <p className="text-gray-700">{post.body}</p>
            <div className="flex justify-end space-x-2 mt-2">
              <button onClick={() => updatePost(post.id, post.title, post.body)} className="text-yellow-500">✎</button>
              <button onClick={() => removePost(post.id)} className="text-red-500">✖</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
