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
      const todo = await createData<Todo>("todos/add", { todo: newTodo, completed: false, userId: 1 });
      if (todo && todo.id) {
        setTodos([{ id: todo.id, todo: todo.todo, completed: todo.completed, userId: todo.userId }, ...todos]);
      }
      setNewTodo("");
    }
  };

  const updateTodo = async (id: number, todoText: string) => {
    const updatedText = prompt("Edit todo:", todoText);
    if (updatedText !== null && updatedText.trim() !== "") {
      const updatedTodo = await updateData<Todo>("todos", id, { todo: updatedText });
      setTodos(todos.map((todo) => (todo.id === id ? { ...todo, todo: updatedTodo.todo } : todo)));
    }
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    const updatedTodo = await updateData<Todo>("todos", id, { completed: !completed });
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, completed: updatedTodo.completed } : todo))
    );
  };

  const removeTodo = async (id: number) => {
    await deleteData("todos", id);
    setTodos(todos.filter((todo) => todo.id !== id));
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
