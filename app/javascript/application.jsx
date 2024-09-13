import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);

  // Fetch posts
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
    <div>
      <h1>Scream Into the Void</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your scream..."
        />
        <button type="submit">Scream</button>
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

export default App;
