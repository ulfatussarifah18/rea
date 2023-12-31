"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _utilities = require("../utilities");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var schema = [{
  additionalProperties: false,
  properties: {
    excludeArrowFunctions: {
      "enum": [false, true, 'expressionsOnly']
    },
    excludeParameterMatch: {
      type: 'string'
    }
  },
  type: 'object'
}];
var create = (0, _utilities.iterateFunctionNodes)(function (context) {
  var skipArrows = _lodash["default"].get(context, 'options[0].excludeArrowFunctions');

  var excludeParameterMatch = new RegExp(_lodash["default"].get(context, 'options[0].excludeParameterMatch', 'a^'), 'u');
  return function (functionNode) {
    // It is save to ignore FunctionTypeAnnotation nodes in this rule.
    if (functionNode.type === 'FunctionTypeAnnotation') {
      return;
    }

    var isArrow = functionNode.type === 'ArrowFunctionExpression';
    var isArrowFunctionExpression = functionNode.expression;

    var functionAnnotation = isArrow && _lodash["default"].get(functionNode, 'parent.id.typeAnnotation');

    if (skipArrows === 'expressionsOnly' && isArrowFunctionExpression || skipArrows === true && isArrow) {
      return;
    }

    _lodash["default"].forEach(functionNode.params, function (identifierNode) {
      var parameterName = (0, _utilities.getParameterName)(identifierNode, context);

      if (excludeParameterMatch.test(parameterName)) {
        return;
      }

      var typeAnnotation;
      typeAnnotation = _lodash["default"].get(identifierNode, 'typeAnnotation') || _lodash["default"].get(identifierNode, 'left.typeAnnotation');

      if (isArrow && functionAnnotation) {
        typeAnnotation = true;
      }

      if (!typeAnnotation) {
        context.report({
          data: {
            name: (0, _utilities.quoteName)(parameterName)
          },
          message: 'Missing {{name}}parameter type annotation.',
          node: identifierNode
        });
      }
    });
  };
});
var _default = {
  create: create,
  schema: schema
};
exports["default"] = _default;
module.exports = exports.default;