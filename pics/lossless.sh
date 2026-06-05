#!/bin/sh


for file in *.png; do
  cwebp -q 1 -m 6 -pass 10 -alpha_q 100 -af "$file" -o "${file%.png}.webp"
done

