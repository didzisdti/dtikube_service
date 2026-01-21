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
    server.insecure: true
    application.namespaces: "*"

  cm:
    timeout.reconciliation: 180s

  rbac:
    policy.default: role:admin

server:
  ingress:
    enabled: true
    ingressClassName: traefik
    hostname: argocd.dtikube.techinsights.com
    hosts:
      - argocd.dtikube.techinsights.com

applicationSet:
  enabled: true
  replicas: 1

dex:
  enabled: false

redis:
  enabled: true

notifications:
  enabled: false

metrics:
  enabled: false
```

### Deployment

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

## From Git Repo to Cluster
There are various ways to deploy applications in the Kubernetes cluster utilising ArgoCD. Natively ArgoCD provides CLI and UI allowing for easier management of deployments.

DTIKube cluster will utilise:
* Plain directory based application deployment
* App of apps based deployment

### Directory Based Deployment
This type of deployment uses manifest files from a specific directory within a Git repository with filetype (.yml, .yaml, and .json). It is easy to apply and will serve as initial setup for the first app creation.

#### Setup 
The application artefacts stored in the Git repository and the setup outlines both directory structure and manifest examples with detailed description.

**Example Structure:**
```
repo/
└── apps/
    └── directory-app/
        ├── deployment.yaml
        ├── service.yaml
        ├── ingress.yaml
        └── application.yaml
```

**Example manifests:**

`deployment.yaml`
Defines how the application Pods are created, updated, and scaled.
```bash
apiVersion: apps/v1
kind: Deployment
metadata:
  name: directory-app
  namespace: demo
  labels:
    app.kubernetes.io/name: directory-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: directory-app
  template:
    metadata:
      labels:
        app: directory-app
    spec:
      containers:
        - name: directory-app
          image: nginx:stable-alpine # sample "hello world"
          ports:
            - containerPort: 80
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 256Mi
```
**Config Info:**
* **`metadata.name`** Name of the deployment.
* **`metadata.namespace`** Namespace where deployment is created.
* **`metadata.labels`** Standard Kubernetes recommended label.
* **`spec.selector.matchLabels.app`** Label selector to match Pods managed by this Deployment.
* **`spec.template.metadata.labels.app`** Labels applied to Pods (must match selector).
* **`spec.template.spec.containers.name`** Name of the container.
* **`spec.template.spec.containers.image`** Target image that is used in deployment.
* **`spec.template.spec.ports.containerPort`** Port exposed by the container.
* **`spec.template.spec.resource.requests`** Assign resource limits for the given container.


`service.yaml`
Provides a stable network endpoint to access the application Pods.
```bash
apiVersion: v1
kind: Service
metadata:
  name: directory-app
  namespace: demo
spec:
  selector:
    app: directory-app
  ports:
    - name: http
      port: 80
      targetPort: 80
```
**Config Info:**
* **`metadata.name`** Name of the service.
* **`metadata.namespace`** Namespace where Service is created.
* **`spec.selector.app.`** Services the Pods with label app=directory-app.
* **`spec.ports.port.`** Port exposed by the Service.
* **`spec.ports.targetPort.`** Port that the container traffic is forwarded to.


`ingress.yaml`
Exposes the application to external users via HTTP/HTTPS.
```bash
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: directory-app
  namespace: demo
  annotations:
    traefik.ingress.kubernetes.io/router.entrypoints: web
spec:
  ingressClassName: traefik
  rules:
    - host: directory-app.dtikube.techinsights.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: directory-app
                port:
                  number: 80
```
**Config Info:**
* **`metadata.name`** Name of the ingress.
* **`metadata.namespace`** Namespace where the Ingress is created.
* **`metadata.annotations`** Entry point to Ingress
* **`spec.ingressClassName`** Choice of ingress controller (Match your cluster setup).
* **`spec.rules.host`** DNS host for routing traffic.
* **`spec.rules.http.paths.path`** URL path to match.
* **`spec.rules.http.paths.pathType`** Match all paths with this prefix.
* **`spec.rules.http.paths.backend`** Backend service details name and port.

`application.yaml`
Argo CD instruction how to deploy and manage the application using GitOps.
```bash
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: directory-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/didzisdti/sandbox
    targetRevision: main
    path: apps/directory-app
  destination:
    server: https://kubernetes.default.svc
    namespace: demo  
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

**Config Info:**
* **`kind`** Declares an Argo CD managed CRD.
* **`metadata.name`** Name of the Argo CD Application.
* **`metadata.namespace`** Namespace where Argo CD is installed.
* **`spec.source.repoURL`** Your target Git repository containing the application.
* **`spec.source.path`** Directory in the Git repository.
* **`spec.source.targetRevision`** Specific Git tag, branch, or commit that Argo will trace.
* **`spec.destination.namespace`** Target namespace where the application will be deployed.
* **`spec.destination.server`** Target cluster for deployment. https://kubernetes.default.svc = local cluster.
* **`spec.syncPolicy.automated`** Optional config for automatic synchronization, pruning and self-healing.

#### Bootstrap to Cluster
Apply the application.yaml directly from the repository or pull it locally on the cluster.
If using remote one, ensure to specify RAW .yaml file path.

```bash
kubectl apply -f https://raw.githubusercontent.com/didzisdti/sandbox/main/apps/directory-app/application.yaml \
  -n argocd
```

#### Confirm Deployment
The expected outcome of above deployment is a welcome page for NGINX accessible in the control nodes browser, confirming that the deployment was successful.

1. Check ArgoCD URL (Healthy, Synced)
```
http://argocd.dtikube.techinsights.com/
```

2. Check the Pods on Cluster are running
```bash
kubectl get pods -n demo
```

3. Check Ingress is set
```bash
kubectl get ingress -n demo
```

4. Set URL mapping in Windows 
```
C:\Windows\System32\drivers\etc\hosts
```

5. Open URL in your browser and view the welcome page. 
```bash
http://directory-app.dtikube.techinsights.com/
```

### App of Apps Deployment
A hiehierarchical deployment model where one app ("Parent") and conists of multiple apps ("children"). In such scenario Argo CD acts as deployment orchestrator, providing layers of responsibility, enabling scalability and safety boundaries.
* **`Parent app`** Defines what and how many applications exist.
* **`Child app`** Defines how each application is deployed.
* **`Workload`** Actual Kubernetes resources.

#### Setup
The Git repository directory structure and manifest examples with detailed description. For additional config info, check previous section 


```
repo/
├── root-app.yaml                # Parent "App of Apps"
├── apps2/
│   ├── frontend/
│   │   └── application.yaml
│   └── backend/
│       └── application.yaml
└── services/
    ├── frontend/
    │   ├── deployment.yaml
    │   ├── service.yaml
    │   └── kustomization.yaml
    └── backend/
        ├── deployment.yaml
        ├── service.yaml
        └── kustomization.yaml
```

`root-app.yaml`
Defines the "Parent" in App of Apps setup and discovers all new "Child" apps under /app2 directory.

```bash
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: platform-root
  namespace: argocd
spec:
  project: default

  source:
    directory:
      recurse: true
    repoURL: https://github.com/didzisdti/sandbox
    targetRevision: main
    path: apps2

  destination:
    server: https://kubernetes.default.svc
    namespace: demo

  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```
**Config Info:**
* **`spec.source.directory.recurse`** Recursively include all manifests under the path

`apps2/frontend/application.yaml`
How to deploy one logical workload and which directory to hook into.
```bash
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: backend
  namespace: argocd
  annotations:
    argocd.argoproj.io/sync-wave: "0"
spec:
  project: default

  source:
    repoURL: https://github.com/didzisdti/sandbox
    targetRevision: main
    path: services/backend

  destination:
    server: https://kubernetes.default.svc
    namespace: demo

  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```
**Config Info:**
* **`metadata.annotations...sync-wave`** Sync order relative to other applications


`services/frontend/deployment.yaml`
Defines how the application Pods are created, updated, and scaled.
```bash
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
        - name: backend
          image: nginx:1.25
          ports:
            - containerPort: 80
```

`services/frontend/service.yaml`
Provides a stable network endpoint to access the application Pods.
```bash
apiVersion: v1
kind: Service
metadata:
  name: backend
spec:
  selector:
    app: backend
  ports:
    - port: 80
      targetPort: 80
```

`services/frontend/kustomization.yaml`
Defines a Kustomize entry point that groups related Kubernetes manifests so Argo CD can deploy them together.
```bash
resources:
  - deployment.yaml
  - service.yaml
```

#### Bootstrap to Cluster

The app of apps setup requires only one manifest to rollout the entire setup of apps and dependancies. Powerfull in managing large scale setups with multiple apps and platform dependancies. Strongly encourages sync waves and ordering of content deployment.
**Best Practice:**
* **Wave -1** CRDs *(rollouts.argoproj.io, issuers.cert-manager.io, certificates.cert-manager.io)*
* **Wave 0** Platform controllers *(Ingress controller, cert-manager, Secrets from Vault)*
* **Wave 1** Shared services *(Observability stack, Logging stack, Service mesh)*
* **Wave 2** Workloads *(Back-end, Front-end apps, stateful workloads)*

Apply the parent app application.yaml directly from the repository or pull it locally on the cluster. Ensure to specify RAW .yaml file path.

```bash
kubectl apply -f https://raw.githubusercontent.com/didzisdti/sandbox/main/root-app.yaml \
  -n argocd
```

#### Confirm Deployment

1. Check ArgoCD URL (Healthy, Synced)
```
http://argocd.dtikube.techinsights.com/
```

2. Check the Pods on Cluster are running
```bash
kubectl get pods -n demo
```

3. Check application status
```bash
kubectl get applications -n argocd
```

4. Check if both frontend and backend are reachable 

```bash
kubectl run tmp --rm -it --image=curlimages/curl -n demo   -- curl http://frontend
kubectl run tmp --rm -it --image=curlimages/curl -n demo   -- curl http://backend
```

5. Check services
```bash
kubectl get svc -n demo
```

## Config Removal
Should the need arise to remove argocd setup or re-create it from scratch followings steps should be applied.

```bash
# Remove Argo CD from the cluster
helm uninstall argo -n argocd

# Remove any app installed
kubectl delete application <app-name> -n <namespace>

# Remove CRD's created during setup
kubectl delete crd applications.argoproj.io applicationsets.argoproj.io appprojects.argoproj.io

# Remove namespace (ensures all CRD's secrets, etc. are removed)
kubetl delete namespace argocd
```
**Check setup is removed:**
```bash
kubectl get ns argocd
kubectl get crd | grep argoproj
kubectl get applications -A
kubectl get applicationsets -A
```


### Secure GitOps

TO DO in next phase!

