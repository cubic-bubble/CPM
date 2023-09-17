"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shell = void 0;
var shelljs_1 = __importDefault(require("shelljs"));
exports.shell = shelljs_1.default;
exports.default = (function (scripts, options, progress) {
    return new Promise(function (resolve, reject) {
        var _a, _b;
        var child = exports.shell.exec(scripts, __assign(__assign({}, options), { silent: true, async: true }));
        if (typeof progress == 'function') {
            (_a = child.stdout) === null || _a === void 0 ? void 0 : _a.on('data', function (data) {
                // Console.log('Stdout: ---', data )
                progress(false, data, data.length);
            });
            (_b = child.stderr) === null || _b === void 0 ? void 0 : _b.on('data', function (data) {
                // Console.log('Stderr: ---', data )
                progress(data);
            });
        }
        child
            .on('error', reject)
            // Process emit exit
            .on('close', function (code) {
            // Console.log('Process emit close: %s', code )
            if (code !== 0) {
                var error = new Error("Error, exit code ".concat(code));
                error.name = 'RUN_SCRIPT_ERROR';
                error.code = code;
                return reject(error);
            }
            return resolve();
        })
            // Process emit exit
            .on('exit', function (code) { return console.log('[Shell] Exit: ', code); });
    });
});
