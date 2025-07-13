import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { deleteBlog, fetchMyBlogs } from '../redux/blogSlice';
import { EllipsisVertical, Loader2, Trash2 } from 'lucide-react';
import { Menu } from '@headlessui/react';
import { toast } from 'react-toastify';

const MyBlog = () => {
    const dispatch = useDispatch();
    const { myBlogs, loading } = useSelector(state => state.blogs);

    useEffect(() => {
        dispatch(fetchMyBlogs());
    }, [dispatch]);

    const handleDelete = (e, id) => {
        e.preventDefault();
        dispatch(deleteBlog(id))
            .unwrap()
            .then(() => {
                toast.success('Blog deleted successfully');
            })
            .catch((err) => {
                toast.error(err || 'Delete failed');
            })
    };

    const getTruncatedText = (html, maxLength = 55) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        const text = div.textContent || div.innerText || '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    console.log(myBlogs);

    return (
        <div className="px-6 md:px-16 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">The Feed</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {myBlogs.map(blog => (
                    <div key={blog._id} className="relative border border-white rounded shadow-xl hover:shadow-md transition">
                        <div className="relative">
                            <img
                                src={`http://localhost:5000/${blog.media[0]}`}
                                alt={blog.title}
                                className="w-full h-65 object-cover rounded-t"
                            />
                            <Menu as="div" className="absolute top-2 right-2 z-10">
                                <Menu.Button className="p-1 rounded-full bg-white/80 hover:bg-white shadow">
                                    <EllipsisVertical className="w-5 h-5 text-gray-700" />
                                </Menu.Button>
                                <Menu.Items className="absolute right-0 mt-2 w-40 bg-white rounded shadow-md focus:outline-none">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={(e) => handleDelete(e, blog._id)}
                                                type="button" 
                                                className={`flex w-full gap-1 items-center px-4 py-2 text-md text-left text-500 ${active ? 'bg-gray-100' : ''
                                                    }`}
                                            >
                                                <Trash2 className="w-4 h-4 text-600" />
                                                Delete Blog
                                            </button>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Menu>
                        </div>
                        <div className="p-4">
                            <p className="text-xs text-gray-500 mb-1">
                                {new Date(blog?.createdAt).toLocaleDateString()} • {blog?.category.charAt(0).toUpperCase() + blog?.category.slice(1)}
                            </p>
                            <h2 className="text-lg font-bold text-gray-800 mb-1 italic truncate mt-3">{blog.title}</h2>
                            <p className="text-sm text-gray-600 ">
                                {getTruncatedText(blog.content, 50)}
                            </p>
                            <hr className="my-3 border-gray-200 mt-5" />
                            <div className="flex items-center justify-between mt-4 text-gray-500 text-sm">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <span>{blog.views || 0}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v9a2 2 0 01-2 2h-2m-3-11H5a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2V9a2 2 0 00-2-2zm-3-5h.01M12 4a1 1 0 00-.883.993L11 5h2a1 1 0 00-.117-1.993L13 3h-1z" />
                                    </svg>
                                    <span>{blog.comments?.length || 0}</span>
                                </div>
                            </div>
                            <div className="cursor-pointer hover:text-red-500 transition">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                        </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default MyBlog