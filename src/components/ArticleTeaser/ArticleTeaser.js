import React, { Component } from 'react';
import { ListGroupItemHeading, ListGroupItemText } from 'reactstrap';

class ArticleTeaser extends Component {
  render() {
    /* Note: the { created_date: createdDate } syntax in this destructure is
        taking the value of created_date from this.props and setting it to
        a new variable called createdDate
    */
    const { id, title, created_date: createdDate, handleTitleClick } = this.props;
    return (
      <div>
        <ListGroupItemHeading>
          <a onClick={(e) => {
            e.preventDefault();
            handleTitleClick(id);
            }}>{title}</a>
        </ListGroupItemHeading>
        <ListGroupItemText>{ createdDate }</ListGroupItemText>
      </div>
    )
  }
}

export default ArticleTeaser;


// Functional solution:
// function ArticleTeaser({ id, title, created_date: createdDate, handleTitleClick }) {
//   return (
//     <div>
//       <ListGroupItemHeading>
//         <a onClick={(e) => {
//           e.preventDefault();
//           handleTitleClick(id);
//         }}>{title}</a>
//       </ListGroupItemHeading>
//       <ListGroupItemText>{createdDate}</ListGroupItemText>
//     </div>
//   );
// }
