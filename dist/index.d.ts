import type { Metadata, CPMOptions, CPMProgressWatcher } from './types';
import CUP from './CUP';
type PackageInstallResponse = {
    metadata: Metadata;
    etoken: string;
    dtoken: string;
};
export default class PackageManager extends CUP {
    manager: "cpm" | "npm" | "yarn";
    private cwd;
    private cpr?;
    private debugMode;
    private rsOptions;
    private watcher;
    /**
     * Intanciate PackageManager Object
     *
     * @param {Object} options       - Initial configuration options
     *
     */
    constructor(options: CPMOptions);
    /**
     * Generate initial `package.json` and `.metadata`
     *  requirement files at project root.
     *
     * @param {Object} configs    - Custom configurations
     *
     */
    init(configs: Metadata): Promise<void>;
    /**
     * `npm` or `yarn` CLI command runner
     *
     * @param {String} verb       - Package managemet action: install, remove, update, ...
     * @param {String} packages   - Space separated list of NodeJS packages/libraries
     * @param {String} params     - Check `npm` or `yarn` command parameters documentation
     * @param {String} progress   - Process tracking report function. (optional) Default to `this.watcher`
     *
     */
    shell(verb: string, packages: string[] | string | null, params?: string, progress?: CPMProgressWatcher): Promise<unknown>;
    /**
     * Install dependency package requirements listed
     *  in `.metadata` or `package.json` files
     *
     * Use `npm` or `yarn` for NodeJS packages & `cpm`
     * for Cubic Package
     *
     * @param {String} params       - Custom process options
     *                                [-f] or [--full]            Full installation process (Retrieve metadata & fetch package files)
     *                                [-d] or [--dependency]      Is dependency package installation
     *                                [-v] or [--verbose]         Verbose logs
     *                                [--force]                   Override directory of existing installations of same packages
     * @param {Function} progress   - Process tracking report function. (optional) Default to `this.watcher`
     *
     */
    installDependencies(params?: string, progress?: CPMProgressWatcher): Promise<unknown>;
    /**
     * Install one or a list of packages
     *
     * Use `npm` or `yarn` for NodeJS packages & `cpm`
     * for Cubic Package
     *
     * @param {String} packages     - Space separated list of package references
     *                                Eg. `application:namespace.name~version plugin:...`
     * @param {String} params       - Custom process options
     *                                [-f] or [--full]            Full installation process (Retrieve metadata & fetch package files)
     *                                [-d] or [--dependency]      Is dependency package installation
     *                                [-v] or [--verbose]         Verbose logs
     *                                [--force]                   Override directory of existing installations of same packages
     * @param {Function} progress   - Process tracking report function. (optional) Default to `this.watcher`
     *
     */
    install(packages: string[] | string, params?: string, progress?: CPMProgressWatcher): Promise<PackageInstallResponse | unknown>;
    /**
     * Remove/Uninstall one or a list of packages
     *
     * Use `npm` or `yarn` for NodeJS packages & `cpm`
     * for Cubic Package
     *
     * @param {String} packages     - Space separated list of package references
     *                                Eg. `application:namespace.name~version plugin:...`
     * @param {String} params       - Custom process options
     *                                [-f] or [--full]            Full installation process (Retrieve metadata & fetch package files)
     *                                [-d] or [--dependency]      Is dependency package installation
     *                                [-v] or [--verbose]         Verbose logs
     *                                [--force]                   Override directory of existing installations of same packages
     * @param {Function} progress   - Process tracking report function. (optional) Default to `this.watcher`
     */
    remove(packages: string[] | string, params?: string, progress?: CPMProgressWatcher): Promise<string | unknown>;
    /**
     * Update one or a list of packages
     *
     * Use `npm` or `yarn` for NodeJS packages & `cpm`
     * for Cubic Package
     *
     * @param {String} packages     - Space separated list of package references
     *                                Eg. `application:namespace.name~version plugin:...`
     * @param {String} params       - Custom process options
     *                                [-f] or [--full]            Full installation process (Retrieve metadata & fetch package files)
     *                                [-d] or [--dependency]      Is dependency package installation
     *                                [-v] or [--verbose]         Verbose logs
     *                                [--force]                   Override directory of existing installations of same packages
     * @param {Function} progress   - Process tracking report function. (optional) Default to `this.watcher`
     *
     */
    update(packages: string[] | string, params?: string, progress?: CPMProgressWatcher): Promise<PackageInstallResponse | unknown>;
    /**
     * Publish current working directory as package
     *
     * @param {Function} progress   - Process tracking report function. (optional) Default to `this.watcher`
     *
     */
    publish(progress?: CPMProgressWatcher): Promise<string>;
}
export {};
