import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

const App = () => {
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('/api/v1/posts')
      .then(response => setPosts(response.data))
      .catch(error => console.log(error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/v1/posts', { content })
      .then(response => {
        setPosts([response.data, ...posts]);
        setContent('');
      })
      .catch(error => console.log(error));
  };

  const makePublic = (id) => {
    axios.put(`/api/v1/posts/${id}`)
      .then(response => {
        const updatedPosts = posts.map(post =>
          post.id === id ? { ...post, public: true } : post
        );
        setPosts(updatedPosts);
      })
      .catch(error => console.log(error));
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleSubmit} className="text-center">
        <h1 className="text-4xl font-bold mb-4">Scream Into the Void</h1>
        <textarea
          className="border-2 border-gray-300 p-2 rounded w-80 h-24 mb-4"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Vent to the universe..."
        />
        <br />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Move onward to better things
        </button>
      </form>
      <div>
        {posts.map(post => (
          <div key={post.id}>
            <p>{post.content}</p>
            {!post.public && (
              <button onClick={() => makePublic(post.id)}>Make Public</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <App />,
    document.getElementById('root'),
  );
});
