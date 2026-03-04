var current        = '0';
var previous       = null;
var operator       = null;
var justCalculated = false;
var waitingForNext = false;

var resultEl     = document.getElementById('result');
var expressionEl = document.getElementById('expression');

function updateDisplay(val, expr) {
  resultEl.textContent     = val;
  expressionEl.textContent = expr || '';
}

function inputNum(n) {
  if (justCalculated) {
    current        = n;
    justCalculated = false;
  } else if (waitingForNext) {
    current        = n;
    waitingForNext = false;
  } else {
    current = (current === '0') ? n : current + n;
  }
  updateDisplay(current, expressionEl.textContent);
}

function inputDot() {
  if (justCalculated)      { current = '0.'; justCalculated = false; }
  else if (waitingForNext) { current = '0.'; waitingForNext = false; }
  else if (!current.includes('.')) { current += '.'; }
  updateDisplay(current, expressionEl.textContent);
}

function inputOp(op) {
  justCalculated = false;
  if (operator && !waitingForNext) {
    var res = compute(parseFloat(previous), parseFloat(current), operator);
    previous = String(res);
    current  = String(res);
  } else {
    previous = current;
  }
  operator       = op;
  waitingForNext = true;
  var sym = { '+':'+', '-':'−', '*':'×', '/':'÷' }[op];
  updateDisplay(current, previous + ' ' + sym);
}

function calculate() {
  if (!operator || waitingForNext) return;
  var sym  = { '+':'+', '-':'−', '*':'×', '/':'÷' }[operator];
  var expr = previous + ' ' + sym + ' ' + current + ' =';
  var res  = compute(parseFloat(previous), parseFloat(current), operator);
  if (res === 'Error') {
    updateDisplay('Error', expr);
    current = '0'; operator = null; previous = null;
    return;
  }
  current        = String(res);
  operator       = null;
  previous       = null;
  justCalculated = true;
  updateDisplay(current, expr);
}

function compute(a, b, op) {
  var result;
  if (op === '+') result = a + b;
  if (op === '-') result = a - b;
  if (op === '*') result = a * b;
  if (op === '/') {
    if (b === 0) return 'Error';
    result = a / b;
  }
  return Math.round(result * 1e10) / 1e10;
}

function clearAll() {
  current        = '0';
  previous       = null;
  operator       = null;
  justCalculated = false;
  waitingForNext = false;
  updateDisplay('0', '');
}

function toggleSign() {
  current = String(parseFloat(current) * -1);
  updateDisplay(current, expressionEl.textContent);
}

function percentage() {
  current = String(parseFloat(current) / 100);
  updateDisplay(current, expressionEl.textContent);
}

document.addEventListener('keydown', function(e) {
  if (e.key >= '0' && e.key <= '9') inputNum(e.key);
  else if (e.key === '.')           inputDot();
  else if (e.key === '+')           inputOp('+');
  else if (e.key === '-')           inputOp('-');
  else if (e.key === '*')           inputOp('*');
  else if (e.key === '/') { e.preventDefault(); inputOp('/'); }
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Escape')      clearAll();
  else if (e.key === 'Backspace') {
    current = current.length > 1 ? current.slice(0, -1) : '0';
    updateDisplay(current, expressionEl.textContent);
  }
});
