"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var getTokenBeforeParens = function getTokenBeforeParens(sourceCode, node) {
  var token;
  token = sourceCode.getTokenBefore(node);

  while (token.type === 'Punctuator' && token.value === '(') {
    token = sourceCode.getTokenBefore(token);
  }

  return token;
};

var _default = getTokenBeforeParens;
exports["default"] = _default;
module.exports = exports.default;