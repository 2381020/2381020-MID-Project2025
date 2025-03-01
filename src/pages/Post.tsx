import { useState, useEffect } from "react";
import { fetchData, createData, deleteData, updateData } from "../services/apiService";

// Definisi Interface Post
interface Post {
  id: number;
  title: string;
  body: string;
  userId?: number;
}

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");

  useEffect(() => {
    fetchData<{ posts: Post[] }>("posts").then((data) => setPosts(data.posts));
  }, []);

  const addPost = async () => {
    if (newTitle.trim() !== "" && newBody.trim() !== "") {
      const post = await createData<Post>("posts/add", { title: newTitle, body: newBody, userId: 1 });
      if (post && post.id) {
        setPosts([{ ...post }, ...posts]);
      }
      setNewTitle("");
      setNewBody("");
    }
  };

  const updatePost = async (id: number, title: string, body: string) => {
    const updatedTitle = prompt("Edit title:", title);
    const updatedBody = prompt("Edit body:", body);
    if (updatedTitle !== null && updatedBody !== null && updatedTitle.trim() !== "" && updatedBody.trim() !== "") {
      const updatedPost = await updateData<Post>("posts", id, { title: updatedTitle, body: updatedBody });
      setPosts(posts.map((post) => (post.id === id ? { ...post, title: updatedPost.title, body: updatedPost.body } : post)));
    }
  };

  const removePost = async (id: number) => {
    await deleteData("posts", id);
    setPosts(posts.filter((post) => post.id !== id));
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold text-center mb-4">Posts</h2>
      <div className="mb-4">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Enter post title"
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />
        <textarea
          value={newBody}
          onChange={(e) => setNewBody(e.target.value)}
          placeholder="Enter post body"
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />
        <button onClick={addPost} className="mt-2 w-full bg-blue-500 text-white py-2 rounded">
          Add Post
        </button>
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
