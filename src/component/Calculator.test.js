import React from 'react';
import ReactDOM from 'react-dom';
import Calculator from './Calculator';
import {optCalculator, formatNumber} from './Calculator';

console.log('optCalculator:',optCalculator);
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

