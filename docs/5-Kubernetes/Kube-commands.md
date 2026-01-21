---
  title: Kubernetes Command Line
  description: ctl details

---

# {{ $frontmatter.title }}

<p align="center">
    <img alt="pikube-logo" src="../Graphics/cli.svg" width="25%">
</p>

Cluster management often requires inspection of various setup layers. in order to achieve this objective some more commenly use commands are detailed in this article.

## Services 
Acquire details of your K3s cluster services, check and manage their config and observe the events and logs.

### Cluster services
```bash
# Check service status after install
sudo systemctl status k3s
sudo systemctl status k3s-agent

# Linux process status
ps aux | grep containerd | grep k3s
```

### Service config
```bash
# All available kube resources
kubectl api-resources -o wide

# List all available services
kubectl get service -A

# List all configured ingress 
kubectl get ingress -A

# List deployments running in a specific namespace
kubectl get deployments -n <namespace>

# Check containerd config (run on master nodes)
sudo grep SystemdCgroup /var/lib/rancher/k3s/agent/etc/containerd/config.toml

# Silence coredns warning output
sudo mkdir -p /etc/coredns/custom
sudo touch /etc/coredns/custom/dummy.override
sudo touch /etc/coredns/custom/dummy.server

```

### Events and logs
```bash
# Check service logs on the host
sudo journalctl -u k3s

# Check events (retained up to ~1h)
kubectl get events -A --sort-by=.metadata.creationTimestamp
kubectl get events -n <namespace>

# Trail events realtime
kubectl get events -A --watch
```

## Nodes
Obtain details about your cluster nodes configuration setup, check health and manage the load and pod allocations.

### Get Node Information
```bash
# List Nodes
kubectl get nodes -o wide

# Check config of nodes which are tainted
kubectl describe nodes | grep taint
kubectl describe node <node-name> | grep -i taint

# Check resource load 
sudo kubectl top nodes
sudo kubectl top pods -A

# Observe node events 
kubectl get events -A \
  --field-selector involvedObject.kind=Node
```

### Change Node Config and Use
```bash
# Switch node state (enable/disable scheduling of new pods)
kubectl cordon <node_name>
kubectl uncordon <node_name>

# Label a node (Example: env=prod, node-role=isolated)
kubectl label node <node-name> <Label>=<value>

# Drain node safely
kubectl drain <node-name> \
  --ignore-daemonsets \
  --delete-emptydir-data
```


## Pods
Obtain details about your pods and containers, manipulate them and redeploy, and check logs for more details.

### Get Pod Information
```bash
# List pods
kubectl get pods -A -o wide 
kubectl get pods -n <namespace> -o wide

# Get detailed pod information
kubectl describe pod <pod_name> -n <namespace>

# Watch pod status changes
kubectl get pods -n <namespace> -w
```

### Manipulate Pods
```bash
# Remove (restart) a pod 
kubectl delete pod -n <namespace> <pod-name>

# Pod redeployment
kubectl rollout restart deployment <resource> -n <namespace>

# Increase pod replicas to 2 for a specific resource 
kubectl scale deployment <resource> -n <namespace> --replicas=2
```

### Check Node and Container Logs
```bash
# Pod logs
kubectl logs -n <namespace> <pod-name>

# Specific container logs in a pod
kubectl logs -n <namespace> <pod_name> -c <container_name>

# Trail logs realtime
kubectl logs -f -n <namespace> <pod_name>

# Pod log historical
kubectl logs -n <namespace> <pod_name> --previous
```

### Reallocate Pods
Moving pod out of specific node to other available node.

```bash
# 1. Cordone node (disavle pod scheduling)
kubectl cordon <node-name>

# 2. Remove the pod in the cordoned node (it will auto create on another node)
kubectl delete pod -n <namespace> <pod-name>

# 3. Check pods new location
kubectl get pod -n <namespace> -o wide

# 4. Uncordone node (enable pod scheduling)
kubectl uncordon <current-node>
```


