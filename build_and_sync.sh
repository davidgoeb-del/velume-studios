#!/bin/bash
set -e

echo "🚀 Step 1: Building Lumora Essentials..."
cd /Users/david/Desktop/Lumora
npm run build
mkdir -p /Users/david/Desktop/velume-studios/www/lumora/essentials
mkdir -p /Users/david/Desktop/velume-studios/ios/App/App/public/lumora/essentials
cp -r dist/* /Users/david/Desktop/velume-studios/www/lumora/essentials/
cp -r dist/* /Users/david/Desktop/velume-studios/ios/App/App/public/lumora/essentials/

echo "☕ Step 2: Building Lumora American Cafe Culture..."
cd /Users/david/Desktop/Lumora-American-Cafe-Culture
npm run build
mkdir -p /Users/david/Desktop/velume-studios/www/lumora/cafe
mkdir -p /Users/david/Desktop/velume-studios/ios/App/App/public/lumora/cafe
cp -r dist/* /Users/david/Desktop/velume-studios/www/lumora/cafe/
cp -r dist/* /Users/david/Desktop/velume-studios/ios/App/App/public/lumora/cafe/

echo "✨ Step 3: Building Lumora American Moments..."
cd /Users/david/Desktop/Lumora-American-Moments
npm run build
mkdir -p /Users/david/Desktop/velume-studios/www/lumora/moments
mkdir -p /Users/david/Desktop/velume-studios/ios/App/App/public/lumora/moments
cp -r dist/* /Users/david/Desktop/velume-studios/www/lumora/moments/
cp -r dist/* /Users/david/Desktop/velume-studios/ios/App/App/public/lumora/moments/

echo "📱 Step 4: Syncing all web assets to iOS..."
cd /Users/david/Desktop/velume-studios
npx cap copy ios

echo "✅ All 3 sub-apps built and copied directly to iOS! Open Xcode and hit Run (Cmd+R)."
