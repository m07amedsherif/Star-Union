import React, { useState, useEffect } from "react";
import Layout from "./Components/Layout";
import Header from "./Components/Header";
import TodoForm from "./Components/TodoForm";
import TodoList from "./Components/TodoList";
import FilterBar from "./Components/FilterBar";
import EmptyState from "./Components/EmptyState";

export default function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  const [filter, setFilter] = useState("all");

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Add Todo
  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
    };

    setTodos((prev) => [newTodo, ...prev]);
  };

  // Delete Todo
  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  // Toggle Complete
  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  // Filtering Logic
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <Layout>
      <Header />
      <TodoForm onAdd={addTodo} />
      <FilterBar filter={filter} setFilter={setFilter} />

      {filteredTodos.length > 0 ? (
        <TodoList
          todos={filteredTodos}
          onDelete={deleteTodo}
          onToggle={toggleTodo}
        />
      ) : (
        <EmptyState />
      )}
    </Layout>
  );
};