import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/auth-hook";
import { useHttpClient } from "../hooks/http-hook";
import { message, Modal } from "antd";
import LoadingSpinner from "../UIElements/LoadingSpinner";
import "./Form.css";

function Form({ todo, onUpdate }) {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "personal",
    priority: "High",
    dueDate: "",
  });

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title,
        description: todo.description,
        category: todo.category,
        priority: todo.priority,
        dueDate: todo.dueDate,
      });
    }
  }, [todo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_TODOS}/add`,
        "POST",
        JSON.stringify({
          formData,
        }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      );
      navigate(`/todos`);
      message.success("Note Added Successfully!");
    } catch (err) {
      message.error(err.message || "Something went wrong!");
    }

    setFormData({
      title: "",
      description: "",
      category: "personal",
      priority: "High",
      dueDate: "",
    });
  };

  async function handleFormUpdate(event) {
    event.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_TODOS}/update/${todo.id}`,
        "POST",
        JSON.stringify({
          title: formData.title || todo.title,
          description: formData.description || todo.description,
          category: formData.category || todo.category,
          priority: formData.priority || todo.priority,
          dueDate: formData.dueDate || todo.dueDate,
        }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      );
      onUpdate();
      message.success("Updated Successfully!");
    } catch (err) {
      message.error(err.message || "Something went wrong!");
    }

    setFormData({
      title: "",
      description: "",
      category: "personal",
      priority: "High",
      dueDate: "",
    });
  }
  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner asOverlay />}
      {error && (
        <Modal title="An Error Occurred" visible={!!error} onOk={clearError}>
          <p>{error}</p>
        </Modal>
      )}
      <div className="form-box">
        <h2 className="form-box__title">Add Note</h2>
        <form onSubmit={handleSubmit} className="form-box__form">
          <div className="form-box__field">
            <label className="form-box__label">Title: </label>
            <input
              type="text"
              name="title"
              className="form-box__input"
              placeholder="Eg. Shopping..."
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-box__field">
            <label className="form-box__label">Description: </label>
            <textarea
              name="description"
              className="form-box__textarea"
              placeholder="Describe your task..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className="form-box__field">
            <label className="form-box__label">Category: </label>
            <select
              name="category"
              className="form-box__select"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="health">Health</option>
              <option value="education">Education</option>
              <option value="family">Family</option>
              <option value="social">Social</option>
              <option value="leisure">Leisure</option>
            </select>
          </div>
          <div className="form-box__field">
            <label className="form-box__label">Priority: </label>
            <select
              name="priority"
              className="form-box__select"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="form-box__field">
            <label className="form-box__label">Due Date: </label>
            <input
              type="date"
              name="dueDate"
              className="form-box__input"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-box__field">
            <button
              type="submit"
              className="form-box__button"
              onClick={todo ? handleFormUpdate : undefined}
            >
              {todo ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
}

export default Form;
