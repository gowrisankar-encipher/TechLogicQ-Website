// TechLogicQ website: build on the EC2 box and deploy with zero-downtime-ish release switching.
//
// Paste this into a Jenkins Pipeline job ("Pipeline script"), so nothing has to be committed to the repo.
// Assumes the server setup in EC2-DEPLOY-GUIDE.md:
//   - Node.js 22 installed, Jenkins running as the "jenkins" user on the same EC2 instance
//   - production env file at /etc/techlogicq/techlogicq.env (owned root:jenkins, mode 640)
//   - systemd service "techlogicq" that runs /var/www/techlogicq/current on port 3000
//   - sudoers rule letting jenkins run "systemctl restart techlogicq" without a password
//   - Jenkins credential "github-techlogicq" (SSH Username with private key; public key added as a GitHub deploy key)

pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '15'))
    }

    triggers {
        // Fires when GitHub's webhook hits https://jenkins.techlogicq.in/github-webhook/
        githubPush()
    }

    environment {
        REPO_URL      = 'git@github.com:gowrisankarv-work/TechLogicQ-Website.git'
        BRANCH        = 'main'
        APP_ROOT      = '/var/www/techlogicq'
        ENV_FILE      = '/etc/techlogicq/techlogicq.env'
        RELEASE_DIR   = "${APP_ROOT}/releases/${env.BUILD_NUMBER}"
        KEEP_RELEASES = '3'
        NEXT_TELEMETRY_DISABLED = '1'
    }

    stages {
        stage('Checkout') {
            steps {
                sh 'rm -f .previous_release'
                git url: env.REPO_URL, branch: env.BRANCH, credentialsId: 'github-techlogicq'
            }
        }

        stage('Install') {
            steps {
                sh '''
                    node -v && npm -v
                    npm ci --no-audit --no-fund
                '''
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Build') {
            steps {
                // NEXT_PUBLIC_SITE_URL is baked in at build time, so the env file must be present now.
                sh '''
                    cp "$ENV_FILE" .env.production.local
                    npm run build
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    set -e
                    mkdir -p "$RELEASE_DIR"
                    # Everything next start needs: build output, deps, public assets, config, data fallback
                    cp -a .next node_modules public data package.json package-lock.json next.config.ts .env.production.local "$RELEASE_DIR"/

                    # Remember the current release so we can roll back
                    PREVIOUS=$(readlink "$APP_ROOT/current" || true)
                    echo "$PREVIOUS" > "$WORKSPACE/.previous_release"

                    ln -sfn "$RELEASE_DIR" "$APP_ROOT/current"
                    sudo /usr/bin/systemctl restart techlogicq
                '''
            }
        }

        stage('Health check') {
            steps {
                sh '''
                    for i in $(seq 1 20); do
                        if curl -fsS -o /dev/null http://127.0.0.1:3000/; then
                            echo "Site is up"
                            exit 0
                        fi
                        sleep 3
                    done
                    echo "Site did not come up on port 3000"
                    exit 1
                '''
            }
        }

        stage('Clean old releases') {
            steps {
                sh '''
                    cd "$APP_ROOT/releases"
                    ls -1tr | head -n -"$KEEP_RELEASES" | xargs -r rm -rf
                '''
            }
        }
    }

    post {
        failure {
            // Roll back to the previous release if the deploy or health check failed
            sh '''
                PREVIOUS=$(cat "$WORKSPACE/.previous_release" 2>/dev/null || true)
                if [ -n "$PREVIOUS" ] && [ -d "$PREVIOUS" ] && [ "$(readlink "$APP_ROOT/current")" != "$PREVIOUS" ]; then
                    echo "Rolling back to $PREVIOUS"
                    ln -sfn "$PREVIOUS" "$APP_ROOT/current"
                    sudo /usr/bin/systemctl restart techlogicq
                    rm -rf "$RELEASE_DIR"
                fi
            '''
        }
        always {
            sh 'rm -f .env.production.local'
        }
    }
}
