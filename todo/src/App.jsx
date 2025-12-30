import { useEffect, useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  // Fetch todos
  useEffect(() => {
    fetch("http://localhost:5000/todos")
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);

  
  const addTodo = async () => {
    if (!title) return;

    const res = await fetch("http://localhost:5000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    const newTodo = await res.json();
    setTodos([...todos, newTodo]);
    setTitle("");
  };

  
  const toggleTodo = async (todo) => {
    const res = await fetch(`http://localhost:5000/todos/${todo._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !todo.completed }),
    });

    const updated = await res.json();
    setTodos(todos.map(t => t._id === updated._id ? updated : t));
  };

  // Delete todo
  const deleteTodo = async (id) => {
    await fetch(`http://localhost:5000/todos/${id}`, {
      method: "DELETE",
    });
    setTodos(todos.filter(todo => todo._id !== id));
  };

  return (
    <div className="todo-container">
      <h2>TODO App</h2>

      <div className="input-group">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter todo"
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <ul>
        {todos.map(todo => (
          <li className="todo-item" key={todo._id}>
            <span
              onClick={() => toggleTodo(todo)}
              className={todo.completed ? "completed" : ""}
            >
              {todo.title}
            </span>
            <button onClick={() => deleteTodo(todo._id)}>×</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;