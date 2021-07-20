import React, { Component, useEffect, useState } from 'react';
import ArticleList from '../components/ArticleList/ArticleList.js';
import { fetchArticles } from '../api/ArticlesAPI';

function HomePage(props) {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const fetchArticlesAsync = async () => {
            const articlesResponse = await fetchArticles();  // needs to be await b/c altho fetchArticles() is async in its definition, we don't know that in HomePage.js
            setArticles(articlesResponse);
        }

        if (articles.length === 0) {
            fetchArticlesAsync();
        }
    }, [articles]);

    return (
        <div>
            <ArticleList articles={articles} />
        </div>
    )
}

export default HomePage;


// Functional solution:
// function HomePage() {
//   return (
//     <div>
//       <ArticleList articles={News}
//         handleTitleClick={(articleID) => props.history.push(`/articles/${articleID}`)} />
//     </div>
//   );
// }
