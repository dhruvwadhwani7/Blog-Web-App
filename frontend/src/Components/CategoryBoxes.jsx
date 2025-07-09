import React from 'react';
import { ArrowLongRightIcon } from '@heroicons/react/24/outline';


const categories = [
    {
        title: "Business",
        description: "Explore insights, trends, and advice to help grow your business effectively and stay ahead in your field.",
    },
    {
        title: "Lifestyle",
        description: "Get inspired with ideas, routines, and advice to help improve the way you live, work, and relax.",
    },
    {
        title: "Sports",
        description: "Stay updated with stories, highlights, and key moments from the world of sports and competition.",
    },
    {
        title: "Culture",
        description: "Dive into unique perspectives, powerful stories, and evolving trends that shape art, heritage, and culture today.",
    },
    {
        title: "Tech",
        description: "Discover new technologies, tools, and trends that are changing the way we live and work every day.",
    }
];


const CategoryBoxes = () => {
    return (
        <div className="max-w-7xl mx-auto px-6 py-14">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                {categories.map((category, index) => (
                    <div
                        key={index}
                        className="relative group bg-[#f8eee8] px-8 py-10 h-64 border border-white border-gray-300 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-lg flex items-center justify-center"
                    >
                        <div>
                            <h3 className="text-[26px] font-futura text-gray-900 mb-6">
                                {category.title}
                            </h3>
                            <p className="text-[13px] italic text-gray-600">
                                {category.description}
                            </p>
                        </div>
                        <ArrowLongRightIcon
                            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 text-gray-600 w-10 stroke-[1] "
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryBoxes;

