describe('Blog app', function () {
    beforeEach(function () {
        cy.request('POST', 'http://localhost:3003/api/testing/reset');
        const user = {
            name: 'Tommi Savolainen',
            username: 'tommi',
            password: 'salasana',
        };
        cy.request('POST', 'http://localhost:3003/api/users/', user);
        cy.visit('http://localhost:5173');
    });
    it('front page can be opened', function () {
        cy.contains('Log in to application');
    });
});
