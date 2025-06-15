import { Link, useNavigate } from "react-router-dom";
import "./styles.css";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import React from "react";
import { Picture } from "../Picture";
export const Pictures = (props) => {
  const [pictures, setPictures] = React.useState<Picture[]>([]);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    date: string;
    file: File | null;
  }>({
    name: "",
    description: "",
    date: "",
    file: null,
  });
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/pictures`)
      .then((res) => setPictures(res.data))
      .catch((err) => setError("Failed to fetch pictures"));
  }, []);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        file: e.target.files![0],
      }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const data = new FormData();
    data.append("Name", formData.name);
    data.append("Description", formData.description);
    data.append("Date", formData.date);
    data.append("File", formData.file!);

    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/pictures`,
        data
      );
      setPictures((prev) => [...prev, { id: res.data, name: formData.name }]);
      handleReset(true);
    } catch (err) {
      setError("Upload failed");
    }
  };

  const handleReset = (confirmed = false) => {
    if (!confirmed) {
      if (!window.confirm("Are you sure you want to reset the form?")) return;
    }
    setFormData({ name: "", description: "", date: "", file: null });
    const fileInput = document.getElementById(
      "fileInput"
    ) as HTMLInputElement | null;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const [error, setError] = useState("");
  return (
    <div style={{ padding: "20px" }}>
      <h2>Picture Album</h2>
      <section>
        <h3>Uploaded Pictures</h3>
        <ul>
          {pictures.map((p) => (
            <li key={p.id}>
              {p.id}: {p.name}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Add New Picture</h3>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Picture Name*: </label>
            <input
              name="name"
              value={formData.name}
              maxLength={50}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Date: </label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Description: </label>
            <textarea
              name="description"
              value={formData.description}
              maxLength={250}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Picture Browser*: </label>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>

          <div>
            <button type="submit">Add Picture</button>
            <button type="button" onClick={() => handleReset()}>
              Reset
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
