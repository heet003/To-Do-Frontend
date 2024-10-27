import React, { useState, useEffect } from "react";
import "./Profile.css";
import { useAuth } from "../hooks/auth-hook";
import LoadingSpinner from "../UIElements/LoadingSpinner";
import { useHttpClient } from "../hooks/http-hook";
import { Button, Space, Modal } from "antd";
import { message } from "antd";
import ImageUpload from "../ImageUpload/ImageUpload";
// const { Option } = Select;

function UserProfile() {
  const { token } = useAuth();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    image: "",
  });

  const handleImageInput = (id, file, isValid) => {
    setImageFile(file);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const resData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_USERS}/profile`,
        "GET",
        null,
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      );
      setUser(resData.user);
      setFormData({
        name: resData.user.name,
        bio: resData.user.bio,
        role: resData.user.role,
        email: resData.user.email,
        image: resData.user.image,
      });
    };

    if (token) {
      fetchUserData();
    }
  }, [token, sendRequest]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    formData.image = imageFile;
    const responseData = await sendRequest(
      `${process.env.REACT_APP_BACKEND_USERS}/update-profile`,
      "POST",
      JSON.stringify(formData),
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    );
    message.success({ content: "Profile Updated!", duration: 2 });
    setUser(responseData.user);
    setEditMode(false);
  };

  return (
    <div className="user-profile">
      {isLoading && <LoadingSpinner asOverlay />}
      <Modal
        title={"Error Occurred!"}
        visible={!!error}
        onOk={clearError}
        onCancel={clearError}
      >
        <p>{error}</p>
      </Modal>
      {user && (
        <div className="user-main-body">
          <div className="profile-card">
            {!editMode && (
              <img
                src={
                  formData.image ||
                  "https://bootdey.com/img/Content/avatar/avatar7.png"
                }
                alt="User"
                className="rounded-circle"
                width="150"
              />
            )}
            {editMode && (
              <React.Fragment>
                <ImageUpload
                  id="image"
                  btnText={formData.image ? "Update Image" : "Add Image"}
                  userImage={formData.image}
                  onInput={handleImageInput}
                />
              </React.Fragment>
            )}
            <div className="mt-3">
              <h4>{user.name}</h4>
              <p>{user.bio}</p>
            </div>
          </div>
          <div className="profile-card mb-3">
            <div className="profile-card-body">
              <div className="row">
                <div className="col-sm-3">
                  <h6 className="mb-0">Full Name</h6>
                </div>
                <div className="col-sm-9 text-secondary">{user.name}</div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <h6 className="mb-0">Email</h6>
                </div>
                <div className="col-sm-9 text-secondary">{user.email}</div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <h6 className="mb-0">Bio</h6>
                </div>
                <div className="col-sm-9 text-secondary">{user.bio}</div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-12">
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {editMode && (
            <div className="profile-card mb-3">
              <div className="profile-card-body">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <input
                    type="text"
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <Space>
                  <Button type="primary" size="large" onClick={handleSave}>
                    Save
                  </Button>
                  <Button
                    type="secondary"
                    size="large"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </Button>
                </Space>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UserProfile;
