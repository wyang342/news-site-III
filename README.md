# News Site Part III

## High Level Objectives

  1. Create a JavaScript module that handles retrieving article data from an API using [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
  2. Integrate the module above into the News Site app using React Component LifeCycle Methods and the `useEffect()` hook.
  3. Slightly refactor the AppNav & ArticleDetails components

## Initial Setup

Again you have a choice to either use the solution code provided in this repo or to copy over your own code from the two previous News Site challenges.  If you choose to use your own code, the files you'll want to copy to this new codebase are:

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

## src/api/ArticlesAPI.js

The `ArticlesAPI.js` JavaScript module's primary function is to handle making requests to the API described in the previous section. This module already contains a few functions that are stubbed out - your job is to complete them.

The functions are:
- `fetchArticleByID(id)` - given an article ID, returns an Article object with the given ID.
- `fetchArticlesBySection(section)` - returns a list of articles whose `section` attribute matches the section argument.
- `fetchArticles(filters)` - returns a list of articles. The filters argument is optional - if no filters are provided, an array of all the articles are returned. If filters are provided, an array of Articles that meet the criteria are returned.

For this, we want you use the concept of [fetch and async/await](https://dev.to/shoupn/javascript-fetch-api-and-using-asyncawait-47mp). Here's a basic summary:
- To make API calls to outside resources within your React app, you have to make `fetch` requests
- `fetch` is inheritantly asynchronous (i.e., not synchronous / happening out of order)
- `fetch` returns a Javascript `Promise` object. These `Promise` objects are basically Javascript's immediate response to you, saying "Hey I have received your request. I `Promise` to respond when I can."
- `Promise` objects must be resolved in order to get to the data using the [.then()](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) function built into Javascript
- Error-handling with `.catch()`: whenever calling out to an API, there is always a possibility of an error occuring. To handle this error on the client-side and give our user proper feedback, we'll tack on a [.catch()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) at the end of our promise chain.

Here's an example of fetch using `.then().catch()`:
```javascript
function getMovies() {
  fetch('http://example.com/movies.json') // make a request this URL. this returns a Promise object.
    .then((response) => { // THEN once that's done, take the response, save it as "response" and turn it into JSON
      return response.json();
    })
    .then((myJson) => { // THEN once that's done, take the JSON you generated, save it as "myJson" and return it
      return myJson;
    })
    .catch((error) => {
      // handle the error - log it? show the user some error message?
    })
}
```
`.then()` is a big pain because of an issue called callback hell. With the release of ES2017, Javascript maintainers introduced `async/await`, which allows developers to write asynchronous code that looks synchronous. Here's our fetch from above written using `async/await`:

```javascript
async function getMovies() {
  try {
    let response = await fetch('http://example.com/movies.json');
    let data = await response.json();
    return data;
  } catch (error) {
    // handle the error
  }
}
```
Here, we are declaring `getMovies` as an asynchronous function (note the `async` before the `function` keyword; the same can be done with an arrow function: `async () => {}`). When it's called, it `await`s the completion of the `fetch` request and saves the result to `response`.

At that point, it moves to the next line. It again `await`s the completion of the `.json()` method and saves the result to `data`. Finally, it returns `data` to the user.

With `async/await` we still need to consider error-handling, so we wrap the fetch in a [try/catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch).

A Unit Test that asserts this functionality can be found alongside `ArticleAPI.js` - it's named `ArticleAPI.test.js`.

**Success Criteria:**  Run `npm run test` to see if ArticlesAPI's unit tests succeed (the tests in `ArticleAPI.test.js`). When they are all passing, you are done with this section.


## Integrating ArticlesAPI.js into your App
At the moment, there are two components that use Article data:
- `src/pages/HomePage`
- `src/pages/ArticlePage`

In these components, we're importing the `src/data/news.json` (which contains an array of Articles) and either passing it down directly (in the case of `HomePage.js`) or taking an Article out of the array and passing it down (in the case of `ArticlePage.js`).  Let's modify these pages to use data from the API instead.

### React and the Virtual DOM
Before we dive into how our page compoments will use our client-side API methods, let's take a quick detour to better understand how React components work. For the sake of time, we'll keep this explanation at a high-level. For a deeper explanation, you can check out this [handy blog post](https://programmingwithmosh.com/react/react-virtual-dom-explained/) about the Virtual DOM. React itself just lightly touches upon the subject in its FAQ [here](https://reactjs.org/docs/faq-internals.html).

The first thing to know is that traditional DOM manipulation is very slow. React quickly gained popularity as a framework because of its speed. Instead of repainting the _entire_ DOM whenever state is changed, React keeps a "virtual" representation of what the UI should look like, and when state changes, it compares the updated "virtual" representation to the actual DOM, identifies the differences, and _only_ updates what has changed.

Since Facebook created React, we'll use their web app as an example. Looking at a facebook user's homepage, it's reasonable to assume that there are different components for stories, newsfeed, chat, etc. If a new story is added to the page, only the stories component needs to know about the state change and update itself and/or its child components accordingly. Or if you scroll down your newsfeed and trigger a new fetch for more posts (via infinite scroll), only the newsfeed component (and/or its child components) needs to update.

### Component Lifecyle Methods
With its initial introduction of the Component class, React baked in [Component Lifecyle Methods](https://programmingwithmosh.com/javascript/react-lifecycle-methods/) (deeper dive [here](https://blog.bitsrc.io/react-16-lifecycle-methods-how-and-when-to-use-them-f4ad31fb2282)). These lifecycle methods are basically the events that occur from the birth of a React component (when it is first mounted on the DOM) to its "death" (when it is unmounted from the DOM). To be clear: Component Lifecycle Methods are only available on React class components - they are methods built into the Component class.

We've actually already been using one of these lifecycle methods, `render()`. `render()` runs when the class component is first mounted on the DOM, and again whenever it is updated.

In order to fetch our articles data and update the component's state, we're going to use another component lifecyle method called `componentDidMount`, which runs only once when the component is initially mounted on the DOM. Typically API calls are made in the `componentDidMount` method. Example:

```javascript
class Component extends React.Component {
  state = {
    someDataFromAnAPI: null
  }

  async componentDidMount() {
    try {
      const jsonResponse = await CallAPI()
      this.setState({
        someDataFromAnAPI: jsonResponse
      });
    } catch (error) {
      console.error('Error occurred fetching data: ', error);
    }
  }

  render() {
    return <ChildComponent data={this.state.someDataFromAnAPI} />
  }
}
```

We start with state containing a null value for the `someDataFromAnAPI` key. In the `async componentDidMount` lifecycle method, we're telling React that we're about to run an asynchronous method (`CallAPI()`). We `await` for `CallAPI()` to finish before setting its resolved response to `jsonResponse` and then setting our Component's state.

Calling `this.setState` triggers the component update process - at this point, `render()` is called again.  Subsequently, the ChildComponent contained within the `render()` function re-renders - it's **data** prop is set to `this.state.someDataFromAnAPI`, which now contains the data that was returned from the API/Web Service - which then is, presumably, used to render content.

You will want to follow this pattern within `src/pages/HomePage.js` and `src/pages/ArticlePage.js` and remove references in these files to `src/data/news.json`.

**Success Criteria:**  `HomePage.js` and `ArticlePage.js` should utilize the `ArticleAPI.js` module to fetch data from  `ArticleAPI.js`, and then display that data.

** Hint: Careful with where the image lives on the `article` object **

### Functional Components and the useEffect() hook
At this point, commit your work and open a new branch for your `functional-version`. Here's where we really start to see the differences between class-based and functional components.

Up until this point, we've only used the `useState()` hook to give our components access to state. Now we'll use the `useEffect()` hook to give our functional component the ability to perform side effects. `useEffect()` serves the same purpose as `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` in React classes, but unified into a single API. According to the [React docs](https://reactjs.org/docs/hooks-effect.html), using the `useEffect()` hook tells React that your component needs to do something after render. React will remember the function you passed (we’ll refer to it as our “effect”), and call it later after performing the DOM updates.

Let's look at the functional version of our above example and then we'll break it down:
```javascript
function Component() {
  const [ someDataFromAnAPI, setSomeDataFromAnAPI ] = React.useState(null);

  React.useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const jsonResponse = await CallAPI();
        setSomeDataFromAnAPI(jsonResponse);
      } catch (error) {
        console.error('Error occurred fetching data: ', error);
      }
    };

    if (someDataFromAnAPI === null) {
      fetchDataAsync();
    }
  }, [someDataFromAnAPI]);

  return <ChildComponent data={someDataFromAnAPI} />

}
```

As we're accustomed to doing, we first use the `useState()` hook to create a piece of state called `someDateFromAnAPI` and instantiate it as `null`.

Then, we use a `useEffect()` hook to tell React what we want to do after our component renders. Notice that `useEffect()` takes two arguments:

1. A function to run after each render.
2. (optional) An array of what pieces of state this function should hook into. By default, `useEffect()` runs your function after every component render. Imagine we had 10 pieces of state in our component -- for this particular `useEffect()`, it is unnecessary to run our function if any of the other 9 pieces of state change; we only care about `someDataFromAnAPI`, so that is what we pass as the second argument.

But why do we have an inner function `fetchDataAsync`?
`useEffect()` cannot be made into an async funtion. Therefore, when fetching data asynchronously, the common pattern is to create an inner `async/await` function, and then call it only if a certain condition is met (in this case, we only call it if we don't have data yet). So the cycle goes: component is mounted and rendered to the DOM --> `useEffect()` is called and sees that we don't have data, so it calls `fetchDataAsync`, which sets the component state --> the component is re-rendered with the updated data --> `useEffect()` is called again, but it sees we have data, so it does nothing.

There are several other use cases for `useEffect()`, but we'll stick to this for now. Using this pattern, go ahead and refactor `HomePage.js` and `ArticlePage.js` as functional components that use the `useEffect()` hook.

## Refactoring!

Programming is iterative - changes happen.  Ways to simplify our app have been idenfified, and it is up to you to implement these changes.

**Refactoring Success Criteria:**  After your refactor, ensure that your app still functions as before. Stretch goal: In addition, ensure that no ESLint warnings appear in your browser console (they will appear with a yellow background).

**1. AppNav Component & Section Data**

At the moment, the data that determines what appears in the main navigation is contained within our `data` directory. Your product managers have decided to slim down the news sections that we present on the site, and your tech lead has decided that these sections don't make sense classified as "data".

A new JSON file has already been created - `src/config/sections.json`.

  1. Import `src/config/sections.json` into `AppNav.js` and use it to construct the navigation, and remove
  2. The `navItems` in `App.js`'s state is no longer needed, and that's the only piece of data in state.  That said, we can remove `App.js`'s constructor entirely.

**2. ArticleTeaser Link**
At the moment, we're passing down a callback function from `HomePage.js` to `ArticleList.js` to `ArticleTeaser.js` that handles redirection when the title in ArticleTeaser is clicked.  This logic was overly and unnecessarily complicated.

Instead, we can just utilize React Router's [Link](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/api/Link.md) component in `ArticleTeaser.js`.  Using this, we can remove the callback function that's set in HomePage.js and passed down to ArticleList.js - remove these.
