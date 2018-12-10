# Recording Variables

require 'yaml'
require 'json'

Runmode = ARGV[0]

if RUBY_PLATFORM.include?('linux')
  Drawfontpath = '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'
  Soxpath = 'rec'
  Ffmpegpath = 'ffmpeg'
  Ffplaypath = 'ffplay'
  Ffprobepath = 'ffprobe'
  Bwfmetaeditpath = 'bwfmetaedit'
  Mpvpath = 'mpv'
elsif RUBY_PLATFORM.include?('darwin')
  Drawfontpath = '/Library/Fonts/Andale Mono.ttf'
  Soxpath = '/usr/local/bin/rec'
  Ffmpegpath = '/usr/local/bin/ffmpeg'
  Ffplaypath = '/usr/local/bin/ffplay'
  Ffprobepath = '/usr/local/bin/ffprobe'
  Bwfmetaeditpath = '/usr/local/bin/bwfmetaedit'
  Mpvpath = '/usr/local/bin/mpv'
else
  Drawfontpath = 'some windows path'
end

Avectorscopefilter = 'avectorscope=s=300x300:r=30:zoom=5'

FILTER_CHAIN = "asplit=6[out1][a][b][c][d][e],\
[e]showvolume=w=700:c=0xff0000:r=30[e1],\
[a]showfreqs=mode=bar:cmode=separate:size=300x300:colors=magenta|yellow[a1],\
[a1]drawbox=12:0:3:300:white@0.2[a2],[a2]drawbox=66:0:3:300:white@0.2[a3],[a3]drawbox=135:0:3:300:white@0.2[a4],[a4]drawbox=202:0:3:300:white@0.2[a5],[a5]drawbox=271:0:3:300:white@0.2[aa],\
[b]#{Avectorscopefilter}[b1],\
[b1]drawgrid=x=150:y=150:c=white@0.3[bb],\
[c]showspectrum=s=400x600:slide=scroll:mode=combined:color=rainbow:scale=lin:saturation=4[cc],\
[d]astats=metadata=1:reset=1,adrawgraph=lavfi.astats.Overall.Peak_level:max=0:min=-30.0:size=700x256:bg=Black[dd],\
[dd]drawbox=0:0:700:42:hotpink@0.2:t=42[ddd],\
[aa][bb]vstack[aabb],[aabb][cc]hstack[aabbcc],[aabbcc][ddd]vstack[aabbccdd],[e1][aabbccdd]vstack[z],\
[z]drawtext=fontfile=#{Drawfontpath}: text='%{pts \\: hms}':x=460: y=50:fontcolor=white:fontsize=30:box=1:boxcolor=0x00000000@1[fps],[fps]fps=fps=30[out0]"

# Set Configuration
sox_channels = '1 2'
ffmpeg_channels = 'stereo'
$codec_choice = 'pcm_s24le'
$soxbuffer = '50000'
$sample_rate_choice = '96000'
$filename = ''

# Load options from config file
configuration_file = File.expand_path("~/audiorecordergui/config.json")
if ! File.exist?(configuration_file)
  config_options = "destination:\nsamplerate:\nchannels:\ncodec:\norig:\nhist:\nbext:"
  File.write(configuration_file, config_options)
end
config = YAML::load_file(configuration_file)
$outputdir = config['dest']
$sample_rate_choice = config['sr']
sox_channels = config['ch']
$codec_choice = config['br']
$filename = config['id']
# $originator = config['orig']
# $history = config['hist']
# $embedbext = config['bext']

#BWF Metaedit Function
def EmbedBEXT(targetfile)
  moddatetime = File.mtime(targetfile)
  moddate = moddatetime.strftime("%Y-%m-%d")
  modtime = moddatetime.strftime("%H:%M:%S")

  #Get Input Name for Description and OriginatorReference
  file_name = File.basename(targetfile)
  originatorreference = File.basename(targetfile, '.wav')
  if originatorreference.length > 32
    originatorreference = "See Description for Identifiers"
  end
  bwfcommand = Bwfmetaeditpath + ' --reject-overwrite ' + '--Description=' + "'" + file_name + "'"  + ' --Originator=' + "'" + $originator + "'" + ' --History=' + "'" + $history + "'" + ' --OriginatorReference=' + "'" + originatorreference + "'" + ' --OriginationDate=' + moddate + ' --OriginationTime=' + modtime + ' --MD5-Embed ' + "'" + targetfile + "'"
  system(bwfcommand)
end

#Function for adjusting buffer
def BufferCheck(sr)
  if sr == '96000'
    $soxbuffer = '50000'
  elsif sr == '48000'
    $soxbuffer = '50000'
  elsif sr == '44100'
    $soxbuffer = '50000'  
  end
end

#Preview mode
if Runmode == "p"
  BufferCheck($sample_rate_choice)
  Soxcommand = Soxpath + ' -r ' + $sample_rate_choice + ' -b 32 -L -e signed-integer --buffer ' + $soxbuffer + ' -p remix ' + sox_channels
  FFmpegSTART = Ffmpegpath + ' -channel_layout ' + ffmpeg_channels + ' -i - '
  FFmpegPreview = '-f wav -c:a ' + 'pcm_s16le -dither_method triangular' + ' -ar ' + '44100' + ' -'
  FFplaycommand = Ffplaypath + ' -window_title "AudioRecorder" -f lavfi ' + '"' + 'amovie=\'pipe\:0\'' + ',' + FILTER_CHAIN + '"' 
  ffmpegcommand = FFmpegSTART + FFmpegPreview
  command = Soxcommand + ' | ' + ffmpegcommand + ' | ' + FFplaycommand
  puts command
  system(command)
end

# Record mode
if Runmode == "r"
  if ! defined? $record_iteration
    $record_iteration = 1
  else
    $record_iteration = $record_iteration + 1
  end
  if $outputdir.nil?
    $outputdir = ''
  end
  $waveform_pic = $outputdir + '/' + 'AUDIORECORDERTEMP' + $record_iteration.to_s + '.jpg'
  BufferCheck($sample_rate_choice)
  @fileoutput = $outputdir + '/' + $filename + '.wav'
  # if $filename == ''
  #   alert "Please enter an output file name!"
  # elsif File.exist?(@fileoutput)
  #   alert "A File named #{$filename} already exists at that location!"
  # elsif ! File.exist?($outputdir)
  #   alert "Please enter a valid output Directory!"
  # else
  Soxcommand = Soxpath + ' -r ' + $sample_rate_choice + ' -b 32 -L -e signed-integer --buffer ' + $soxbuffer + ' -p remix ' + sox_channels
  FFmpegSTART = Ffmpegpath + ' -channel_layout ' + ffmpeg_channels + ' -i - '
  FFmpegRECORD = '-f wav -c:a ' + $codec_choice  + ' -dither_method triangular -ar ' + $sample_rate_choice + ' -metadata comment="" -y -rf64 auto ' + @fileoutput
  FFmpegPreview = ' -f wav -c:a ' + 'pcm_s16le -dither_method triangular' + ' -ar ' + '44100' + ' -'
  FFplaycommand = Ffplaypath + ' -window_title "AudioRecorder" -f lavfi ' + '"' + 'amovie=\'pipe\:0\'' + ',' + FILTER_CHAIN + '"' 
  ffmpegcommand = FFmpegSTART + FFmpegRECORD + FFmpegPreview
  syscommand1 = Soxcommand + ' | ' + ffmpegcommand + ' | ' + FFplaycommand
  system(syscommand1)  
end