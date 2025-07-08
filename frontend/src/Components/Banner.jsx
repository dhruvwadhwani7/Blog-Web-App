import React from 'react';

const Banner = () => {
  return (
    <section className="relative w-full bg-white">
      {/* Grid for 3 Images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <img
          src="./teacup.jpg"
          alt="Workspace"
          className="w-full h-[500px] object-cover"
        />
        <img
          src="/women.jpg"
          alt="Portrait"
          className="w-full h-[500px] object-cover "
        />
        <img
          src="/plant.jpg"
          alt="Plant"
          className="w-full h-[500px] object-cover "
        />
      </div>

      {/* Overlay Title */}
        <div className="absolute  bottom-[-40px]  left-1/2 transform -translate-x-1/2 bg-white px-10 py-4 shadow-xl">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold tracking-wider text-gray-800 text-center">
              Fresh Perspectives
            </h2>
          </div>
    </section>
  );
};

export default Banner;
