import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';

const REVENUECAT_API_KEY = 'appl_NCkNtfIhOVYMTBjQENDTGSmiMiJ';
const ENTITLEMENT_ID = 'lifetime';

export class PurchasesService {
  static async initialize() {
    if (Capacitor.getPlatform() === 'web') return;
    try {
      await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
      await Purchases.configure({ apiKey: REVENUECAT_API_KEY });
    } catch (error) {
      console.error('PurchasesService: Error configuring RevenueCat:', error);
    }
  }

  static async checkPremiumStatus(): Promise<boolean> {
    if (Capacitor.getPlatform() === 'web') return false;
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
    } catch (error) {
      console.error('PurchasesService: Error checking customer info:', error);
      return false;
    }
  }

  static async purchaseLifetimeUnlock(): Promise<boolean> {
    if (Capacitor.getPlatform() === 'web') {
      alert('In-App Purchases are only available on iOS.');
      return false;
    }
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
        const purchaseResult = await Purchases.purchasePackage({ package: offerings.current.availablePackages[0] });
        if (typeof purchaseResult.customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined') {
          return true;
        }
      }
      return false;
    } catch (error: any) {
      if (!error.userCancelled) {
        console.error('PurchasesService: Error during purchase:', error);
      }
      return false;
    }
  }

  static async restorePurchases(): Promise<boolean> {
    if (Capacitor.getPlatform() === 'web') return false;
    try {
      const customerInfo = await Purchases.restorePurchases();
      return typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
    } catch (error) {
      console.error('PurchasesService: Error restoring purchases:', error);
      return false;
    }
  }
}
