import React from 'react';
import ReactDOM from 'react-dom';
import {shallow, mount} from 'enzyme';
import Calculator from './Calculator';
import {optCalculator, formatNumber} from './Calculator';

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Calculator />, div);
});

// test optCalculator
describe('optCalculator works normally', () => {
  test('+ get right results', () => {
    expect(optCalculator['+'](1, 2)).toBe(3);
  });
  test('- get right results', () => {
    expect(optCalculator['-'](1, 2)).toBe(-1);
  });
});

// test formatNumer
describe('formatNumber() works normally',() => {
  test('localize big num with ,',() => {
    expect(formatNumber(1234)).toBe('1,234');
    expect(formatNumber(12345)).toBe('12,345');
  });
  test('with 6 fraction digits',() => {
    expect(formatNumber(1.01234567)).toBe('1.012346');
  });
});

// snapshot test
describe('snapshot test',() => {
  test('snapshot test', () => {
    expect(optCalculator['/'](4,2)).toMatchSnapshot();
  });
});


// dom test
describe('DOM test',() => {
  test('plus', () => {
    // const calculator = shallow(<Calculator />);
    const calculator = mount(<Calculator />);
    const expression = calculator.find('.expression');
    const mainDisplay = calculator.find('.mainDisplay');
    expect(expression).toHaveLength(1);
    expect(mainDisplay).toHaveLength(1);
    const digitalKeys = calculator.find('.digitalKey');
    expect(digitalKeys).toHaveLength(11);

    // dom manipulation
    const one = digitalKeys.at(6);
    const two = digitalKeys.at(7);
    // console.log('one',one);
    const plus = (calculator.find('.operationKey')).at(3);
    one.simulate('click');
    plus.simulate('click');
    two.simulate('click');
    plus.simulate('click');
    // click 1+1+
    expect(expression.text()).toEqual('1+2+');
    expect(mainDisplay.text()).toEqual('3');

  });
});


