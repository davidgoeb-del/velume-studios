import { PurchasesService } from './purchases.js';
import { Capacitor } from '@capacitor/core';
import { Camera } from '@capacitor/camera';

window.PurchasesService = PurchasesService;

window.pickPhotoFromLibrary = async function() {
  if (!Capacitor.isNativePlatform()) {
    return null;
  }
  try {
    const result = await Camera.pickImages({
      limit: 1,
      quality: 100
    });
    if (result && result.photos && result.photos.length > 0) {
      return result.photos[0].webPath;
    }
  } catch (err) {
    console.log('Camera.pickImages cancelled or failed:', err);
  }
  return null;
};

const APPLE_APP_STORE_URL = 'https://apps.apple.com/app/id6808384129';
const APPLE_ICON_SVG = `<svg style="width:15px;height:15px;fill:currentColor;vertical-align:-2px;margin-right:6px;" viewBox="0 0 170 170"><path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.7-11.64-13.98-5.54-8.59-9.87-18.49-13-29.69-3.13-11.2-4.7-21.72-4.7-31.56 0-13.37 3.39-24.64 10.17-33.8 6.78-9.16 15.35-13.82 25.72-13.98 5.43 0 11.19 1.54 17.3 4.62 6.1 3.08 10.15 4.67 12.13 4.77 1.52 0 5.8-1.63 12.84-4.89 7.03-3.26 13.06-4.73 18.08-4.42 14.02 1.09 24.67 6.47 31.95 16.14-12.4 7.5-18.49 17.61-18.28 30.33.22 10.01 4.08 18.37 11.59 25.07 7.51 6.71 16.3 10.55 26.37 11.53-2.18 6.74-4.8 13.59-7.87 20.55zM119.22 31.84c0-7.39 2.66-14.18 7.98-20.37 5.33-6.19 11.85-10.05 19.57-11.57.22 1.3.33 2.5.33 3.59 0 7.39-2.77 14.35-8.31 20.88-5.54 6.53-12.28 10.38-20.22 11.53-.21-1.3-.35-2.65-.35-4.06z"/></svg>`;

document.addEventListener('DOMContentLoaded', async () => {
  // If running on web (desktop/mobile browser), configure the App Store Funnel
  if (!Capacitor.isNativePlatform()) {
    const btnText = document.getElementById('pass-price-display');
    if (btnText) {
      btnText.innerHTML = `${APPLE_ICON_SVG}Get on App Store &bull; $1.49`;
    }
    const restoreBtn = document.querySelector('.pass-restore-btn');
    if (restoreBtn) {
      restoreBtn.textContent = 'Studio Pass on iOS App Store';
    }
    const legalNotice = document.querySelector('.pass-legal');
    if (legalNotice) {
      legalNotice.innerHTML = 'Lifetime Studio Pass is available on the Apple App Store for iPhone &amp; iPad. One-time purchase of $1.49.';
    }
    return;
  }

  // Native iOS RevenueCat initialization
  await PurchasesService.initialize();

  // Check if user already owns the Lifetime Studio Pass
  const isUnlocked = await PurchasesService.checkPremiumStatus();
  if (isUnlocked && typeof window.setPremiumUnlocked === 'function') {
    window.setPremiumUnlocked(true);
  }

  // Dynamically update price string from Apple App Store / RevenueCat
  try {
    let priceString = null;
    const pkg = await PurchasesService.getLifetimePackage();
    if (pkg && pkg.product && pkg.product.priceString) {
      priceString = pkg.product.priceString;
    } else {
      const direct = await PurchasesService.getDirectProduct();
      if (direct && direct.priceString) {
        priceString = direct.priceString;
      }
    }
    if (priceString) {
      const btnText = document.getElementById('pass-price-display');
      if (btnText) {
        btnText.textContent = `Launch Special • ${priceString}`;
      }
    }
  } catch (e) {
    console.log('PurchasesBridge: Could not fetch offerings price:', e);
  }
});

// UI Handlers for Studio Pass Purchase and Restore
window.handlePurchaseStudioPass = async function() {
  if (!Capacitor.isNativePlatform()) {
    window.open(APPLE_APP_STORE_URL, '_blank');
    return;
  }

  const btn = document.getElementById('btn-unlock-pass');
  if (btn) {
    btn.disabled = true;
    btn.style.opacity = '0.6';
  }
  try {
    const success = await PurchasesService.purchaseLifetime();
    if (success) {
      if (typeof window.setPremiumUnlocked === 'function') {
        window.setPremiumUnlocked(true);
      }
      if (typeof window.closeStudioPassPaywall === 'function') {
        window.closeStudioPassPaywall();
      }
      alert('Welcome to Velume Matte Studio! All features unlocked forever.');
    }
  } catch (e) {
    console.error('PurchasesBridge: Purchase error:', e);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.style.opacity = '1';
    }
  }
};

window.handleRestorePurchases = async function() {
  if (!Capacitor.isNativePlatform()) {
    alert('Studio Pass purchases are linked to your Apple ID on iOS.\n\nOpen Velume Matte on the Apple App Store to download on your iPhone or iPad.');
    window.open(APPLE_APP_STORE_URL, '_blank');
    return;
  }

  try {
    const success = await PurchasesService.restorePurchases();
    if (success) {
      if (typeof window.setPremiumUnlocked === 'function') {
        window.setPremiumUnlocked(true);
      }
      if (typeof window.closeStudioPassPaywall === 'function') {
        window.closeStudioPassPaywall();
      }
      alert('Purchases restored successfully. Your Studio Pass is active!');
    } else {
      alert('No previous purchase found for this Apple ID.');
    }
  } catch (e) {
    console.error('PurchasesBridge: Restore error:', e);
  }
};
