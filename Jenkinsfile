pipeline {

    agent {
        label 'jenkins-worker-1'
    }

    environment {
        IMAGE_NAME = "dineshvl460/sample-node-app"
        CONTAINER_NAME = "sample-node-app"
        WEB_SERVER = "172.31.15.191"
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
        stage('Deploy to Webserver') {
            steps {

                sshagent(['webserver-id']) {

                    sh '''
                        ssh -o StrictHostKeyChecking=no \
                        ubuntu@${WEB_SERVER} << EOF

                        echo "Connected to Webserver"

                        echo "Pulling latest Docker image..."
                        docker pull ${IMAGE_NAME}:latest

                        echo "Stopping old container..."
                        docker stop ${CONTAINER_NAME} || true

                        echo "Removing old container..."
                        docker rm ${CONTAINER_NAME} || true

                        echo "Starting new container..."
                        docker run -d \
                            --name ${CONTAINER_NAME} \
                            -p 3000:3000 \
                            --restart unless-stopped \
                            ${IMAGE_NAME}:latest

                        echo "Deployment completed!"

                        docker ps

                        EOF
                    '''
                }
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
