import { useState, useEffect } from "react";
import { fetchData } from "../services/apiService";

type Comment = {
  id: number;
  body: string;
  postId: number;
};

const Comments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [postId] = useState<number>(1);

  useEffect(() => {
    fetchData<{ comments: Comment[] }>("comments").then((data) => setComments(data.comments));
  }, []);
  

  const addComment = () => {
    if (newComment.trim() !== "") {
      const comment: Comment = {
        id: Math.floor(Math.random() * 1000), // ID sementara
        body: newComment,
        postId,
      };

      setComments([comment, ...comments]); // Tambahkan ke UI
      setNewComment("");
    }
  };

  const updateComment = (id: number) => {
    const newBody = prompt("Edit comment:", comments.find((c) => c.id === id)?.body || "");
    if (newBody) {
      setComments(
        comments.map((comment) =>
          comment.id === id ? { ...comment, body: newBody } : comment
        )
      );
    }
  };

  const removeComment = (id: number) => {
    setComments(comments.filter((comment) => comment.id !== id));
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold text-center mb-4">Comments</h2>
      <div className="mb-4">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter comment"
        />
       
        <button onClick={addComment} className="mt-2 w-full bg-blue-500 text-white py-2 rounded">
          Add Comment
        </button>
      </div>

      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="flex justify-between bg-white p-3 rounded shadow">
            <span>{comment.body}</span>
            <div className="flex space-x-2">
              <button
                onClick={() => updateComment(comment.id)}
                className="text-yellow-500"
              >
                ✎
              </button>
              <button onClick={() => removeComment(comment.id)} className="text-red-500">
                ✖
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
