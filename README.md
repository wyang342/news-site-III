# News Site Part III

## High Level Objectives

 1. Create a JavaScript module that handles retrieving article data from an API using [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
 2. Integrate the module above into the News Site app.
 3. Slightly refactor the Nav & ArticleDetails components 

## Initial Setup

You will want to copy over the work you've done in the two previous News Site challenges.  **Be sure to not overwrite the test files in these folder - you want to only copy and paste the component JS files.** The files you'll want to copy to this new codebase are:

 - src/App.js
 - src/components/Article/Article.js
 - src/components/ArticleList/ArticleList.js
 - src/components/ArticleTeaser/ArticleTeaser.js
 - src/components/Nav/Nav.js
 - src/pages/HomePage.js
 - src/pages/ArticlePage.js

Once you've copied over these files, run ```npm run start``` - verify that no errors appear in your browser console or terminal, and that your app functions the same as it did in the last challenge.

##The News/Article API
So far, the data that drives our News Site has been contained within a static JSON file - ./src/data/news.json.  We will now begin connecting our front-end to an API/web service that provides news data.  This API is included in this codebase.  When you run ```npm run start```, the React development environment will function as usual - this web service will also boot up, though.  For today, there are two endpoints you will use:

**http://localhost:3001/api/articles**
This endpoint returns a list of articles.  Articles can be filtered by any property through a request parameter called "filter".  The value of the filter request parameter should be set to a JSON string that resembles the following (where [filteredkey] is the key you want to filter an article object by, and [filteredvalue] is the corresponding value:

```
{
  "where": {
    "[filteredkey]": "[filteredvalue]"
  }
}
```

A true example of the filter object would look like this:

```
{
  "where": {
    "byline": "By DAVID ZUCCHINO"
  }
}
```
The URL to the API that corresponds to the example above would look like this:  [http://localhost:3001/api/articles/?filter={%22where%22:{%22byline%22:%22By%20ALISON%20SMALE%22}}](http://localhost:3001/api/articles/?filter={%22where%22:{%22byline%22:%22By%20ALISON%20SMALE%22}})

----------
**[http://localhost:3001/api/articles/[articleID]](http://localhost:3001/api/articles/1)**

Individual Article objects can be retrieved with the URL above.  The Article ID is a number, an corresponds to the unique index of the article as it exists in the database.  

##src/api/ArticleAPI.js

The ArticleAPI.js JavaScript module's primary function is to handle making requests to the API described in the previous section.  This module already contains a few functions that are stubbed out - you must complete them.

The functions are:

 - fetchArticleByID(id) - given an article ID, returns a Promise of an Article object with the given ID.  
 - fetchArticles(filters) - returns a list of articles.  The filters argument is optional - if no filters are provided, a Promise of an array of Articles is returned.  If filters are provided, a Promise of Articles that meet the criteria are returned. 
 - fetchArticlesBySection(section) - returns a Promise of a list of articles whose 'section' attribute matches the section argument.

Example usages of ArticleAPI.js (once you complete the functionality described above) are:

    ArticleAPI.fetchArticleByID(1).then(function(article) {
      console.log(article.title) // will print out "Going Home to Falluja, a City Slipping Back Into Turmoil"
      console.log(article.byline) // will print out "By DAVID ZUCCHINO"
    });

    ArticleAPI.fetchArticles().then(function(articles) {
      console.log(articles.length) // will print out 40
      console.log(articles[0].title) // will print out "Going Home to Falluja, a City Slipping Back Into Turmoil"
    });

    ArticleAPI.fetchArticlesBySection('opinion').then(function(articles) {
      console.log(articles[0].title) // will print out "French Farmer Who Aided Migrants Is Given Suspended Fine"
    });

A Unit Test that asserts this functionality can be found alongside ArticleAPI.js - it's named ArticleAPI.test.js.  

**Success Criteria:**  If ArticleAPI's unit tests succeed (the tests in ArticleAPI.test.js), you are done.

Note:  Other tests may currently be failing - you can ignore these for now.  After running ```npm run test```, you can have the test runner ignore these files, also.  Use the 'p' option to filter tests by a regex pattern - enter ArticleAPI.

##Integrating ArticleAPI.js into your App

At the moment, there are two components that use Article data - src/pages/HomePage and src/pages/ArticlePage.  In these components, we're importing the src/data/news.json (which contains an array of Articles) and either passing it down directly (in the case of HomePage.js) or taking an Article out of the array and passing it down (in the case of ArticlePage.js).  Let's modify these pages to use data from the API instead.  

In React, you typically fire calls to APIs in the componentDidMount method.  Example:

    class Component extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          someDataFromAnAPI: null
        }
      }
      componentDidMount() {
        CallAPI().then((apiResponseJSON) => {
          this.setState({
            someDataFromAnAPI: apiResponseJSON
          });
        });
      }
      render() {
        return <ChildComponent data={this.state.someDataFromAnAPI} />
      }
    }

Let's first examine the constructor - here, we're just initializing *this.state*.  State contains a someDataFromAnAPI key.  When the component is initialized, it's null.  

In componentDidMount, we're calling a function (CallAPI()) on an object (similar to ArticleAPI.js) that presumably fires a request to a web service.  CallAPI() returns a promise, which we then attach a callback function to via the then() method.  The callback function inside of the then() method takes the data that's ultimately returned from the web service request, and stores it into *this.state* via this.setState().  

Calling this.setState triggers the rendering process - at this point, render() is called again.  Subsequently, the ChildComponent contained within the render() function re-renders - it's *data* prop is set to this.state.someDataFromAnAPI, which now contains the data that was returned from the API/Web Service - which then is, presumably, used to render content.

You will want to follow this pattern within src/pages/HomePage.js and src/pages/ArticlePage.js and remove references in these files to src/data/news.json

**Success Criteria:**  HomePage.js and ArticlePage.js should utilize the ArticleAPI.js module to fetch data from the Article API, and then display that data.

## Refactoring!

Programming is iterative - changes happen.  Ways to simplify our app have been idenfified, and it is up to you to implement these changes.

**Nav Component & Section Data**

At the moment, the data that determines what appears in the main navigation is contained with App.js's state.  Your product managers have decided that the news sections that we present on the site will never change - that said, we can remove this data from App.js's state, move the data into a JSON file in our codebase, and import it directly into Nav.js.

The JSON file has already been created - src/config/sections.json.  

 1. Import src/config/sections.json into Nav.js and use it to construct the navigation, and remove 
 2. The navItems object in App.js's state is no longer needed, and that's the only piece of data in state.  That said, we can remove App.js's constructor entirely.

**ArticleTeaser Link**
At the moment, we're passing down a callback function from HomePage.js to ArticleList.js to ArticleTeaser.js that handles redirection when the title in ArticleTeaser is clicked.  This logic was overly and unnecessarily complicated.  

Instead, we can just utilize React Router's `<Link>` component in ArticleTeaser.js.  Using this, we can remove the callback function that's set in HomePage.js and passed down to ArticleList.js - remove these.

**Refactoring Success Criteria:**  Unit tests have already been reconfigured to account for these changes.  Once you've completed them successfully, all unit tests should pass.  In addition, ensure that no ESLint warnings appear in your browser console (they will appear with a yellow background). 

## Updates

1) If you're getting an error running ```npm run test```, run ```brew install watchman```.  
2) There was a small bug in src/api/ArticlesAPI.test.js.  This file has been updated in this repo.  If you've already forked this repo, you can simply copy this file from this repo and overwrite the version in your fork.
3) The functions in ArticlesAPI.js should return a value (a Promise, specifically).  An example of this could look something like this:

```
const foo = () => {
  return fetch('https://jsonplaceholder.typicode.com/posts/1')
      .then((response) => response.json())
}

foo().then((json) => console.log(json))
```
4) In the information provided above about how to construct a API 'filter', the filter object that's created is a JavaScript.  When you make a request and want to include this object, you would need to convert it into a string.  JavaScript objects can be converted into strings using [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
