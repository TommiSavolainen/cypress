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

    describe('Login', function () {
        it('succeeds with correct credentials', function () {
            cy.get('#username').type('tommi');
            cy.get('#password').type('salasana');
            cy.get('#login-button').click();

            cy.contains('Tommi Savolainen logged-in');
        });

        it('fails with wrong credentials', function () {
            cy.get('#username').type('tommi');
            cy.get('#password').type('wrong');
            cy.get('#login-button').click();

            cy.get('.error').should('contain', 'error: wrong username or password').and('have.css', 'color', 'rgb(255, 0, 0)');
        });
    });
    describe('When logged in', function () {
        beforeEach(function () {
            cy.get('#username').type('tommi');
            cy.get('#password').type('salasana');
            cy.get('#login-button').click();
            cy.contains('new blog').click();
            cy.get('#title').type('a blog 2 created by cypress');
            cy.get('#author').type('cypress 2');
            cy.get('#url').type('www.cypress2.com');
            cy.get('#create-button').click();
        });
        it('A blog can be created', function () {
            cy.get('#new-blog').click();
            cy.get('#title').type('a blog created by cypress');
            cy.get('#author').type('cypress');
            cy.get('#url').type('www.cypress.com');
            cy.get('#create-button').click();
            cy.contains('a blog created by cypress');
        });
        it('A blog can be liked', function () {
            cy.contains('view').click();
            cy.contains('like').click();
            cy.contains('likes 1');
        });
        it('A blog can be deleted', function () {
            cy.contains('view').click();
            cy.contains('remove').click();
            cy.get('.success').should('contain', 'Blog removed successfully');
        });
        it('A blog cannot be deleted by another user', function () {
            cy.contains('logout').click();
            const user = {
                name: 'Tommi Savolainen',
                username: 'tommi2',
                password: 'salasana',
            };
            cy.request('POST', 'http://localhost:3003/api/users/', user);
            cy.get('#username').type('tommi2');
            cy.get('#password').type('salasana');
            cy.get('#login-button').click();
            cy.contains('view').click();
            cy.get('#remove-button').should('exist').and('have.css', 'display', 'none');
        });
        it('Blogs are ordered by likes', function () {
            cy.get('#new-blog').click();
            cy.get('#title').type('a blog 3 created by cypress');
            cy.get('#author').type('cypress 3');
            cy.get('#url').type('www.cypress3.com');
            cy.get('#create-button').click();
            cy.contains('view').click();
            cy.contains('like').click();
            cy.wait(500);
            cy.contains('like').click();
            cy.wait(500);
            cy.contains('like').click();
            cy.wait(500);
            cy.contains('like').click();
            cy.wait(500);
            cy.contains('like').click();
            cy.wait(500);
            cy.contains('like').click();
            cy.wait(500);
            cy.contains('like').click();
            cy.get('.note').then((blogs) => {
                cy.wrap(blogs[0]).contains('likes 7');
                cy.wrap(blogs[1]).contains('view').click();
                cy.wrap(blogs[1]).contains('likes 0');
            });
        });
    });
});
