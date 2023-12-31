import type { HeaderOptions, Layout } from '../types';
type Props = HeaderOptions & {
    /**
     * Whether the header is in a modal
     */
    modal?: boolean;
    /**
     * Layout of the screen.
     */
    layout?: Layout;
    /**
     * Title text for the header.
     */
    title: string;
};
export default function Header(props: Props): JSX.Element;
export {};
//# sourceMappingURL=Header.d.ts.map