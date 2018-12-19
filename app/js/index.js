const {dialog, app} = require('electron').remote;
const Store = require('electron-store');
const store = new Store({cwd: app.getPath('home') + '/.audiorecordergui'});
const path = require('path');
const savePath = '';

const exec = require('child_process').exec;

document.getElementById("saveSettings").addEventListener("click", getSettings);
document.getElementById("preview").addEventListener("click", preview);
document.getElementById("record").addEventListener("click", record);

const saveAs = document.getElementById("saveAs");
saveAs.addEventListener("click", event => {
    event.preventDefault();
    const savePath = dialog.showSaveDialog({
        defaultPath: app.getPath("desktop"),
        filters: [{
          name: 'WAV',
          extensions: ['wav']
        }]
    });

    document.getElementById("saveAsValue").innerText = savePath;
    event.stopPropagation();
});

function loadSettings() {
    document.getElementById(store.get('br')).checked = true;
    document.getElementById(store.get('sr')).checked = true;
    document.getElementById(store.get('ch')).checked = true;
}

loadSettings();

function getSettings() {
    var bitdepth = document.querySelector('input[name = "bitdepth"]:checked').value;
    var samplerate = document.querySelector('input[name = "samplerate"]:checked').value;
    var channels = document.querySelector('input[name = "channels"]:checked').value;

    var destination = document.getElementById('destination').value;
    var id = document.getElementById('fileID').value;

    store.set('br', bitdepth);
    store.set('sr', samplerate);
    store.set('ch', channels);
    store.set('dest', destination);
    store.set('id', id);
}

function preview() {
    getSettings()

    var cmd = 'xterm -e "ruby app/scripts/audiopreview.rb p"'
    exec(cmd, function(error, stdout, stderr) {
        // command output is in stdout
    })
}

function record() {
    getSettings()
    
    var cmd = 'xterm -e "ruby app/scripts/audiopreview.rb r"'
    exec(cmd, function(error, stdout, stderr) {
        // command output is in stdout
    })
}