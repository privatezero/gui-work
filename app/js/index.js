const {dialog, app} = require('electron').remote;
const Store = require('electron-store');
const store = new Store({cwd: app.getPath('home') + '/.audiorecordergui'});
const path = require('path');
const savePath = '';

const exec = require('child_process').exec;

document.getElementById("saveSettings").addEventListener("click", getSettings);
document.getElementById("preview").addEventListener("click", preview);
document.getElementById("record").addEventListener("click", checkRecord);

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

function checkRecord() {

    const opts = {
        type: 'warning',
        buttons: ['OK'],
        title: 'Warning',
        message: "You are missing a required setting!"
    };

    var destination = document.getElementById('destination').value;
    var id = document.getElementById('fileID').value;
    if (destination == undefined || id == undefined) {
        dialog.showMessageBox(null, opts, (response) => {
            // nothing
        });
    } else {
        record();
    }
}

function record() {
    getSettings()
    
    var cmd = 'xterm -e "ruby app/scripts/audiopreview.rb r"'
    exec(cmd, function(error, stdout, stderr) {
        // command output is in stdout
    })
}