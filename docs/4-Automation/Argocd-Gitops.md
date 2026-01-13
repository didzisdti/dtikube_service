---
  title: ArgoCD GitOps Setup
  description: Setup details

---

# {{ $frontmatter.title }}

<p align="center">
    <img alt="pikube-logo" src="../Graphics/Argo_CD.svg" width="25%">
</p>


**GitOps** a model where Git is perceived as a single source of truth for the infrastructure and applications. Declare what should run, Git commit, and automated controllers ensure the cluster continuously matches that state. 
Approach provides versioning, audits, rollbacks, and safer deployments through pull requests rather than manual cluster changes.

**Argo CD** is a GitOps controller for Kubernetes that watches Git repositories and reconciles them with the cluster state. It deploys applications, detects drift, self-heals when resources change outside Git, and provides UI/CLI for visibility. 
Deployment and Sync Capabilities:
* Helm 
* Kustomize
* plain manifests
* multi-cluster setups
* automated or manual sync strategies

The DTIKube cluster together with ArgoCD and Git provide a compact and yet robust production-grade environment, making it reproducible, secure and low maintenance overhead.

## Deploying ArgoCD

### Preparing Environment
Creating namespace, adding helm repo and providing initial config yaml.np
```bash
# Create namespace 
kubectl create namespace argocd

# Add ArgoCD helm chart 
helm repo add argo https://argoproj.github.io/argo-helm

# Update helm repo (fetch latest)
helm repo update
```
### Config values
Since no active project is yet running, test values are provided enabling setup sanity testing.
```bash
configs:
  params:
    server.insecure: true               # Allow Argo CD server to serve HTTP
    application.namespaces: "*"         # Manage apps in all namespaces

  cm:
    timeout.reconciliation: 180s        # Sets the default timeout for app reconciliation

  rbac:
    policy.default: role:admin          # Default admin role 

server:
  replicas: 1                           # Nr. of pods
  extraArgs:
    - --insecure                        # Extra argument passed to the server, in this case allow insecure HTTP
  service:
    type: ClusterIP                     # Expose server as ClusterIP service (internal to cluster)
    port: 80                            # The port Argo CD server will listen on inside the cluster
  ingress:
    enabled: true                       # Create an Ingress to expose Argo CD externally
    ingressClassName: traefik           # Use Traefik Ingress controller
    hosts:
      - argocd.dtikube.techinsights.com     # hostname for URL access
    paths:
      - /                               # Path prefix for the Ingress
    annotations:
      traefik.ingress.kubernetes.io/router.entrypoints: web  # Tell Traefik to use the 'web' entrypoint (port 80)

controller:
  replicas: 1                           # Number of Argo CD application controller pods (handles reconciliation of apps)

repoServer:
  replicas: 1                           # Nr. of repository server pods (used to fetch manifests from git repos)

applicationSet:
  enabled: true                          # allows dynamic creation of apps from templates
  replicas: 1                            # Nr. of ApplicationSet controller pods

dex:
  enabled: false                         # Disable Dex (identity provider) since we are not yet using SSO/OAuth

redis:
  enabled: true                          # Deploy an internal Redis instance for Argo CD (used for caching and notifications)

notifications:
  enabled: false                         # Disable notifications (email, etc.)

metrics:
  enabled: false                         # Disable metrics (Prometheus metrics server)
```

### Deploying

```bash
# Deploying AgroCD in agrocd namespace
helm install argo argo/argo-cd \
  -n argocd \
  -f argocd-values.yaml
```

### Validation
Validation after initial deployment is done.
```bash
# Check pods
kubectl get pods -n argocd

# Check secrets
kubectl get secret -n argocd

# Obtain Secret for UI login (admin)
kubectl get secret argocd-initial-admin-secret -n argocd \
  -o jsonpath="{.data.password}" | base64 -d

# Useful summary check post deployment
kubectl get deploy,svc,ingress argo-cd \
  -o wide \
  -n argocd
```

To access the ArgoCD URL from the control node one additional configuration is required on the windows laptop in path: `C:\Windows\System32\drivers\etc\hosts`
Open the hosts file in admin mode and add new line:
```
<Cluster-node-IP> grafana.dtikube.techinsights.com
```

This will redirect browser session to our cluster and `traefik` ingress will look to match the HTTP call with the rule that was setup earlier. 
Basic setup is now complete.

<p align="center">
    <img alt="pikube-logo" src="../Graphics/sample_argocd.png" width="90%">
</p>


TODO