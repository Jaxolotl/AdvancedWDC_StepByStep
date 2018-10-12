/* eslint-env node, mocha, jest */

import Mapping from './Mapping';
import _ from 'lodash';

/**
 *
 * Mapping Test suite
 */
describe('Mapping Module SHOULD', () => {
    let sampleData = [
        { id: 100, name: 'Bar', type: 'simple' },
        { id: 103, name: 'Baz' },
        { id: 111, name: 'Foo' }
    ];

    it('SUCCEED creating a Mapping instance', () => {
        const myMapping = new Mapping();

        expect(Mapping).toBeInstanceOf(Function);
        expect(myMapping).toBeInstanceOf(Object);
        expect(myMapping).toBeInstanceOf(Mapping);

    });

    it('FAIL creating rules with DUPLICATED ids', () => {
        expect(() => {
            (new Mapping()).rules = [
                { lookup: 'id', dataType: 'int', id: 'UserId', alias: 'User Id' },
                { lookup: 'name', dataType: 'string', id: 'UserId', alias: 'User Name' }
            ];
        }).toThrow(/id MUST be unique @ mappingRule item/);

    });

    it('FAIL creating rules with MISSING lookup', () => {
        expect(() => {
            (new Mapping()).rules = [
                { dataType: 'int', id: 'UserId', alias: 'User Id' }
            ];
        }).toThrow(/lookup mandatory property missing @ mappingRule item/);
    });

    it('FAIL creating rules with MISSING dataType', () => {
        expect(() => {
            (new Mapping()).rules = [
                { lookup: 'id', id: 'UserId', alias: 'User Id' }
            ];
        }).toThrow(/dataType mandatory property missing @ mappingRule item/);
    });

    it('SUCCEED creating valid rules', () => {
        const myMapping = new Mapping();

        myMapping.rules = [
            { lookup: 'id', dataType: 'int', id: 'UserId', alias: 'User Id' },
            { lookup: 'name', dataType: 'string', id: 'UserName', alias: 'User Name' }
        ];

        expect(myMapping.rules).toBeInstanceOf(Array);
    });

    it('FAIL adding INVALID rule', () => {
        const err = new Mapping().prevalidateRule({
            lookup: 'id',
            dataType: 'class',
            id: 'UserId'
        });

        expect(err).toBeInstanceOf(Error);
        expect(err.name).toBe('Mapping');
        expect(err.message).toMatch(/dataType unsupported/);
    });

    it('SUCCEED adding VALID rule', () => {
        const result = new Mapping().prevalidateRule({
            lookup: 'id',
            dataType: 'int',
            id: 'UserId',
            alias: 'User Id'
        });

        expect(result).toBe(true);
    });

    it('FAIL adding INVALID transformation handler', () => {
        expect(() => (new Mapping()).addTransformationHandler('bla1', 'ble')).toThrow(/bla1 is not a defined valid function/);
    });

    it('SUCCEED adding VALID transformation handler', () => {
        const myMapping = new Mapping();

        myMapping.addTransformationHandler((value) => value.toLowerCase(), 'toLower');

        expect(myMapping.transformationHandlers.toLower).toBeInstanceOf(Function);

    });

    it('FAIL flatten data with INVALID transformation handler', () => {
        const myMapping = new Mapping();

        myMapping.rules = [
            { lookup: 'id', dataType: 'int', id: 'UserId', alias: 'User Id' },
            { lookup: 'name', dataType: 'string', id: 'UserName', alias: 'User Name', transform: 'wrong-invalid-should-fail' }
        ];

        expect(() => myMapping.flattenData(sampleData)).toThrow('wrong-invalid-should-fail is not a defined Mapping transformationHandler function');

    });

    it('SUCCEED flattening data', () => {
        const myMapping = new Mapping();

        myMapping.rules = [
            { lookup: 'id', dataType: 'int', id: 'UserId', alias: 'User Id' },
            { lookup: 'name', dataType: 'string', id: 'UserName', alias: 'User Name' },
            { lookup: 'type', dataType: 'string', id: 'Type', alias: 'Type', defaultValue: '' },
            { lookup: '.', dataType: 'string', id: 'Transaction', alias: 'Transaction', defaultValue: 'default transaction' }
        ];

        const flatData = myMapping.flattenData(sampleData);

        expect(flatData.length).toBe(3);
        expect(_.size(flatData[0])).toBe(4);

        expect(flatData[0].Type).toBe(sampleData[0].type);
        expect(flatData[1].Type).toBe('');

        expect(flatData[0].Transaction).toBe('default transaction');
    });

});
