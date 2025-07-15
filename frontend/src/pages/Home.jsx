import React from 'react'
import Banner from '../Components/Banner'
import CategoryBoxes from '../Components/CategoryBoxes'
import BlogForm from '../Components/BlogForm'
import RecentBlogs from '../Components/RecentBlog'

const Home = () => {
  return (
    <div>
        <Banner/>
        <CategoryBoxes/>
        <RecentBlogs/>
        <BlogForm/>
    </div>
  )
}

export default Home