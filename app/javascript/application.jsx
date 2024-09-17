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

  const getWordFrequencies = (posts) => {
    const wordMap = {};
    const maxLength = 45; 
    // Max word length based on the longest word in the English Dict
  
    posts.forEach(post => {
      const words = post.content.trim().split(/\s+/);
      words.forEach(word => {
        if (word.length <= maxLength) {
          const lowerWord = word.toLowerCase();
          if (wordMap[lowerWord]) {
            wordMap[lowerWord] += 1;
          } else {
            wordMap[lowerWord] = 1;
          }
        }
      });
    });
  
    return Object.keys(wordMap).map(word => ({
      text: word,
      value: wordMap[word],
    }));
  };
  

  const words = getWordFrequencies(submittedPosts);

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

  const COLORS = [
    "#0000FF", "#00FF00", "#FF0000", "#FFFF00", "#FF00FF", "#00FFFF",
    "#000000", "#FF5733", "#C70039", "#900C3F", "#581845", "#5A4FCF"
  ];

  return (
    <div className="h-screen w-full bg-gray-100 flex flex-col items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mt-6">
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

      {/* Word Cloud */}
      <div className="flex-grow w-full mt-6">
        <div className="relative h-full w-full">
          <WordCloud
            words={words}
            options={{
              fontSizes: [10, 80],
              rotations: 2,
              rotationAngles: [-90, 0],
              colors: COLORS,
              enableTooltip: false,
              deterministic: true,
            }}
          />
        </div>
      </div>
    </div>
  );
};

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root');
  const root = createRoot(container);
  root.render(<App />);
});
