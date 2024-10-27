import React, { useState } from "react";
import Form from "../Form/Form";
import Modal from "../UIElements/Modal";
import { useAuth } from "../hooks/auth-hook";
import { useHttpClient } from "../hooks/http-hook";
import { message } from "antd";
import LoadingSpinner from "../UIElements/LoadingSpinner";
import "./Item.css";

function Item(props) {
  const [openModal, setOpenModal] = useState(false);
  const [updateTodo, setUpdateTodo] = useState(null);
  const { token } = useAuth();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [isUpdating, setIsUpdating] = useState(false); // New state for update mode

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setIsUpdating(false); // Reset update mode when closing modal
    setUpdateTodo(null); // Reset the todo when closing
  };

  const handleDelete = async (itemId) => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_TODOS}/delete/${itemId}`,
        "GET",
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      message.success("Deleted Successfully!");
      setOpenModal(false);
    } catch (err) {
      message.error(err.message || "Something went wrong!");
      console.error("Error deleting item:", err);
    }
  };

  const handleUpdateClick = () => {
    setUpdateTodo(props); // Set the current props as the todo to update
    setIsUpdating(true); // Switch to update mode
  };

  const handleUpdateSubmit = () => {
    setOpenModal(false);
    setUpdateTodo(null);
    setIsUpdating(false); // Reset update mode after submitting
  };

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner asOverlay />}
      {error && (
        <Modal title="An Error Occurred" visible={!!error} onOk={clearError}>
          <p>{error}</p>
        </Modal>
      )}

      <Modal
        animation={false}
        show={openModal}
        onCancel={handleCloseModal}
        header={"Choose Your Action"}
        contentClass="modal-content-enhanced"
        footerClass="modal-footer"
        footer={
          <div className="modal-footer-buttons">
            <button onClick={handleCloseModal} className="modal-close-button">
              Close
            </button>
          </div>
        }
      >
        <div className="modal-options">
          {!isUpdating ? (
            <>
              <div className="modal-option-section">
                <h3 className="modal-section-header">Update Note</h3>
                <button
                  onClick={handleUpdateClick}
                  className="modal-button update"
                >
                  Update
                </button>
              </div>
              <div className="modal-option-section">
                <h3 className="modal-section-header">Mark As Completed</h3>
                <button
                  className="modal-button complete"
                  onClick={() => handleDelete(props.id)}
                >
                  Delete
                </button>
              </div>
            </>
          ) : (
            <div className="modal-scrollable-content">
              <Form todo={updateTodo} onUpdate={handleUpdateSubmit} />
            </div>
          )}
        </div>
      </Modal>

      <div className={`item ${props.priority}`} onClick={handleOpenModal}>
        <div className="item-header">
          <img
            src={`./categories/${props.category}.png`}
            alt={`${props.category}`}
          />
          <h3>{props.title}</h3>
        </div>
        <div className="item-description">
          <p>{props.description}</p>
        </div>
        <div className="item-footer">
          <h5>Due Date: {props.dueDate}</h5>
          {props.role === "admin" && <h5>Creator Name: {props.creatorName}</h5>}
        </div>
      </div>
    </React.Fragment>
  );
}

export default Item;
