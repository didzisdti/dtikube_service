---
  title: ArgoCD GitOps Setup
  description: Setup details

---

# {{ $frontmatter.title }}

<p align="center">
    <img alt="pikube-logo" src="../Graphics/Argo_CD.svg" width="25%">
</p>


**GitOps** a model where Git is percieved as a single source of truth for the infrastructure and applications. Declare what should run, Git commit, and automated controllers ensure the cluster continuously matches that state. 
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

### Deploying

```bash
# Deploying AgroCD in agrocd namespace
helm install argo argo/argo-cd \
  -n argocd \
  -f argocd-values.yaml
```
Validation after initial deploymeny is complete
```bash
# Check pods
kubectl get pods -n argocd

# Obtain Secret for UI 
kubectl get secret argocd-initial-admin-secret -n argocd \
  -o jsonpath="{.data.password}" | base64 -d

# Useful summary check post deployment
kubectl get deploy,svc,ingress argo-cd \
  -o wide \
  -n argocd
```

```bash

```
```bash

```
```bash

```