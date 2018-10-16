/* eslint-env node, mocha, jest */

import Connector from './Connector';
import TableauShim from './TableauShim';

TableauShim.addCrossOriginException = jest.fn();

describe('Connector Module', () => {

    it('Connector should be defined', () => {
        expect(Connector).toBeInstanceOf(Object);
    });

    it('init callback to be callesd', () => {
        let initCallback = jest.fn();
        (new Connector()).init(initCallback);
        expect(initCallback).toBeCalled();
    });

    it('shutdown callback to be callesd', () => {
        let shutdownCallback = jest.fn();
        (new Connector()).shutdown(shutdownCallback);
        expect(shutdownCallback).toBeCalled();
    });

    it('Connector.getHeaders to return be invoked properly', () => {
        let connector = new Connector();

        let tables = [{
            'id': 'account',
            'columns': [
                { 'id': 'ID', 'alias': 'ID', 'dataType': 'string' }
            ],
            'alias': 'Account',
            'description': 'Description'
        }];

        let standardConnections = {
            'alias': 'Joined earthquake data',
            'tables': [{
                'id': 'magPlace',
                'alias': 'Magnitude and Place'
            }, {
                'id': 'timeUrl',
                'alias': 'Time and URL'
            }],
            'joins': [{
                'left': {
                    'tableAlias': 'Magnitude and Place',
                    'columnId': 'id'
                },
                'right': {
                    'tableAlias': 'Time and URL',
                    'columnId': 'id'
                },
                'joinType': 'inner'
            }]
        };

        let schemaCallback = jest.fn();

        connector.schema = (done) => {
            done({ tables, standardConnections });
        };

        connector.getSchema(schemaCallback);

        expect(schemaCallback).toHaveBeenCalledWith(tables, standardConnections);

    });

    it('Connector.getData to return be invoked properly', () => {
        let connector = new Connector();
        let dataDoneCallback = jest.fn();
        let appendRows = jest.fn();

        let tableObject = {
            filterColumnId: undefined,
            filterValues: undefined,
            incrementValue: undefined,
            isJoinFiltered: false,
            appendRows,
            tableInfo: {
                tableId: 'my_mok_table'
            }
        };

        connector.data = ({ tableId, done, dataProgressCallback, tableProperties } = {}) => { // eslint-disable-line no-unused-vars
            dataProgressCallback(5);
            done();
        };

        connector.getData(tableObject, dataDoneCallback);

        expect(dataDoneCallback).toBeCalled();
        expect(appendRows).toHaveBeenCalledWith(5);

    });

});
