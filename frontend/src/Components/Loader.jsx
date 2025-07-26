import React from 'react'

const Loader = () => {
  return (
     <div className="w-screen h-screen fixed top-0 left-0 flex items-center justify-center bg-white z-50">
      <div
        className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#b4552c]"
        role="status"
      />
    </div>
  )
}

export default Loader