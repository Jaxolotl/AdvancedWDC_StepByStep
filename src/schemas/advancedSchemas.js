import { ENUMS_DICTIONARY } from '@jaxolotl/wdclib';

const ADVANCED_SCHEMA = {
    /**
     * 
     * TableInfo
     * Represents metadata about a table of data
     * 
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableinfo-1
     * 
     */
    'tables': [
        {
            /**
             * alias (Optional)
             * 
             * An alias for this table to be shown to the user.
             * This alias is editable by the user and must be unique across all tables used in a join.
             * If this property is omitted, the table id will be used.
             * 
             * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableinfo-1.alias
             */
            'alias': 'Top Artists',
            /**
             * id
             * 
             * A unique id for this particular table.
             * The id can only contain alphanumeric (a-z, A-Z, 0-9) and underscore characters (_).
             * The id must match the regular expression: "^[a-zA-Z0-9_]\*$".
             * 
             * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableinfo-1.id-1
             */
            'id': 'topArtists',
            /**
             * columns
             * 
             * An array of columns that belong to this table.
             * 
             * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.columninfo
             */
            'columns': [
                {
                    /**
                     * id
                     * 
                     * The id of this column. Column ids must be unique within a table.
                     * The id can only contain alphanumeric (a-z, A-Z, 0-9) and underscore characters (_).
                     * The id must match the regular expression:  "^[a-zA-Z0-9_]\*$"
                     * 
                     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.columninfo.id
                     */
                    'id': 'followers',
                    /**
                     * dataType
                     * 
                     * The data type of the value that belong to this column
                     * 
                     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.columninfo.datatype
                     */
                    'dataType': ENUMS_DICTIONARY.dataTypeEnum.int
                },
                { 'id': 'genre1', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'genre2', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'href', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'id', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'image_link', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'name', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'popularity', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'uri', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string }
            ]
        },
        {
            'alias': 'Top Tracks',
            'id': 'topTracks',
            'columns': [
                { 'id': 'album_id', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'artist_id', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'artist_name', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'duration_ms', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.int },
                { 'id': 'explicit', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.bool },
                { 'id': 'href', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'id', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'name', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'preview_url', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'track_number', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.int },
                { 'id': 'uri', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string }
            ]
        },
        {
            'alias': 'Artists',
            'id': 'artists',
            'columns': [
                { 'id': 'followers', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.int },
                { 'id': 'genre1', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'genre2', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'href', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'id', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'image_link', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'name', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'popularity', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'uri', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string }
            ]
        },
        {
            'alias': 'Albums',
            'id': 'albums',
            'columns': [
                { 'id': 'added_at', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.datetime },
                { 'id': 'artist_id', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'genre1', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'genre2', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'href', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'id', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'image_link', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'name', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'popularity', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'release_date', 'dataType': 'date' },
                { 'id': 'type', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'uri', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string }
            ]
        },
        {
            'alias': 'Tracks',
            'id': 'tracks',
            'columns': [
                { 'id': 'added_at', 'alias': 'Added At Time', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.datetime },
                { 'id': 'album_id', 'alias': 'Album Id', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'artist_id', 'alias': 'Artist Id', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'artist_name', 'alias': 'Artist Name', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'duration_ms', 'alias': 'Song Duration (ms)', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.int },
                { 'id': 'explicit', 'alias': 'Is Explicit', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.bool },
                { 'id': 'href', 'alias': 'Link to Track', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'id', 'alias': 'Track Id', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'name', 'alias': 'Name', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'preview_url', 'alias': 'Track Preview Url', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'track_number', 'alias': 'Track Number', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.int },
                { 'id': 'uri', 'alias': 'Launch Spotify Link', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                {
                    'id': 'danceability',
                    /**
                     * alias (Optional)
                     * 
                     * The user friendly alias of this column.
                     * If this property is omitted, the column id will be used.
                     * 
                     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.columninfo.alias
                     */
                    'alias': 'Danceability',
                    'dataType': ENUMS_DICTIONARY.dataTypeEnum.float,
                    /**
                     * aggType (Optional)
                     * 
                     * The default aggregation type for this column.
                     * 
                     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.columninfo.aggtype
                     */
                    'aggType': ENUMS_DICTIONARY.aggTypeEnum.avg,
                    /**
                     * numberFormat (Optional)
                     * 
                     * The default number formatting for this column.
                     * 
                     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.columninfo.numberformat
                     */
                    'defaultFormat': {
                        'numberFormat': 'percentage'
                    }
                },
                { 'id': 'energy', 'alias': 'Energy', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.float, 'aggType': ENUMS_DICTIONARY.aggTypeEnum.avg, 'defaultFormat': { 'numberFormat': 'percentage' } },
                { 'id': 'key', 'alias': 'Key', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'loudness', 'alias': 'Loudness (dB)', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.float },
                { 'id': 'mode', 'alias': 'Mode (Major or Minor)', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'speechiness', 'alias': 'Speechiness', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.float, 'aggType': ENUMS_DICTIONARY.aggTypeEnum.avg, 'defaultFormat': { 'numberFormat': 'percentage' } },
                { 'id': 'acousticness', 'alias': 'Acousticness', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.float, 'aggType': ENUMS_DICTIONARY.aggTypeEnum.avg, 'defaultFormat': { 'numberFormat': 'percentage' } },
                { 'id': 'instrumentalness', 'alias': 'Instrumentalness', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.float, 'aggType': ENUMS_DICTIONARY.aggTypeEnum.avg, 'defaultFormat': { 'numberFormat': 'percentage' } },
                { 'id': 'liveness', 'alias': 'Liveness', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.float, 'aggType': ENUMS_DICTIONARY.aggTypeEnum.avg, 'defaultFormat': { 'numberFormat': 'percentage' } },
                { 'id': 'valence', 'alias': 'Valence (Musical Positiveness)', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.float, 'aggType': ENUMS_DICTIONARY.aggTypeEnum.avg, 'defaultFormat': { 'numberFormat': 'percentage' } },
                { 'id': 'tempo', 'alias': 'Tempo (Beats per Minute)', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.float, 'aggType': ENUMS_DICTIONARY.aggTypeEnum.avg },
                { 'id': 'time_signature', 'alias': 'Time Signature', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string }
            ]
        }
    ],
    /**
     * Standard Connections
     * The metadata for standard connections, or predefined joins.
     * 
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.standardconnection
     */
    'standardConnections': [
        {
            /**
             * alias
             * 
             * An alias for the standard connection. This is the name of the connection that is displayed in Tableau Desktop.
             * 
             * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.standardconnection.alias
             */
            'alias': 'Artists and Tracks',
            /**
             * tables
             * 
             * Specifies the tables that you want to join. The table properties must match the properties defined in the table schema.
             * 
             * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.standardconnection.tables
             */
            'tables': [
                {
                    /**
                     * id
                     * 
                     * The table ID
                     */
                    'id': 'artists',
                    /**
                     * alias
                     * 
                     * An alias for the table
                     */
                    'alias': 'Artists'
                },
                {
                    'id': 'tracks',
                    'alias': 'Tracks'
                }
            ],
            /**
             * joins
             * An array of join objects which specifies which objects to join and with which join type
             * 
             * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.standardconnection.joins
             */
            'joins': [
                {
                    'left': {
                        'tableAlias': 'Artists',
                        'columnId': 'id'
                    },
                    'right': {
                        'tableAlias': 'Tracks',
                        'columnId': 'artist_id'
                    },
                    /**
                     * joinType
                     * 
                     * The join type, either 'inner' or 'left'
                     */
                    'joinType': 'inner'
                }
            ]
        },
        {
            'alias': 'Artists and Albums',
            'tables': [
                {
                    'id': 'artists',
                    'alias': 'Artists'
                },
                {
                    'id': 'albums',
                    'alias': 'Albums'
                }
            ],
            'joins': [
                {
                    'left': {
                        'tableAlias': 'Artists',
                        'columnId': 'id'
                    },
                    'right': {
                        'tableAlias': 'Albums',
                        'columnId': 'artist_id'
                    },
                    'joinType': 'inner'
                }
            ]
        }
    ]
};

export default ADVANCED_SCHEMA;
