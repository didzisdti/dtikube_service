---
  title: Flannel
  description: Setup details

---

# {{ $frontmatter.title }}

<p align="center">
    <img alt="pikube-logo" src="../Graphics/flannel.svg" width="25%">
</p>

Flannel is a lightweight CNI plugin that is packaged together with K3s and creates a layer 3 network overlay, by default as Virtual Extensible Local Area Network (VxLAN). 

## Config Options

During K3s setup there are several options to customise our CNI setup.

> [!IMPORTANT]
> Flannel configuration must be identical across all master nodes of the cluster. No configuration takes place on worker nodes.
> For Raspberry Pi running Ubuntu OS check compatibility and if the additional setup is required to use VxLAN `sudo apt install linux-modules-extra-raspi`

|  CLI Flag  |  Default |   Description  |
|--------|----------|----------------|
| `--flannel-backend=` | `vxlan` | Choice of Flannel networking backend. Available values: `vxlan`,`none`,`host-gw`,`wireguard-native`,`ipsec`|
| `--cluster-cidr=` | `10.42.0.0/16` | IP address range from which Kubernetes assigns Pod IPs. Available values: Any valid CIDR | 
| `-service-cidr=` | `10.43.0.0/16` | IP address range from which Kubernetes assigns Service IPs. Available values: Any valid CIDR | 
| `--flannel-iface=` | auto detected | Network interface to which Flannel binds to. Available values: Any valid Linux network interface name | 
| `--flannel-external-ip` | disabled | Uses the node’s external IP for inter-node traffic instead of the internal IP. Boolean flag type | 
| `--flannel-ipv6-masq` | disabled | Enables IPv6 masquerading. Requires IPv6 cluster networking enabled. Boolean flag type| 

## Network Interfaces
During the setup a Flannel and bridge plugin is deployed. These plugins create network interfaces for pods and nodes: bridge (`veth` ,`cni0`), Flannel (`flannel.1`). 
**Bridge plugin:**
* `cni0`: A Linux network bridge that acts as a virtual switch, allowing communication between the pods on given node.  
* `veth`: Creates a virtual ethernet pair where one end is plugged into the pod and other into cni0 bridge.

**Flannel plugin:**
* `flannel.1`: A VXLAN tunnel interface created by Flannel that encapsulates Pod traffic so it can be routed between nodes as if all Pods were on the same network.

> [!NOTE]
> Instances are created only if pods that require cross node communication are deployed on the specific node.

## IP Allocation
Flannel by default uses CIDR 	10.42.0.0/16 and allocate subnets with 10.42.X.0/24 mask to each node, and Pods will get an IP addresses from these subnets. With this setup each node can have up to 254 Pods.

## Package Flow
Simulating a package flow from node-1 pod-A to node 2 pod-B.

* Package leaves Node 1 pod-A through (`veth`) to bridge(`cni0`)
* from bridge (`cni0`) to VxLAN (`flannel.1`)
* from VXLAN physical switch
* from physical switch to VxLAN(`flannel.1`) on Node 2
* from VXLan (`flannel.1`) to bridge (`cni0`)
* from brige (`cni0`) via `veth` to Pod-B

## Setup Check
```bash
# Lookup interfaces created by Fannel CNI
ip -d addr show cni0 && ip -d addr show flannel.1

# Check Flannel config
sudo cat /var/lib/rancher/k3s/agent/etc/cni/net.d/10-flannel.conflist

# Check node annotations
kubectl get node <node-name> -o yaml | grep "flannel"
