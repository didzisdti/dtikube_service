---
  title: Kubernetes Networking
  description: Setup details

---

# {{ $frontmatter.title }}
The "Vanilla" K3s cluster comes with already pre-configured networking elements. This allows us to focus more on deployment and enhancements as the basic setup serves the initial needs.

## K3s Default Network Setup
Assumption taken that cluster is installed without any modifications or substitutions from the default resource setup using `curl -sfL https://get.k3s.io | sh -`

### CNI Controller
Handles pod-to-pod networking and IP address allocation across the cluster, enabling communication between containers.
* Default: **Flannel**
  * Operates pod-to-pod networking via overlay across nodes, VXLAN as default. 
  * Auto creates required network interfaces and allocates IP's to pods.
  * Resource smart, doesn't create overhead if there are no pod-to-pod deployments on a given node.
  * Alternative options: `Calico`, `Cilium`, 
  * Additional info: [CNI: Flannel](../6-Networking/Flannel.html)

### Ingress Controller
Manages HTTP/HTTPS routing from outside the cluster to services, often including SSL termination and path-based routing.
* Default: **Traefik**
  * Routes external HTTP and HTTPS traffic to services/pods. 
  * Offers built in Let's Encrypt support.
  * "Cluster aware" updates routing in real time without need for forced reloads.
  * Alternative options: `NGINX`, `HAProxy`
  * Additional info: TBC

### DNS Resolution
Provides name resolution for services and pods, enabling service discovery within the cluster.
* Default: **CoreDNS**
  * Enables name based service discovery within the cluster.
  * Alternative options: `kube-dns`
  * Additional info: TBC

### Service Load Balancer
Distributes external traffic to the appropriate service endpoints across nodes in the cluster.
* Default: **Klipper-LB**
  * Resource smart lightweight service load balancer but limited by design
  * Automatically handles all service with type: `LoadBalancer`
  * Alternative options: `MetalLB`, `Cilium LB`, `Cloud provider LB`

### Service Networking
Defines how services are exposed internally or externally, providing stable endpoints for accessing sets of pods.
* Default: **ClusterIP**
  * Provides stable Virtual IPs (VIP) for every service
  * Enables seamless traffic to pods irrespective on which node they start up
  * "Cluster aware" with dynamic service discovery without config reloads
  * Alterative options: `Headless Service`,`Service mesh`

### Traffic Proxy / Forwarding
Forwards service traffic to backend pods and implements cluster networking rules for load balancing and routing.
* Default: **kube-proxy**
  * Forward traffic from LoadBalancer services to endpoint utilising ClusterIP VIPs
  * "Cluster aware" updates rules in real time without need for forced reloads.
  * Alternative options: `Cilium (eBPF)`,`Calico eBPF`,`Service mesh`

### Network Policy
Controls pod-to-pod and pod-to-external traffic at the network level by defining rules for allowed or denied communication.
* Default: **Not Enabled**
  * Setup Option: `Calico`,`Cilium`


### Noteworthy Ports

Inbound Rules for K3s Nodes
|Protocol	|Port	|Source	|Destination	|Description
|-|-|-|-|-|
TCP	|6443	|Agents	|Servers	|K3s supervisor and Kubernetes API Server
UDP	|8472|	All nodes	|All nodes|	Required for Flannel VXLAN
TCP	|10250	|All nodes|	All nodes	|Kubelet metrics
