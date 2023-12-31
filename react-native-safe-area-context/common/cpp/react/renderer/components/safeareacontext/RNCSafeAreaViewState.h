#pragma once

#include <react/renderer/components/safeareacontext/Props.h>
#include <react/renderer/graphics/RectangleEdges.h>
#include <vector>

#ifdef ANDROID
#include <folly/dynamic.h>
#include <react/renderer/mapbuffer/MapBuffer.h>
#include <react/renderer/mapbuffer/MapBufferBuilder.h>
#endif

namespace facebook {
namespace react {

#ifdef ANDROID
inline EdgeInsets edgeInsetsFromDynamic(const folly::dynamic &value) {
  return EdgeInsets{
      .left = (float)value["left"].getDouble(),
      .top = (float)value["top"].getDouble(),
      .right = (float)value["right"].getDouble(),
      .bottom = (float)value["bottom"].getDouble(),
  };
}

#endif

/*
 * State for <RNCSafeAreaView> component.
 */
class JSI_EXPORT RNCSafeAreaViewState final {
 public:
  using Shared = std::shared_ptr<const RNCSafeAreaViewState>;

  RNCSafeAreaViewState(){};

#ifdef ANDROID
  RNCSafeAreaViewState(
      RNCSafeAreaViewState const &previousState,
      folly::dynamic data)
      : insets(edgeInsetsFromDynamic(data["insets"])){};
#endif

  EdgeInsets insets{};

#ifdef ANDROID
  folly::dynamic getDynamic() const;
  MapBuffer getMapBuffer() const {
    return MapBufferBuilder::EMPTY();
  };

#endif
};

} // namespace react
} // namespace facebook
