# News Site Part III

## High Level Objectives

  1. Create a JavaScript module that handles retrieving article data from an API using [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
  2. Integrate the module above into the News Site app.
  3. Slightly refactor the AppNav & ArticleDetails components 

## Initial Setup

You will want to copy over the work you've done in the two previous News Site challenges.  **Be sure to not overwrite the test files in these folder - you want to only copy and paste the component JS files.** The files you'll want to copy to this new codebase are:

 - src/App.js
 - src/components/Article/Article.js
 - src/components/ArticleList/ArticleList.js
 - src/components/ArticleTeaser/ArticleTeaser.js
 - src/components/AppNav/AppNav.js
 - src/pages/HomePage.js
 - src/pages/ArticlePage.js

Once you've copied over these files, run ```npm run start``` - verify that no errors appear in your browser console or terminal, and that your app functions the same as it did in the last challenge.

## The News/Article API
So far, the data that drives our News Site has been contained within a static JSON file - `./src/data/news.json`.  We will now begin connecting our front-end to an API/web service that provides news data.  This API is included in this codebase.  When you run ```npm run start```, the React development environment will function as usual. But, we also get a separate web service running on port 3001. For today, there are two endpoints you will use:


1. **http://localhost:3001/api/articles**
  
    This endpoint returns a list of articles. Articles can be filtered by any property through a request parameter called "filter". The value of the filter request parameter should be set to a JSON string that resembles the following (where `FILTEREDKEY` is the key you want to filter an article object by, and `FILTEREDVALUE` is the corresponding value:

    ```javascript
    {
      "where": {
        "FILTEREDKEY": "FILTEREDVALUE"
      }
    }
    ```

    An example of the filter object would look like this:

    ```javascript
    {
      "where": {
        "byline": "By DAVID ZUCCHINO"
      }
    }
    ```

    The URL to the API that corresponds to the example above would look like this: `http://localhost:3001/api/articles?filter={"where":{"byline":"By DAVID ZUCCHINO"}}`

2. **[http://localhost:3001/api/articles/[articleID]](http://localhost:3001/api/articles/1)**

    Individual Article objects can be retrieved with the URL above.  The `articleID` is a number, an corresponds to the unique index of the article as it exists in the database.

## src/api/ArticleAPI.js

The `ArticleAPI.js` JavaScript module's primary function is to handle making requests to the API described in the previous section. This module already contains a few functions that are stubbed out - you must complete them.

The functions are:
- `fetchArticleByID(id)` - given an article ID, returns an Article object with the given ID.
- `fetchArticlesBySection(section)` - returns a list of articles whose `section` attribute matches the section argument.
- `fetchArticles(filters)` - returns a list of articles. The filters argument is optional - if no filters are provided, an array of all the articles are returned. If filters are provided, an array of Articles that meet the criteria are returned. 

For this, we want you use the concept of [fetch and async/await](https://dev.to/shoupn/javascript-fetch-api-and-using-asyncawait-47mp). Here's a basic summary:
- To make API calls to outside resources within your React app, you have to make `fetch` requests
- `fetch` is inheritantly asynchronous (i.e., not synchronous / happening out of order)
- `fetch` returns a Javascript `Promise` object. These `Promise` objects are basically Javascript's immediate response to you, saying "Hey I have received your request. I `Promise` to respond when I can."
- `Promise` objects must be resolved in order to get to the data using the [.then()](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) function built into Javascript 

Here's an example of fetch:
```javascript
function getMovies() {
  fetch('http://example.com/movies.json') // make a request this URL. this returns a Promise object.
    .then(function(response) { // THEN once that's done, take the response, save it as "response" and turn it into JSON
      return response.json();
    })
    .then(function(myJson) { // THEN once that's done, take the JSON you generated, save it as "myJson" and return it
      return myJson;
    });
}
```
`.then` is a big pain because of an issue called callback hell. This is where the Javascript maintainers created `async/await`. Here's that same code as above, but using `async/await`:

```javascript
async function getMovies() 
{
  let response = await fetch('http://example.com/movies.json');
  let data = await response.json()
  return data;
}
```
Here, we are declaring `getMovies` as an asynchronous function. When it's called, it `await`'s the completion of the `fetch` request and saves the result to `response`. 

At that point, it moves to the next line. It again `await`'s the completion of the `.json()` method and saves the result to `data`. Finally, it returns `data` to the user.

A Unit Test that asserts this functionality can be found alongside `ArticleAPI.js` - it's named `ArticleAPI.test.js`.

**Success Criteria:**  If ArticleAPI's unit tests succeed (the tests in `ArticleAPI.test.js`), you are done.

Note:  Other tests may currently be failing - you can ignore these for now.  After running `npm run test`, you can have the test runner ignore these files, also.  Use the 'p' option to filter tests by a regex pattern - enter `ArticleAPI`.

## Integrating ArticleAPI.js into your App
At the moment, there are two components that use Article data:
- `src/pages/HomePage`
- `src/pages/ArticlePage`.=

In these components, we're importing the `src/data/news.json` (which contains an array of Articles) and either passing it down directly (in the case of `HomePage.js`) or taking an Article out of the array and passing it down (in the case of `ArticlePage.js`).  Let's modify these pages to use data from the API instead.

We're going to use a [React Lifecycle](https://blog.bitsrc.io/react-16-lifecycle-methods-how-and-when-to-use-them-f4ad31fb2282) method called `componentDidMount`. Whenever we use a lifecycle method, we recommend that you use a class. Typically API calls are made in the `componentDidMount` method. Example:

```javascript
class Component extends React.Component {
  state = {
    someDataFromAnAPI: null
  }

  async componentDidMount() {
    let jsonResponse = await CallAPI()
    this.setState({
      someDataFromAnAPI: jsonResponse
    })
  }

  render() {
    return <ChildComponent data={this.state.someDataFromAnAPI} />
  }
}
```

We start with state containing a null value for the `someDataFromAnAPI` key. In `async componentDidMount` lifecycle method (i.e., once the component actually mounts onto the DOM), we're telling React that we're about to run an asynchronous method (`CallAPI()`). We `await` for `CallAPI()` to finish before setting it to `jsonResponse` and then setting our Component's state. 

Calling `this.setState` triggers the rendering process - at this point, `render()` is called again.  Subsequently, the ChildComponent contained within the `render()` function re-renders - it's **data** prop is set to `this.state.someDataFromAnAPI`, which now contains the data that was returned from the API/Web Service - which then is, presumably, used to render content.

You will want to follow this pattern within `src/pages/HomePage.js` and `src/pages/ArticlePage.js` and remove references in these files to `src/data/news.json`

**Success Criteria:**  `HomePage.js` and `ArticlePage.js` should utilize the `ArticleAPI.js` module to fetch data from  `ArticleAPI.js`, and then display that data.

** Hint: Careful with where the image lives on the `article` object **

## Refactoring!

Programming is iterative - changes happen.  Ways to simplify our app have been idenfified, and it is up to you to implement these changes.

**Refactoring Success Criteria:**  Unit tests have already been reconfigured to account for these changes.  Once you've completed them successfully, all unit tests should pass.  In addition, ensure that no ESLint warnings appear in your browser console (they will appear with a yellow background). 

**1. AppNav Component & Section Data**

At the moment, the data that determines what appears in the main navigation is contained with App.js's state. Your product managers have decided that the news sections that we present on the site will never change - that said, we can remove this data from `App.js`'s state, move the data into a JSON file in our codebase, and import it directly into `AppNav.js`.

The JSON file has already been created - `src/config/sections.json`.

  1. Import `src/config/sections.json` into `AppNav.js` and use it to construct the navigation, and remove 
  2. The `navItems` object in `App.js`'s state is no longer needed, and that's the only piece of data in state.  That said, we can remove `App.js`'s constructor entirely.

**2. ArticleTeaser Link**
At the moment, we're passing down a callback function from `HomePage.js` to `ArticleList.js` to `ArticleTeaser.js` that handles redirection when the title in ArticleTeaser is clicked.  This logic was overly and unnecessarily complicated.

Instead, we can just utilize React Router's [Link](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/api/Link.md) component in `ArticleTeaser.js`.  Using this, we can remove the callback function that's set in HomePage.js and passed down to ArticleList.js - remove these.
