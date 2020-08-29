import React, { Component } from 'react';
import ArticleTeaser from '../ArticleTeaser/ArticleTeaser.js';
import { ListGroup, ListGroupItem } from 'reactstrap';

class ArticleList extends Component {
  render() {
    const { articles, handleTitleClick } = this.props;
    return (
      <ListGroup>
        { articles.map((article, index) => (
          <ListGroupItem>
            <ArticleTeaser { ...article } id={ index + 1 }
              handleTitleClick={handleTitleClick}/>
          </ListGroupItem>
        ))}
      </ListGroup>
    );
  }
}

export default ArticleList;


// Functional solution:
// function ArticleList({ articles, handleTitleClick }) {
//   return (
//     <ListGroup>
//       {articles.map((article, index) => (
//         <ListGroupItem>
//           <ArticleTeaser {...article} id={ index + 1 }
//              handleTitleClick={handleTitleClick} />
//         </ListGroupItem>
//       ))}
//     </ListGroup>
//   );
// }
