const electron_data = require('electron-data');
document.getElementById("submit").addEventListener("click", getsettings);
document.getElementById("preview").addEventListener("click", preview);
document.getElementById("record").addEventListener("click", record);
electron_data.config({
    filename: 'audiorecordergui',
});
var exec = require('child_process').exec;

function getsettings() {
    var bitdepth = document.querySelector('input[name = "bitdepth"]:checked').value;
    var samplerate = document.querySelector('input[name = "samplerate"]:checked').value;
    var channels = document.querySelector('input[name = "channels"]:checked').value;
    var destination = document.getElementById("outputlocation").value;
    var id = document.getElementById("itemid").value;
electron_data.set('settings', {'br': bitdepth,'sr': samplerate,'ch': channels,'dest': destination,'id': id})
electron_data.save()
}

function preview() {
    var cmd = 'xterm -e ruby app/scripts/audiopreview.rb'
    exec(cmd, function(error, stdout, stderr) {
  // command output is in stdout
})
}

function record() {
    var cmd = 'xterm -e app/scripts/audiorecorder.sh'
    exec(cmd, function(error, stdout, stderr) {
  // command output is in stdout
})
}