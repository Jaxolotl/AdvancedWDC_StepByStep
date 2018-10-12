/* eslint-env node, mocha, jest */

import Connector from './Connector';
import TableauShim from './TableauShim';

TableauShim.addCrossOriginException = jest.fn();

describe('Connector Module', () => {

    it('Connector should be defined', () => {
        expect(Connector).toBeInstanceOf(Object);
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

});
