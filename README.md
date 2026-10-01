# Installation and Configuration Steps

## Step 1: Launch AWS EC2 Instances

Provision the following Ubuntu EC2 instances:

### Jenkins Controller
Purpose:
- Host Jenkins Server
- Manage CI/CD Pipelines
- Store Credentials

Recommended Configuration:
- Instance Type: t3.medium
- Storage: 20 GB
- OS: Ubuntu 24.04 LTS

### Jenkins Worker
Purpose:
- Execute Build Jobs
- Build Docker Images
- Push Images to Docker Hub

Recommended Configuration:
- Instance Type: t3.medium
- Storage: 20 GB
- OS: Ubuntu 24.04 LTS

### Webserver EC2
Purpose:
- Run Application Containers
- Host Production Workloads

Recommended Configuration:
- Instance Type: t3.small
- Storage: 20 GB
- OS: Ubuntu 24.04 LTS

---

## Step 2: Install Jenkins on Controller EC2

Update the server:

```bash
sudo apt update
sudo apt upgrade -y
```

Install Java:

```bash
sudo apt install openjdk-21-jdk -y
```

Verify Java:

```bash
java -version
```

Install Jenkins:

```bash
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee \
  /usr/share/keyrings/jenkins-keyring.asc > /dev/null

echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null

sudo apt update
sudo apt install jenkins -y
```

Start Jenkins:

```bash
sudo systemctl enable jenkins
sudo systemctl start jenkins
```

Check status:

```bash
sudo systemctl status jenkins
```

Access Jenkins:

```text
http://<JENKINS_PUBLIC_IP>:8080
```

Retrieve admin password:

```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

---

## Step 3: Configure Jenkins Plugins

Install the following plugins:

- Git
- GitLab
- Docker Pipeline
- Pipeline
- SSH Agent
- Credentials Binding
- Workspace Cleanup

Restart Jenkins after installation.

---

## Step 4: Configure Jenkins Worker

Install Java:

```bash
sudo apt update
sudo apt install openjdk-21-jdk -y
```

Install Git:

```bash
sudo apt install git -y
```

Install Docker:

```bash
sudo apt install docker.io -y
```

Enable Docker:

```bash
sudo systemctl enable docker
sudo systemctl start docker
```

Add user to Docker group:

```bash
sudo usermod -aG docker ubuntu
```

Install Node.js:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify:

```bash
java -version
git --version
docker --version
node -v
npm -v
```

Reboot:

```bash
sudo reboot
```

---

## Step 5: Connect Worker to Jenkins

From Jenkins:

Manage Jenkins → Nodes → New Node

Configuration:

```text
Node Name: Jenkins-Worker-1
Type: Permanent Agent
Remote Root Directory:
/var/jenkins-worker-1

Label:
linux
```

Launch Method:

```text
Launch agent by connecting it to the controller
```

Start the agent and verify connection.

---

## Step 6: Configure Docker Hub

Create Docker Hub account.

Create repository:

```text
sample-node-app
```

Generate Docker Hub Access Token.

Store in Jenkins Credentials:

```text
ID:
dockerhub-credentials
```

---

## Step 7: Configure GitLab

Create GitLab repository.

Example:

```text
sample-node-app
```

Store GitLab credentials in Jenkins:

```text
ID:
gitlab-credentials
```

---

## Step 8: Configure Webserver EC2

Install Docker:

```bash
sudo apt update
sudo apt install docker.io -y
```

Enable Docker:

```bash
sudo systemctl enable docker
sudo systemctl start docker
```

Add user to Docker group:

```bash
sudo usermod -aG docker ubuntu
```

Reboot:

```bash
sudo reboot
```

Verify:

```bash
docker ps
docker --version
```

---

## Step 9: Configure SSH Deployment

Store EC2 private key in Jenkins.

Credentials Type:

```text
SSH Username with Private Key
```

Configuration:

```text
ID:
webserver-id

Username:
ubuntu
```

Used for Jenkins-to-Webserver deployment.

---

## Step 10: Configure CI/CD Pipeline

Pipeline Workflow:

GitLab Repository
↓
Jenkins Checkout
↓
Application Build
↓
Docker Build
↓
Docker Push
↓
SSH to Webserver
↓
Docker Pull
↓
Container Deployment
↓
Application Available on Port 3000

---

## Step 11: Configure GitLab Webhook

GitLab Repository → Settings → Webhooks

Webhook URL:

```text
http://<JENKINS_IP>:8080/project/<JOB_NAME>
```

Enable:

```text
Push Events
```

Test webhook delivery and verify Jenkins automatic build triggering.

---

## Final Validation

Verify:

```bash
docker ps
```

Expected:

```text
sample-node-app
0.0.0.0:3000->3000/tcp
```

Access application:

```text
http://<WEBSERVER_PUBLIC_IP>:3000
```

Expected Result:

Application successfully deployed through Jenkins CI/CD pipeline.
