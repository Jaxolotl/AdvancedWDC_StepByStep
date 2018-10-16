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
                     * alias (Optional)
                     * 
                     * The user friendly alias of this column.
                     * If this property is omitted, the column id will be used.
                     * 
                     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.columninfo.alias
                     */
                    'alias': 'Followers',
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
            'id': 'topTracks',
            'alias': 'Top Tracks',
            'columns': [
                { 'id': 'id', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'album_id', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'artist_id', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'artist_name', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'duration_ms', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.int },
                { 'id': 'explicit', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.bool },
                { 'id': 'href', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'name', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'preview_url', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'track_number', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.int },
                { 'id': 'uri', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string }
            ]
        },
        {
            'id': 'albums',
            'alias': 'Albums',
            'columns': [
                { 'id': 'id', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'added_at', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.datetime },
                { 'id': 'artist_id', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'genre1', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'genre2', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'href', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'image_link', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'name', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'popularity', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'release_date', 'dataType': 'date' },
                { 'id': 'type', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'uri', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string }
            ]
        },
        {
            'id': 'tracks',
            'alias': 'Tracks',
            'columns': [
                { 'id': 'id', 'alias': 'Track Id', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'added_at', 'alias': 'Added At Time', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.datetime },
                { 'id': 'album_id', 'alias': 'Album Id', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'artist_id', 'alias': 'Artist Id', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'artist_name', 'alias': 'Artist Name', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'duration_ms', 'alias': 'Song Duration (ms)', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.int },
                { 'id': 'explicit', 'alias': 'Is Explicit', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.bool },
                { 'id': 'href', 'alias': 'Link to Track', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'name', 'alias': 'Name', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'preview_url', 'alias': 'Track Preview Url', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'track_number', 'alias': 'Track Number', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.int },
                { 'id': 'uri', 'alias': 'Launch Spotify Link', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string }
            ]
        },
        {
            'id': 'tracksFeatures',
            'alias': 'Tracks Features',
            /**
             * description (Optional)
             * 
             * A user friendly description of the contents in this table.
             * 
             * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableinfo-1.description-1
             */
            'description': 'This table can only be joined with Tracks table',
            'columns': [
                {
                    'id': 'id',
                    'alias': 'Track Id',
                    'dataType': ENUMS_DICTIONARY.dataTypeEnum.string,
                    /**
                     * filterable (Optional)
                     * 
                     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.columninfo.filterable
                     */
                    filterable: true
                },
                {
                    'id': 'danceability',
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
            ],
            /**
             * This table can be selected ONLY by joining it with tracks table
             * Join filtering is only supported in WDC lib versions 2.2 and later.
             * 
             * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableinfo-1.joinOnly
             * @see http://tableau.github.io/webdataconnector/docs/wdc_join_filtering
             */
            'joinOnly': true,
            /**
             * foreignKey (Optional)
             * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.columninfo.foreignKey
             */
            'foreignKey': {
                'tableId': 'tracks',
                'columnId': 'id'
            }
        },
        {
            'id': 'tracksArtists',
            'alias': 'Tracks Artists',
            'description': 'This table can only be joined with Tracks table',
            'columns': [
                {
                    'id': 'id',
                    'dataType': ENUMS_DICTIONARY.dataTypeEnum.string,
                    filterable: true
                },
                { 'id': 'followers', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.int },
                { 'id': 'genre1', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'genre2', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'href', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'image_link', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'name', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'popularity', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'uri', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string }
            ],
            'joinOnly': true,
            'foreignKey': {
                'tableId': 'tracks',
                'columnId': 'artist_id'
            }
        },
        {
            'id': 'albumsArtists',
            'alias': 'Albums Artists',
            'description': 'This table can only be joined with Albums table',
            'columns': [
                {
                    'id': 'id',
                    'dataType': ENUMS_DICTIONARY.dataTypeEnum.string,
                    filterable: true
                },
                { 'id': 'followers', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.int },
                { 'id': 'genre1', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'genre2', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'href', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'image_link', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'name', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'popularity', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string },
                { 'id': 'uri', 'dataType': ENUMS_DICTIONARY.dataTypeEnum.string }
            ],
            'joinOnly': true,
            'foreignKey': {
                'tableId': 'albums',
                'columnId': 'artist_id'
            }
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
                    'id': 'tracks',
                    'alias': 'Tracks'
                },
                {
                    'id': 'tracksFeatures',
                    'alias': 'Features'
                },
                {
                    'id': 'tracksArtists',
                    'alias': 'Artists'
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
                        'tableAlias': 'Tracks',
                        'columnId': 'artist_id'
                    },
                    'right': {
                        'tableAlias': 'Artists',
                        'columnId': 'id'
                    },
                    'joinType': 'inner'
                },
                {
                    'left': {
                        'tableAlias': 'Tracks',
                        'columnId': 'id'
                    },
                    'right': {
                        'tableAlias': 'Features',
                        'columnId': 'id'
                    },
                    'joinType': 'inner'
                }
            ]
        },
        {
            'alias': 'Artists and Albums',
            'tables': [
                {
                    'id': 'albums',
                    'alias': 'Albums'
                },
                {
                    'id': 'albumsArtists',
                    'alias': 'Artists'
                }
            ],
            'joins': [
                {
                    'left': {
                        'tableAlias': 'Albums',
                        'columnId': 'artist_id'

                    },
                    'right': {
                        'tableAlias': 'Artists',
                        'columnId': 'id'
                    },
                    'joinType': 'inner'
                }
            ]
        }
    ]
};

export default ADVANCED_SCHEMA;
