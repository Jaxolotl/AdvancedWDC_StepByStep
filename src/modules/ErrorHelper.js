import _ from 'lodash';
import TableauShim from './TableauShim';

/**
 * @returns {undefined}
 */
const log = function log () {
    TableauShim.log(this.stringify());
};

/**
 * @returns {String}
 */
const stringify = function stringify () {
    return `
Name: ${this.name || 'Error'}
Message: ${this.message || this.toString() || 'undefined'}
Code: ${_.get(this, 'code')}
Stack: ${this.stack || 'unavailable'}`;
};

/**
 * @todo Should we throw an error if message is undefined?
 *
 * @param {String|Error} message
 * @returns {Error}
 */
const makeErrorFromMessage = function makeErrorFromMessage (message) {
    return _.isError(message) ? message : (new Error(message));
};

const DEFAULT_ERROR_NAME = 'Generic WDC Error';

const ErrorHelper = {
    /**
     * @param {String} name
     * @param {String|Error} message
     * @param {String} code
     * @returns {Error}
     */
    createError (name = DEFAULT_ERROR_NAME, message, code) {
        return this.customizeGenericError(makeErrorFromMessage(message), name, code);
    },
    /**
     * @param {Error} error
     * @param {String} name
     * @param {String} code
     * @returns {Error}
     */
    customizeGenericError (error, name = DEFAULT_ERROR_NAME, code) {
        if (!_.isError(error)) {
            throw new Error('ErrorHelper: customizeGenericError invoked with invalid error input');
        }

        if (!error.wdcCustomError) {
            error.name = name;
            error.stringify = stringify.bind(error);
            error.log = log.bind(error);
            error.throw = () => { throw error; };
            error.wdcCustomError = true;

            if (!_.isUndefined(code)) {
                error.code = code;
            }
        }
        // @todo check this
        // error is not a literal object
        // and we're mutating it, is that what we want?
        return error;
    }
};

export default ErrorHelper;
