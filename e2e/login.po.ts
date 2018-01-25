import { by, element, browser } from 'protractor';

export class LoginPage {
  static async navigateTo() {
    return await browser.get('/');
  }

  static async login() {
    await browser.driver.findElements(by.id('login'));
    return await element(by.id('login')).click();
  }
}
