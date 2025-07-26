import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listBlogs } from '../graphql/queries';
import { useNavigate } from 'react-router-dom';

const client = generateClient();

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await client.graphql({
          query: listBlogs,
          authMode: 'API_KEY',
        });
        const blogsData = res.data.listBlogs.items;
        setBlogs(blogsData || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    })();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      {/* Add Blog Button */}
      <button
        onClick={() => navigate('/create-blog')}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        ➕ Create Blog
      </button>

      <h2 className="text-2xl font-semibold mb-4">📝 Blogs</h2>

      {blogs.length === 0 && <p>No blogs yet.</p>}
      {blogs.map(blog => (
        <div key={blog.id} className="mb-8 p-4 border rounded-lg shadow">
          <h3 className="text-xl font-bold mb-2">{blog.title}</h3>

          {/* Add Post Button */}
          <button
            onClick={() => navigate(`/create-post/${blog.id}`)}
            className="mb-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            ➕ Add Post
          </button>

          {blog.posts && blog.posts.length > 0 ? (
            <ul className="space-y-4">
              {blog.posts.map(post => (
                <li key={post.id} className="border-b pb-2">
                  <h4 className="text-lg font-medium">{post.title}</h4>
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-40 object-cover rounded my-2"
                    />
                  )}
                  <p>{post.content.substring(0, 100)}...</p>
                  <button
                    onClick={() => navigate(`/posts/${post.id}`)}
                    className="mt-2 text-blue-600 hover:underline"
                  >
                    Read More
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No posts yet for this blog.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Blogs;
