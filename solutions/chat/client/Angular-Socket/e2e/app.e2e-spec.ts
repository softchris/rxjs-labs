import { AngularSocketPage } from './app.po';

describe('angular-socket App', () => {
  let page: AngularSocketPage;

  beforeEach(() => {
    page = new AngularSocketPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
