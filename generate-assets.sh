#!/bin/bash

# Install required tools if not present
if ! command -v magick &> /dev/null; then
    echo "ImageMagick not found. Please install it first:"
    echo "brew install imagemagick"
    exit 1
fi

if ! command -v rsvg-convert &> /dev/null; then
    echo "librsvg not found. Please install it first:"
    echo "brew install librsvg"
    exit 1
fi

# Create a temporary stylesheet
cat > assets/light-style.css << EOL
svg { 
    --bg-color: white; 
    --icon-color: #3B82F6; 
}
EOL

# Generate light mode icon
rsvg-convert -w 1024 -h 1024 --stylesheet assets/light-style.css assets/icon-config.svg > assets/light/icon.png

# Generate dark mode icon
rsvg-convert -w 1024 -h 1024 assets/icon-config.svg > assets/dark/icon.png

# Create adaptive icon for Android (light mode)
cp assets/light/icon.png assets/light/adaptive-icon.png

# Create adaptive icon for Android (dark mode)
cp assets/dark/icon.png assets/dark/adaptive-icon.png

# Generate light mode splash screen
magick -size 2048x2048 xc:white \( assets/light/icon.png -resize 512x512 \) -gravity center -composite \
    -resize 1242x2436^ -gravity center -extent 1242x2436 \
    assets/light/splash.png

# Generate dark mode splash screen
magick -size 2048x2048 xc:'#1F2937' \( assets/dark/icon.png -resize 512x512 \) -gravity center -composite \
    -resize 1242x2436^ -gravity center -extent 1242x2436 \
    assets/dark/splash.png

# Copy default assets (using light mode)
cp assets/light/icon.png assets/icon.png
cp assets/light/adaptive-icon.png assets/adaptive-icon.png
cp assets/light/splash.png assets/splash.png

# Clean up
rm assets/light-style.css

echo "Assets generated successfully!" 