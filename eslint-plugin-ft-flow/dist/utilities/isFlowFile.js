"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _isFlowFileAnnotation = _interopRequireDefault(require("./isFlowFileAnnotation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Checks whether a file has an  or @noflow annotation.
 *
 * @param context
 * @param [strict] - By default, the function returns true if the file
 *  starts with @flow but not if it starts by @noflow. When the strict flag
 *  is set to false, the function returns true if the flag has @noflow also.
 */
var _default = function _default(context) {
  var strict = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var comments = context.getAllComments();

  if (!comments.length) {
    return false;
  }

  return comments.some(function (comment) {
    return (0, _isFlowFileAnnotation["default"])(comment.value, strict);
  });
};

exports["default"] = _default;
module.exports = exports.default;