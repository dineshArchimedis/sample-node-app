pipeline {

    agent {
        label 'jenkins-worker-1'
    }

    environment {
        IMAGE_NAME = "dineshvl460/sample-node-app"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: 'github-id',
                    url: 'https://github.com/dineshArchimedis/sample-node-app.git'
            }
        }

        stage('Application Build') {
            steps {
                sh '''
                    echo "Installing dependencies..."
                    npm install
                '''
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                    docker build \
                    -t ${IMAGE_NAME}:${BUILD_NUMBER} \
                    -t ${IMAGE_NAME}:latest \
                    .
                '''
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'docker-id',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    sh '''
                        echo "$DOCKER_PASSWORD" | docker login \
                        -u "$DOCKER_USERNAME" \
                        --password-stdin
                    '''
                }
            }
        }

        stage('Docker Push') {
            steps {
                sh '''
                    docker push ${IMAGE_NAME}:${BUILD_NUMBER}
                    docker push ${IMAGE_NAME}:latest
                '''
            }
        }

        stage('Cleanup') {
            steps {
                sh '''
                    docker logout
                    docker image prune -f
                '''
            }
        }
    }
}
