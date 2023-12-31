"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var schema = [{
  "enum": ['always', 'never'],
  type: 'string'
}, {
  additionalProperties: false,
  properties: {
    annotateUndefined: {
      "enum": ['always', 'never', 'ignore', 'always-enforce'],
      type: 'string'
    },
    excludeArrowFunctions: {
      "enum": [false, true, 'expressionsOnly']
    },
    excludeMatching: {
      items: {
        type: 'string'
      },
      type: 'array'
    },
    includeOnlyMatching: {
      items: {
        type: 'string'
      },
      type: 'array'
    }
  },
  type: 'object'
}];

var makeRegExp = function makeRegExp(str) {
  return new RegExp(str, 'u');
};

var isUndefinedReturnType = function isUndefinedReturnType(returnNode) {
  return returnNode.argument === null || returnNode.argument.name === 'undefined' || returnNode.argument.operator === 'void';
};

var create = function create(context) {
  var annotateReturn = (_lodash["default"].get(context, 'options[0]') || 'always') === 'always';
  var annotateUndefined = _lodash["default"].get(context, 'options[1].annotateUndefined') || 'never';
  var skipArrows = _lodash["default"].get(context, 'options[1].excludeArrowFunctions') || false;

  var excludeMatching = _lodash["default"].get(context, 'options[1].excludeMatching', []).map(makeRegExp);

  var includeOnlyMatching = _lodash["default"].get(context, 'options[1].includeOnlyMatching', []).map(makeRegExp);

  var targetNodes = [];

  var registerFunction = function registerFunction(functionNode) {
    targetNodes.push({
      functionNode: functionNode
    });
  };

  var getIsReturnTypeAnnotationUndefined = function getIsReturnTypeAnnotationUndefined(targetNode) {
    var isReturnTypeAnnotationLiteralUndefined = _lodash["default"].get(targetNode, 'functionNode.returnType.typeAnnotation.id.name') === 'undefined' && _lodash["default"].get(targetNode, 'functionNode.returnType.typeAnnotation.type') === 'GenericTypeAnnotation';
    var isReturnTypeAnnotationVoid = _lodash["default"].get(targetNode, 'functionNode.returnType.typeAnnotation.type') === 'VoidTypeAnnotation';
    var isAsyncReturnTypeAnnotationVoid = _lodash["default"].get(targetNode, 'functionNode.async') && _lodash["default"].get(targetNode, 'functionNode.returnType.typeAnnotation.id.name') === 'Promise' && (_lodash["default"].get(targetNode, 'functionNode.returnType.typeAnnotation.typeParameters.params[0].type') === 'VoidTypeAnnotation' || _lodash["default"].get(targetNode, 'functionNode.returnType.typeAnnotation.typeParameters.params[0].id.name') === 'undefined' && _lodash["default"].get(targetNode, 'functionNode.returnType.typeAnnotation.typeParameters.params[0].type') === 'GenericTypeAnnotation');
    return isReturnTypeAnnotationLiteralUndefined || isReturnTypeAnnotationVoid || isAsyncReturnTypeAnnotationVoid;
  };

  var shouldFilterNode = function shouldFilterNode(functionNode) {
    var isArrow = functionNode.type === 'ArrowFunctionExpression';
    var isMethod = functionNode.parent && functionNode.parent.type === 'MethodDefinition';
    var propertyNodes = ['Property', 'ClassProperty', 'PropertyDefinition'];
    var isProperty = functionNode.parent && propertyNodes.includes(functionNode.parent.type);
    var selector;

    if (isMethod || isProperty) {
      selector = 'parent.key.name';
    } else if (isArrow) {
      selector = 'parent.id.name';
    } else {
      selector = 'id.name';
    }

    var identifierName = _lodash["default"].get(functionNode, selector);

    var checkRegExp = function checkRegExp(regex) {
      return regex.test(identifierName);
    };

    if (excludeMatching.length && _lodash["default"].some(excludeMatching, checkRegExp)) {
      return true;
    }

    if (includeOnlyMatching.length && !_lodash["default"].some(includeOnlyMatching, checkRegExp)) {
      return true;
    }

    return false;
  }; // eslint-disable-next-line complexity


  var evaluateFunction = function evaluateFunction(functionNode) {
    var targetNode = targetNodes.pop();

    if (functionNode !== targetNode.functionNode) {
      throw new Error('Mismatch.');
    }

    var isArrow = functionNode.type === 'ArrowFunctionExpression';
    var isArrowFunctionExpression = functionNode.expression;
    var isFunctionReturnUndefined = !isArrowFunctionExpression && !functionNode.generator && (!targetNode.returnStatementNode || isUndefinedReturnType(targetNode.returnStatementNode));
    var isReturnTypeAnnotationUndefined = getIsReturnTypeAnnotationUndefined(targetNode);

    if (skipArrows === 'expressionsOnly' && isArrowFunctionExpression || skipArrows === true && isArrow || shouldFilterNode(functionNode)) {
      return;
    }

    var returnType = functionNode.returnType || isArrow && _lodash["default"].get(functionNode, 'parent.id.typeAnnotation');

    if (isFunctionReturnUndefined && isReturnTypeAnnotationUndefined && annotateUndefined === 'never') {
      context.report({
        message: 'Must not annotate undefined return type.',
        node: functionNode
      });
    } else if (isFunctionReturnUndefined && !isReturnTypeAnnotationUndefined && annotateUndefined === 'always') {
      context.report({
        message: 'Must annotate undefined return type.',
        node: functionNode
      });
    } else if ((annotateUndefined === 'always-enforce' || !isFunctionReturnUndefined && !isReturnTypeAnnotationUndefined) && annotateReturn && !returnType && !shouldFilterNode(functionNode)) {
      context.report({
        message: 'Missing return type annotation.',
        node: functionNode
      });
    }
  };

  var evaluateNoise = function evaluateNoise() {
    targetNodes.pop();
  };

  return {
    ArrowFunctionExpression: registerFunction,
    'ArrowFunctionExpression:exit': evaluateFunction,
    ClassDeclaration: registerFunction,
    'ClassDeclaration:exit': evaluateNoise,
    ClassExpression: registerFunction,
    'ClassExpression:exit': evaluateNoise,
    FunctionDeclaration: registerFunction,
    'FunctionDeclaration:exit': evaluateFunction,
    FunctionExpression: registerFunction,
    'FunctionExpression:exit': evaluateFunction,
    ReturnStatement: function ReturnStatement(node) {
      if (targetNodes.length) {
        targetNodes[targetNodes.length - 1].returnStatementNode = node;
      }
    }
  };
};

var _default = {
  create: create,
  schema: schema
};
exports["default"] = _default;
module.exports = exports.default;