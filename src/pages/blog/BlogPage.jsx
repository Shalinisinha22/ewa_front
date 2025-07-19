import React from 'react';
import { Link } from 'react-router-dom';
import blogs from '../../data/blogs.json';

const BlogPage = () => {
  return (
    <>
      <section className="section__container bg-primary-light">
        <h2 className="section__header">Fashion Blog</h2>
        <p className="section__subheader">
          Discover the latest fashion trends, styling tips, and industry insights from our expert team.
        </p>
      </section>

      <section className="section__container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {blogs.map((blog) => (
            <article key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img 
                  src={blog.imageUrl} 
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm">
                  {blog.subtitle}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-800 hover:text-primary transition-colors">
                  <Link to={`/blog/${blog.id}`}>
                    {blog.title}
                  </Link>
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  Published on {blog.date}
                </p>
                
                <p className="text-gray-700 mb-4 line-clamp-3">
                  Discover the latest trends and styling tips that will elevate your wardrobe 
                  and help you express your unique personal style.
                </p>
                
                <Link 
                  to={`/blog/${blog.id}`}
                  className="inline-flex items-center text-primary hover:text-primary-dark font-medium transition-colors"
                >
                  Read More 
                  <i className="ri-arrow-right-line ml-1"></i>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Featured Categories */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">Blog Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-primary hover:text-white transition-colors cursor-pointer">
              <i className="ri-shirt-line text-2xl mb-2"></i>
              <p className="font-medium">Fashion Trends</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-primary hover:text-white transition-colors cursor-pointer">
              <i className="ri-palette-line text-2xl mb-2"></i>
              <p className="font-medium">Styling Tips</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-primary hover:text-white transition-colors cursor-pointer">
              <i className="ri-star-line text-2xl mb-2"></i>
              <p className="font-medium">Celebrity Style</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-primary hover:text-white transition-colors cursor-pointer">
              <i className="ri-shopping-bag-line text-2xl mb-2"></i>
              <p className="font-medium">Shopping Guides</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogPage;