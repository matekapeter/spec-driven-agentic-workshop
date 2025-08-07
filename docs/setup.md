# 🚀 Spec-Driven Agentic Dev Workshop - Setup Guide

👋 Welcome to the **Spec-Driven Agentic Dev Workshop**! This guide will help you prepare your development environment for our hands-on sessions. Please complete this setup **before the first session** to ensure we can focus on learning rather than troubleshooting.

## 🛠️ Installation Steps

### 1. Install Docker and Docker Compose

**For Ubuntu/Debian:**
```bash
# Update package index
sudo apt update

# Install required packages
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add your user to docker group (logout/login required after this)
sudo usermod -aG docker $USER
```

**For Fedora/RHEL/CentOS:**
```bash
# Install Docker and Docker Compose plugin
sudo dnf install -y docker docker-compose-plugin

# Start and enable Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group
sudo usermod -aG docker $USER
```

**Verify Docker Installation:**
```bash
# After logout/login or restart
docker --version
docker compose version
docker run hello-world
```

### 2. Install Cursor IDE

**Download and Install:**
https://docs.cursor.com/get-started/installation

### 3. Install Dev Container Extension

1. Open Cursor IDE
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Dev Containers"
4. Install the **Dev Containers** extension by Cursor

### 4. Clone Workshop Repository

```bash
# Verify repository contents
ls -la
```

**Expected repository structure:**
```
agentic-craft/
├── session 1/
│   ├── backend/
│   │   ├── src/
│   │   ├── pom.xml
│   │   └── Dockerfile
│   ├── frontend/
│   │   ├── src/
│   │   ├── package.json
│   │   └── Dockerfile
│   └── docker-compose.yml
├── session 2/
├── session 3/
└── README.md
```

## 🔧 Workshop Project Setup

### 1. Start Development Environment

```bash
# Navigate to project directory
cd session_1

# Build and start all services
docker compose up --build -d

# Check if all containers are running
docker compose ps
```

**Expected output:**
```
NAME                    STATUS              PORTS
workshop-backend        Up                  0.0.0.0:8080->8080/tcp
workshop-frontend       Up                  0.0.0.0:4200->4200/tcp
workshop-database       Up                  0.0.0.0:5432->5432/tcp
```

### 2. Open Project in Cursor with Dev Container

1. **Open Cursor IDE**
2. **File** → **Open Folder** → Select `agentic-craft`
3. **Command Palette** (Ctrl+Shift+P) → Type "Dev Containers: Reopen in Container"
4. Wait for container to build and Cursor to connect
5. Verify you see "Dev Container: Workshop Environment" in the bottom-left corner

### 3. Verify Setup

**Manual verification steps:**

1. **Backend Health Check:**
   ```bash
   curl http://localhost:8080/api/health
   ```
   Expected response: `{"status":"UP","timestamp":"..."}`

2. **Frontend Access:**
   - Open browser: http://localhost:4200
   - Should see Angular app with "Workshop TODO App" title
   - Health check indicator should show "✅ Backend Connected"

3. **Database Connection:**
   ```bash
   # Inside dev container
   psql -h localhost -p 5432 -U workshop -d todoapp -c "SELECT 1;"
   ```
   Expected: Returns `1`
   
   **Database Configuration:**
   - Database: `todoapp`
   - Username: `workshop`
   - Password: `workshop123`
   - Port: `5432`

## 🧪 Test Your Environment

### Backend API Test
```bash
# Test backend endpoints
curl -X GET http://localhost:8080/api/health
curl -X GET http://localhost:8080/api/tasks
```

### Frontend Features Test
1. Navigate to http://localhost:4200
2. Verify the health check displays "Connected" status
3. Check browser console for any errors (F12)

### Cursor Integration Test
1. Open `backend/src/main/java/com/workshop/controller/HealthController.java`
2. Try Cursor's AI completion (Ctrl+K)
3. Verify syntax highlighting and IntelliSense work

## 🔍 Troubleshooting

### Common Issues

**Docker Permission Denied:**
```bash
# Ensure you're in docker group and restart session
sudo usermod -aG docker $USER
# Logout and login again, or restart your system
```

**Port Already in Use:**
```bash
# Check what's using the ports
sudo netstat -tulpn | grep :8080
sudo netstat -tulpn | grep :4200
sudo netstat -tulpn | grep :5432

# Option 1: Stop conflicting services
sudo systemctl stop <service-name>

# Option 2: Change ports in docker-compose.yml
# Edit session_1/docker-compose.yml and change port mappings:
# For backend: "8081:8080" instead of "8080:8080"
# For frontend: "4201:4200" instead of "4200:4200"
# For database: "5433:5432" instead of "5432:5432"
```

### Getting Help

**Before the workshop:**
- Create an issue in the workshop repository with your error details
- Include output of `docker compose logs` and `docker compose ps`
- Contact the workshop organizer for additional support

**During setup verification:**
- Check container logs: `docker compose logs`
- Verify all services are running: `docker compose ps`
- Check port accessibility: `netstat -tulpn | grep -E '(8080|4200|5432)'`

## ✅ Pre-Workshop Checklist

Mark each item as completed:

- [ ] Docker and Docker Compose installed and working
- [ ] Cursor IDE installed
- [ ] Workshop repository cloned successfully
- [ ] All containers start without errors (`docker compose ps` shows all "Up")
- [ ] Backend health check returns success (http://localhost:8080/api/health)
- [ ] Frontend loads correctly (http://localhost:4200)
- [ ] Cursor opens project in dev container successfully
- [ ] Can edit code and see AI completions in Cursor
- [ ] Manual verification steps completed successfully

## 🎯 What's Next?

Once your setup is verified:
1. **Explore the codebase** - Familiarize yourself with the project structure
2. **Try Cursor features** - Experiment with AI completions and chat

**See you in Session 1! 🚀**

---

*If you encounter any issues during setup, don't worry! We'll have a 15-minute setup verification period before each session. However, completing this beforehand will maximize your learning time.*
