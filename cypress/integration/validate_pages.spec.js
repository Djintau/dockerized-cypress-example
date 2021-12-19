const pages = require('../fixtures/pages.json')

describe('Validate response code, absence of console errors and broken links on selected pages', () => {

    pages.forEach(page => {

        // array to save all broken links and image sources
        let broken_links = []

        it(`Test ${page.route} response`, () => {
            cy.request({ url: `${Cypress.config().baseUrl}${page.route}`, failOnStatusCode: false })
                .its('status').should('equal', page.expected_response)
        })

        it(`Test ${page.route} that there are no console errors on page load`, () => {
            cy.visit(`${Cypress.config().baseUrl}${page.route}`, {
                failOnStatusCode: false,
                onBeforeLoad(win) {
                    cy.spy(win.console, 'error').as('consoleError');
                }
            })
            cy.get('@consoleError').should('not.be.called')
        })

        it(`Find ${page.route} broken links`, () => {
            cy.visit(`${Cypress.config().baseUrl}${page.route}`, { failOnStatusCode: false })
            cy.validateLinks("a:not([href*='mailto:'])", "href", broken_links)
            cy.validateLinks("img", "src", broken_links)
            .then(() => {
                if (broken_links.length){
                    // logging of broken links/sources
                    cy.task('log', 'Broken links:')
                    broken_links.forEach(link => cy.task('log', link))
                }
            }).then(() => {
                expect(broken_links.length).to.equal(0)
            })
        })
    })
})