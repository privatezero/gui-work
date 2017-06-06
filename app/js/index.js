document.getElementById("submit").addEventListener("click", getsettings);

function getsettings() {
    var bitdepth = document.querySelector('input[name = "bitdepth"]:checked').value;
    var samplerate = document.querySelector('input[name = "samplerate"]:checked').value;
    var channels = document.querySelector('input[name = "channels"]:checked').value;
    console.log(samplerate)
    console.log(bitdepth)
    console.log(channels)    
}