import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import WordCloud from 'react-wordcloud';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [submittedPosts, setSubmittedPosts] = useState([]);

  // Load posts on page load once
  useEffect(() => {
    axios.get('/api/v1/posts')
      .then(response => {
        setPosts(response.data);
        setSubmittedPosts(response.data);
      })
      .catch(error => console.log(error));
  }, []);

  // Words for the word cloud
  const words = submittedPosts.map(post => ({
    text: post.content.trim().split(" ")[0],
    value: 1,
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/v1/posts', { content })
      .then(response => {
        setPosts([response.data, ...posts]);
        setSubmittedPosts([response.data, ...posts]);
        setContent(''); // clear after submit
      })
      .catch(error => console.log(error));
  };

  return (
    <div className="relative h-screen w-full bg-gray-100 flex items-center justify-center">
      {/* Word Cloud Container WIP*/}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-[90%] w-[90%] rounded-full overflow-hidden">
          <WordCloud
            words={words}
            options={{
              fontSizes: [10, 80],
              rotations: 2,
              rotationAngles: [-90, 0],
              colors: ["#0000FF", "#00FF00", "#FF0000"],
              enableTooltip: false,
              deterministic: true,
            }}
          />
        </div>
      </div>
      <div className="relative z-10 bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={handleSubmit} className="text-center">
          <h1 className="text-4xl font-bold mb-4">Scream Into the Void</h1>
          <textarea
            className="border-2 border-gray-300 p-2 rounded w-full h-24 mb-4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Vent to the universe..."
          />
          <br />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Move onward to better things
          </button>
        </form>
      </div>
    </div>
  );
};


document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root');
  const root = createRoot(container);
  root.render(<App />);
});
