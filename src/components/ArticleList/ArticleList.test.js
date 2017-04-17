import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import ArticleListContainer from './ArticleList.js';
import ArticleList from '../ArticleTeaser/ArticleTeaser.js';
import News from '../../data/News.json';
import MemoryRouter from 'react-router/MemoryRouter'
jest.mock('react-router-dom');

it('renders without crashing', () => {
  const component = mount(<MemoryRouter><ArticleListContainer articles={News} /></MemoryRouter>);
});

it('accepts this.props.articles (an array), and displays a list of ArticleTeaser\'s', () => {
  const component = mount(<MemoryRouter><ArticleListContainer articles={News} /></MemoryRouter>);
  expect(component.find(ArticleList).length).toBeGreaterThan(0);
});
