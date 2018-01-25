import { DashboardPage } from './dashboard.po';
import { browser, by, element } from 'protractor';

describe('Page: Dashboard', () => {
  beforeEach(async() => {
    await DashboardPage.navigateTo();
  });

  it('should display message saying Top Heroes', async() => {
    expect(await DashboardPage.getParagraphText()).toEqual('Top Heroes');
  });

  describe('Navigation: ', async() => {
    const hero = 'Narco';
    const heroSelector = 'app-hero-detail h2';
    const searchSelector = 'search-box';
    const searchResultSelector = '.search-result';

    it('should go to hero when clicked', async() => {
      await browser.driver.findElements(by.css(heroSelector));
      await DashboardPage.getHero(hero);
      const elementText = await DashboardPage.getElementText(heroSelector);
      expect(elementText).toBe(`${hero} details!`);
    });

    it('should go to hero when typeahead is used for search', async() => {
      await browser.driver.findElements(by.id(searchSelector));
      let input = element(by.id(searchSelector));
      input.clear();
      input.sendKeys(hero);
      await browser.driver.findElements(by.css(searchResultSelector));
      let result = element.all(by.css(searchResultSelector)).first();
      await result.click();
      const elementText = await DashboardPage.getElementText(heroSelector);
      expect(elementText).toBe(`${hero} details!`);
    });
  });

});
