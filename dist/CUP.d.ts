/// <reference types="node" />
/// <reference types="node" />
import { BinaryLike } from 'crypto';
type Packed = {
    prepackSize: number;
    etoken: string;
};
type Unpacked = {
    unpackSize: number;
};
type ProgressListener = (error: boolean, byte: number | null, message: string) => void;
export default class CUP {
    /**
     * Generate encryption token, cipherkey & initialization
     * vector for .cup package encryption
     *
     * @param {String} passcode     - (Optional) Encryption passcode
     *
     */
    keygen(passcode?: BinaryLike): {
        etoken: string;
        key: Buffer;
        iv: Buffer;
    };
    /**
     * Parse encryption token to cipherkey & Initialization Vector
     *
     * @param {Object} etoken     - Project's root directory path
     *
     */
    keypar(etoken: string): {
        key: Buffer;
        iv: Buffer;
    } | {
        key?: undefined;
        iv?: undefined;
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
    pack(rootDir: string, filepath: string, progress?: ProgressListener): Promise<Packed>;
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
    unpack(source: string, directory: string, etoken: string, progress?: ProgressListener): Promise<Unpacked>;
}
export {};
