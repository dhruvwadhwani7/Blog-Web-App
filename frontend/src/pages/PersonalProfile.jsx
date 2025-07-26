import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchUserById } from '../redux/authSlice';
import { deleteBlog, fetchBlogsByUserId } from '../redux/blogSlice';
import { EllipsisVertical, Heart, MessageCircle, Trash2 } from 'lucide-react';
import { getLikeCount, isPostLiked, likePost, unlikePost } from '../redux/likeSlice';
import { fetchCommentsByPost } from '../redux/commentSlice';
import { Menu } from '@headlessui/react';
import Loader from '../Components/Loader';

const PersonalProfile = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const { selectedUser: profile, loading } = useSelector((state) => state.auth);
    const { blogsByUser, loading: blogsLoading } = useSelector((state) => state.blogs);
    const { likeCounts, likeStatus } = useSelector((state) => state.likes);
    const postIds = useMemo(() => blogsByUser?.map(b => b._id), [blogsByUser]);
    const { commentCounts } = useSelector((state) => state.comments);
    useEffect(() => {
        if (postIds && postIds.length > 0) {
            postIds.forEach(postId => {
                dispatch(getLikeCount(postId));
                dispatch(isPostLiked(postId));
                dispatch(fetchCommentsByPost(postId))
            });
        }
    }, [dispatch, postIds]);

    useEffect(() => {
        if (id) dispatch(fetchUserById(id));
        dispatch(fetchBlogsByUserId(id));
    }, [id, dispatch]);

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

    if (loading || !profile) return <Loader/>

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-50">
            <div className="relative w-full shadow-lg bg-cover bg-center" style={{ backgroundImage: "url('./profile4.jpg')" }}>
                <div className="bg-black/60 p-8 sm:p-12 flex flex-col sm:flex-row justify-between items-center min-h-[400px]">
                    <div className="text-white max-w-2xl">
                        <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "monospace" }}>
                            Hello {profile?.name?.split(' ')[0]}
                        </h1>
                        <p className="opacity-90 text-lg" style={{ fontFamily: "cursive" }}>
                            Welcome to {profile?.name?.split(' ')[0]}'s blogging space.
                        </p>
                    </div>
                    <div className="relative bg-white rounded-xl shadow-lg pt-16 px-6 pb-6 w-full sm:w-80 mt-8 sm:mt-0 text-center">
                        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2">
                            {profile?.avatar ? (
                                <img
                                    src={`http://localhost:5000${profile?.avatar}`}
                                    alt="Avatar"
                                    className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"

                                />
                            ) : (
                                <img
                                    src={`./avatar.webp`}
                                    alt="Author"
                                    className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                                />
                            )}
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mt-4">{profile?.name}</h2>
                        <p className="mt-4 text-sm text-gray-600 italic">
                            {profile?.bio || 'A passionate blogger sharing ideas with the world.'}
                        </p>
                    </div>
                </div>
            </div>
            <div className="w-full  mt-10 px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogsByUser.map(blog => (
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
        </div>
    );
};

export default PersonalProfile;
