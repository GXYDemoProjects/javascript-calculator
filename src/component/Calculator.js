import React, {Component} from 'react';
import '../style/App.css';

// button of calculator
function KeyButton(props) {
  return (
    <button className={props.className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}


// functionBoard
class FunctionBoard extends Component {
  renderDigitalButton(key) {
    const name = `key digitalKey${key === '0' ? ' doubleWidth' : ''}`;
    return <KeyButton className={name} value={key}
                      onClick={() => this.props.digitalClick(key)}/>
  }

  renderFunctionButton(key) {
    const name = `key functionKey${key === '=' ? ' doubleHeight' : ''}`;
    return <KeyButton className={name} value={key}
                      onClick={() => this.props.functionClick(key)}/>
  }

  renderOperationButton(key) {
    let value = key;
    if (key === '*') value = '×';
    if (key === '/') value = '÷';
    return <KeyButton className="key operationKey" value={value}
                      onClick={() => this.props.operationClick(key)}/>
  }

  render() {
    return (
      <div className="operationBoard">
        <div className="boarder-row">
          {this.renderFunctionButton('AC')}
          {this.renderFunctionButton('CE')}
          {this.renderOperationButton('/')}
          {this.renderOperationButton('*')}
        </div>
        <div className="boarder-row">
          {this.renderDigitalButton('7')}
          {this.renderDigitalButton('8')}
          {this.renderDigitalButton('9')}
          {this.renderOperationButton('-')}
        </div>
        <div className="boarder-row">
          {this.renderDigitalButton('4')}
          {this.renderDigitalButton('5')}
          {this.renderDigitalButton('6')}
          {this.renderOperationButton('+')}
        </div>
        <div className="boarder-row">
          {this.renderDigitalButton('1')}
          {this.renderDigitalButton('2')}
          {this.renderDigitalButton('3')}
          {this.renderFunctionButton('=')}
        </div>
        <div className="boarder-row">
          {this.renderDigitalButton('0')}
          {this.renderDigitalButton('.')}
        </div>
      </div>
    );
  }
}

class DisplayBoard extends Component {

  render() {
    return (
      <div className="displayBoard">
        <p className="mainDisplay">
          {this.props.mainDisplay}
        </p>
        <p className="expression">
          {this.props.expression}
        </p>
      </div>
    );
  }
}

class Calculator extends Component {
  constructor() {
    super();
    this.state = {
      currentValue: undefined,
      lastOpt: '',
      lastValue: 0,
      expression: '',
      mainDisplay: '0'
    };
    /*    this.handleDigitalKey = this.handleDigitalKey.bind(this);
     this.handleOperationKey = this.handleOperationKey.bind(this);
     this.handleFunctionKey = this.handleFunctionKey.bind(this);*/
  }

  /**
   * digital key event
   * update currentValue and mainDisplay
   * @param key char
   */
  handleDigitalKey(key) {
    // deal with length exceed maximum(8)
    let mainDisplay = this.state.mainDisplay.split(',').join('');
    if (!this.state.newInput && mainDisplay.toString().length >= 8) {
      this.setState({
        currentValue: undefined,
        lastOpt: '',
        lastValue: 0,
        expression: 'Digit Limit Met',
        mainDisplay: '0',
        newInput: true,
      });
      return;
    }
    // deal with '0' input
    if (mainDisplay === '0' && key === '0') return;
    // deal with mutiple '.' input
    if (!this.state.newInput && mainDisplay.indexOf('.') !== -1 && key === '.') return;
    // deal with 1/0
    if (this.state.newInput) {
      // newInput:true
      if (this.state.expression === 'Digit Limit Met') {
        this.setState({expression: ''});
      }
      if (this.state.lastOpt === '/' && key === '0') return;
      if (key !== '.') {
        mainDisplay = `${key}`;
        if (key !== '0') this.setState({newInput: false});
      } else if (key === '.') {
        mainDisplay = `0${key}`;
        this.setState({newInput: false});
      }
    } else {
      mainDisplay = `${mainDisplay}${key}`;
    }
    // if lastOpt is '', value set to lastValue
    const value = Number.parseFloat(mainDisplay);
    if (this.state.lastOpt === '') {
      if (mainDisplay[mainDisplay.length - 1] !== '.') {
        mainDisplay = value.toLocaleString('en-US', {maximumFractionDigits: 6});
      } else {
        mainDisplay = `${value.toLocaleString('en-US')}.`;
      }
      this.setState({
        mainDisplay: mainDisplay,
        lastValue: value,
      });
    } else {
      if (mainDisplay[mainDisplay.length - 1] !== '.') {
        mainDisplay = value.toLocaleString('en-US', {maximumFractionDigits: 6});
      } else {
        mainDisplay = `${value.toLocaleString('en-US')}.`;
      }
      this.setState({
        mainDisplay: mainDisplay,
        currentValue: value,
      });
    }
  }

  /**
   * operation key event
   * update lastResult and show, update expression
   * @param key, char type: + = * /
   */
  handleOperationKey(key) {
    let expression = this.state.expression;
    // last operation contain operation
    const optReg = /[+*-/]$/;
    if (optReg.test(expression) && this.state.newInput) {
      expression = `${expression.substring(0, expression.length - 1)}${key}`;
      this.setState({
        expression: expression,
        lastOpt: key,
      });
      return;
    }
    let lastValue = this.state.lastValue;
    const lastOpt = this.state.lastOpt;
    const currentValue = this.state.currentValue;
    if (lastOpt === '') {
      // last operation is ''
      expression = `${lastValue.toString()}${key}`;
      this.setState({
        expression: expression,
        lastOpt: key,
        newInput: true,
      });
      return;
    }

    // calculate the temp result

    lastValue = optCalculator[lastOpt](lastValue, currentValue);
    const mainDisplay = formatNumber(lastValue);
    expression = `${expression}${currentValue.toString()}${key}`;
    this.setState({
      expression: expression,
      lastValue: lastValue,
      mainDisplay: mainDisplay,
      currentValue: 0,
      lastOpt: key,
      newInput: true,
    })

  }

  /**
   *
   * @param key,'AC','CE','='
   */
  handleFunctionKey(key) {
    switch (key) {
      case 'AC':
        this.setState({
          currentValue: undefined,
          lastOpt: '',
          lastValue: 0,
          expression: '',
          mainDisplay: '0',
          newInput: true,
        });
        break;
      case 'CE':
        this.setState({
          currentValue: 0,
          mainDisplay: '0',
          newInput: true,
        });
        break;
      case '=':
        if (this.state.lastOpt === '') return;
        const lastValue = optCalculator[this.state.lastOpt](this.state.lastValue, this.state.currentValue);
        const mainDisplay = formatNumber(lastValue);
        this.setState({
          lastValue: lastValue,
          currentValue: undefined,
          mainDisplay: mainDisplay,
          expression: '',
          lastOpt: '',
          newInput: true,
        });
        break;
      default:
    }
  }

  render() {
    const mainDisplay = this.state.mainDisplay;
    const expression = this.state.expression;
    return (
      <div className="calculator">
        <DisplayBoard mainDisplay={mainDisplay} expression={expression}/>
        <FunctionBoard
          digitalClick={(key) => this.handleDigitalKey(key)}
          operationClick={(key) => this.handleOperationKey(key)}
          functionClick={(key) => this.handleFunctionKey(key)}
        />
      </div>
    );
  }
}

// calculator function
const optCalculator = {
  '+': (preValue, nextValue) => preValue + nextValue,
  '-': (preValue, nextValue) => preValue - nextValue,
  '*': (preValue, nextValue) => preValue * nextValue,
  '/': (preValue, nextValue) => preValue / nextValue,

};
/**
 * format the calculated result
 * take care of negative value
 * @param num
 */
const formatNumber = function (num) {
  // >=10^10, format to 2.123456e10
  if (num >= 10000000000) return num.toExponential(6);
  // <=-10^10
  if (num <= -10000000000) return `-${(-num).toExponential(6)}`;
  // <1/10^10 && >-1/10^10, format to 0
  if (num < 0.0000000001 && num > -0.0000000001) return '0';
  // normal
  return num.toLocaleString('en-US', {maximumFractionDigits: 6});
};

export default Calculator;
export {optCalculator, formatNumber}

