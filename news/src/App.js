import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';

const ITEMS_PER_PAGE = 10;

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchNews(`https://newsapi.org/v2/top-headlines?country=us&apiKey=671eacadabdf4b4aa6e1a580ee2c8d5b`);
    const interval = setInterval(() => {
      fetchNews(`https://newsapi.org/v2/top-headlines?country=us&apiKey=671eacadabdf4b4aa6e1a580ee2c8d5b`);
    }, 3600000); 

    return () => clearInterval(interval);
  }, []);

  const fetchNews = async (url) => {
    try {
      setLoading(true);
      const response = await axios.get(url);
      const modifiedArticles = response.data.articles.map(article => ({
        title: article.title,
        description: article.description,
        url: article.url,
        author: article.author,
        publishedAt: article.publishedAt,
        image: article.urlToImage
      }));
      setArticles(modifiedArticles);
    } catch (error) {
      console.log("Error while fetching", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = () => {
    fetchNews(`https://newsapi.org/v2/everything?q=${searchQuery}&apiKey=671eacadabdf4b4aa6e1a580ee2c8d5b`);
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  }

  const renderArticles = () => {
    if (loading) {
      return <div className='loader'>Loading...</div>;
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentArticles = articles.slice(startIndex, endIndex);

    return (
      <div className="articles-container">
        {currentArticles.map((article, index) => (
          <div className="article" key={index}>
            {article.image && <img src={article.image} alt="Article" />}
            <div className="article-details">
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <p><strong>Author:</strong> {article.author}</p>
              <p><strong>Published At:</strong> {article.publishedAt}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer">Read More</a>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className='App'>
     <header className="header">
  <div className="header-content">
    <div className="logo">
      <img src="https://seeklogo.com/images/F/fox-news-logo-35A69D9549-seeklogo.com.png" alt="News Logo" className="logo-img" />
      <h1 className="header-title">Fox news</h1>
    </div>
   
   
  </div>
</header>

      <div className='search-bar'>
        <input
          type="text"
          placeholder='Search here'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {renderArticles()}

      <div className='pagination'>
        {Array.from({ length: Math.ceil(articles.length / ITEMS_PER_PAGE) }).map((_, index) => (
          <button key={index + 1} onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
        ))}
      </div>
    </div>
  );
};

export default App;
