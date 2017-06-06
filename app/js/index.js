const electron_data = require('electron-data');
document.getElementById("submit").addEventListener("click", getsettings);
electron_data.config({
    filename: 'electron_test',
});

function getsettings() {
    var bitdepth = document.querySelector('input[name = "bitdepth"]:checked').value;
    var samplerate = document.querySelector('input[name = "samplerate"]:checked').value;
    var channels = document.querySelector('input[name = "channels"]:checked').value;
electron_data.set('settings', {'br': bitdepth,'sr': samplerate,'ch': channels})
electron_data.save()
}