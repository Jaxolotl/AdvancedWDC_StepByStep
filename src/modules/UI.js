import $ from 'jquery';
import TableauShim from './TableauShim';
import TERMS from './termsDictionary';

/**
 * 
 */
class UI {

    /**
     * @memberof UI
     * @static
     * 
     * @param {String} contentToShow
     * 
     * @returns {Undefined}
     */
    static toggleUIState (contentToShow) {
        $('.app').attr('data-display', contentToShow);
    }

    /**
     * @memberof UI
     * @static
     * 
     * @returns {Undefined}
     */
    static redirectToSignIn () {
        window.location.href = `/login?authPurpose=${TableauShim.authPurpose}`;
    }

    /**
     * 
     */
    static get filteValue () {
        return $('input[name="term"]:checked').val();
    }

    /**
     * @memberof UI
     * @static
     * 
     * @param {String} value short_term|medium_term|long_term
     */
    static set filteValue (value) {
        $(`input[name="term"][value=${value}]`).click();
    }

    /**
     * @memberof UI
     * @static
     * 
     * @returns {Undefined}
     */
    static submitConfiguration () {

        let filterBy = this.filteValue;

        /**
         * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableau.authtype
         */
        TableauShim.authType = TableauShim.authTypeEnum.custom;

        /**
         * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableau.connectionname
         */
        TableauShim.connectionName = TERMS.CONNECTOR_NAME;

        /**
         * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableau.connectiondata
         * @see http://tableau.github.io/webdataconnector/docs/wdc_phases#pass-data-between-phases
         */
        TableauShim.connectionData = {
            filterBy
        };

        /**
         * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableau.submit
         */
        TableauShim.submit();
    }

    /**
     * @memberof UI
     * @static
     * 
     * @returns {Undefined}
     */
    static setFilterFromConnectionData () {
        let { filterBy } = TableauShim.connectionData;

        if (filterBy) {
            this.filteValue = filterBy;
        }
    }

    /**
     * @memberof UI
     * @static
     * 
     * @returns {Undefined}
     */
    static bootstrap () {
        /**
         *
         */
        $(() => {

            $('.app')
                .on('click', '#getdata', () => this.submitConfiguration())
                .on('click', '#signIn', () => this.redirectToSignIn());

        });

    }
}

export default UI;
