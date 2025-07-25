import { useParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogById } from '../redux/blogSlice';
import { addComment, fetchCommentsByPost } from '../redux/commentSlice';
import { formatDistanceToNowStrict } from 'date-fns';
import { useState } from 'react';
import { Heart, MessageCircle, SendHorizonal } from 'lucide-react';
import { getLikeCount, isPostLiked, likePost, unlikePost } from '../redux/likeSlice';


const BlogDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [commentText, setCommentText] = useState('');
    const [submitError, setSubmitError] = useState('');
    const { blog, loading } = useSelector((state) => state.blogs);
    const normalizedId = id?.toString();
    const comments = useSelector((state) => state.comments?.commentsByPost?.[normalizedId]) || [];
    const { commentCounts } = useSelector((state) => state.comments);
    const commentsLoading = useSelector((state) => state.comments?.loading);
    const postIds = useMemo(() => blog?._id ?? null, [blog]);
    const { likeCounts, likeStatus } = useSelector((state) => state.likes);
  const { user, token } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getLikeCount(id));
        dispatch(isPostLiked(id));
    }, [dispatch, id]);

    const handleLikeToggle = (id) => {
        if (likeStatus[id]) {
            dispatch(unlikePost(id));
        } else {
            dispatch(likePost(id));
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) {
            setSubmitError("Comment can't be empty");
            return;
        }
        try {
            dispatch(addComment({ postId: id, content: commentText }));
            setCommentText('');
            setSubmitError('');
        } catch (err) {
            setSubmitError('Failed to submit comment');
        }
    };


    useEffect(() => {
        dispatch(fetchBlogById(id));
        dispatch(fetchCommentsByPost(id));
    }, [id, dispatch]);

    if (loading) return <p className="text-center">Loading...</p>;
    if (!blog) return <p className="text-center">Blog not found</p>;
    return (
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
                <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>

                <div className="flex items-center text-sm text-gray-500 mb-6 flex-wrap">
                    <span>By {blog.authorId?.name || 'Unknown'}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    <span className="ml-4 px-2 py-1 bg-blue-100 text-blue-600 rounded">
                        {blog.category}
                    </span>
                </div>
                <img
                    src={`http://localhost:5000/${blog.media[0]}`}
                    alt="Cover"
                    className="w-full h-72 object-cover rounded-lg mb-2"
                />
                <div className='flex gap-5 mb-5'>
                    <button
                        onClick={() => handleLikeToggle(blog._id)}
                        key={blog._id}
                        className={`flex items-center gap-1 cursor-pointer  transition-colors ${likeStatus[blog._id] ? 'text-red-600' : 'text-gray-500'
                            } hover:text-red-600`}
                    >
                        <Heart
                            className="w-4 h-4 fill-current"
                            fill={likeStatus[blog._id] ? 'currentColor' : 'none'}
                        />
                        <span className='text-gray-600'>{likeCounts[blog._id]}</span>
                    </button>
                    <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4 text-gray-600" />
                        <span className='text-gray-600'>{commentCounts[blog._id] || ""}</span>
                    </span>
                </div>
                <div dangerouslySetInnerHTML={{ __html: blog.content }} style={{ fontFamily: "cursive", fontSize: "18px" }}></div>
                <div className='relative'>
                    <div className='max-h-[500px] overflow-y-auto pr-2'>
                        {comments.map((comment) => (
                            <div key={comment._id} className="bg-white p-4 ">
                                <div className="flex items-center gap-3 mb-2">
                                    <img
                                        src={
                                            comment.userId.avatar
                                                ? `http://localhost:5000${comment.userId.avatar}`
                                                : "./avatar.webp"
                                        }
                                        alt={comment.userId.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="text-black-500">
                                            <span className='text-md'>{comment.userId.name}</span>{' '}
                                            <span className='text-xs text-gray-500'>
                                                {formatDistanceToNowStrict(new Date(comment.createdAt), { addSuffix: true }).replace(/^about /, '')}
                                            </span>
                                        </p>
                                        <p className="text-black-800">{comment.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                       {user?.role !== "admin" && (
                    <form
                        onSubmit={handleCommentSubmit}
                        className="mt-4 w-full max-w-3xl bg-white border border-gray-200 rounded-full px-4 py-2 shadow-md flex items-center"
                    >
                        <textarea
                            className="flex-1 resize-none border-none outline-none bg-transparent text-sm px-2 py-1 max-h-20"
                            rows={1}
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..."
                        />
                        <button
                            type="submit"
                            className="ml-2 p-2 text-blue-600 hover:text-blue-800 transition"
                            title="Send"
                        >
                            <SendHorizonal className="w-5 h-5" />
                        </button>
                    </form>
                       )}
                </div>

            </div>
           
            <div className="w-full lg:w-1/3 bg-pink-50 p-6 rounded-lg shadow">
          
                <div className="flex flex-col items-center text-center">
                    {blog?.avatar ? (
                        <img
                            src={`http://localhost:5000${blog?.authorId?.avatar}`}
                            className="w-40 h-45 object-cover mb-4"
                        />
                    ) : (
                        <img
                            src={`./avatar.webp`}
                            alt="Author"
                            className="w-30 h-30 object-cover rounded-full mb-4"
                        />
                    )}
                    <h2 className="text-lg font-semibold mb-2">Thanks for checking out this post!</h2>
                    <p className="text-sm text-gray-700 italic">
                        If you liked it or have something to say, drop a comment below.I’d love to hear what you think.
                        Let’s keep the conversation going — I’m excited to connect with you in the comments!
                    </p>
                </div>
                {user?.role !== "admin" && (
                <div className="bg-[#A04F3B] text-white p-8 w-full max-w-sm mt-15">
                    <h2 className="text-[35px]  leading-[1.2] font-serif mb-6 text-center">
                        Join the <br /> Conversation
                    </h2>
                    <form className="space-y-4 py-4 px-5">
                        <div className='mt-6'>
                            <label htmlFor="email" className="text-md font-medium">
                                Email *
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="mt-1 w-full px-4 py-2 bg-transparent border-b border-white placeholder-white text-white focus:outline-none"
                                placeholder=""
                                required
                            />
                        </div>

                        <div className="flex items-start gap-2 mt-8 text-md">
                            <input
                                type="checkbox"
                                id="subscribe"
                                className="w-4 h-4 appearance-none border-2 border-white bg-transparent checked:bg-white checked:border-white focus:outline-none cursor-pointer mt-1"
                                required
                            />
                            <label htmlFor="subscribe" className="text-white font-light font-avenir text-[18px]">
                                Yes, subscribe me to your newsletter. *
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="bg-white text-[#A04F3B] w-full font-semibold px-6 py-2 hover:bg-gray-100 transition mt-8"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
                )}
            </div>
        </div>
    );
};

export default BlogDetail;
