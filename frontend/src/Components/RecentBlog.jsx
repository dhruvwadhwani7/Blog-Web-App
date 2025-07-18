import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBlogs } from '../redux/blogSlice';
import { MessageCircle, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getLikeCount, isPostLiked } from '../redux/likeSlice';
import { fetchCommentsByPost } from '../redux/commentSlice';

const RecentBlogs = () => {
    const dispatch = useDispatch();
    const { blogs, loading } = useSelector((state) => state.blogs);
    const getInitial = (name) => name?.charAt(0).toUpperCase();
    const { likeCounts, likeStatus } = useSelector((state) => state.likes);
    const postIds = useMemo(() => blogs?.map(b => b._id), [blogs]);
    const { commentCounts } = useSelector((state) => state.comments);
      
    useEffect(() => {
        dispatch(fetchAllBlogs());
    }, [dispatch]);

    useEffect(() => {
        if (postIds && postIds.length > 0) {
            postIds.forEach(postId => {
                dispatch(getLikeCount(postId));
                dispatch(isPostLiked(postId));
                  dispatch(fetchCommentsByPost(postId));
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
    
    const recentBlogs = blogs.slice(0, 3);
    const getTruncatedText = (html, maxLength = 150) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        const text = div.textContent || div.innerText || '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <section className=" px-4 md:px-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="flex flex-col gap-6">
                    {recentBlogs.map((blog) => (
                        <div
                            key={blog._id}
                            className="grid grid-cols-1 md:grid-cols-2 bg-white  shadow gap-4 items-start"
                        >
                            <img
                                src={`http://localhost:5000/${blog.media[0]}`}
                                alt={blog.title}
                                className="w-full h-[300px] object-cover "
                                loading="lazy"
                            />
                            <div className="flex flex-col py-4 px-4 justify-between h-full">
                                <div>
                                    <div className="flex items-start gap-3 mb-2">
                                        {blog?.authorId?.avatar ? (
                                            <img
                                                src={`http://localhost:5000${blog?.authorId?.avatar}`}
                                                alt="Author"
                                                className="w-10 h-10 rounded-full object-cover"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <img
                                                src={`./avatar.webp`}
                                                alt="Author"
                                                className="w-11 h-11 rounded-full object-cover"
                                                loading="lazy"
                                            />
                                        )}
                                        <div className="text-gray-600 text-sm ">
                                            <div className="text-black-500 font-light font-avenir">{blog.authorId?.name || 'Unknown'}</div>
                                            <div className="flex items-center gap-2 text-xs mt-1 text-gray-500 font-light font-avenir">
                                                <span>{new Date(blog.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}</span>
                                                <span>•</span>
                                                <span>{blog?.category.charAt(0).toUpperCase() + blog?.category.slice(1)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold mt-5">{blog.title}</h3>
                                    <p className="text-sm text-gray-700 mt-3">
                                        {getTruncatedText(blog.content, 150)}
                                    </p>
                                </div>
                                <div>
                                    <hr className="border-t border-gray-200 my-4" />
                                    <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <MessageCircle className="w-4 h-4" />
                                           <span>{commentCounts[blog._id] || ""}</span>
                                        </span>
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <Link to="/bloglist">
                        <button className="mt-6 px-6 py-3 text-white bg-[#A04F3B] w-full max-w-sm font-semibold text-white transition-all duration-300">
                            Explore More
                        </button>
                    </Link>
                </div>
                <div className="bg-[#FAEDE8] relative flex flex-col items-center justify-start py-10 px-4">
                    <div className="bg-[#A04F3B] text-white p-8 w-full max-w-sm">
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
                    <div>
                        <h2 className="text-2xl font-bold mt-15 text-center font-serif">Discover More Moments</h2>
                        <div className=" p-6 absolute right-0 translate-x-1/4 w-full max-w-4xl relative">
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                                <img src="./sport1.jpg" alt="1" className=" w-full h-40 object-cover" loading="lazy" />
                                <img src="./teacup.jpg" alt="2" className=" w-full h-40 object-cover" loading="lazy" />
                                <img src="./life.jpg" alt="3" className="w-full h-40 object-cover" loading="lazy" />
                                <img src="./plant.jpg" alt="4" className=" w-full h-40 object-cover" loading="lazy" />
                                <img src="./breakfast.jpg" alt="5" className=" w-full h-40 object-cover" loading="lazy" />
                                <img src="./sweet.jpg" alt="6" className="w-full h-40 object-cover" loading="lazy" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RecentBlogs;
