import {
  Widget
} from '@phosphor/widgets';

import {
  Message
} from '@phosphor/messaging';

import {
  JSONExt
} from '@phosphor/coreutils';

import {
  ICommandPalette, InstanceTracker
} from '@jupyterlab/apputils';

import {
  JupyterLab, JupyterLabPlugin, ILayoutRestorer
} from '@jupyterlab/application';

import '../style/index.css';


/**
 * CERN ROOT file viewer.
 */
class RootWidget extends Widget {
  /**
   * Construct a new ROOT widget.
   */
  constructor() {
    super();

    this.id = 'jupyterlab-root-viewer';
    this.title.label = 'root-viewer';
    this.title.closable = true;
    this.addClass('jp-rootWidget');

    this.img = document.createElement('img');
    this.img.className = 'jp-rootCartoon';
    this.node.appendChild(this.img);

    this.img.insertAdjacentHTML('afterend',
      `<div class="jp-rootAttribution">
        <a href="https://creativecommons.org/licenses/by-nc/2.5/" class="jp-xkcdAttribution" target="_blank">
          <img src="https://licensebuttons.net/l/by-nc/2.5/80x15.png" />
        </a>
      </div>`
    );
  }

  /**
   * The image element associated with the widget.
   */
  readonly img: HTMLImageElement;

  /**
   * Handle update requests for the widget.
   */
  onUpdateRequest(msg: Message): void {
    fetch('https://egszlpbmle.execute-api.us-east-1.amazonaws.com/prod').then(response => {
      return response.json();
    }).then(data => {
      this.img.src = data.img;
      this.img.alt = data.title;
      this.img.title = data.alt;
    });
  }
};


/**
 * Activate the ROOT widget extension.
 */
function activate(app: JupyterLab, palette: ICommandPalette, restorer: ILayoutRestorer) {
  console.log('JupyterLab extension jupyterlab-root-viewer is activated!');

  // Declare a widget variable
  let widget: RootWidget;

  // Add an application command
  const command: string = 'root:open';
  app.commands.addCommand(command, {
    label: 'Open ROOT file',
    execute: () => {
      if (!widget) {
        // Create a new widget if one does not exist
        widget = new RootWidget();
        widget.update();
      }
      if (!tracker.has(widget)) {
        // Track the state of the widget for later restoration
        tracker.add(widget);
      }
      if (!widget.isAttached) {
        // Attach the widget to the main work area if it's not there
        app.shell.addToMainArea(widget);
      } else {
        // Refresh the comic in the widget
        widget.update();
      }
      // Activate the widget
      app.shell.activateById(widget.id);
    }
  });

  // Add the command to the palette.
  palette.addItem({ command, category: 'CERN ROOT' });

  // Track and restore the widget state
  let tracker = new InstanceTracker<Widget>({ namespace: 'root' });
  restorer.restore(tracker, {
    command,
    args: () => JSONExt.emptyObject,
    name: () => 'root'
  });  
};


/**
 * Initialization data for the jupyterlab-root-viewer extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'jupyterlab-root-viewer',
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer],
  activate: activate
};

export default extension;
