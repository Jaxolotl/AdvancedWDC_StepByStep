
import style from './assets/custom.css'; // eslint-disable-line no-unused-vars
import tableauwdcInit from '@jaxolotl/wdclib'; // eslint-disable-line no-unused-vars
import SpotifyConnector from './modules/SpotifyConnector';
import UI from './modules/UI';

tableauwdcInit();

let connector = new SpotifyConnector();

connector.register();

UI.bootstrap();
