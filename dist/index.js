"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("@cubic-bubble/fs"));
var request_1 = __importDefault(require("request"));
var request_promise_1 = __importDefault(require("request-promise"));
var RunScript_1 = __importDefault(require("./lib/RunScript"));
var CUP_1 = __importDefault(require("./CUP"));
/**
 * Parse package reference string in to
 * construction object.
 *
 * @param {Function} reference  - Eg. plugin:namespace.name~version
 *
 */
function parsePackageReference(reference) {
    var sequence = reference.match(/(\w+):([a-zA-Z0-9_\-+]+).([a-zA-Z0-9_\-+]+)(~(([0-9]\.?){2,3}))?/);
    if (!sequence || sequence.length < 4)
        return;
    var _ = sequence[0], type = sequence[1], namespace = sequence[2], nsi = sequence[3], __ = sequence[4], version = sequence[5];
    return { type: type, namespace: namespace, nsi: nsi, version: version };
}
function isValidMetadata(metadata) {
    return !!metadata.type
        || !!metadata.nsi
        || !!metadata.name
        || !!metadata.namespace;
}
var PackageManager = /** @class */ (function (_super) {
    __extends(PackageManager, _super);
    /**
     * Intanciate PackageManager Object
     *
     * @param {Object} options       - Initial configuration options
     *
     */
    function PackageManager(options) {
        var _this = _super.call(this) || this;
        _this.watcher = function () { console.log('Default watcher'); };
        // Configure access to package repository
        var _a = options.cpr, source = _a.source, apiversion = _a.apiversion, token = _a.token;
        _this.cpr = {
            baseURL: "".concat(source, "/v").concat(apiversion || '1'),
            accessToken: token || ''
        };
        _this.manager = options.manager || 'cpm'; // Yarn as default node package manager (npm): (Install in packages)
        _this.cwd = options.cwd;
        _this.debugMode = options.debug || false;
        // Script runner options
        _this.rsOptions = { cwd: _this.cwd, stdio: 'pipe' };
        // Mute watcher function by default
        if (typeof options.watcher == 'function')
            _this.watcher = options.watcher;
        return _this;
    }
    /**
     * Generate initial `package.json` and `.metadata`
     *  requirement files at project root.
     *
     * @param {Object} configs    - Custom configurations
     *
     */
    PackageManager.prototype.init = function (configs) {
        return __awaiter(this, void 0, void 0, function () {
            var filepath, existing, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filepath = "".concat(this.cwd, "/.metadata");
                        // Generate 3rd party CLI package managers (npm, yarn) package.json
                        if (['npm', 'yarn'].includes(this.manager))
                            filepath = "".concat(this.cwd, "/package.json");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs_1.default.readJson(filepath)
                            /**
                             * Merge new information with exising
                             *  .metadata or package.json content.
                             */
                        ];
                    case 2:
                        existing = _a.sent();
                        /**
                         * Merge new information with exising
                         *  .metadata or package.json content.
                         */
                        if (typeof existing == 'object')
                            configs = __assign(__assign({}, existing), configs);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.log('Init Error: ', error_1);
                        return [3 /*break*/, 4];
                    case 4: 
                    // Generate a new package.json file
                    return [4 /*yield*/, fs_1.default.outputJSON(filepath, configs, { spaces: '\t' })];
                    case 5:
                        // Generate a new package.json file
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * `npm` or `yarn` CLI command runner
     *
     * @param {String} verb       - Package managemet action: install, remove, update, ...
     * @param {String} packages   - Space separated list of NodeJS packages/libraries
     * @param {String} params     - Check `npm` or `yarn` command parameters documentation
     * @param {String} progress   - Process tracking report function. (optional) Default to `this.watcher`
     *
     */
    PackageManager.prototype.shell = function (verb, packages, params, progress) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // Specified packages to uninstall
            packages = Array.isArray(packages) ? packages.join(' ') : packages || '';
            (0, RunScript_1.default)("".concat(_this.manager, " ").concat(verb, " ").concat(packages, " ").concat(params), _this.rsOptions, progress)
                .then(resolve)
                .catch(reject);
        });
    };
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
    PackageManager.prototype.installDependencies = function (params, progress) {
        if (params === void 0) { params = ''; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof params == 'function') {
                            progress = params;
                            params = '';
                        }
                        progress = progress || this.watcher;
                        if (!['npm', 'yarn'].includes(this.manager)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.shell('install', null, params, progress)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
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
    PackageManager.prototype.install = function (packages, params, progress) {
        var _a;
        if (params === void 0) { params = ''; }
        return __awaiter(this, void 0, void 0, function () {
            var verb, plist, fetchPackage, installDependencies, eachPackage;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (typeof params == 'function') {
                            progress = params;
                            params = '';
                        }
                        progress = progress || this.watcher;
                        if (!['npm', 'yarn'].includes(this.manager)) return [3 /*break*/, 2];
                        verb = void 0;
                        switch (this.manager) {
                            case 'npm':
                                verb = 'install';
                                break;
                            case 'yarn': // Yarn is use by default
                            default: verb = 'add';
                        }
                        return [4 /*yield*/, this.shell(verb, packages, params, progress)];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        // Check whether a package repository is defined
                        if (!((_a = this.cpr) === null || _a === void 0 ? void 0 : _a.baseURL))
                            throw new Error('Undefined Cubic Package Repository');
                        plist = Array.isArray(packages) ? __spreadArray([], packages, true) : packages.split(/\s+/), fetchPackage = function (_a, _b, isDep) {
                            var type = _a.type, namespace = _a.namespace, nsi = _a.nsi;
                            var metadata = _b.metadata, dtoken = _b.dtoken, etoken = _b.etoken;
                            return new Promise(function (resolve, reject) {
                                /**
                                 * Define installation directory
                                 *
                                 * NOTE: Packages are extracted
                                 *   - Directly into `cwd` by namespace folder (Main package)
                                 *   - Or into respective dependency type folders (Dependency package: by `isDep` flag)
                                 */
                                var directory = "".concat(_this.cwd, "/").concat(isDep ? ".".concat(type, "/") : '').concat(namespace, "/").concat(nsi, "~").concat(metadata.version), downloadAndUnpack = function () { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                typeof progress == 'function'
                                                    && progress(false, null, "Installation directory: ".concat(directory));
                                                return [4 /*yield*/, fs_1.default.ensureDir(directory)];
                                            case 1:
                                                _a.sent();
                                                return [4 /*yield*/, this.unpack("".concat(this.cpr.baseURL, "/package/fetch?dtoken=").concat(dtoken), directory, etoken, progress)];
                                            case 2:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); };
                                /**
                                 * Do not override existing installation directory
                                 * unless --force flag is set in params
                                 */
                                if (params.includes('--force'))
                                    return downloadAndUnpack().then(resolve).catch(reject);
                                /**
                                 * Check directory where to append package files:
                                 *
                                 * `.metadata` is use to identify whether an
                                 * installation already exists in that directory.
                                 */
                                fs_1.default.readJson("".concat(directory, "/.metadata"))
                                    .then(function () {
                                    typeof progress == 'function'
                                        && progress(false, null, "Package <".concat(type, ":").concat(namespace, ".").concat(nsi, "~").concat(metadata.version, "> is already installed. ").concat(directory, "\n\tUse -f or --force option to override existing installation."));
                                    resolve();
                                })
                                    .catch(function () { return downloadAndUnpack().then(resolve).catch(reject); });
                            });
                        }, installDependencies = function (metadata) { return __awaiter(_this, void 0, void 0, function () {
                            var depRegex, deps, _a, _b, _c, _i, x, _d, _, depType, response;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        depRegex = /^(plugin|library):(.+)$/, deps = metadata.resource
                                            && metadata.resource.dependencies
                                            && metadata.resource.dependencies.length
                                            && metadata.resource.dependencies.filter(function (each) { return depRegex.test(each); });
                                        if (!Array.isArray(deps) || !deps.length)
                                            return [2 /*return*/, metadata];
                                        _a = deps;
                                        _b = [];
                                        for (_c in _a)
                                            _b.push(_c);
                                        _i = 0;
                                        _e.label = 1;
                                    case 1:
                                        if (!(_i < _b.length)) return [3 /*break*/, 4];
                                        _c = _b[_i];
                                        if (!(_c in _a)) return [3 /*break*/, 3];
                                        x = _c;
                                        _d = deps[x].match(depRegex) || [], _ = _d[0], depType = _d[1];
                                        return [4 /*yield*/, eachPackage(deps[x], !!depType)];
                                    case 2:
                                        response = _e.sent();
                                        if (!response)
                                            throw new Error("<".concat(deps[x], "> not found"));
                                        switch (depType) {
                                            case 'plugin':
                                                {
                                                    if (!metadata.plugins)
                                                        metadata.plugins = {};
                                                    metadata.plugins[response.metadata.nsi] = response.metadata;
                                                }
                                                break;
                                            case 'library':
                                                {
                                                    if (!metadata.libraries)
                                                        metadata.libraries = {};
                                                    metadata.libraries[response.metadata.nsi] = response.metadata;
                                                }
                                                break;
                                        }
                                        _e.label = 3;
                                    case 3:
                                        _i++;
                                        return [3 /*break*/, 1];
                                    case 4: return [2 /*return*/, metadata];
                                }
                            });
                        }); }, eachPackage = function (pkg, isDep) {
                            if (isDep === void 0) { isDep = false; }
                            return __awaiter(_this, void 0, void 0, function () {
                                var refs, headers, response, _a, _b, _c;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            refs = parsePackageReference(pkg);
                                            if (!refs)
                                                throw new Error("Invalid <".concat(pkg, "> package reference"));
                                            typeof progress == 'function'
                                                && progress(false, null, "Resolving ".concat(pkg));
                                            headers = {
                                                'Authorization': "Bearer ".concat(this.cpr.accessToken),
                                                'X-User-Agent': 'CPM/1.0'
                                            };
                                            return [4 /*yield*/, request_promise_1.default.get({ url: "".concat(this.cpr.baseURL, "/resolve/").concat(pkg), headers: headers, json: true })];
                                        case 1:
                                            response = _d.sent();
                                            if (response.error)
                                                throw new Error(response.message);
                                            // Fetch packages
                                            _a = params.includes('-f');
                                            if (!_a) 
                                            // Fetch packages
                                            return [3 /*break*/, 3];
                                            return [4 /*yield*/, fetchPackage(refs, response, isDep)
                                                /**
                                                 * Install all required dependencies (plugin/library)
                                                 *
                                                 * NOTE: Regular mode only. Plugin are directly added to
                                                 *       `.metadata` file in sandbox mode.
                                                 */
                                            ];
                                        case 2:
                                            _a = (_d.sent());
                                            _d.label = 3;
                                        case 3:
                                            // Fetch packages
                                            _a;
                                            /**
                                             * Install all required dependencies (plugin/library)
                                             *
                                             * NOTE: Regular mode only. Plugin are directly added to
                                             *       `.metadata` file in sandbox mode.
                                             */
                                            _b = response;
                                            return [4 /*yield*/, installDependencies(response.metadata)
                                                // Install next package if there is. Otherwise resolve
                                            ];
                                        case 4:
                                            /**
                                             * Install all required dependencies (plugin/library)
                                             *
                                             * NOTE: Regular mode only. Plugin are directly added to
                                             *       `.metadata` file in sandbox mode.
                                             */
                                            _b.metadata = _d.sent();
                                            if (!plist.length) return [3 /*break*/, 6];
                                            return [4 /*yield*/, eachPackage(plist.shift())];
                                        case 5:
                                            _c = _d.sent();
                                            return [3 /*break*/, 7];
                                        case 6:
                                            _c = response;
                                            _d.label = 7;
                                        case 7: 
                                        // Install next package if there is. Otherwise resolve
                                        return [2 /*return*/, _c];
                                    }
                                });
                            });
                        };
                        return [4 /*yield*/, eachPackage(plist.shift(), params.includes('-d') || params.includes('--dependency'))];
                    case 3: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
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
    PackageManager.prototype.remove = function (packages, params, progress) {
        if (params === void 0) { params = ''; }
        return __awaiter(this, void 0, void 0, function () {
            var verb, plist, eachPackage;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!packages)
                            throw new Error('Undefined package to uninstall');
                        if (typeof params == 'function') {
                            progress = params;
                            params = '';
                        }
                        progress = progress || this.watcher;
                        if (!['npm', 'yarn'].includes(this.manager)) return [3 /*break*/, 2];
                        verb = void 0;
                        switch (this.manager) {
                            case 'npm':
                                verb = 'uninstall';
                                break;
                            case 'yarn': // Yarn is use by default
                            default: verb = 'remove';
                        }
                        return [4 /*yield*/, this.shell(verb, packages, params, progress)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        plist = Array.isArray(packages) ? __spreadArray([], packages, true) : packages.split(/\s+/), eachPackage = function (pkg) { return __awaiter(_this, void 0, void 0, function () {
                            var refs, type, namespace, nsi, version, nspDir, dir, _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        refs = parsePackageReference(pkg);
                                        if (!refs)
                                            throw new Error("Invalid <".concat(pkg, "> package reference"));
                                        type = refs.type, namespace = refs.namespace, nsi = refs.nsi, version = refs.version, nspDir = "".concat(this.cwd, "/.").concat(type, "/").concat(namespace);
                                        return [4 /*yield*/, fs_1.default.pathExists(nspDir)];
                                    case 1:
                                        // Check whether installation namespace exists
                                        if (!(_b.sent()))
                                            throw new Error("No installation of <".concat(pkg, "> found"));
                                        if (!!version) return [3 /*break*/, 5];
                                        return [4 /*yield*/, fs_1.default.readdir(nspDir)];
                                    case 2:
                                        dir = _b.sent();
                                        if (!(Array.isArray(dir) && dir.length)) return [3 /*break*/, 4];
                                        return [4 /*yield*/, Promise.all(dir.map(function (dirname) {
                                                if (dirname.includes(nsi))
                                                    return fs_1.default.remove("".concat(nspDir, "/").concat(dirname));
                                            }))];
                                    case 3:
                                        _b.sent();
                                        _b.label = 4;
                                    case 4: return [3 /*break*/, 7];
                                    case 5: return [4 /*yield*/, fs_1.default.remove("".concat(nspDir, "/").concat(name, "~").concat(version))
                                        // Install next package if there is. Otherwise resolve
                                    ];
                                    case 6:
                                        _b.sent();
                                        _b.label = 7;
                                    case 7:
                                        if (!plist.length) return [3 /*break*/, 9];
                                        return [4 /*yield*/, eachPackage(plist.shift())];
                                    case 8:
                                        _a = _b.sent();
                                        return [3 /*break*/, 10];
                                    case 9:
                                        _a = "<".concat(Array.isArray(packages) ? packages.join(', ') : packages.replace(/\s+/, ', '), "> removed");
                                        _b.label = 10;
                                    case 10: 
                                    // Install next package if there is. Otherwise resolve
                                    return [2 /*return*/, _a];
                                }
                            });
                        }); };
                        return [4 /*yield*/, eachPackage(plist.shift())];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
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
    PackageManager.prototype.update = function (packages, params, progress) {
        if (params === void 0) { params = ''; }
        return __awaiter(this, void 0, void 0, function () {
            var verb;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!packages)
                            throw new Error('Undefined package to uninstall');
                        if (typeof params == 'function') {
                            progress = params;
                            params = '';
                        }
                        progress = progress || this.watcher;
                        if (!['npm', 'yarn'].includes(this.manager)) return [3 /*break*/, 2];
                        verb = void 0;
                        switch (this.manager) {
                            case 'npm':
                                verb = 'update';
                                break;
                            case 'yarn': // Yarn is use by default
                            default:
                                verb = 'upgrade';
                                params += ' --latest';
                        }
                        return [4 /*yield*/, this.shell(verb, packages, params, progress)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        // Update: Reinstall packages to their latest versions
                        packages = Array.isArray(packages) ? packages : packages.split(/\s+/);
                        packages = packages.map(function (each) { return each.replace(/~(([0-9]\.?){2,3})/, ''); }).join(' ');
                        return [4 /*yield*/, this.install(packages, params, progress)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Publish current working directory as package
     *
     * @param {Function} progress   - Process tracking report function. (optional) Default to `this.watcher`
     *
     */
    PackageManager.prototype.publish = function (progress) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var metadata, error_2, explicitError, tmpPath, error_3, filepath, uploadPackage, _b, prepackSize, etoken, 
            // Add package stages sizes to metadata
            fileStat;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // Check whether a package repository is defined
                        if (!((_a = this.cpr) === null || _a === void 0 ? void 0 : _a.baseURL))
                            throw new Error('Undefined Cubic Package Repository');
                        // TODO: Preliminary checks of packagable configurations
                        progress = progress || this.watcher;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        progress(false, null, 'Checking metadata in .metadata');
                        return [4 /*yield*/, fs_1.default.readJson("".concat(this.cwd, "/.metadata"))];
                    case 2:
                        metadata = _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _c.sent();
                        explicitError = new Error('Undefined Metadata. Expected .metadata file in project root');
                        progress(explicitError);
                        throw explicitError;
                    case 4:
                        if (!isValidMetadata(metadata))
                            throw new Error('Invalid Metadata. Check documentation');
                        tmpPath = "".concat(path_1.default.dirname(this.cwd), "/.tmp");
                        progress(false, null, "Creating .tmp directory at ".concat(tmpPath));
                        _c.label = 5;
                    case 5:
                        _c.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, fs_1.default.ensureDir(tmpPath)];
                    case 6:
                        _c.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        error_3 = _c.sent();
                        progress(error_3);
                        throw new Error('Installation failed. Check progress logs for more details');
                    case 8:
                        filepath = "".concat(tmpPath, "/").concat(metadata.nsi, ".cup"), uploadPackage = function () {
                            return new Promise(function (resolve, reject) {
                                var options = {
                                    url: "".concat(_this.cpr.baseURL, "/publish"),
                                    headers: {
                                        'Authorization': "Bearer ".concat(_this.cpr.accessToken),
                                        'Content-Type': 'application/octet-stream',
                                        'X-User-Agent': 'CPM/1.0'
                                    },
                                    formData: {
                                        metadata: JSON.stringify(metadata),
                                        pkg: fs_1.default.createReadStream(filepath),
                                        deploy: 'after-check'
                                    },
                                    json: true
                                };
                                request_1.default.post(options, function (error, response, body) {
                                    if (error || (body && body.error))
                                        return reject(error || body.message);
                                    fs_1.default.remove(tmpPath); // Delete .tmp directory
                                    resolve(body);
                                });
                            });
                        };
                        return [4 /*yield*/, this.pack(this.cwd, filepath, progress)];
                    case 9:
                        _b = _c.sent(), prepackSize = _b.prepackSize, etoken = _b.etoken;
                        return [4 /*yield*/, fs_1.default.stat(filepath)
                            // Attach .cup encryption token
                        ];
                    case 10:
                        fileStat = _c.sent();
                        // Attach .cup encryption token
                        metadata.etoken = etoken;
                        metadata.sizes = {
                            download: fileStat.size,
                            installation: prepackSize
                        };
                        progress(false, null, 'Publishing package ...');
                        return [4 /*yield*/, uploadPackage()];
                    case 11: 
                    // Upload package to the given CPR (Cubic Package Repositories)
                    return [2 /*return*/, _c.sent()];
                }
            });
        });
    };
    return PackageManager;
}(CUP_1.default));
exports.default = PackageManager;
