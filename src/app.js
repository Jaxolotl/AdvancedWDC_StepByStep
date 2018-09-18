
import style from './assets/custom.css'; // eslint-disable-line no-unused-vars
import tableauwdcInit from '@jaxolotl/wdclib'; // eslint-disable-line no-unused-vars
// import Q from 'q';
import SpotifyConnector from './modules/SpotifyConnector';

tableauwdcInit();

let connector = new SpotifyConnector();

connector.register();

connector.bootstrap();
