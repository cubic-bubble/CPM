'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.encode = void 0;
var base_x_1 = __importDefault(require("base-x"));
var ENCODING_BASES = {
    'b32': 'ybndrfg8ejkmcpqxot1uwisza345h769',
    'b43': '0123456789abcdefghijklmnopqrstuvwxyzABCDEFG',
    'b58': '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
    'b62': '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    'b64': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
    // 'b66': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_+!~'
};
function _random(min, max) {
    // Returns random number between defined interval
    return Math.floor(Math.random() * (max - min) + min);
}
function _encode(type, body) {
    return (0, base_x_1.default)(ENCODING_BASES[type]).encode(Buffer.from(body));
}
function _decode(type, body) {
    return (0, base_x_1.default)(ENCODING_BASES[type]).decode(body).toString();
}
var encode = function (arg, type) {
    // Encoding
    if (!arg) {
        // Console.log('[ENCODER::ERROR] Invalid Argument')
        return '';
    }
    var argtype = typeof arg, // Input regardless its type: Encoding,
    Bases = Object.keys(ENCODING_BASES);
    arg = argtype == 'object' ? JSON.stringify(arg) : String(arg);
    type = type && type.toLowerCase();
    var Body = _encode('b32', arg);
    // Check requested type or assign random type
    if (!type || !Bases.includes(type))
        type = Bases[_random(0, Bases.length)];
    var Metadata = "[".concat(type, "-Encoding]/type:").concat(argtype); // Encoding metadata
    return "".concat(_encode(type, Body).split('').reverse().join(''), "$").concat(_encode('b58', Metadata));
};
exports.encode = encode;
var decode = function (arg) {
    // Decoding
    if (typeof arg !== 'string') {
        // Console.log('[ENCODER::ERROR] Invalid Argument <String Expected>')
        return '';
    }
    var Bases = Object.keys(ENCODING_BASES);
    var _a = arg.split('$'), Body = _a[0], Metadata = _a[1];
    if (!Metadata || !Body)
        return arg;
    Metadata = _decode('b58', Metadata);
    var _b = Metadata.match(/^\[(.+)-Encoding\]\/type:(\w+)/) || [], _ = _b[0], type = _b[1], argtype = _b[2];
    if (!type || !Bases.includes(type))
        return arg;
    // Decoding type & first seal gate: base32
    Body = _decode('b32', _decode(type, Body.split('').reverse().join('')));
    // Return the argument in its encoding type
    switch (argtype) {
        case 'number': return +Body;
        case 'object': return JSON.parse(Body);
        case 'boolean': return Boolean(Body);
        default: return Body; // String
    }
};
exports.decode = decode;
exports.default = { dictionaries: ENCODING_BASES, encode: exports.encode, decode: exports.decode };
