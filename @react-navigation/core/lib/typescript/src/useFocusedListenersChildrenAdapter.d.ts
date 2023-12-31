import type { ParamListBase } from '@react-navigation/routers';
import { FocusedNavigationListener } from './NavigationBuilderContext';
import type { NavigationHelpers } from './types';
type Options = {
    navigation: NavigationHelpers<ParamListBase>;
    focusedListeners: FocusedNavigationListener[];
};
/**
 * Hook for passing focus callback to children
 */
export default function useFocusedListenersChildrenAdapter({ navigation, focusedListeners, }: Options): void;
export {};
//# sourceMappingURL=useFocusedListenersChildrenAdapter.d.ts.map