import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import '../style/index.css';


/**
 * Initialization data for the jupyterlab-root-viewer extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'jupyterlab-root-viewer',
  autoStart: true,
  activate: (app: JupyterLab) => {
    console.log('JupyterLab extension jupyterlab-root-viewer is activated!');
  }
};

export default extension;
