import React, { Component, useEffect, useState } from 'react';
import Article from '../components/Article/Article.js';
import { fetchArticleByID } from '../api/ArticlesAPI';


function ArticlePage(props) {
    const [article, setArticle] = useState(null);

    useEffect(() => {
        const fetchArticleAsync = async () => {
            const articleID = props.match.params.articleID;
            const article = await fetchArticleByID(articleID);
            setArticle(article);
        }

        if (!article) {
            fetchArticleAsync();
        }
    }, [article]);

    return (
        <div>
            {article ? <Article {...article} /> : <span>404: Article Not Found</span>}
        </div>
    )
}

export default ArticlePage;


// Functional solution:
// function ArticlePage(props) {
//   const articleIndex = props.match.params.articleID - 1;
//   const article = News[articleIndex];
//   const image = article.multimedia.length ? article.multimedia[2].url : null;

//   return (
//     <div>
//       {article ? <Article { ...article } image={ image } /> :
//         <span>404: Article Not Found</span>
//       }
//     </div>
//   );
// }
