import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBlogs } from '../redux/blogSlice';
import { MessageCircle, Heart } from 'lucide-react'; // or use any icon lib

const RecentBlogs = () => {
    const dispatch = useDispatch();
    const { blogs, loading } = useSelector((state) => state.blogs);

    useEffect(() => {
        dispatch(fetchAllBlogs());
    }, [dispatch]);

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
                            />
                            <div className="flex flex-col py-4 px-4 justify-between h-full">
                                <div>
                                    <div className="flex items-start gap-3 mb-2">
                                        <img
                                            src={`http://localhost:5000${blog?.authorId?.avatar}`}
                                            alt="Author"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div className="text-gray-600 text-sm ">
                                            <div className="text-black-500 font-light font-avenir">{blog.authorId?.name || 'Unknown'}</div>
                                            <div className="flex items-center gap-2 text-xs mt-1 text-gray-500 font-light font-avenir">
                                                <span>{new Date(blog.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}</span>
                                                <span>•</span>
                                                <span>2 min read</span>
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
                                            {blog.comment?.length || 0} comments
                                        </span>
                                        <button className="hover:text-red-600">
                                            <Heart className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                      <button className="mt-6 px-6 py-3 text-white bg-[#A04F3B] w-full max-w-sm font-semibold text-white transition-all duration-300">
                                Explore More
                            </button>
                </div>
                <div className="bg-[#FAEDE8] relative flex flex-col items-center justify-start py-10 px-4">
                    <div className="bg-[#A04F3B] text-white p-8 w-full max-w-sm">
                        <h2 className="text-[35px]  leading-[1.2] font-serif mb-6 text-center">
                            Join the <br /> Conversation
                        </h2>
                        <form className="space-y-4 py-4 px-2">
                            <div className='mt-6'>
                                <label htmlFor="email" className="text-md font-medium">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="mt-1 w-full px-4 py-2 bg-transparent border-b border-white placeholder-white text-white focus:outline-none"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div className="flex items-start gap-2 mt-8 text-md">
                                <input
                                    type="checkbox"
                                    id="subscribe"
                                    className="w-5 h-5 appearance-none border-2 border-white bg-transparent checked:bg-white checked:border-white focus:outline-none cursor-pointer mt-1"
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
                            <img src="./sport1.jpg" alt="1" className=" w-full h-40 object-cover" />
                            <img src="./teacup.jpg" alt="2" className=" w-full h-40 object-cover" />
                            <img src="./life.jpg" alt="3" className="w-full h-40 object-cover" />
                            <img src="./plant.jpg" alt="4" className=" w-full h-40 object-cover" />
                            <img src="./breakfast.jpg" alt="5" className=" w-full h-40 object-cover" />
                            <img src="./sweet.jpg" alt="6" className="w-full h-40 object-cover" />
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RecentBlogs;
