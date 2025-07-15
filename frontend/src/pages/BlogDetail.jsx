import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogById } from '../redux/blogSlice';

const BlogDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { blog, loading } = useSelector((state) => state.blogs);

    useEffect(() => {
        dispatch(fetchBlogById(id));
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
                    className="w-full h-72 object-cover rounded-lg mb-6"
                />
                <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />
            </div>
            <div className="w-full lg:w-1/3 bg-pink-50 p-6 rounded-lg shadow">
                <div className="flex flex-col items-center text-center">
                    <img
                        src={`http://localhost:5000${blog?.authorId?.avatar}`}
                        className="w-40 h-45 object-cover mb-4"
                    />
                    <h2 className="text-lg font-semibold mb-2">Thanks for checking out this post!</h2>
                    <p className="text-sm text-gray-700">
                        If you liked it or have something to say, drop a comment below.I’d love to hear what you think.
                        Let’s keep the conversation going — I’m excited to connect with you in the comments!
                    </p>
                    <button className="mt-4 border border-gray-800 px-4 py-2 rounded hover:bg-gray-800 hover:text-white transition">
                        Read More
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
