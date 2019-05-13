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

    this.script_1 = document.createElement('script');
    this.node.appendChild(this.script_1);

    //this.img = document.createElement('img');
    //this.img.className = 'jp-rootCartoon';
    //this.node.appendChild(this.img);

console.log('lol');
    this.script_1.type = 'text/javascript';
    this.script_1.src = '../src/jsroot570/scripts/JSRootCore.min.js';

//      `<div class="jp-rootAttribution">
//        <a href="https://creativecommons.org/licenses/by-nc/2.5/" class="jp-xkcdAttribution" target="_blank">
//          <img src="https://licensebuttons.net/l/by-nc/2.5/80x15.png" />
//        </a>
//      </div>`;
  }

  /**
   * The image element associated with the widget.
   */
  //readonly img: HTMLImageElement;
  readonly script_1: HTMLScriptElement;
//  readonly script_2: HTMLScriptElement;

  /**
   * Handle update requests for the widget.
   */
  onUpdateRequest(msg: Message): void {
    fetch('https://egszlpbmle.execute-api.us-east-1.amazonaws.com/prod').then(response => {
      return response.json();
    }).then(data => {
      //this.img.src = data.img;
      //this.img.alt = data.title;
      //this.img.title = data.alt;
      console.log('here');
      //this.img.innerHTML = 
      const s: string =
`<!DOCTYPE html>
<html lang="en">
<head>

   <meta charset="UTF-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge">

   <title>Reading geometry from the ROOT file</title>

   <script src="./jsroot570/scripts/JSRootCore.min.js" type="text/javascript"></script>

   <script type='text/javascript'>
      geom_file = "../data/geometryJLEIC.root"
      // load geometry from ROOT file
      JSROOT.OpenFile(geom_file, function(file) {
         file.ReadObject("VGM Root geometry;1", function(item){
            JSROOT.draw("drawing", item, "transp50;zoom50;nohighlight;tracks;clipy");
         });
      });
   </script>

</head>

<body>
  <div id="drawing" style="width:1000px; height:750px"></div>
</body>

</html>
`;
console.log(s);
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
