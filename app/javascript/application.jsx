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

  return (
    <div>
      <h1>Scream Into the Void</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Vent to the universe..."
        />
        <button type="submit">Let it Go</button>
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
