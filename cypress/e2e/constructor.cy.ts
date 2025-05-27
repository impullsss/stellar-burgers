import * as orderFixture from '../fixtures/order.json';

// Вынос всех селекторов в константы
const SELECTORS = {
  INGREDIENT: {
    BUN: '[data-ingredient="bun"]',
    MAIN: '[data-ingredient="main"]',
    SAUCE: '[data-ingredient="sauce"]',
    FIRST_BUN: '[data-ingredient="bun"]:first-of-type',
    FIRST_MAIN: '[data-ingredient="main"]:first-of-type',
    BUTTON: 'button'
  },
  MODAL: {
    CONTAINER: '#modals',
    CLOSE_BUTTON: '#modals button:first-of-type',
    OVERLAY: '#modals>div:nth-of-type(2)',
    TITLE: '#modals h2:first-of-type'
  },
  ORDER: {
    BUTTON: '[data-order-button]'
  }
};

describe('E2E тест конструктора бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });
    cy.visit('/');
  });

  it('Список ингредиентов доступен для выбора', () => {
    cy.get(SELECTORS.INGREDIENT.BUN).should('have.length.at.least', 1);
    cy.get(`${SELECTORS.INGREDIENT.MAIN},${SELECTORS.INGREDIENT.SAUCE}`).should(
      'have.length.at.least',
      1
    );
  });

  describe('Проверка работы модальных окон описаний ингредиентов', () => {
    describe('Проверка открытия модальных окон', () => {
      it('Базовое открытие по карточке ингредиента', () => {
        cy.get(SELECTORS.INGREDIENT.FIRST_BUN).click();
        cy.get(SELECTORS.MODAL.CONTAINER).children().should('have.length', 2);
      });

      it('Модальное окно с ингредиентом будет открыто после перезагрузки страницы', () => {
        cy.get(SELECTORS.INGREDIENT.FIRST_BUN).click();
        cy.reload(true);
        cy.get(SELECTORS.MODAL.CONTAINER).children().should('have.length', 2);
      });
    });

    describe('Проверка закрытия модальных окон', () => {
      it('Через нажатие на крестик', () => {
        cy.get(SELECTORS.INGREDIENT.FIRST_BUN).click();
        cy.get(SELECTORS.MODAL.CLOSE_BUTTON).click();
        cy.wait(500);
        cy.get(SELECTORS.MODAL.CONTAINER).children().should('have.length', 0);
      });

      it('Через нажатие на оверлей', () => {
        cy.get(SELECTORS.INGREDIENT.FIRST_BUN).click();
        cy.get(SELECTORS.MODAL.OVERLAY).click({ force: true });
        cy.wait(500);
        cy.get(SELECTORS.MODAL.CONTAINER).children().should('have.length', 0);
      });

      it('Через нажатие на Escape', () => {
        cy.get(SELECTORS.INGREDIENT.FIRST_BUN).click();
        cy.get('body').type('{esc}');
        cy.wait(500);
        cy.get(SELECTORS.MODAL.CONTAINER).children().should('have.length', 0);
      });
    });
  });

  describe('Процесс оформления заказа', () => {
    beforeEach(() => {
      cy.setCookie('accessToken', 'EXAMPLE_ACCESS_TOKEN');
      localStorage.setItem('refreshToken', 'EXAMPLE_REFRESH_TOKEN');

      cy.intercept('GET', 'api/auth/user', { fixture: 'user' });
      cy.intercept('POST', 'api/orders', { fixture: 'order' });
      cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });

      cy.visit('/');
    });

    it('Базовая процедура оформления ПОСЛЕ авторизации', () => {
      cy.get(SELECTORS.ORDER.BUTTON).should('be.disabled');
      cy.get(
        `${SELECTORS.INGREDIENT.FIRST_BUN} ${SELECTORS.INGREDIENT.BUTTON}`
      ).click();
      cy.get(SELECTORS.ORDER.BUTTON).should('be.disabled');
      cy.get(
        `${SELECTORS.INGREDIENT.FIRST_MAIN} ${SELECTORS.INGREDIENT.BUTTON}`
      ).click();
      cy.get(SELECTORS.ORDER.BUTTON).should('be.enabled');

      cy.get(SELECTORS.ORDER.BUTTON).click();

      cy.get(SELECTORS.MODAL.CONTAINER).children().should('have.length', 2);
      cy.get(SELECTORS.MODAL.TITLE).should(
        'have.text',
        orderFixture.order.number
      );
      cy.get(SELECTORS.ORDER.BUTTON).should('be.disabled');
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });
  });
});
