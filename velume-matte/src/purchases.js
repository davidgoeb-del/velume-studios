import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';

// Official RevenueCat Apple Key for Velume Matte
export const REVENUECAT_APPLE_KEY = 'appl_pQqjKzcgkPZCeXLzvheZJgZyBwW';
export const ENTITLEMENT_ID = 'velume_matte_premium';
export const PRODUCT_ID = 'velume_matte_lifetime';

export class PurchasesService {
  static isInitialized = false;

  static isEntitlementActive(customerInfo) {
    if (!customerInfo || !customerInfo.entitlements || !customerInfo.entitlements.active) {
      return false;
    }
    const active = customerInfo.entitlements.active;
    return (
      typeof active['velume_matte_premium'] !== 'undefined' ||
      typeof active['premium'] !== 'undefined' ||
      typeof active['studio_pass'] !== 'undefined' ||
      Object.keys(active).length > 0
    );
  }

  static async initialize() {
    if (Capacitor.getPlatform() === 'web') {
      console.log('PurchasesService: Web platform detected. Native purchases disabled.');
      return;
    }
    if (this.isInitialized) return;

    try {
      await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
      await Purchases.configure({ apiKey: REVENUECAT_APPLE_KEY });
      this.isInitialized = true;
      console.log('PurchasesService: RevenueCat initialized successfully.');
    } catch (error) {
      console.error('PurchasesService: Error configuring RevenueCat:', error);
    }
  }

  static async checkPremiumStatus() {
    if (Capacitor.getPlatform() === 'web') {
      return localStorage.getItem('velume_matte_dev_premium') === 'true';
    }
    try {
      const result = await Purchases.getCustomerInfo();
      return this.isEntitlementActive(result.customerInfo);
    } catch (error) {
      console.error('PurchasesService: Error checking premium status:', error);
      return false;
    }
  }

  static async getLifetimePackage() {
    if (Capacitor.getPlatform() === 'web') return null;
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current && offerings.current.availablePackages.length > 0) {
        const lifetime = offerings.current.availablePackages.find(
          pkg => pkg.packageType === 'LIFETIME' || pkg.identifier === '$rc_lifetime' || pkg.identifier.includes('lifetime')
        );
        return lifetime || offerings.current.availablePackages[0];
      }
      return null;
    } catch (error) {
      console.error('PurchasesService: Error getting offerings:', error);
      return null;
    }
  }

  static async getDirectProduct() {
    if (Capacitor.getPlatform() === 'web') return null;
    try {
      const { products } = await Purchases.getProducts({ productIdentifiers: [PRODUCT_ID] });
      if (products && products.length > 0) {
        return products[0];
      }
      return null;
    } catch (error) {
      console.error('PurchasesService: Error getting direct product:', error);
      return null;
    }
  }

  static async purchaseLifetime() {
    if (Capacitor.getPlatform() === 'web') {
      alert('In-App Purchases are handled through Apple App Store on iOS.');
      return false;
    }
    try {
      const pkg = await this.getLifetimePackage();
      if (pkg) {
        const purchaseResult = await Purchases.purchasePackage({ aPackage: pkg });
        return this.isEntitlementActive(purchaseResult.customerInfo);
      }
      // Direct store product fallback
      const product = await this.getDirectProduct();
      if (product) {
        const purchaseResult = await Purchases.purchaseStoreProduct({ product });
        return this.isEntitlementActive(purchaseResult.customerInfo);
      }
      throw new Error('No lifetime package or direct product found.');
    } catch (error) {
      if (!error.userCancelled) {
        console.error('PurchasesService: Error during purchase:', error);
        alert('Purchase could not be completed. Please try again.');
      }
      return false;
    }
  }

  static async restorePurchases() {
    if (Capacitor.getPlatform() === 'web') {
      alert('Restore Purchases is available in the iOS app.');
      return false;
    }
    try {
      const result = await Purchases.restorePurchases();
      return this.isEntitlementActive(result.customerInfo);
    } catch (error) {
      console.error('PurchasesService: Error restoring purchases:', error);
      alert('Unable to restore purchases. Please check your Apple ID connection.');
      return false;
    }
  }
}
