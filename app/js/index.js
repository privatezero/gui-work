const electron_data = require('electron-data');
const {dialog, app} = require('electron').remote;

document.getElementById("saveSettings").addEventListener("click", getSettings);
document.getElementById("preview").addEventListener("click", preview);
document.getElementById("record").addEventListener("click", record);

const saveAs = document.getElementById("saveAs");
saveAs.addEventListener("click", event => {
    event.preventDefault();
    const savePath = dialog.showSaveDialog({defaultPath: app.getPath("desktop") });
    document.getElementById("saveAsValue").innerText = savePath;
    console.log(savePath);
    event.stopPropagation();
});

electron_data.config({
    filename: 'audiorecordergui',
});
var exec = require('child_process').exec;

function getSettings() {
    var fullPath = document.getElementById("saveAsValue").innerText;

    var bitdepth = document.querySelector('input[name = "bitdepth"]:checked').value;
    var samplerate = document.querySelector('input[name = "samplerate"]:checked').value;
    var channels = document.querySelector('input[name = "channels"]:checked').value;
    var destination = fullPath.substring(0, fullPath.lastIndexOf("/"));
    var id = fullPath.replace(/^.*[\\\/]/, '');

    electron_data.set('settings', {'br': bitdepth,'sr': samplerate,'ch': channels,'dest': destination,'id': id})
    electron_data.save()
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