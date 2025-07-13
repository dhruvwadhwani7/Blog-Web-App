"use client"
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import { useDispatch, useSelector } from 'react-redux';
import { createBlog, resetStatus } from '../redux/blogSlice';
import 'react-quill-new/dist/quill.snow.css';
import { toast } from 'react-toastify';
import { FaPhotoVideo } from "react-icons/fa"

const BlogForm = () => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector(state => state.blogs);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    media: [],
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = value => {
    setFormData(prev => ({ ...prev, content: value }));
  };

  const handleMediaChange = e => {
    setFormData(prev => ({ ...prev, media: e.target.files }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const plainContent = formData.content.replace(/<[^>]*>/g, '').trim();
    if (!plainContent) {
      toast.error('Blog content cannot be empty!');
      return;
    }
    if (formData.media.length === 0) {
      toast.error('Please upload at least one media file!');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('content', formData.content);
    for (let i = 0; i < formData.media.length; i++) {
      data.append('media', formData.media[i]);
    }

    dispatch(createBlog(data));
  } catch (err) {
    console.error('Submit failed:', err);
  }
};

  useEffect(() => {
  if (success) {
    toast.success('Blog posted successfully!');
    setFormData({
      title: '',
      category: '',
      content: '',
      media: [],
    });
    dispatch(resetStatus());
  }
}, [success, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);


  return (
    <section className="w-full bg-[#fdeeea] py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl mx-auto px-6 py-10 bg-[#fdeeea] rounded-lg"
      >
        <h2 className="text-4xl font-bold text-center mb-5 font-['ui-monospace']">Share Your Thoughts</h2>
        <p className="text-gray-600 text-center italic font-['ui-monospace'] max-w-2xl mx-auto mb-12">
          “ Don’t wait for perfection—just start sharing your thoughts and let your voice be heard.”
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            {/* <label className="block font-light font-avenir">Title *</label> */}
            <input
              type="text"
              name="title"
              placeholder='Enter Your Blog Title Here...'
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-transparent border-b-1 border-gray-500 py-3 px-2 outline-none placeholder:text-gray-500"
              required
            />
          </div>
          <div>
            {/* <label className="block font-light font-avenir">Category *</label> */}
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-transparent border-b-1 border-gray-500 py-3 px-2 outline-none text-gray-700 "
              required
            >
              <option value="" disabled>Select Category</option>
              <option value="business">Business</option>
              <option value="travel">Travel</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="tech">Tech</option>
              <option value="sports">Sports</option>
            </select>
          </div>
        </div>

        <div className="mt-15">
          {/* <label className="block text-gray-700 mb-5 font-light font-avenir">
            Drop Us a Note *
          </label> */}
          <div className=" border bg-transparent outline-none border-gray-500 overflow-hidden text-gray-700">
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={handleContentChange}
              className="  bg-[#fdeeea] h-40 text-gray-700"
              placeholder="Type your thoughts here..."
            />
          </div>
        </div>
        <div className="w-full mt-10">
          <label
            htmlFor="media"
            className="flex items-center justify-center gap-2 border border-dashed border-gray-700    px-4 py-2 cursor-pointer text-sm text-gray-700 hover:bg-gray-100"
          >
            <FaPhotoVideo className="text-orange-600" />
            Pick Media to Upload
          </label>
          <input
            id="media"
            type="file"
            name="media"
            multiple
            accept="image/*,video/*"
            onChange={handleMediaChange}
            className="hidden bg-[#fdeeea]"
          />
          {formData.media.length > 0 && (
    <ul className="mt-3 text-sm text-gray-700 italic list-disc pl-6">
      {Array.from(formData.media).map((file, index) => (
        <li key={index}>{file.name}</li>
      ))}
    </ul>
  )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mx-auto block bg-[#a34122] text-white px-16 py-2 font-semibold hover:bg-[#872e14] transition mt-7"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </section>

  );
};

export default BlogForm;
