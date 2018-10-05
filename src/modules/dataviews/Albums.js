
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
     * @returns {Object} Promise/A+
     * 
     */
    getFlattenedData () {

        return this.requestor.getAlbums().then((response) => {

            let { items } = _.get(response, 'body');

            let flattenedData = this.mapping.flattenData(items);

            return Q(flattenedData);
        });
    }
}

export default Albums;
