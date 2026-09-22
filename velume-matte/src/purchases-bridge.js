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

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize native RevenueCat SDK
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
