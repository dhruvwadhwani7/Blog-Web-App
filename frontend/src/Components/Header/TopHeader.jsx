import { FaFacebookF, FaInstagram, FaTwitter, FaPinterest } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';

const TopHeader = () => {
  return (
    <div className="bg-black text-white px-12 py-3 flex justify-between items-center text-sm">
  {/* Left: Search Icon */}
  <div className="flex-1 flex justify-start">
    <FiSearch className="text-xl cursor-pointer hover:text-pink-400 transition-colors" />
  </div>

  {/* Center: Blog Title or Leave Empty to Balance */}
  <div className="flex-1 flex justify-center">
    {/* Optionally put a logo or text here */}
  </div>

  {/* Right: Social Icons */}
  <div className="flex-1 flex justify-end space-x-6">
    <FaFacebookF className="text-lg cursor-pointer hover:text-pink-400 transition-colors" />
    <FaInstagram className="text-lg cursor-pointer hover:text-pink-400 transition-colors" />
    <FaTwitter className="text-lg cursor-pointer hover:text-pink-400 transition-colors" />
    <FaPinterest className="text-lg cursor-pointer hover:text-pink-400 transition-colors" />
  </div>
</div>
  );
};

export default TopHeader;
