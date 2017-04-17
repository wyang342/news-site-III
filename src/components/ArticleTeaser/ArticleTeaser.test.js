import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import sinon from 'sinon';
import ArticleTeaser from './ArticleTeaser';
import MemoryRouter from 'react-router/MemoryRouter'
jest.mock('react-router-dom');

it('renders without crashing', () => {
  const component = mount(<ArticleTeaser />);
});

it('accepts title and created_date', () => {
  const component = mount(<MemoryRouter><ArticleTeaser id={1} title="Test Headline" created_date="2017-02-10T03:00:25-05:00" /></MemoryRouter>);
  expect(component.contains(<p>2017-02-10T03:00:25-05:00</p>)).toEqual(true);
});
