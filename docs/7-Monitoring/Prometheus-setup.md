---
  title: Prometheus Configuration
  description: Setup details

---

# {{ $frontmatter.title }}

<p align="center">
    <img alt="pikube-logo" src="../Graphics/prometheus.svg" width="25%">
</p>

Prometheus is an open-source monitoring and alerting system that collects time-series metrics from services and infrastructure via a pull-based model. In a k3s environment, it provides lightweight, Kubernetes-native monitoring of nodes, pods, and control-plane components, making it well-suited for resource-constrained or edge clusters while still enabling powerful querying and alerting.

## Deploying Prometheus

Using helm on the Gateway node the DTIKube cluster will utilise a community managed helm chart `https://prometheus-community.github.io/helm-charts`

```bash
# Add helm chart to repository
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

# Check the repository
helm search repo prometheus-community

# Update to latest charts
helm repo update
```

Creating manifest before deployment in grafana-values.yml to ensure that when we use `http://grafana.dtikube.techinsights.com` in our browser ther is an ingress rule that will forward the traffic to the Graana Service (ClusterIP).

```yaml
grafana:
  ingress:
    enabled: true
    ingressClassName: traefik
    hosts:
      - grafana.dtikube.techinsights.com
```

Deploying Prometheus helm chart in the new monitoring namespace with our custom manifest.

```bash
# Create new namespace
kubectl create namespace monitoring

# Deploying prometheus in monitoring namespace
helm install monitoring prometheus-community/kube-prometheus-stack \
  -n monitoring \
  -f prometheus-values.yml

# Check pods
kubectl get pods -n monitoring

# Useful summary check post deployment
kubectl -n monitoring get deploy,svc,ingress monitoring-grafana -o wide
```


To access the Grafana weblink one additional configuration is required on the windows laptop in path: `C:\Windows\System32\drivers\etc\hosts`
Open the hosts file in admin mode and add new line:
```
<Cluster-node-IP> grafana.dtikube.techinsights.com
```

This will redirect browser session to our cluster and ingress will look to match the HTTP call with the rule that was setup earlier. 
Our basic setup is now complete.


**TODO:** Advanced monitoring setup with alerting and SSO 

<p align="center">
    <img alt="pikube-logo" src="../Graphics/under-construction.svg" width="40%">
</p>