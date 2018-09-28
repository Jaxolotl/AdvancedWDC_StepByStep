import _ from 'lodash';

/**
 * window.tableau is defined by the tableau shim
 * We don't want to use the same name,
 * nor collide with it's definition
 * And we also want to make explicit "it's using a global variable"
 *
 * @returns {Object}
 */
let globalTableau = () => _.get(window, 'tableau', {});

/**
 * TableauShim
 * This is the wrapper of the global tableau object exposed by the shim
 */
const TableauShim = {
    /**
     * REFERENCE to tableau.abortForAuth
     * Called whenever the connector has invalid credentials and needs to reauthenticate its user.
     * This method must be called from the init method during the gather data phase.
     *
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableau.abortforauth
     *
     * @returns {undefined}
     */
    abortForAuth: (...args) => globalTableau().abortForAuth.apply(globalTableau(), [...args]), // eslint-disable-line no-useless-call
    /**
     * Alias for abortForAuth
     * @returns {undefined}
     */
    abortForAuthentication: (...args) => globalTableau().abortForAuth.apply(globalTableau(), [...args]), // eslint-disable-line no-useless-call
    /**
     * REFERENCE to tableau.abortWithError
     *
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableau.abortwitherror
     *
     * @returns {undefined}
     */
    abortWithError: (...args) => globalTableau().abortWithError.apply(globalTableau(), [...args]), // eslint-disable-line no-useless-call
    /**
     * REFERENCE to addCrossOriginException
     * @todo documentation not available on API documentation
     *
     * @returns {undefined}
     */
    addCrossOriginException: (...args) => globalTableau().addCrossOriginException.apply(globalTableau(), [...args]), // eslint-disable-line no-useless-call
    /**
     * WRAPPER for tableau.aggTypeEnum to make it read-only
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.aggtypeenum
     *
     * @readonly
     * @example
     * "aggTypeEnum": {
     *     "sum": "sum",
     *     "avg": "avg",
     *     "median": "median",
     *     "count": "count",
     *     "countd": "count_dist"
     * }
     *
     * @returns {Object}
     */
    get aggTypeEnum () {
        return Object.assign({}, globalTableau().aggTypeEnum);
    },
    set aggTypeEnum (drop) {
        throw new Error('TableauShim: aggTypeEnum prop is read-only');
    },
    /**
     * REFERENCE to tableau.alwaysShowAuthUI
     * If true, UI will be shown after every refresh.
     *
     * @see http://onlinehelp.tableau.com/v9.3/api/wdc/en-us/WDC/wdc_ref.htm#tableau_properties_alwaysShowAUthUI
     * @deprecated No longer maintained on v.2.* of the WDC, which is compatible only with Tableau 10.0
     *
     * @type {Boolean}
     * @returns {Boolean}
     */
    get alwaysShowAuthUI () {
        return globalTableau().alwaysShowAuthUI;
    },
    set alwaysShowAuthUI (value) {

        if (!_.isBoolean(value)) {
            throw new Error('TableauShim: alwaysShowAuthUI must be a Boolean');
        }

        globalTableau().alwaysShowAuthUI = value;
    },
    /**
     * WRAPPER of tableau.authPurpose
     * returns the authentication purpose, if value is<br />
     * "enduring" means we are running auth on server, if<br />
     * value is "ephemereal" then we are runnin on tableau desktop.
     *
     * @readonly
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableau.authpurpose
     * @returns {string}
     */
    get authPurpose () {
        return globalTableau().authPurpose;
    },
    set authPurpose (drop) {
        throw new Error('TableauShim: authPurpose prop is read-only');
    },
    /**
     * READONLY copy of tableau.authPurposeEnum
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.authpurposeenum
     *
     * @readonly
     * @example
     * "authPurposeEnum": {
     *     "ephemeral": "ephemeral",
     *     "enduring": "enduring"
     * }
     * @returns {Object}
     */
    get authPurposeEnum () {
        return Object.assign({}, globalTableau().authPurposeEnum);
    },
    set authPurposeEnum (drop) {
        throw new Error('TableauShim: authPurposeEnum prop is read-only');
    },
    /**
     * REFERENCE to tableau.authType
     * the auth type, also checks if is a valid value
     *
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableau.authtype
     *
     * @type {String}
     * @returns {String}
     */
    get authType () {
        return globalTableau().authType;
    },
    set authType (value) {

        if (_.values(this.authTypeEnum).indexOf(value) < 0) {
            throw new Error(`TableauShim: Invalid Value passed : ${JSON.stringify(value)}`);
        }

        globalTableau().authType = value;
    },
    /**
     * READONLY copy of tableau.authTypeEnum
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.authtypeenum
     *
     * @readonly
     * @example
     * "authTypeEnum": {
     *     "none": "none",
     *     "basic": "basic",
     *     "custom": "custom"
     * }
     * @returns {Object}
     */
    get authTypeEnum () {
        return Object.assign({}, globalTableau().authTypeEnum);
    },
    set authTypeEnum (drop) {
        throw new Error('TableauShim: authTypeEnum prop is read-only');
    },
    /**
     * READONLY copy of tableau.columnRoleEnum
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.columnroleenum
     *
     * @readonly
     * @example
     * "columnRoleEnum": {
     *     "dimension": "dimension",
     *     "measure": "measure"
     * }
     * @returns {Object}
     */
    get columnRoleEnum () {
        return Object.assign({}, globalTableau().columnRoleEnum);
    },
    set columnRoleEnum (drop) {
        throw new Error('TableauShim: columnRoleEnum prop is read-only');
    },
    /**
     * READONLY copy of tableau.columnTypeEnum
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.columntypeenum
     *
     * @readonly
     * @example
     * "columnTypeEnum": {
     *     "continuous": "continuous",
     *     "discrete": "discrete"
     * }
     * @returns {Object}
     */
    get columnTypeEnum () {
        return Object.assign({}, globalTableau().columnTypeEnum);
    },
    set columnTypeEnum (drop) {
        throw new Error('TableauShim: columnTypeEnum prop is read-only');
    },
    /**
     * REFERENCE to tableau.connectionData
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableau.connectiondata
     *
     * @type {Object}
     * @returns {Object}
     */
    get connectionData () {
        let data = globalTableau().connectionData;

        if (!_.isEmpty(data)) {
            return JSON.parse(data);
        }

        return {};
    },
    set connectionData (connectionData) {

        if (_.isPlainObject(connectionData)) {
            globalTableau().connectionData = JSON.stringify(connectionData);
            return;
        }

        if (_.isString(connectionData)) {
            globalTableau().connectionData = connectionData;
            return;
        }

        throw new Error('TableauShim: connectionData must be either a stringified object or a literal object');
    },
    /**
     * REFERENCE to tableau.connectionName
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableau.connectionname
     *
     * @returns {String}
     */
    get connectionName () {
        return globalTableau().connectionName;
    },
    set connectionName (value) {

        if (!_.isString(value)) {
            throw new Error('TableauShim: connectionName must be a String');
        }

        globalTableau().connectionName = value;
    },
    /**
     * REFERENCE to tableau.dataCallback
     * Passes data from the connector to Tableau.
     * You call this function from the getTableData function that's attached to your connector instance.
     * @see http://onlinehelp.tableau.com/v9.3/api/wdc/en-us/WDC/wdc_ref.htm#tableau_functions_dataCallback
     *
     * @deprecated No longer maintained on v.2.* of the WDC, which is compatible only with Tableau 10.0
     *
     * @returns {undefined}
     */
    dataCallback: (...args) => globalTableau().dataCallback.apply(globalTableau(), [...args]), // eslint-disable-line no-useless-call
    /**
     * READONLY copy of tableau.dataTypeEnum
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.datatypeenum
     *
     * @readonly
     * @example
     * "dataTypeEnum": {
     *      "bool":"bool",
     *      "date":"date",
     *      "datetime":"datetime",
     *      "float":"float",
     *      "int":"int",
     *      "string":"string"
     * }
     *
     * @returns {Object}
     */
    get dataTypeEnum () {
        return Object.assign({}, globalTableau().dataTypeEnum);
    },
    set dataTypeEnum (drop) {
        throw new Error('TableauShim: dataTypeEnum prop is read-only');
    },
    /**
     * READONLY copy of tableau.geographicRoleEnum
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.geographicroleenum
     *
     * @readonly
     * @example
     * "geographicRoleEnum": {
     *     "area_code": "area_code",
     *     "cbsa_msa": "cbsa_msa",
     *     "city": "city",
     *     "congressional_district": "congressional_district",
     *     "country_region": "country_region",
     *     "county": "county",
     *     "state_province": "state_province",
     *     "zip_code_postcode": "zip_code_postcode",
     *     "latitude": "latitude",
     *     "longitude": "longitude"
     * }
     *
     * @returns {Object}
     */
    get geographicRoleEnum () {
        return Object.assign({}, globalTableau().geographicRoleEnum);
    },
    set geographicRoleEnum (drop) {
        throw new Error('TableauShim: geographicRoleEnum prop is read-only');
    },
    /**
     * REFERENCE to tableau.headersCallback
     * @see http://onlinehelp.tableau.com/v9.3/api/wdc/en-us/WDC/wdc_ref.htm#tableau_functions_headersCallback
     * @deprecated No longer maintained on v.2.* of the WDC, which is compatible only with Tableau 10.0
     *
     * @returns {undefined}
     */
    headersCallback: (...args) => globalTableau().headersCallback.apply(globalTableau(), [...args]), // eslint-disable-line no-useless-call
    /**
     * REFERENCE to tableau.incrementalExtractColumn
     * @see http://onlinehelp.tableau.com/v9.3/api/wdc/en-us/WDC/wdc_ref.htm#tableau_properties_incrementalExtractColumn
     * @deprecated No longer maintained on v.2.* of the WDC, which is compatible only with Tableau 10.0
     *
     * @returns {String}
     */
    get incrementalExtractColumn () {
        return globalTableau().incrementalExtractColumn;
    },
    set incrementalExtractColumn (value) {

        if (!_.isString(value)) {
            throw new Error('TableauShim: incrementalExtractColumn must be a String');
        }

        globalTableau().incrementalExtractColumn = value;
    },
    /**
     * REFERENCE to tableau.initCallback
     * @see http://onlinehelp.tableau.com/v9.3/api/wdc/en-us/WDC/wdc_ref.htm#tableau_functions_initCallback
     * @deprecated No longer maintained on v.2.* of the WDC, which is compatible only with Tableau 10.0
     *
     * @returns {undefined}
     */
    initCallback: (...args) => globalTableau().initCallback.apply(globalTableau(), [...args]), // eslint-disable-line no-useless-call
    /**
     * READONLY copy of tableau.joinEnum ( no documentation available )
     *
     * @readonly
     * @example
     * "joinEnum": {
     *     "inner": "inner",
     *     "left": "left"
     * }
     *
     * @returns {Object}
     */
    get joinEnum () {
        return Object.assign({}, globalTableau().joinEnum);
    },
    set joinEnum (drop) {
        throw new Error('TableauShim: joinEnum prop is read-only');
    },
    /**
     * REFERENCE to tableau.language
     * @deprecated No longer maintained, Use locale instead
     *
     * @returns {String}
     */
    get language () {
        return globalTableau().locale;
    },
    set language (drop) {
        throw new Error('TableauShim: language prop is read-only');
    },
    /**
     * WRAPPER for tableau.locale
     * Known locales
     * en-us|zh-cn|de-de|es-es|fr-fr|ja-jp|ko-kr|pt-br
     *
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableau.locale
     *
     * @returns {string}
     */
    get locale () {
        return globalTableau().locale;
    },
    set locale (drop) {
        throw new Error('TableauShim: locale prop is read-only');
    },
    /**
     * READONLY copy of tableau.localeEnum
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.localeenum
     *
     * @readonly
     * @example
     * "localeEnum": {
     *     "america": "en-us",
     *     "brazil": "pt-br",
     *     "china": "zh-cn",
     *     "france": "fr-fr",
     *     "germany": "de-de",
     *     "japan": "ja-jp",
     *     "korea": "ko-kr",
     *     "spain": "es-es"
     * }
     *
     * @returns {Object}
     */
    get localeEnum () {
        return Object.assign({}, globalTableau().localeEnum);
    },
    set localeEnum (drop) {
        throw new Error('TableauShim: localeEnum prop is read-only');
    },
    /**
     * REFERENCE to tableau.log
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableau.log
     *
     * @returns {undefined}
     */
    log: (...args) => globalTableau().log.apply(globalTableau(), [...args]), // eslint-disable-line no-useless-call
    /**
     * REFERENCE to tableau.makeConnector
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableau.makeconnector
     *
     * Returns a new instance of a WebDataConnector.
     * This is the actual interface a WDC will be asked to implement. init
     * and shutdown are optional and will be filled in automatically if a connector does not implement these.
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.webdataconnector
     *
     * @returns {Object} WebDataConnector
     */
    makeConnector: (...args) => globalTableau().makeConnector.apply(globalTableau(), [...args]), // eslint-disable-line no-useless-call
    /**
     * READONLY copy of tableau.numberFormatEnum
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.numberformatenum
     *
     * @readonly
     * @example
     * "numberFormatEnum": {
     *     "number": "number",
     *     "currency": "currency",
     *     "scientific": "scientific",
     *     "percentage": "percentage"
     * }
     *
     * @returns {Object}
     */
    get numberFormatEnum () {
        return Object.assign({}, globalTableau().numberFormatEnum);
    },
    set numberFormatEnum (drop) {
        throw new Error('TableauShim: numberFormatEnum prop is read-only');
    },
    /**
     * REFERENCE to tableau.password
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableau.password
     *
     * @type {String}
     * @returns {String}
     */
    get password () {
        return globalTableau().password;
    },
    set password (value) {

        if (!_.isString(value)) {
            throw new Error('TableauShim: password must be a String');
        }

        globalTableau().password = value;
    },
    /**
     * WRAPPER for tableau.password in JSON form when more than username and password data is required for authentication
     * password object is arbitrary and contain a dictionary of sensitive information, e.g oauth tokens, which should't be
     * permamently stored on a workbook but are required for authentication when e.g using saved credentials keyring
     *
     * @type {String}
     * @returns {Object} passwordData
     */
    get passwordData () {
        try {
            return JSON.parse(this.password);
        } catch (e) {
            return {};
        }
    },
    set passwordData (value) {

        if (!_.isPlainObject(value)) {
            throw new Error('TableauShim: passwordData value must be a plain Object');
        }

        globalTableau().password = JSON.stringify(value);
    },
    /**
     * REFERENCE to tableau.phase
     *
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableau.phase
     *
     * @type {String}
     * @returns {String}
     */
    get phase () {
        return globalTableau().phase;
    },
    set phase (drop) {
        throw new Error('TableauShim: phase prop is read-only');
    },
    /**
     * READONLY copy of tableau.phaseEnum
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.phaseenum
     *
     * @readonly
     * @example
     * "phaseEnum": {
     *      "interactivePhase": "interactive",
     *      "authPhase": "auth",
     *      "gatherDataPhase": "gatherData"
     * }
     *
     * @returns {Object}
     */
    get phaseEnum () {
        return Object.assign({}, globalTableau().phaseEnum);
    },
    set phaseEnum (drop) {
        throw new Error('TableauShim: phaseEnum prop is read-only');
    },
    /**
     * WRAPPER for tableau.platformBuildNumber
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableau.platformBuildNumber
     * @returns {String}
     */
    get platformBuildNumber () {
        return globalTableau().platformBuildNumber;
    },
    set platformBuildNumber (drop) {
        throw new Error('TableauShim: platformBuildNumber prop is read-only');
    },
    /**
     * WRAPPER for tableau.platformEdition
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableau.platformEdition
     * @returns {String}
     */
    get platformEdition () {
        return globalTableau().platformEdition;
    },
    set platformEdition (drop) {
        throw new Error('TableauShim: platformEdition prop is read-only');
    },
    /**
     * WRAPPER for tableau.platformOs
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableau.platformOs
     * @returns {String}
     */
    get platformOs () {
        return globalTableau().platformOs;
    },
    set platformOs (drop) {
        throw new Error('TableauShim: platformOs prop is read-only');
    },
    /**
     * alias of this.platformOs
     * @returns {String}
     */
    get platformOS () {
        return this.platformOs;
    },
    set platformOS (drop) {
        throw new Error('TableauShim: platformOs prop is read-only');
    },
    /**
     * WRAPPER for tableau.platformVersion
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableau.platformVersion
     * @returns {String}
     */
    get platformVersion () {
        let [MAYOR, MINOR] = globalTableau().platformVersion.split('.');
        return `${MAYOR}.${MINOR}`;
    },
    set platformVersion (drop) {
        throw new Error('TableauShim: platformVersion prop is read-only');
    },
    /**
     * REFERENCE to tableau.registerConnector
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableau.registerconnector
     * Registers your connector with Tableau. You call this function after you have created the connector instance
     * and attached functions to the instance
     *
     * @returns {undefined}
     */
    registerConnector: (...args) => globalTableau().registerConnector.apply(globalTableau(), [...args]), // eslint-disable-line no-useless-call
    /**
     * WRAPPER of tableau.reportProgress for backwards compatibility and shim version checking
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableau.reportProgress
     *
     * @param {String} message
     * @returns {Object} Promises/A+
     */
    reportProgress: (message) => {

        if (_.isUndefined(globalTableau().reportProgress)) {
            this.log('tableau.reportProgress not available. Verify the SHIM version to be >= v2.1.2');
        } else {
            globalTableau().reportProgress(message);
        }
    },
    /**
     * REFERENCE of tableau.shutdownCallback
     *
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.webdataconnector.shutdown
     * @returns {undefined}
     */
    shutdownCallback: (...args) => globalTableau().shutdownCallback.apply(globalTableau(), [...args]), // eslint-disable-line no-useless-call
    /**
     * REFERENCE to tableau.submit
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableau.submit
     *
     * Tells Tableau that the connector has finished the interactive phase or the authentication phase.
     * After this method is called, Tableau proceeds to the gather data phase.
     *
     * @returns {undefined}
     */
    submit: (...args) => globalTableau().submit.apply(globalTableau(), [...args]), // eslint-disable-line no-useless-call
    /**
     * READONLY copy of tableau.unitsFormatEnum
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.unitsformatenum
     *
     * @readonly
     * @example
     * "unitsFormatEnum": {
     *     "thousands": "thousands",
     *     "millions": "millions",
     *     "billions_english": "billions_english",
     *     "billions_standard": "billions_standard"
     * }
     *
     * @returns {Object}
     */
    get unitsFormatEnum () {
        return Object.assign({}, globalTableau().unitsFormatEnum);
    },
    set unitsFormatEnum (drop) {
        throw new Error('TableauShim: unitsFormatEnum prop is read-only');
    },
    /**
     * REFERENCE to tableau.username
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableau.username
     *
     * @type {String}
     * @returns {String}
     */
    get username () {
        return globalTableau().username;
    },
    set username (value) {

        if (!_.isString(value)) {
            throw new Error('TableauShim: username must be a String');
        }

        globalTableau().username = value;
    },
    /**
     * REFERENCE to tableau.usernameAlias
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableau.usernameAlias
     *
     * @type {String}
     * @returns {String}
     */
    get usernameAlias () {
        return globalTableau().usernameAlias;
    },
    set usernameAlias (value) {

        if (!_.isString(value)) {
            throw new Error('TableauShim: usernameAlias must be a String');
        }

        globalTableau().usernameAlias = value;
    },
    /**
     * WRAPPER for tableau.username in JSON form when more than username and password data is required for authentication
     * username object MUST contain an own property named user for setter
     *
     * @type {String}
     * @returns {Object} userData
     */
    get userData () {
        // getter
        try {
            return JSON.parse(this.username);
        } catch (e) {
            return {};
        }
    },
    set userData (value) {

        if (!_.isPlainObject(value)) {
            throw new Error('TableauShim: userData must be an Object when allowObject is true');
        }

        if (!value.hasOwnProperty('user')) {
            throw new Error('TableauShim: userData must have a property named "user" when defined as Object');
        }

        globalTableau().username = JSON.stringify(value);
    },
    /**
     * We use the same technic the original shim
     * Check to see if the tableauVersionBootstrap is defined as a global object. If so,
     * we are running in the Tableau desktop/server context. If not, we're running in the simulator
     * @see https://github.com/tableau/wdclib/blob/master/tableauwdc.js at line 37
     *
     * @returns {Boolean}
     */
    get runningOnTableau () {
        return !!_.get(window, 'tableauVersionBootstrap');
    }
};

export default TableauShim;
