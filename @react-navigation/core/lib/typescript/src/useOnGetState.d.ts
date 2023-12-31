import type { NavigationState } from '@react-navigation/routers';
import { GetStateListener } from './NavigationBuilderContext';
type Options = {
    getState: () => NavigationState;
    getStateListeners: Record<string, GetStateListener | undefined>;
};
export default function useOnGetState({ getState, getStateListeners, }: Options): void;
export {};
//# sourceMappingURL=useOnGetState.d.ts.map