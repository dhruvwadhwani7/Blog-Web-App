import { useState } from "react";

const BlogForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    media: null,
  });

  const categories = ["Travel", "Technology", "Lifestyle", "Education", "Health"];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "media") {
      setFormData({ ...formData, media: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting blog post:", formData);
    // TODO: Handle upload to backend (FormData if media is involved)
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl space-y-4"
    >
      <h2 className="text-2xl font-bold mb-2">Share Your Blog</h2>

      {/* Title */}
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Blog Title"
        className="w-full border px-4 py-2 rounded-md"
        required
      />

      {/* Category */}
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="w-full border px-4 py-2 rounded-md"
        required
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Content */}
      <textarea
        name="content"
        value={formData.content}
        onChange={handleChange}
        placeholder="Write your blog content here..."
        rows={6}
        className="w-full border px-4 py-2 rounded-md"
        required
      ></textarea>

      {/* Image/Video Upload */}
      <input
        type="file"
        name="media"
        accept="image/*,video/*"
        onChange={handleChange}
        className="w-full"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Publish Blog
      </button>
    </form>
  );
};

export default BlogForm;
