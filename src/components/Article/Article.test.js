import React from 'react'
import ReactDOM from 'react-dom'
import { mount } from 'enzyme'
import Article from './Article'

it('renders without crashing', () => {
  const component = mount(<Article />)
})

it('accepts title, abstract, null byline, and null image', () => {
  const component = mount(<Article title="Test Headline" created_date="2017-02-10T03:00:25-05:00" abstract="Lorem Ipsum" />)
  expect(component.contains(<h1>Test Headline</h1>)).toEqual(true)
  expect(component.contains(<p>Lorem Ipsum</p>)).toEqual(true)
  expect(component.contains(<p>2017-02-10T03:00:25-05:00</p>)).toEqual(true)
  expect(component.find('h2').exists()).toEqual(false)
  expect(component.find('img').exists()).toEqual(false)
})

it('accepts title, abstract, byline, and image', () => {
  const component = mount(<Article title="Test Headline" created_date="2017-02-10T03:00:25-05:00" abstract="Lorem Ipsum" byline="By XXX" image="https://static01.nyt.com/images/2017/02/11/world/11Hongkong1/11Hongkong1-thumbStandard.jpg" />)
  expect(component.contains(<h1>Test Headline</h1>)).toEqual(true)
  expect(component.contains(<p>Lorem Ipsum</p>)).toEqual(true)
  expect(component.contains(<p>2017-02-10T03:00:25-05:00</p>)).toEqual(true)
  expect(component.find('h2').exists()).toEqual(true)
  expect(component.find('img').exists()).toEqual(true)
})
