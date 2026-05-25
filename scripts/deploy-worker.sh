#!/bin/bash
set -e

# Graphify × drive.io Hetzner Worker Deployment Script
# This script provisions and runs the Graphify background worker daemon on a Hetzner VM.

echo "=========================================================="
echo "Starting Graphify Worker Daemon Deployment Setup..."
echo "=========================================================="

# 1. Update packages and install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "[1/4] Installing Docker..."
    sudo apt-get update -y
    sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io
    echo "Docker installed successfully."
else
    echo "[1/4] Docker is already installed."
fi

# 2. Check/Prepare environment configuration file
ENV_FILE=".env.worker"
echo "[2/4] Verifying worker environment file ($ENV_FILE)..."

if [ ! -f "$ENV_FILE" ]; then
    echo "Creating a template environment file: $ENV_FILE"
    cat <<EOF > "$ENV_FILE"
# Graphify Worker Environment Configuration
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
R2_ACCOUNT_ID=your_cloudflare_r2_account_id
R2_ACCESS_KEY_ID=your_cloudflare_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_cloudflare_r2_secret_access_key
R2_BUCKET_NAME=your_cloudflare_r2_bucket_name
EOF
    echo "WARNING: Created template $ENV_FILE. Please edit it with your real credentials before running the container."
else
    echo "Found existing environment file: $ENV_FILE"
fi

# 3. Build the worker docker container
echo "[3/4] Building Docker container image (graphify-worker:latest)..."
sudo docker build -t graphify-worker:latest -f Dockerfile.worker .

# 4. Spin up the container service under restart-always policy
echo "[4/4] Starting the worker daemon container..."

# Check if a container with the same name is already running and clean it up
if sudo docker ps -a --format '{{.Names}}' | grep -Eq "^graphify-worker-daemon$"; then
    echo "Stopping and removing existing worker container..."
    sudo docker stop graphify-worker-daemon || true
    sudo docker rm graphify-worker-daemon || true
fi

# Run the daemon container
sudo docker run -d \
    --name graphify-worker-daemon \
    --restart always \
    --env-file "$ENV_FILE" \
    -v /tmp/graphify-jobs:/tmp/graphify-jobs \
    graphify-worker:latest

echo "=========================================================="
echo "Deployment successful!"
echo "Worker status:"
sudo docker ps -f name=graphify-worker-daemon
echo "To view logs, run: sudo docker logs -f graphify-worker-daemon"
echo "=========================================================="
