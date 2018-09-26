
import style from './assets/custom.css'; // eslint-disable-line no-unused-vars
import tableauwdcInit from '@jaxolotl/wdclib'; // eslint-disable-line no-unused-vars
import SpotifyConnector from './modules/SpotifyConnector';
import UI from './modules/UI';

/**
 * Initialize tableauwdc SHIM ( @see https://en.wikipedia.org/wiki/Shim_(computing) )
 * 
 * This will act as a interface between Tableau software and our connector
 */
tableauwdcInit();

/**
 * Create our connector
 */
let connector = new SpotifyConnector();

/**
 * Registers your connector with Tableau.
 * You call this function after you have created the connector instance
 * and attached functions to the instance
 * 
 * REFERENCE to tableau.registerConnector
 * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableau.registerconnector

 */
connector.register();

/**
 * Define UI bindings
 */
UI.bootstrap();
