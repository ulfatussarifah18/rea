/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */

'use strict';

const nullthrows = require('nullthrows');
const _require = require('./CppHelpers'),
  getCppTypeForAnnotation = _require.getCppTypeForAnnotation,
  generateEventStructName = _require.generateEventStructName;
const _require2 = require('../Utils'),
  indent = _require2.indent,
  toSafeCppString = _require2.toSafeCppString;
const FileTemplate = ({componentEmitters}) => `
/**
 * This code was generated by [react-native-codegen](https://www.npmjs.com/package/react-native-codegen).
 *
 * Do not edit this file as changes may cause incorrect behavior and will be lost
 * once the code is regenerated.
 *
 * ${'@'}generated by codegen project: GenerateEventEmitterH.js
 */
#pragma once

#include <react/renderer/components/view/ViewEventEmitter.h>
#include <jsi/jsi.h>

namespace facebook {
namespace react {

${componentEmitters}

} // namespace react
} // namespace facebook
`;
const ComponentTemplate = ({className, structs, events}) =>
  `
class JSI_EXPORT ${className}EventEmitter : public ViewEventEmitter {
 public:
  using ViewEventEmitter::ViewEventEmitter;

  ${structs}

  ${events}
};
`.trim();
const StructTemplate = ({structName, fields}) =>
  `
  struct ${structName} {
    ${fields}
  };
`.trim();
const EnumTemplate = ({enumName, values, toCases}) =>
  `enum class ${enumName} {
  ${values}
};

static char const *toString(const ${enumName} value) {
  switch (value) {
    ${toCases}
  }
}
`.trim();
function getNativeTypeFromAnnotation(componentName, eventProperty, nameParts) {
  const type = eventProperty.typeAnnotation.type;
  switch (type) {
    case 'BooleanTypeAnnotation':
    case 'StringTypeAnnotation':
    case 'Int32TypeAnnotation':
    case 'DoubleTypeAnnotation':
    case 'FloatTypeAnnotation':
      return getCppTypeForAnnotation(type);
    case 'StringEnumTypeAnnotation':
      return generateEventStructName(nameParts.concat([eventProperty.name]));
    case 'ObjectTypeAnnotation':
      return generateEventStructName(nameParts.concat([eventProperty.name]));
    default:
      type;
      throw new Error(`Received invalid event property type ${type}`);
  }
}
function generateEnum(structs, options, nameParts) {
  const structName = generateEventStructName(nameParts);
  const fields = options
    .map((option, index) => `${toSafeCppString(option)}`)
    .join(',\n  ');
  const toCases = options
    .map(
      option =>
        `case ${structName}::${toSafeCppString(option)}: return "${option}";`,
    )
    .join('\n' + '    ');
  structs.set(
    structName,
    EnumTemplate({
      enumName: structName,
      values: fields,
      toCases: toCases,
    }),
  );
}
function generateStruct(structs, componentName, nameParts, properties) {
  const structNameParts = nameParts;
  const structName = generateEventStructName(structNameParts);
  const fields = properties
    .map(property => {
      return `${getNativeTypeFromAnnotation(
        componentName,
        property,
        structNameParts,
      )} ${property.name};`;
    })
    .join('\n' + '  ');
  properties.forEach(property => {
    const name = property.name,
      typeAnnotation = property.typeAnnotation;
    switch (typeAnnotation.type) {
      case 'BooleanTypeAnnotation':
        return;
      case 'StringTypeAnnotation':
        return;
      case 'Int32TypeAnnotation':
        return;
      case 'DoubleTypeAnnotation':
        return;
      case 'FloatTypeAnnotation':
        return;
      case 'ObjectTypeAnnotation':
        generateStruct(
          structs,
          componentName,
          nameParts.concat([name]),
          nullthrows(typeAnnotation.properties),
        );
        return;
      case 'StringEnumTypeAnnotation':
        generateEnum(structs, typeAnnotation.options, nameParts.concat([name]));
        return;
      default:
        typeAnnotation.type;
        throw new Error(
          `Received invalid event property type ${typeAnnotation.type}`,
        );
    }
  });
  structs.set(
    structName,
    StructTemplate({
      structName,
      fields,
    }),
  );
}
function generateStructs(componentName, component) {
  const structs = new Map();
  component.events.forEach(event => {
    if (event.typeAnnotation.argument) {
      generateStruct(
        structs,
        componentName,
        [event.name],
        event.typeAnnotation.argument.properties,
      );
    }
  });
  return Array.from(structs.values()).join('\n\n');
}
function generateEvent(componentName, event) {
  if (event.typeAnnotation.argument) {
    const structName = generateEventStructName([event.name]);
    return `void ${event.name}(${structName} value) const;`;
  }
  return `void ${event.name}() const;`;
}
function generateEvents(componentName, component) {
  return component.events
    .map(event => generateEvent(componentName, event))
    .join('\n\n' + '  ');
}
module.exports = {
  generate(libraryName, schema, packageName, assumeNonnull = false) {
    const moduleComponents = Object.keys(schema.modules)
      .map(moduleName => {
        const module = schema.modules[moduleName];
        if (module.type !== 'Component') {
          return;
        }
        const components = module.components;
        // No components in this module
        if (components == null) {
          return null;
        }
        return components;
      })
      .filter(Boolean)
      .reduce((acc, components) => Object.assign(acc, components), {});
    const moduleComponentsWithEvents = Object.keys(moduleComponents);
    const fileName = 'EventEmitters.h';
    const componentEmitters =
      moduleComponentsWithEvents.length > 0
        ? Object.keys(moduleComponents)
            .map(componentName => {
              const component = moduleComponents[componentName];
              const replacedTemplate = ComponentTemplate({
                className: componentName,
                structs: indent(generateStructs(componentName, component), 2),
                events: generateEvents(componentName, component),
              });
              return replacedTemplate;
            })
            .join('\n')
        : '';
    const replacedTemplate = FileTemplate({
      componentEmitters,
    });
    return new Map([[fileName, replacedTemplate]]);
  },
};