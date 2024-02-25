export class PageObjectBase {

  constructor(protected root: HTMLDivElement) { }
  _inputValue(cssSelector: string, value: string) {
    const element = this.root.querySelector<HTMLInputElement>(cssSelector);
    if (element && value) {
      element.value = value;
      element.dispatchEvent(new Event('input'));
      return value;
    }
    else if (element) {
      return value;
    } else {
      throw Error('Element not found')
    }
  }
  _buttonClick(cssSelector: string) {
    const btn = this.root.querySelector<HTMLInputElement>(cssSelector);
    btn?.click();
  }

}
