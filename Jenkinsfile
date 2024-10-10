pipeline {
    agent any

    stages {
        stage('Clonar repositorio') {
            steps {
                git branch: 'main', url: 'https://github.com/leticiacezario/testes-e2e-ebac-shop.git'
                bat 'npm install'
            }
        }
        stage('Test') {
            steps {
            bat 'npm start' 
               bat '''set NO_COLOR=1
                npm test'''
                bat 'npm run cypress:open'
                }
        }
    }
}