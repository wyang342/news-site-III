import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import sinon from 'sinon';
import AppNav from './AppNav';
import MemoryRouter from 'react-router/MemoryRouter'
import { Link } from 'react-router-dom';
const navItems = [{
  label: "NATIONAL",
  value: "national"
},
{
  label: "POLITICS",
  value: "politics"
}]

it('renders without crashing', () => {
  const component = mount(<MemoryRouter><AppNav /></MemoryRouter>);
});

it('renders navItems', () => {
  const component = mount(<MemoryRouter><AppNav /></MemoryRouter>);
  expect(component.find('nav').length).toEqual(1);
  expect(component.find('a').length).toEqual(4);
});
