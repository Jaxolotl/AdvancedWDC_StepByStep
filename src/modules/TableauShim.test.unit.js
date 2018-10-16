/* eslint-env node, mocha, jest */
import { ENUMS_DICTIONARY } from '@jaxolotl/wdclib';
import TableauShim from './TableauShim';

let mockGlobalTableau = {
    makeConnector: jest.fn(),
    registerConnector: jest.fn(),
    phaseEnum: ENUMS_DICTIONARY.phaseEnum,
    authPurposeEnum: ENUMS_DICTIONARY.authPurposeEnum,
    authTypeEnum: ENUMS_DICTIONARY.authTypeEnum,
    dataTypeEnum: ENUMS_DICTIONARY.dataTypeEnum,
    columnRoleEnum: ENUMS_DICTIONARY.columnRoleEnum,
    columnTypeEnum: ENUMS_DICTIONARY.columnTypeEnum,
    aggTypeEnum: ENUMS_DICTIONARY.aggTypeEnum,
    geographicRoleEnum: ENUMS_DICTIONARY.geographicRoleEnum,
    unitsFormatEnum: ENUMS_DICTIONARY.unitsFormatEnum,
    numberFormatEnum: ENUMS_DICTIONARY.numberFormatEnum,
    localeEnum: ENUMS_DICTIONARY.localeEnum,
    joinEnum: ENUMS_DICTIONARY.joinEnum,
    abortForAuth: jest.fn(),
    abortWithError: jest.fn(),
    addCrossOriginException: jest.fn(),
    log: jest.fn(),
    reportProgress: jest.fn(),
    submit: jest.fn(),
    initCallback: jest.fn(),
    headersCallback: jest.fn(),
    dataCallback: jest.fn(),
    shutdownCallback: jest.fn(),
    connectionName: '',
    connectionData: '',
    password: '',
    username: '',
    usernameAlias: '',
    incrementalExtractColumn: '',
    locale: '',
    language: '',
    authPurpose: '',
    platformOS: 'win',
    platformOs: 'win',
    platformVersion: '10.1.0',
    platformEdition: 'standard',
    platformBuildNumber: '10100.16.1005.2001',
    phase: 'interactive'
};

window.tableau = mockGlobalTableau;

describe('TableauShim Module Test Suit', () => {

    it('Pre-assigned default properties should match data type', () => {
        expect(TableauShim.abortForAuth).toBeInstanceOf(Function);
        TableauShim.abortForAuth(5);
        expect(mockGlobalTableau.abortForAuth).toBeCalledWith(5);

        expect(TableauShim.abortForAuthentication).toBeInstanceOf(Function);
        TableauShim.abortForAuthentication(5);
        expect(mockGlobalTableau.abortForAuth).toBeCalledWith(5);

        expect(TableauShim.abortWithError).toBeInstanceOf(Function);
        TableauShim.abortWithError(5);
        expect(mockGlobalTableau.abortWithError).toBeCalledWith(5);

        expect(TableauShim.addCrossOriginException).toBeInstanceOf(Function);
        TableauShim.addCrossOriginException(5);
        expect(mockGlobalTableau.addCrossOriginException).toBeCalledWith(5);

        expect(TableauShim.dataCallback).toBeInstanceOf(Function);
        TableauShim.dataCallback(5);
        expect(mockGlobalTableau.dataCallback).toBeCalledWith(5);

        expect(TableauShim.initCallback).toBeInstanceOf(Function);
        TableauShim.initCallback(5);
        expect(mockGlobalTableau.initCallback).toBeCalledWith(5);

        expect(TableauShim.registerConnector).toBeInstanceOf(Function);
        TableauShim.registerConnector(5);
        expect(mockGlobalTableau.registerConnector).toBeCalledWith(5);

        expect(TableauShim.reportProgress).toBeInstanceOf(Function);
        TableauShim.reportProgress(5);
        expect(mockGlobalTableau.reportProgress).toBeCalledWith(5);

        expect(TableauShim.shutdownCallback).toBeInstanceOf(Function);
        TableauShim.shutdownCallback(5);
        expect(mockGlobalTableau.shutdownCallback).toBeCalledWith(5);

        expect(TableauShim.submit).toBeInstanceOf(Function);
        TableauShim.submit(5);
        expect(mockGlobalTableau.submit).toBeCalledWith(5);

        expect(TableauShim.log).toBeInstanceOf(Function);
        TableauShim.log(5);
        expect(mockGlobalTableau.log).toBeCalledWith(5);

        expect(TableauShim.makeConnector).toBeInstanceOf(Function);
        TableauShim.makeConnector(5);
        expect(mockGlobalTableau.makeConnector).toBeCalledWith(5);

        expect(TableauShim.aggTypeEnum).toBeInstanceOf(Object);
        expect(TableauShim.authPurposeEnum).toBeInstanceOf(Object);
        expect(TableauShim.authTypeEnum).toBeInstanceOf(Object);
        expect(TableauShim.columnRoleEnum).toBeInstanceOf(Object);
        expect(TableauShim.columnTypeEnum).toBeInstanceOf(Object);
        expect(TableauShim.dataTypeEnum).toBeInstanceOf(Object);
        expect(TableauShim.geographicRoleEnum).toBeInstanceOf(Object);
        expect(TableauShim.headersCallback).toBeInstanceOf(Function);
        expect(TableauShim.joinEnum).toBeInstanceOf(Object);
        expect(TableauShim.localeEnum).toBeInstanceOf(Object);
        expect(TableauShim.numberFormatEnum).toBeInstanceOf(Object);
        expect(TableauShim.phaseEnum).toBeInstanceOf(Object);
        expect(TableauShim.unitsFormatEnum).toBeInstanceOf(Object);

    });

    it('State properties should match assigned state values', () => {
        expect(TableauShim.alwaysShowAuthUI).toEqual(mockGlobalTableau.alwaysShowAuthUI);
        expect(TableauShim.authPurpose).toEqual(mockGlobalTableau.authPurpose);
        expect(TableauShim.authType).toEqual(mockGlobalTableau.authType);
        expect(TableauShim.connectionName).toEqual(mockGlobalTableau.connectionName);
        expect(TableauShim.incrementalExtractColumn).toEqual(mockGlobalTableau.incrementalExtractColumn);
        expect(TableauShim.language).toEqual(mockGlobalTableau.language);
        expect(TableauShim.locale).toEqual(mockGlobalTableau.locale);
        expect(TableauShim.password).toEqual(mockGlobalTableau.password);
        expect(TableauShim.phase).toEqual(mockGlobalTableau.phase);
        expect(TableauShim.platformBuildNumber).toEqual(mockGlobalTableau.platformBuildNumber);
        expect(TableauShim.platformEdition).toEqual(mockGlobalTableau.platformEdition);
        expect(TableauShim.platformOs).toEqual(mockGlobalTableau.platformOs);
        expect(TableauShim.platformOS).toEqual(mockGlobalTableau.platformOS);
        expect(TableauShim.platformVersion).toEqual((() => {
            let [MAYOR, MINOR] = mockGlobalTableau.platformVersion.split('.');
            return `${MAYOR}.${MINOR}`;
        })());
        expect(TableauShim.username).toEqual(mockGlobalTableau.username);
        expect(TableauShim.usernameAlias).toEqual(mockGlobalTableau.usernameAlias);

    });

    it('connectionData should be parsed into object on local shim and stored as string on tableau object', () => {
        let connectionData = JSON.stringify({ 'filters': { 'timeRange': 'short_term' } });

        TableauShim.connectionData = '';

        expect(TableauShim.connectionData).toEqual({});

        TableauShim.connectionData = connectionData;

        expect(TableauShim.connectionData).toEqual(JSON.parse(mockGlobalTableau.connectionData));
        expect(JSON.stringify(TableauShim.connectionData)).toEqual(window.tableau.connectionData);

    });

    it('connectionData should throw an error if data type is not String|Object', () => {
        let thrownMessage = 'connectionData must be either a stringified object or a literal object';
        expect(() => { TableauShim.connectionData = 1; }).toThrow(thrownMessage);
        expect(() => { TableauShim.connectionData = []; }).toThrow(thrownMessage);

    });

    it('connectionName should throw an error if data type is not String', () => {
        let thrownMessage = 'connectionName must be a String';
        expect(() => { TableauShim.connectionName = 1; }).toThrow(thrownMessage);
    });

    it('username should throw an error if data type is not String', () => {
        let thrownMessage = 'username must be a String';
        expect(() => { TableauShim.username = 1; }).toThrow(thrownMessage);
    });

    it('usernameAlias should throw an error if data type is not String', () => {
        let thrownMessage = 'usernameAlias must be a String';
        expect(() => { TableauShim.usernameAlias = 1; }).toThrow(thrownMessage);
    });

    it('password should throw an error if data type is not String', () => {
        let thrownMessage = 'password must be a String';
        expect(() => { TableauShim.password = 1; }).toThrow(thrownMessage);
    });

    it('incrementalExtractColumn should throw an error if data type is not String', () => {
        let thrownMessage = 'incrementalExtractColumn must be a String';
        expect(() => { TableauShim.incrementalExtractColumn = 1; }).toThrow(thrownMessage);
    });

    it('alwaysShowAuthUI should throw an error if data type is not Boolean', () => {
        let thrownMessage = 'alwaysShowAuthUI must be a Boolean';
        expect(() => { TableauShim.alwaysShowAuthUI = 1; }).toThrow(thrownMessage);
    });

    it('Throw error on mutation attempt to read-only properties', () => {
        expect(() => { TableauShim.aggTypeEnum = 1; }).toThrow(/read-only/);
        expect(() => { TableauShim.authPurpose = 1; }).toThrow(/read-only/);
        expect(() => { TableauShim.authPurposeEnum = 1; }).toThrow(/read-only/);
        expect(() => { TableauShim.authTypeEnum = 1; }).toThrow(/read-only/);
        expect(() => { TableauShim.columnRoleEnum = 1; }).toThrow(/read-only/);
        expect(() => { TableauShim.columnTypeEnum = 1; }).toThrow(/read-only/);
        expect(() => { TableauShim.dataTypeEnum = 1; }).toThrow(/read-only/);
        expect(() => { TableauShim.geographicRoleEnum = 1; }).toThrow(/read-only/);
        expect(() => { TableauShim.joinEnum = 1; }).toThrow(/read-only/);
        expect(() => { TableauShim.localeEnum = 1; }).toThrow(/read-only/);
        expect(() => { TableauShim.phase = 1; }).toThrow(/read-only/);
        expect(() => { TableauShim.phaseEnum = 1; }).toThrow(/read-only/);
        expect(() => { TableauShim.unitsFormatEnum = 1; }).toThrow(/read-only/);
        expect(() => { TableauShim.language = 1; }).toThrow(/read-only/);
        expect(() => { TableauShim.locale = 1; }).toThrow(/read-only/);
        expect(() => { TableauShim.numberFormatEnum = 1; }).toThrow(/read-only/);
        expect(() => { TableauShim.platformBuildNumber = 1; }).toThrow(/read-only/);
        expect(() => { TableauShim.platformEdition = 1; }).toThrow(/read-only/);
        expect(() => { TableauShim.platformOs = 1; }).toThrow(/read-only/);
        expect(() => { TableauShim.platformOS = 1; }).toThrow(/read-only/);
        expect(() => { TableauShim.platformVersion = 1; }).toThrow(/read-only/);

    });

    it('userData method on setter mode should throw if input is not an object', function () {
        expect(() => { TableauShim.userData = 'myPasswd'; }).toThrow('userData must be an Object when allowObject is true');
    });

    it('userData method on setter mode  should throw if input object doesn\'t have user property', function () {
        expect(() => { TableauShim.userData = { a: 1 }; }).toThrow('userData must have a property named "user" when defined as Object');
    });

    it('userData method should set/get user data as and object', function () {

        const userData = { user: 'jax@user.com', customEndpoint: 'http://google.com' };

        expect(TableauShim.userData).toEqual({});

        TableauShim.userData = userData;
        expect(TableauShim.userData).toEqual(userData);
        expect(TableauShim.userData.user).toBe(userData.user);
        expect(TableauShim.userData.customEndpoint).toBe(userData.customEndpoint);
        expect(TableauShim.username).toBe(JSON.stringify(TableauShim.userData));
        expect(TableauShim.username).toEqual(JSON.stringify(userData));

    });

    it('passwordData method on setter mode should throw if input is not an object', function () {
        expect(() => { TableauShim.passwordData = 'myPasswd'; }).toThrow('value must be a plain Object');
    });

    it('passwordData method should set/get user data as and object', function () {

        const passwordData = { token: 'jax@user.com', secret: 'http://google.com' };

        expect(TableauShim.passwordData).toEqual({});

        TableauShim.passwordData = passwordData;
        expect(TableauShim.passwordData).toEqual(passwordData);
        expect(TableauShim.passwordData.token).toBe(passwordData.token);
        expect(TableauShim.passwordData.secret).toBe(passwordData.secret);
        expect(TableauShim.password).toBe(JSON.stringify(TableauShim.passwordData));
        expect(TableauShim.password).toEqual(JSON.stringify(passwordData));

    });

    it('enum values should be copies of tableau enum to avoid direct value modification by reference', () => {
        expect(TableauShim.aggTypeEnum).toEqual(window.tableau.aggTypeEnum);
        expect(TableauShim.aggTypeEnum).not.toBe(window.tableau.aggTypeEnum);

        expect(TableauShim.authPurposeEnum).toEqual(window.tableau.authPurposeEnum);
        expect(TableauShim.authPurposeEnum).not.toBe(window.tableau.authPurposeEnum);

        expect(TableauShim.authTypeEnum).toEqual(window.tableau.authTypeEnum);
        expect(TableauShim.authTypeEnum).not.toBe(window.tableau.authTypeEnum);

        expect(TableauShim.columnRoleEnum).toEqual(window.tableau.columnRoleEnum);
        expect(TableauShim.columnRoleEnum).not.toBe(window.tableau.columnRoleEnum);

        expect(TableauShim.columnTypeEnum).toEqual(window.tableau.columnTypeEnum);
        expect(TableauShim.columnTypeEnum).not.toBe(window.tableau.columnTypeEnum);

        expect(TableauShim.dataTypeEnum).toEqual(window.tableau.dataTypeEnum);
        expect(TableauShim.dataTypeEnum).not.toBe(window.tableau.dataTypeEnum);

        expect(TableauShim.geographicRoleEnum).toEqual(window.tableau.geographicRoleEnum);
        expect(TableauShim.geographicRoleEnum).not.toBe(window.tableau.geographicRoleEnum);

        expect(TableauShim.joinEnum).toEqual(window.tableau.joinEnum);
        expect(TableauShim.joinEnum).not.toBe(window.tableau.joinEnum);

        expect(TableauShim.localeEnum).toEqual(window.tableau.localeEnum);
        expect(TableauShim.localeEnum).not.toBe(window.tableau.localeEnum);

        expect(TableauShim.phaseEnum).toEqual(window.tableau.phaseEnum);
        expect(TableauShim.phaseEnum).not.toBe(window.tableau.phaseEnum);

        expect(TableauShim.unitsFormatEnum).toEqual(window.tableau.unitsFormatEnum);
        expect(TableauShim.unitsFormatEnum).not.toBe(window.tableau.unitsFormatEnum);
    });

    it('authType should set a valid value or throw if value is not a valid value', () => {
        let value = 'custom';
        expect(() => { TableauShim.authType = 1; }).toThrow(/Invalid Value passed/);
        expect(TableauShim.authType = value).toBe(value);
    });

    it('reportProgress to have been called with argument', () => {
        let value = 'Showing progress';
        TableauShim.reportProgress(value);
        expect(mockGlobalTableau.reportProgress).toHaveBeenCalledWith(value);
    });

    it('makeConnector to have been called', () => {
        TableauShim.makeConnector();
        expect(mockGlobalTableau.makeConnector).toHaveBeenCalled();

    });

    it('Detect if SHIM is running on Tableau', () => {
        // We use the same technic the original shim
        expect(TableauShim.runningOnTableau).toBe(false);

        window.tableauVersionBootstrap = true;
        expect(TableauShim.runningOnTableau).toBe(true);
    });

});
