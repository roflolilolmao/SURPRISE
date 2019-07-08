import os
import subprocess
from collections import namedtuple

files = os.listdir('./sources')

wavs = [f[:-4] for f in files if f[-4:] == '.wav']

for file in wavs:
    subprocess.run(
            'ffmpeg.exe -i sources/{}.wav -ab 320k {}.mp3'.format(file, file))
