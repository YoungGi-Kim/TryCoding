import { TryCodingPage } from './app.po';

describe('try-coding App', function() {
  let page: TryCodingPage;

  beforeEach(() => {
    page = new TryCodingPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
