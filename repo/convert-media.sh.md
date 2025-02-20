```sh
# Convert video to mp4
ffmpeg -i {in-video}.mov -vcodec h264 -acodec aac {out-video}.mp4

# Convert pic to webp
ffmpeg -i pic.png -c:v libwebp pic.png.webp

# Convert document file
pandoc -i input.html -o output.md

# Convert pdf to webp using imagemagick
magick input.pdf output.webp

# Convert batch webp
find /path/to/folder -name "*.png" -exec sh -c 'ffmpeg -i "$0" -c:v libwebp -qscale:v 85 "${0%.png}.webp"' {} \;

# Convert batch to webp using magick
find ./ -name "*.jpg" -exec sh -c 'magick "$0" "${0%.jpg}.webp"' {} \;
```
