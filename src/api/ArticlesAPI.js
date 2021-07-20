const fetch = require("node-fetch");


const fetchArticleByID = async (articleID) => {
    try {
        const response = await fetch(`http://localhost:3001/api/articles/${articleID}/`);
        // const data = response.json();
        // return data;
        return response.json();
    } catch (e) {
        return new Error('Call failed');
    }
};

const fetchArticlesBySection = async (section) => {
    try {
        const response = await fetch(`http://localhost:3001/api/articles?filter={"where":{"section":"${section}"}}`);
        // const data = response.json();
        // return data
        return response.json();
    } catch (e) {
        return new Error('Call failed');
    }
};

const fetchArticles = async (filters = null) => {
    let data;

    try {
        if (!filters) {
            const response = await fetch('http://localhost:3001/api/articles');
            data = response.json();
        } else {
            const response = await fetch(`http://localhost:3001/api/articles?filter=${filters}/`)
            data = response.json();
        }
    } catch (e) {
        return new Error('Call failed');
    }

    return data;
};

export {
    fetchArticleByID,
    fetchArticles,
    fetchArticlesBySection
};
