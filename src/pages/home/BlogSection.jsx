import React from 'react';
import { Link } from 'react-router-dom';
import blogs from '../../data/blogs.json';

const BlogSection = () => {
  return (
    <section className="section__container blog__container">
      <h2 className="section__header">Latest From Our Blog</h2>
      <p className="section__subheader mb-12">
        Stay updated with the latest fashion trends, styling tips, and industry insights from our fashion experts.
      </p>

      <div className="blog__grid">
        {blogs.slice(0, 3).map((blog) => (
          <div key={blog.id} className="blog__card">
            <div className="blog__image">
              <img src={blog.imageUrl} alt={blog.title} className="w-full h-48 object-cover" />
            </div>
            <div className="blog__card__content">
              <h6>{blog.subtitle}</h6>
              <h4>{blog.title}</h4>
              <p>{blog.date}</p>
              <Link 
                to={`/blog/${blog.id}`} 
                className="inline-block mt-3 text-primary hover:text-primary-dark font-medium"
              >
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link 
          to="/blog" 
          className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors duration-300"
        >
          View All Posts
        </Link>
      </div>
    </section>
  );
};

export default BlogSection;