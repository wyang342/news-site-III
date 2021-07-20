
import { fetchArticleByID, fetchArticlesBySection, fetchArticles } from './ArticlesAPI'
import fetchMock from 'fetch-mock'
require('isomorphic-fetch')

afterEach(() => {
    fetchMock.restore()
})

it('calls ArticlesAPI.fetchArticleByID(1)', (done) => {
    fetchMock.get('http://localhost:3001/api/articles/1', { success: true })
    return fetchArticleByID(1)
        .then((json) => {
            console.log(json);
            console.log(json.success);
            expect(json.success).toEqual(true)
            done()
        })
        .catch((err) => {
            throw new Error('Call failed')
        })
}, 15000)

// it('calls ArticlesAPI.fetchArticles()', (done) => {
//     fetchMock.get('http://localhost:3001/api/articles', { success: true })
//     return fetchArticles()
//         .then((json) => {
//             expect(json.success).toEqual(true)
//             done()
//         })
//         .catch((err) => {
//             throw new Error('Call failed')
//         })
// }, 15000)

it('calls ArticlesAPI.fetchArticlesBySection(\'opinion\')', (done) => {
    fetchMock.get('http://localhost:3001/api/articles?filter={"where":{"section":"opinion"}}', { success: true })
    return fetchArticlesBySection('opinion')
        .then((json) => {
            expect(json.success).toEqual(true)
            done()
        })
        .catch((err) => {
            throw new Error('Call failed')
        })
}, 15000)
