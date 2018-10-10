
import DataView from './DataView';
import Q from 'q';
import _ from 'lodash';

/**
 * 
 */
class Albums extends DataView {

    /**
     * 
     * @param {Object} $0
     * @param {Array} $0.columns
     * 
     * @returns {Object} this
     */
    defineMappingRules ({ columns } = {}) {

        let [...rules] = columns;

        for (let i = 0; i < rules.length; i++) {

            let col = rules[i];

            switch (col.id) {
                case 'added_at':
                    col.lookup = 'added_at';
                    break;
                case 'artist_id':
                    col.lookup = 'album.artists[0].id';
                    break;
                case 'genre1':
                    col.lookup = 'album.genres[0]';
                    break;
                case 'genre2':
                    col.lookup = 'album.genres[1]';
                    break;
                case 'href':
                    col.lookup = 'album.href';
                    break;
                case 'id':
                    col.lookup = 'album.id';
                    break;
                case 'image_link':
                    col.lookup = 'album.images[0].url';
                    break;
                case 'name':
                    col.lookup = 'album.name';
                    break;
                case 'popularity':
                    col.lookup = 'album.popularity';
                    break;
                case 'uri':
                    col.lookup = 'album.uri';
                    break;
                case 'release_date':
                    col.lookup = 'album.release_date';
                    break;
                case 'type':
                    col.lookup = 'album.type';
                    break;
            }
        }

        this.mapping.addRules(rules);

        return this;
    }

    /**
     * 
     * Using recursion for pagination
     * 
     * @param {Object} $0
     * @param {Function} $0.dataProgressCallback callback to send the data to Tableau
     * @param {Function<Q.Deferred>} $0.defer Deferred object to pass the promise along the recursion
     * @param {Number} $0.offset offset to be incremented on each iteration
     * 
     * @returns {Object} Promise/A+
     * 
     */
    getFlattenedData ({ dataProgressCallback, defer = Q.defer(), offset = 0 } = {}) {

        this.requestor.getAlbums({ offset }).then((response) => {

            /**
             * Assing the paging object values
             * @see https://developer.spotify.com/documentation/web-api/reference/library/get-users-saved-albums/
             */
            let { items, next, offset, limit } = _.get(response, 'body');

            let flattenedData = this.mapping.flattenData(items);

            /**
             * Send the flattened data to tableau and release memory
             */
            dataProgressCallback(flattenedData);

            /**
             * No more data?
             * Resolve the promise and return it
             */
            if (!next) {
                defer.resolve();
                return defer.promise;
            }

            /**
             * oh! we have more data
             * Let's get it!
             * Increment the offset to get the next page
             */
            this.getFlattenedData({ dataProgressCallback, defer, offset: offset + limit });

        }).catch(defer.reject);

        return defer.promise;
    }
}

export default Albums;
