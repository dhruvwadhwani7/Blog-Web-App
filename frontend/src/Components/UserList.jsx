import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createUserByAdmin, deleteUser, fetchAllUsers, registerUser } from '../redux/authSlice';
import { FaTrashAlt } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';

const USERS_PER_PAGE = 7;

const UserList = () => {
    const dispatch = useDispatch();
    const { users, loading } = useSelector((state) => state.auth);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
    });

    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    const handleDelete = async (userId) => {
        if (confirm('Are you sure?')) {
            try {
                await dispatch(deleteUser(userId)).unwrap();
                toast.success('User deleted successfully!');
            } catch (err) {
                toast.error('Failed to delete user.');
            }
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            toast.error('Phone number must be exactly 10 digits');
            return;
        }
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        try {
            await dispatch(createUserByAdmin(formData)).unwrap();
            toast.success('User created successfully!');
            setShowModal(false);
            dispatch(fetchAllUsers()); 
        } catch (err) {
            toast.error(err);
        }
    };

    const filteredUsers = users.filter((user) =>
        [user.name, user.email, user.phone]
            .join(' ')
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * USERS_PER_PAGE,
        currentPage * USERS_PER_PAGE
    );

    return (
        <div className="p-6 py-10 px-20">
            <h1 className="text-2xl font-bold flex-1 mb-4">List of All Users</h1>

            <div className="flex flex-wrap items-center justify-between px-6 py-3 border border-gray-200 rounded-t-md gap-4">
                <div className="relative w-full max-w-xs">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#b4552c]"
                    />
                </div>

                <div className="flex-1 flex justify-end">
                    <button
                        className="bg-[#b4552c] text-white px-5 py-2 rounded shadow hover:bg-[#943f1e] transition"
                        onClick={() => setShowModal(true)}
                    >
                        Add User
                    </button>
                </div>
            </div>

            <table className="min-w-full shadow-md rounded border border-gray-200 ">
                <thead className="text-black">
                    <tr>
                        <th className="px-4 py-2 border-b border-gray-200">Name</th>
                        <th className="px-4 py-2 border-b border-gray-200">Email</th>
                        <th className="px-4 py-2 border-b border-gray-200">Phone</th>
                        <th className="px-4 py-2 border-b border-gray-200">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white text-center">
                    {paginatedUsers.length > 0 ? (
                        paginatedUsers.map((user, idx) => (
                            <tr key={idx} className="hover:bg-gray-100 transition duration-200">
                                <td className="px-4 py-2 border-b border-gray-200">{user.name}</td>
                                <td className="px-4 py-2 border-b border-gray-200">{user.email}</td>
                                <td className="px-4 py-2 border-b border-gray-200">{user.phone}</td>
                                <td className="px-4 py-2 border-b border-gray-200">
                                    <button
                                        onClick={() => handleDelete(user._id)}
                                        className="text-[#b4552c] hover:text-red-800 text-center"
                                    >
                                        <FaTrashAlt className="inline-block text-lg" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="py-4 text-gray-500">No users found.</td>
                        </tr>
                    )}
                    {totalPages > 1 && (
                        <tr>
                            <td colSpan="4" className="py-4 text-center">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`mx-1 px-3 py-1 rounded-full border ${currentPage === i + 1
                                            ? 'bg-[#b4552c] text-white font-semibold'
                                            : 'bg-white border-gray-300 text-gray-700'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {showModal && (
                <div className="fixed inset-0 bg-transparent backdrop-blur-md bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mb-150">
                        <h2 className="text-xl font-bold mb-4">Add New User</h2>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="block font-light font-avenir mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border-b border-gray-300 focus:outline-none focus:border-[#b4552c] py-1.5 bg-transparent text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-light font-avenir mb-1">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full border-b border-gray-300 focus:outline-none focus:border-[#b4552c] py-1.5 bg-transparent text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-light font-avenir mb-1">Phone *</label>
                                <div className="flex items-center border-b border-gray-300 focus-within:border-[#b4552c]">
                                    <span className="text-gray-700 px-2 py-1.5 select-none">+91</span>
                                    <input
                                        type="tel"
                                        name="phone"
                                        maxLength={10}
                                        pattern="\d{10}"
                                        title="Phone number must be exactly 10 digits"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full py-1.5 pl-1 bg-transparent focus:outline-none text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-light font-avenir mb-1">Password *</label>
                                <input
                                    type="password"
                                    name="password"
                                    minLength={6}
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full border-b border-gray-300 focus:outline-none focus:border-[#b4552c] py-1.5 bg-transparent text-sm"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-2 mt-5">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border rounded hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#b4552c] text-white rounded hover:bg-[#943f1e]"
                                >
                                    Add
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}
        </div>
    );
};

export default UserList;
