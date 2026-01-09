---
  title: Metric Server
  description: Setup details

---

# {{ $frontmatter.title }}

Metrics Server is a lightweight Kubernetes component that collects resource usage data (CPU, memory) from nodes and Pods. It aggregates this information and makes it available via the Metrics API, which is used by components like HorizontalPodAutoscaler (HPA), VerticalPodAutoscaler (VPA) and kubectl top. Main usage is monitoring and autoscaling based on real-time resource usage.

## How It Works

1. **Scrape** – Metrics server queries each kubelet on every node for Pod and node resource usage (CPU, memory).
2. **Aggregate** – Collected metrics are aggregated across all nodes.
3. **Expose** - Metrics are then exposed using the Kubernetes Metrics API (metrics.k8s.io)
4. **Consume** - Consumed by HPA for autoscaling and when kubectl top query the Metrics API to read current usage.

> [!IMPORTANT]
> Metrics Server does not store historical data, it only exposes current usage.

## Installing Metric Server

Metric server is a default add-on that is deployed together with initial cluster setup. If however it is not present or is omitted through a configuration during installation then we can deploy it explicitly using Helm.

Official Helm chart repo: [Metric Server](https://github.com/kubernetes-sigs/metrics-server/tree/master/charts/metrics-server)


1. Prepare the repository
```bash
helm repo add metrics-server https://kubernetes-sigs.github.io/metrics-server/
helm repo update
```

2. Install in the preferred namespace
```bash
helm upgrade --install metrics-server metrics-server/metrics-server \
  --namespace <namespace> --wait
```

3. Verify setup
```bash
# Confirm metric server pod status 
kubectl get pods -n <namespace> | grep metrics-server

# Check resource consumption
kubectl top nodes
kubectl top pods -A
```


