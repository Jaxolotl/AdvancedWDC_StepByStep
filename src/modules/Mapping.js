import _ from 'lodash';
import ErrorHelper from './ErrorHelper';
import { ENUMS_DICTIONARY } from '@jaxolotl/wdclib';

/**
 * @param {Object} rule
 * @returns {String}
 */
const stringifiedRule = function stringifiedRule (rule) {
    return JSON.stringify(rule, function (key, val) {
        return (typeof val === 'function') ? '' + val : val;
    });
};

/**
 * @param {String} name
 * @param {String} message
 * @param {String} code
 * @returns {undefined}
 */
const throwRequired = function throwRequired (name, message, code) {
    throw ErrorHelper.createError(name, message, code);
};

/**
 * Class Mapping
 * Maps data following the given rules to fit into Tableau's schema
 */
class Mapping {

    /**
     * 
     */
    constructor () {
        this._mappingRules = [];
        this.transformationHandlers = {};
    }

    /**
     * @returns {Array}
     */
    get rules () {
        return [...this._mappingRules];
    }

    /**
     *
     * @param {Array} rules
     * @returns {Object}
     */
    set rules (rules = []) {

        this._mappingRules = [];

        let i = -1;
        let rulesLength = rules.length;

        while (++i < rulesLength) {
            this.addRule(rules[i]);
        }

        return this;
    }

    /**
     * @param {Object} rule
     * @returns {Object} this
     */
    addRule (rule) {
        const prevalidateRule = this.prevalidateRule(rule);

        if (_.isError(prevalidateRule)) {
            throw prevalidateRule;
        }

        this._mappingRules.push(rule);

        return this;
    }

    /**
     * add rules
     *
     * @param {Array} rules
     * @returns {Object} this
     */
    addRules (rules) {
        const l = rules.length;

        for (let i = 0; i < l; i = i + 1) {
            this.addRule(rules[i]);
        }

        return this;
    }

    /**
     * @param {String} id
     * @returns {Boolean}
     */
    isValidId (id) {
        return id.match(/^[a-z][a-z0-9_]+$/ig);
    }

    /**
     * @param {Object} rule
     * @returns {Boolean|Error}
     */
    prevalidateRule (rule) {
        if (!_.isPlainObject(rule)) {
            return ErrorHelper.createError('Mapping', `Mapping rules MUST be literal objects ${stringifiedRule(rule)}`);
        }

        if (_.isUndefined(rule.id)) {
            rule.id = this.generateid(rule);
        }

        if (!this.isValidId(rule.id)) {
            return ErrorHelper.createError('Mapping', `Invalid id  @ mappingRule item  ${stringifiedRule(rule)}`);
        }

        if (_.findIndex(this.rules, { id: rule.id }) > -1) {
            return ErrorHelper.createError('Mapping', `id MUST be unique @ mappingRule item  ${stringifiedRule(rule)}`);
        }

        if (!rule.dataType) {
            return ErrorHelper.createError('Mapping', `dataType mandatory property missing @ mappingRule item  ${stringifiedRule(rule)}`);
        }

        if (Object.keys(ENUMS_DICTIONARY.dataTypeEnum).indexOf(rule.dataType) < 0) {
            return ErrorHelper.createError('Mapping', `dataType unsupported  ${stringifiedRule(rule)}`);
        }

        if (!rule.lookup) {
            return ErrorHelper.createError('Mapping', `lookup mandatory property missing @ mappingRule item  ${stringifiedRule(rule)}`);
        }

        return true;
    }

    /**
     * @param {Function} handler
     * @param {String} key
     * @returns {Object} this
     */
    addTransformationHandler (handler, key = throwRequired('TransformationHandler', 'key param is required')) {
        if (!this.transformationHandlers) {
            this.transformationHandlers = {};
        }

        if (this.transformationHandlers[key]) {
            throw ErrorHelper.createError('TransformationHandler key', `${key} already exists on transformationHandlers object`);
        }

        if (!_.isFunction(handler)) {
            throw ErrorHelper.createError('TransformationHandler', `${handler} is not a defined valid function`);
        }

        this.transformationHandlers[key] = handler;

        return this;
    }

    /**
     * @param {mixed} value
     * @param {String|Function} handler
     * @returns {Mixed}
     */
    transform (value, handler) {
        if (!handler) {
            return value;
        }
        if (_.isString(handler) && _.isFunction(_.get(this.transformationHandlers, handler))) {
            return this.transformationHandlers[handler](value);
        }
        if (_.isFunction(handler)) {
            return handler(value);
        }

        throw ErrorHelper.createError('TransformationHandler', `${handler} is not a defined Mapping transformationHandler function`);
    }

    /**
     * From a given data, map it to the connector required data structure
     *
     * @param {Array} data the list of siblings for the data param item
     * @returns {Array}
     */
    flattenData (data) {

        let dataLength = data.length;
        let dataIndex = -1;
        const rules = this.rules;

        const ids = _.map(this.rules, 'id');
        const lookups = _.map(this.rules, 'lookup');
        const defaultValues = _.map(this.rules, 'defaultValue');

        const fieldTransformationHandlers = _.map(this.rules, 'transform');

        let output = new Array(dataLength);

        // make the base row
        while (++dataIndex < dataLength) {
            let itemData = data[dataIndex];
            if (_.isPlainObject(itemData) && !_.isEmpty(itemData)) {
                // smash cols and vals to build the base object
                output[dataIndex] = this.mapItem({
                    itemData,
                    rules,
                    lookups,
                    ids,
                    fieldTransformationHandlers,
                    defaultValues
                });
            }
        }

        // filter empty slots
        return output.filter(item => item);
    }

    /**
     * 
     * @param {Object} $0
     * @param {Object} $0.itemData
     * @param {Array} $0.rules
     * @param {Array} $0.lookups
     * @param {Array} $0.ids
     * @param {Array} $0.fieldTransformationHandlers
     * @param {Array} $0.defaultValues
     * 
     * @returns {Object}
     */
    mapItem ({
        itemData = throwRequired('mapItem', 'Missing itemData'),
        rules = throwRequired('mapItem', 'Missing rules'),
        lookups = throwRequired('mapItem', 'Missing lookups'),
        ids = throwRequired('mapItem', 'Missing ids'),
        fieldTransformationHandlers = [],
        defaultValues = []
    } = throwRequired('mapItem', 'Missing data')) {

        let colIndex = -1;
        const rowColumnsLength = rules.length;

        // The pattern new Array(n) is used to create a fixed length array to be filled afterwards,
        // is far more efficient than pushing items during iteration
        let colVals = new Array(rowColumnsLength);
        let val;

        // make the base row
        while (++colIndex < rowColumnsLength) {

            // if unable to find the value with the defined lookup, returns the default value or null
            const defaultValue = !_.isUndefined(defaultValues[colIndex]) ? defaultValues[colIndex] : null;

            val = _.get(itemData, lookups[colIndex], defaultValue);

            // transform checks if handler is defined, otherwise returns the val as is
            colVals[colIndex] = this.transform(val, fieldTransformationHandlers[colIndex]);
        }

        return _.zipObject(ids, colVals);
    }

}

export default Mapping;
