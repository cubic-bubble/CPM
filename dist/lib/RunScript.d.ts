import type { CPMProgressWatcher, ShellOptions } from '../types';
import Shell from 'shelljs';
export declare const shell: typeof Shell;
declare const _default: (scripts: string, options: ShellOptions, progress?: CPMProgressWatcher) => Promise<void>;
export default _default;
