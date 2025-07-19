import React from 'react';
import { useParams, Link } from 'react-router-dom';
import blogs from '../../data/blogs.json';

const BlogPost = () => {
  const { id } = useParams();
  const blog = blogs.find(blog => blog.id === parseInt(id));

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
        <Link to="/blog" className="text-primary hover:text-primary-dark">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="section__container bg-primary-light">
        <div className="text-center">
          <div className="inline-block bg-primary text-white px-4 py-2 rounded-full text-sm mb-4">
            {blog.subtitle}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
          <p className="text-gray-600">Published on {blog.date}</p>
        </div>
      </section>

      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <img 
            src={blog.imageUrl} 
            alt={blog.title}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </div>

        <div className="prose max-w-none">
          <div className="text-lg leading-relaxed text-gray-700 space-y-6">
            <p>
              Fashion is more than just clothing—it's a form of self-expression that allows us to 
              communicate our personality, mood, and creativity to the world. In today's ever-evolving 
              fashion landscape, staying current with trends while maintaining your unique style can 
              be both exciting and challenging.
            </p>

            <p>
              Whether you're building a capsule wardrobe, exploring new trends, or looking to refine 
              your personal style, understanding the fundamentals of fashion can help you make 
              confident choices that reflect who you are.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Key Fashion Principles</h2>
            
            <p>
              The foundation of great style lies in understanding what works for your body type, 
              lifestyle, and personal preferences. Here are some timeless principles that can 
              guide your fashion journey:
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Invest in quality basics that can be mixed and matched</li>
              <li>Choose colors that complement your skin tone</li>
              <li>Ensure proper fit—tailoring can make a significant difference</li>
              <li>Accessorize thoughtfully to elevate simple outfits</li>
              <li>Stay true to your personal style while experimenting with trends</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Building Your Wardrobe</h2>
            
            <p>
              Creating a versatile wardrobe doesn't require an enormous budget or countless pieces. 
              Focus on building a collection of well-made, versatile items that can be styled 
              multiple ways. This approach not only saves money but also reduces decision fatigue 
              when getting dressed each day.
            </p>

            <p>
              Remember, fashion should be fun and empowering. Don't be afraid to experiment with 
              new styles, colors, or silhouettes. The best outfit is one that makes you feel 
              confident and comfortable in your own skin.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <Link 
              to="/blog" 
              className="flex items-center text-primary hover:text-primary-dark transition-colors"
            >
              <i className="ri-arrow-left-line mr-2"></i>
              Back to Blog
            </Link>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Share:</span>
              <button className="text-gray-600 hover:text-primary transition-colors">
                <i className="ri-facebook-fill text-xl"></i>
              </button>
              <button className="text-gray-600 hover:text-primary transition-colors">
                <i className="ri-twitter-fill text-xl"></i>
              </button>
              <button className="text-gray-600 hover:text-primary transition-colors">
                <i className="ri-pinterest-fill text-xl"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-8">Related Posts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.filter(b => b.id !== blog.id).slice(0, 2).map((relatedBlog) => (
              <div key={relatedBlog.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src={relatedBlog.imageUrl} 
                  alt={relatedBlog.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h4 className="text-lg font-semibold mb-2">
                    <Link 
                      to={`/blog/${relatedBlog.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {relatedBlog.title}
                    </Link>
                  </h4>
                  <p className="text-gray-600 text-sm">{relatedBlog.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogPost;