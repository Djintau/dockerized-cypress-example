describe('Validate response code, absence of console errors and broken links on selected pages', () => {

    const pages = [
        { "route": "/standards/badpage", "expected_response": 404},
        { "route": "/standards/webofdevices/multimodal", "expected_response": 200 },
        { "route": "/standards/webdesign/htmlcss", "expected_response": 200 }
    ]

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
            cy.get("a:not([href*='mailto:'])").each(link => {
                if (link.prop('href')){
                    cy.request({ url: link.prop('href'), failOnStatusCode: false })
                        .its('status').then(status => {
                            if (status != 200) {
                                broken_links.push(link.prop('href'))
                            }
                        })
                } else {
                    broken_links.push(`link is missing href prop`)
                }
            })
            cy.get("img").each(img => {
                if (img.prop('src')){
                    cy.request({ url: img.prop('src'), failOnStatusCode: false })
                        .its('status').then(status => {
                            if (status != 200) {
                                broken_links.push(img.prop('src'))
                            }
                        })
                } else {
                    broken_links.push(`image is missing src prop`)
                }  
            }).then(() => {
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