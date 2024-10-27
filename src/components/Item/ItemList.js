import React, { useEffect, useState } from "react";
import Item from "./Item";
import { useAuth } from "../hooks/auth-hook";
import { useHttpClient } from "../hooks/http-hook";
import { message, Modal } from "antd";
import LoadingSpinner from "../UIElements/LoadingSpinner";
import "./Item.css"; // Import the new styles

function ItemList(props) {
  const [data, setData] = useState([
    {
      title: "Buy groceries",
      description: "Milk, bread, eggs, and fruits",
      priority: "High",
      dueDate: "2024-06-10",
      category: "Family",
    },
    {
      title: "Finish project report",
      description: "",
      priority: "Low",
      category: "Work",
      dueDate: "2024-06-15",
    },
  ]);
  const { token, role } = useAuth();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          let responseData = await sendRequest(
            `${process.env.REACT_APP_BACKEND_TODOS}/getTodos`,
            "GET",
            null,
            {
              Authorization: `Bearer ${token}`,
            }
          );
          setData(responseData.notes);
        } catch (err) {
          message.error(err.message || "Something went wrong!");
        }
      }
    };
    if (token) {
      fetchData();
    }
  }, [token, sendRequest]);

  return (
    <div className="list-container">
      {isLoading && (
        <LoadingSpinner className="loading-spinner-overlay" asOverlay />
      )}
      {error && (
        <Modal title="An Error Occurred" visible={!!error} onOk={clearError}>
          <p className="modal-error-message">{error}</p>
        </Modal>
      )}
      {data && data.length > 0 ? (
        data.map((item) => (
          <Item
            className="item"
            key={item._id}
            id={item._id}
            role={role}
            creatorName={item.creatorName}
            title={item.title}
            description={item.description}
            priority={item.priority}
            dueDate={item.dueDate}
            category={item.category}
          />
        ))
      ) : (
        <p className="no-data-message">There are no Notes to show.</p>
      )}
    </div>
  );
}

export default ItemList;
