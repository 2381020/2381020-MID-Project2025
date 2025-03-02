import { useState, useEffect } from "react";
import { fetchData, createData, deleteData, updateData } from "../services/apiService";

// Definisi Interface Todo
interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId?: number;
}

const Todos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchData<{ todos: Todo[] }>("todos").then((data) => setTodos(data.todos));
  }, []);

  const addTodo = async () => {
    if (newTodo.trim() !== "") {
      const tempId = Date.now(); // ID sementara
      const newTodoItem: Todo = {
        id: tempId,
        todo: newTodo,
        completed: false,
        userId: 1,
      };
  
      setTodos([newTodoItem, ...todos]);
      console.log("Todo sementara ditambahkan:", newTodoItem);
      setNewTodo("");
  
      try {
        const todoFromAPI = await createData<Todo>("todos/add", {
          todo: newTodo,
          completed: false,
          userId: 1,
        });
  
        console.log("Todo berhasil dibuat di API:", todoFromAPI);
  
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === tempId ? { ...todo, id: todoFromAPI.id } : todo
          )
        );
  
        console.log("Todos setelah update ID dari API:", todos);
      } catch (error) {
        console.error("Gagal menambahkan todo ke API:", error);
      }
    }
  };
  
  
  

  const updateTodo = async (id: number, todoText: string) => {
    const updatedText = prompt("Edit todo:", todoText);
    if (updatedText !== null && updatedText.trim() !== "") {
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? { ...todo, todo: updatedText } : todo))
      );
    }
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    console.log("Coba toggle todo, ID:", id, "Status sebelumnya:", completed);
  
    const todo = todos.find((t) => t.id === id);
    if (!todo) {
      console.error("Todo tidak ditemukan di state!");
      return;
    }
  
    if (id >= 10 ** 12) {
      console.log("Todo masih pakai ID sementara, update di frontend saja.");
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
      return;
    }
  
    try {
      console.log("Mengirim request ke API untuk toggle:", id);
      const updatedTodo = await updateData<Todo>("todos", id, { completed: !completed });
  
      console.log("Berhasil update todo di API:", updatedTodo);
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, completed: updatedTodo.completed } : todo
        )
      );
    } catch (error) {
      console.error("Gagal mengubah status todo:", error);
    }
  };
  
  
  
  const removeTodo = async (id: number) => {
    console.log("Menghapus todo dengan ID:", id);
  
    // Hapus langsung dari state untuk ID sementara
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  
    if (id >= 10 ** 12) return; // Jika ID sementara, tidak perlu API call
  
    try {
      await deleteData("todos", id);
    } catch (error) {
      console.error("Gagal menghapus dari API:", error);
    }
  };
  
  
  

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold text-center mb-4">Todos</h2>
      <div className="mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter a new todo"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button onClick={addTodo} className="mt-2 w-full bg-blue-500 text-white py-2 rounded">
          Add Todo
        </button>
      </div>

      <div className="space-y-3">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={`flex justify-between p-3 rounded shadow ${
              todo.completed ? "bg-green-200" : "bg-white"
            }`}
          >
            <span className={todo.completed ? "line-through text-gray-500" : ""}>{todo.todo}</span>
            <div className="flex space-x-2">
              <button onClick={() => toggleTodo(todo.id, todo.completed)} className="text-blue-500">
                {todo.completed ? "🔄" : "✔"}
              </button>
              <button onClick={() => updateTodo(todo.id, todo.todo)} className="text-yellow-500">✎</button>
              <button onClick={() => removeTodo(todo.id)} className="text-red-500">✖</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todos;
