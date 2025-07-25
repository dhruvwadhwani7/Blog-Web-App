import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllBlogs } from '../redux/blogSlice';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const BlogHistory = () => {
  const dispatch = useDispatch();
  const { blogs, loading } = useSelector((state) => state.blogs);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 7;

  useEffect(() => {
    dispatch(fetchAllBlogs());
  }, [dispatch]);

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(filteredBlogs.length / postsPerPage);

  return (
    <div  className="p-6 py-10 px-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-3 border border-gray-200 rounded-t-md bg-white shadow space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold">Blog History</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-1.5 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#b4552c]"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto bg-white shadow border border-t-0 border-gray-200">
        <table className="min-w-full shadow-md rounded border border-gray-200 ">
          <thead className="text-black ">
            <tr>
              <th className="px-4 py-2 border-b border-gray-200">Name</th>
              <th className="px-4 py-2 border-b border-gray-200">Title</th>
              <th className="px-4 py-2 border-b border-gray-200">Created At</th>
              <th className="px-4 py-2 border-b border-gray-200">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white text-center">
            {loading ? (
              <tr>
                <td colSpan={4} className="p-4 text-center">Loading...</td>
              </tr>
            ) : currentBlogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center">No blogs found</td>
              </tr>
            ) : (
              currentBlogs.map((blog) => (
                <tr key={blog._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b border-gray-200">{blog.authorId?.name || 'N/A'}</td>
                  <td className="px-4 py-2 border-b border-gray-200">{blog.title}</td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3">
                    <Link
                      to={`/${blog._id}`}
                      className=" text-[#b4552c] px-3 py-1 rounded"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded border text-sm ${
                currentPage === i + 1
                  ? 'bg-[#b4552c] text-white'
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogHistory;
