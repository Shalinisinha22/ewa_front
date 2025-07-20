import React from 'react';
import { Link } from 'react-router-dom';
import blogs from '../../data/blogs.json';

const BlogSection = () => {
  return (
    <section className="max-w-screen-2xl mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Latest From Our Blog</h2>
        <p className="text-gray-600">
          Stay updated with the latest fashion trends, styling tips, and industry insights from our fashion experts.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {blogs.slice(0, 4).map((blog) => (
          <div key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              <img 
                src={blog.imageUrl} 
                alt={blog.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <p className="text-sm text-primary mb-2">{blog.subtitle}</p>
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">{blog.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{blog.date}</p>
              <Link 
                to={`/blog/${blog.id}`} 
                className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
              >
                Read More 
                <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link 
          to="/blog" 
          className="inline-block px-8 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors duration-300"
        >
          View All Posts
        </Link>
      </div>
    </section>
  );
};

export default BlogSection;