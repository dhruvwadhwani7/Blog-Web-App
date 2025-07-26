import React, { Suspense, lazy } from 'react';
import Loader from '../Components/Loader';

const Banner = lazy(() => import('../Components/Banner'));
const CategoryBoxes = lazy(() => import('../Components/CategoryBoxes'));
const RecentBlogs = lazy(() => import('../Components/RecentBlog'));
const BlogForm = lazy(() => import('../Components/BlogForm'));

const Home = () => {
  return (
    <Suspense fallback={<div><Loader/></div>}>
      <Banner />
      <CategoryBoxes />
      <RecentBlogs />
      <BlogForm />
    </Suspense>
  );
};

export default Home;
