"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var zlib_1 = __importDefault(require("zlib"));
var tar_fs_1 = __importDefault(require("tar-fs"));
var fs_1 = __importDefault(require("@cubic-bubble/fs"));
var crypto_1 = __importDefault(require("crypto"));
var request_1 = __importDefault(require("request"));
var rand_token_1 = __importDefault(require("rand-token"));
var Encoder_1 = require("./lib/Encoder");
var CUP = /** @class */ (function () {
    function CUP() {
    }
    /**
     * Generate encryption token, cipherkey & initialization
     * vector for .cup package encryption
     *
     * @param {String} passcode     - (Optional) Encryption passcode
     *
     */
    CUP.prototype.keygen = function (passcode) {
        passcode = passcode || rand_token_1.default.generate(88);
        var iv = crypto_1.default.randomBytes(16);
        return {
            etoken: (0, Encoder_1.encode)({ passcode: passcode, iv: iv }),
            key: crypto_1.default.createHash('sha256').update(passcode).digest(),
            iv: iv
        };
    };
    /**
     * Parse encryption token to cipherkey & Initialization Vector
     *
     * @param {Object} etoken     - Project's root directory path
     *
     */
    CUP.prototype.keypar = function (etoken) {
        try {
            var _a = (0, Encoder_1.decode)(etoken), passcode = _a.passcode, iv = _a.iv;
            if (!passcode || !iv || iv.type !== 'Buffer')
                throw new Error('Invalid etoken');
            return {
                key: crypto_1.default.createHash('sha256').update(passcode).digest(),
                iv: Buffer.from(iv.data)
            };
        }
        catch (error) {
            return {};
        }
    };
    /**
     * Generate initial `package.json` and `.metadata`
     *  requirement files at project root.
     *
     * @param {String} rootDir     - Project's root directory path
     * @param {String} filepath    - Destination path for generated .cup file
     * @param {Function} progress  - Process tracking report function
     *
     */
    CUP.prototype.pack = function (rootDir, filepath, progress) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            typeof progress == 'function'
                && progress(false, null, 'Prepacking & Generating the CUP file');
            // Generate .cup file encryption token, key & iv
            var encryption = _this.keygen();
            var prepackSize = 0;
            // Writable stream of temporary path of generated .cup
            var writeStream = fs_1.default.createWriteStream(filepath);
            writeStream
                .on('finish', function () {
                typeof progress == 'function'
                    && progress(false, prepackSize, 'Prepack completed!');
                return resolve({ prepackSize: prepackSize, etoken: encryption.etoken });
            })
                .on('error', reject);
            // Generate package files
            var IGNORE_DIRECTORIES = ['node_modules', 'build', 'dist', 'cache', '.git', '.DS_Store', '.plugin', '.application', '.lib'], IGNORE_FILES = ['.gitignore'], options = {
                ignore: function (pathname) {
                    // Ignore some folders when packing
                    return IGNORE_DIRECTORIES.includes(path_1.default.basename(pathname))
                        || IGNORE_FILES.includes(path_1.default.extname(pathname));
                },
                /**
                 * Readable: true, // all dirs and files should be readable
                 * writable: true // all dirs and files should be writable
                 */
            };
            var prepackStream = tar_fs_1.default.pack(rootDir, options);
            prepackStream
                .on('data', function (chunk) {
                prepackSize += chunk.length;
                typeof progress == 'function'
                    && progress(false, prepackSize, 'Prepacking ...');
            })
                .on('error', reject);
            var zipStream = zlib_1.default.createGzip().on('error', reject), cipherStream = crypto_1.default.createCipheriv('AES-256-CBC', encryption.key, encryption.iv);
            prepackStream
                .pipe(zipStream)
                .pipe(cipherStream)
                .pipe(writeStream);
        });
    };
    /**
     * Generate initial `package.json` and `.metadata`
     *  requirement files at project root.
     *
     * @param {String} source      - Source path or URL of the .cup file
     * @param {String} directory   - Extraction directory path
     * @param {String} etoken      - CUP package Encryption token
     * @param {Function} progress  - Process tracking report function
     *
     */
    CUP.prototype.unpack = function (source, directory, etoken, progress) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // Get decryption key
            var _a = _this.keypar(etoken), key = _a.key, iv = _a.iv;
            if (!key || !iv)
                return reject(new Error('Invalid encryption token'));
            var decipherStream = crypto_1.default.createDecipheriv('AES-256-CBC', key, iv);
            // .gz format unzipping stream
            var unzipStream = zlib_1.default.createGunzip();
            var unpackSize = 0;
            unzipStream
                .on('data', function (chunk) {
                unpackSize += chunk.length;
                typeof progress == 'function'
                    && progress(false, unpackSize, 'Unpacking ...');
            })
                .on('close', function () {
                typeof progress == 'function'
                    && progress(false, null, 'Unpack completed!');
                resolve({ unpackSize: unpackSize });
            })
                .on('error', reject);
            // .tar format extracting stream
            var unpackStream = tar_fs_1.default.extract(directory).on('error', reject);
            typeof progress == 'function'
                && progress(false, null, 'Fetching CUP package ...');
            request_1.default
                .get({ url: source, json: true }, function (error) { return error && reject(error); })
                .pipe(decipherStream) // Decipher package
                .pipe(unzipStream) // Unzip package
                .pipe(unpackStream); // Extract/Unpack package content
        });
    };
    return CUP;
}());
exports.default = CUP;
