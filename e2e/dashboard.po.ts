import { by, element, browser } from 'protractor';
import { LoginPage } from './login.po';
export class DashboardPage {
  static async navigateTo() {
    await LoginPage.navigateTo();
    return await LoginPage.login();
  }

  static async getParagraphText() {
    return await element(by.css('app-root h3')).getText();
  }

  static async getElementText(selector: string) {
    return await element(by.css(selector)).getText();
  }

  static async getHero(id: string) {
    await browser.driver.findElements(by.id(id));
    return await element(by.id(id)).click();
  }
}
