"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _utilities = require("../../utilities");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = function _default(context, report, typeForMessage) {
  var sourceCode = context.getSourceCode();

  var getColon = function getColon(node, typeAnnotation) {
    if (node.type === 'FunctionTypeParam') {
      return sourceCode.getFirstToken(node, node.optional ? 2 : 1);
    }

    return sourceCode.getFirstToken(typeAnnotation);
  };

  return function (node) {
    var typeAnnotation = _lodash["default"].get(node, 'typeAnnotation') || _lodash["default"].get(node, 'left.typeAnnotation');

    if (typeAnnotation) {
      report({
        colon: getColon(node, typeAnnotation),
        name: (0, _utilities.quoteName)((0, _utilities.getParameterName)(node, context)),
        node: node,
        type: "".concat(typeForMessage, " type annotation")
      });
    }
  };
};

exports["default"] = _default;
module.exports = exports.default;