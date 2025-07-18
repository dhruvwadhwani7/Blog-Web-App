import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { deleteBlog, fetchMyBlogs } from '../redux/blogSlice';
import { EllipsisVertical, Heart, Loader2, MessageCircle, Trash2 } from 'lucide-react';
import { Menu } from '@headlessui/react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { getLikeCount, isPostLiked, likePost, unlikePost } from '../redux/likeSlice';
import { fetchCommentsByPost } from '../redux/commentSlice';

const MyBlog = () => {
    const dispatch = useDispatch();
    const { myBlogs } = useSelector(state => state.blogs);
    const { likeCounts, likeStatus } = useSelector((state) => state.likes);
    const postIds = useMemo(() => myBlogs?.map(b => b._id), [myBlogs]);
    const { commentCounts } = useSelector((state) => state.comments);
    useEffect(() => {
        dispatch(fetchMyBlogs());
    }, [dispatch]);
    useEffect(() => {
        if (postIds && postIds.length > 0) {
            postIds.forEach(postId => {
                dispatch(getLikeCount(postId));
                dispatch(isPostLiked(postId));
                dispatch(fetchCommentsByPost(postId))
            });
        }
    }, [dispatch, postIds]);

    const handleLikeToggle = (postId) => {
        if (likeStatus[postId]) {
            dispatch(unlikePost(postId));
        } else {
            dispatch(likePost(postId));
        }
    };
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
                            <Link to={`/${blog._id}`}>
                                <img
                                    src={`http://localhost:5000/${blog.media[0]}`}
                                    alt={blog.title}
                                    className="w-full h-65 object-cover rounded-t"
                                />
                            </Link>
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
                            <Link to={`/${blog._id}`}>
                                <p className="text-xs text-gray-500 mb-1">
                                    {new Date(blog?.createdAt).toLocaleDateString()} • {blog?.category.charAt(0).toUpperCase() + blog?.category.slice(1)}
                                </p>
                                <h2 className="text-lg font-bold text-gray-800 mb-1 italic truncate mt-3">{blog.title}</h2>
                                <p className="text-sm text-gray-600 ">
                                    {getTruncatedText(blog.content, 50)}
                                </p>
                            </Link>
                            <hr className="my-3 border-gray-200 mt-5" />
                            <div className="flex items-center justify-between mt-4 text-gray-500 text-sm">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <span className="flex items-center gap-1">
                                            <MessageCircle className="w-4 h-4" />
                                           <span>{commentCounts[blog._id] || ""}</span>
                                        </span>
                                    </div>
                                </div>
                                <div className="cursor-pointer hover:text-red-500 transition">
                                    <button
                                        onClick={() => handleLikeToggle(blog._id)}
                                        key={blog._id}
                                        className={`flex items-center gap-1 transition-colors cursor-pointer ${likeStatus[blog._id] ? 'text-red-600' : 'text-gray-500'
                                            } hover:text-red-600`}
                                    >
                                        <Heart
                                            className="w-4 h-4 fill-current"
                                            fill={likeStatus[blog._id] ? 'currentColor' : 'none'}
                                        />
                                        <span className='text-gray-600'>{likeCounts[blog._id] ?? 0}</span>
                                    </button>
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