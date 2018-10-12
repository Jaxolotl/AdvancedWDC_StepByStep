/* eslint-env node, mocha, jest */

import ErrorHelper from './ErrorHelper';

/**
 * 
 * ErrorHelper Test suite
 */
describe('ErrorHelper Module SHOULD', () => {

    it('createError should return an error object', () => {
        let err = ErrorHelper.createError('Hi', 'this is an error', 73);
        expect(err).toBeInstanceOf(Error);
        expect(err.name).toBe('Hi');
        expect(err.message).toBe('this is an error');
        expect(err.code).toBe(73);
    });

    it('customizeGenericError should add stringify, log, and wdcCustomError to a standard Error object', () => {
        let err = new Error('Sample Error');

        expect(err.stringify).toBeUndefined();
        expect(err.log).toBeUndefined();
        expect(err.throw).toBeUndefined();
        expect(err.wdcCustomError).toBeUndefined();

        ErrorHelper.customizeGenericError(err);

        expect(err.stringify).toBeInstanceOf(Function);
        expect(err.log).toBeInstanceOf(Function);
        expect(err.throw).toBeInstanceOf(Function);
        expect(err.wdcCustomError).toBe(true);

    });

    it('check error.throw function', () => {
        let err = ErrorHelper.createError('Hi', 'this is an error', 73);
        expect(() => { err.throw(); }).toThrowError('this is an error');
    });

});
