import { by, element } from 'protractor';
import { LoginPage } from './login.po';
import { DashboardPage } from './dashboard.po';
export class HeroDetailPage {
  static async navigateTo(id = 'Narco') {
    await LoginPage.navigateTo();
    await LoginPage.login();
    return await DashboardPage.getHero(id);
  }

  static async getParagraphText() {
    return await element(by.css('app-root h3')).getText();
  }
}
