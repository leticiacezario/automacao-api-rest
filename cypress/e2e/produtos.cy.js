/// <reference types= "cypress"/>
import contrato from '../contratos/produtos.contrato'

describe('Teste de API - Produtos', () => {
        let token
        beforeEach(() => {
            cy.token('fulano@qa.com' , 'teste').then(tkn => {
                token = tkn
            })
        });

    it('Deve validar o contrato de produtos com sucesso', () => {
      cy.request('produtos').then(response => {
        return contrato.validateAsync(response.body)
      })  
    });


    it('Deve listar os produtos cadastrados com sucesso - GET', () => {
        cy.request({
            method: 'GET',
            url: 'produtos'
        }).should((response) => {
            expect(response.status).equal(200)
            expect(response.body).to.have.property('produtos')
        })
    });

    it('Deve cadastrar produto com sucesso - POST', () => { 
        let produto = 'Produto EBAC' + Math.floor(Math.random() * 10000)
        cy.cadastrarProduto(token,produto,10,'produto detalhes',100)
        .should((response) => {
            expect(response.status).equal(201)
            expect(response.body.message).equal('Cadastro realizado com sucesso')
        })

    });

    it('Deve validar mensagem de produto cadastrado anteriormente - POST', () => {
        cy.cadastrarProduto(token,'Samsung 60 polegadas',10,'Samsung 60 polegadas HD',100)
        .should((response) => {
        expect(response.status).equal(400)
        expect(response.body.message).equal('Já existe produto com esse nome')
    })

    });

    it('Deve editar uum produto com sucesso - PUT', () => {
        let produto = 'Produto EBAC editado' + Math.floor(Math.random() * 10000)
        cy.cadastrarProduto(token,produto,10,'produto editado',100)
        .then(response => {
            let id = response.body._id
            cy.request({
                method: 'PUT',
                url: `produtos/${id}`,
                headers: {authorization: token},
                body: {
                    "nome": produto,
                    "preco": 1000,
                    "descricao": "Produto editado",
                    "quantidade": 10000
                  }
            }).should((response) => {
                expect(response.status).equal(200)
                expect(response.body.message).equal('Registro alterado com sucesso')
        });
        })
        
})

    it('Deve deletar um produto com sucesso - DELETE', () => {
        cy.cadastrarProduto(token, 'Produto EBAC a ser deletado', 100, 'Delete', 100)
        .then(response => {
            let id = response.body._id
            cy.request({
                method: 'DELETE',
                url: `produtos/${id}`,
                headers: {authorization: token}
            }).should(response => {
                expect(response.body.message).to.equal('Registro excluído com sucesso')
                expect(response.status).to.equal(200)
                
            })
        })
    });

})