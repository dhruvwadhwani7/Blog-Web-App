import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { updateUser } from '../redux/authSlice';

export default function EditProfileModal({ user, closeModal }) {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        bio: user?.bio || '',
        avatar: null,
        avatarPreview: user?.avatar ? `http://localhost:5000${user.avatar}` : null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'avatar') {
            const file = files[0];
            if (file) {
                setFormData((prev) => ({
                    ...prev,
                    avatar: file,
                    avatarPreview: URL.createObjectURL(file),
                }));
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    console.log(user);

    const handleSubmit = async (e) => {
        e.preventDefault();
         const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
        toast.error('Phone number must be exactly 10 digits');
        return;
    }
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            data.append('bio', formData.bio);
            if (formData.avatar) {
                data.append('avatar', formData.avatar);
            }

            await dispatch(updateUser(data)).unwrap();
            toast.success('Profile updated successfully!');
            closeModal();
        } catch (error) {
            toast.error(error || 'Failed to update profile');
        }
    };


    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-md bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-md p-6 relative">
                <button
                    onClick={closeModal}
                    className="absolute top-3 right-3 text-gray-500 hover:text-black"
                >
                    <X size={20} />
                </button>

                <h2 className="text-3xl  mb-3  text-center  text-gray-800">Edit Profile</h2>
                <p className="text-sx mb-6 text-gray-600 font-light text-center italic  font-avenir">
                    "Update your personal details and customize your profile."
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-16 h-16 rounded-full overflow-hidden border">
                            {formData.avatarPreview ? (
                                <img
                                    src={formData.avatarPreview}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 text-xl font-semibold uppercase">
                                    {formData.name?.[0] || 'U'}
                                </div>
                            )}
                        </div>
                        <label className="text-bold cursor-pointer italic  font-avenir" style={{ color: '#b4552c' }}>
                            Change Profile Picture
                            <input
                                type="file"
                                name="avatar"
                                accept="image/*"
                                onChange={handleChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <div>
                        <label className="block font-light font-avenir mb-3">Name *</label>
                        <input
                            type="text"
                            name="name"
                            className="w-full border-b border-gray-300 focus:outline-none focus:border-[#b4552c] py-1.5 bg-transparent text-sm"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-light font-avenir mb-3">Email *</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full border-b border-gray-300 focus:outline-none focus:border-[#b4552c] py-1.5 bg-transparent text-sm"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-light font-avenir mb-3">Phone *</label>
                        <input
                            type="text"
                            name="phone"
                            className="w-full border-b border-gray-300 focus:outline-none focus:border-[#b4552c] py-1.5 bg-transparent text-sm"
                            value={formData.phone}
                            onChange={handleChange}
                            maxLength={10}
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-light font-avenir mb-3">Bio *</label>
                        <textarea
                            name="bio"
                            className="w-full border-b border-gray-300 focus:outline-none focus:border-[#b4552c] py-1.5 bg-transparent text-sm"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>
                    <button
                        type="submit"
                        style={{ backgroundColor: "#b4552c" }}
                        className="w-full flex justify-center items-center gap-2 text-white py-2 hover:opacity-90 transition"
                    > Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}
