import { HeroDetailPage } from './hero-detail.po';
import { browser, element, by } from 'protractor';

describe('Page: Hero-Detail', () => {
  beforeEach(async() => {
    await HeroDetailPage.navigateTo();
  });

  describe('Navigation:', async() => {
    it('should navigate back to dashboard when back is clicked', async() => {
      const backSelector = 'back';
      await browser.driver.findElements(by.id(backSelector));
      await element(by.id(backSelector)).click();
      expect(HeroDetailPage.getParagraphText()).toEqual('Top Heroes');
    });
  });
});
