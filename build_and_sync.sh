#!/bin/bash
set -e

PLATFORM=${1:-all}

echo "========================================="
echo " Lumora Multi-Platform Build & Sync"
echo " Target: $PLATFORM"
echo "========================================="

echo "🚀 Step 1: Building Lumora Essentials..."
cd /Users/david/Desktop/Lumora
npm run build
mkdir -p /Users/david/Desktop/velume-studios/www/lumora/essentials
mkdir -p /Users/david/Desktop/velume-studios/ios/App/App/public/lumora/essentials
mkdir -p /Users/david/Desktop/velume-studios/android/app/src/main/assets/public/lumora/essentials
cp -r dist/* /Users/david/Desktop/velume-studios/www/lumora/essentials/
cp -r dist/* /Users/david/Desktop/velume-studios/ios/App/App/public/lumora/essentials/
cp -r dist/* /Users/david/Desktop/velume-studios/android/app/src/main/assets/public/lumora/essentials/

echo "☕ Step 2: Building Lumora American Cafe Culture..."
cd /Users/david/Desktop/Lumora-American-Cafe-Culture
npm run build
mkdir -p /Users/david/Desktop/velume-studios/www/lumora/cafe
mkdir -p /Users/david/Desktop/velume-studios/ios/App/App/public/lumora/cafe
mkdir -p /Users/david/Desktop/velume-studios/android/app/src/main/assets/public/lumora/cafe
cp -r dist/* /Users/david/Desktop/velume-studios/www/lumora/cafe/
cp -r dist/* /Users/david/Desktop/velume-studios/ios/App/App/public/lumora/cafe/
cp -r dist/* /Users/david/Desktop/velume-studios/android/app/src/main/assets/public/lumora/cafe/

echo "✨ Step 3: Building Lumora American Moments..."
cd /Users/david/Desktop/Lumora-American-Moments
npm run build
mkdir -p /Users/david/Desktop/velume-studios/www/lumora/moments
mkdir -p /Users/david/Desktop/velume-studios/ios/App/App/public/lumora/moments
mkdir -p /Users/david/Desktop/velume-studios/android/app/src/main/assets/public/lumora/moments
cp -r dist/* /Users/david/Desktop/velume-studios/www/lumora/moments/
cp -r dist/* /Users/david/Desktop/velume-studios/ios/App/App/public/lumora/moments/
cp -r dist/* /Users/david/Desktop/velume-studios/android/app/src/main/assets/public/lumora/moments/

echo "📱 Step 4: Syncing Capacitor platforms..."
cd /Users/david/Desktop/velume-studios

if [ "$PLATFORM" = "ios" ]; then
    npx cap sync ios
    echo "✅ Synced to iOS! Open Xcode and hit Run (Cmd+R)."
elif [ "$PLATFORM" = "android" ]; then
    npx cap sync android
    echo "✅ Synced to Android! Open Android Studio (npx cap open android)."
else
    npx cap sync
    echo "✅ All 3 sub-apps built and synced to both iOS and Android!"
fi
