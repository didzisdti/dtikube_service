---
  title: Kubernetes Cluster Networking
  description: Setup details

---

# {{ $frontmatter.title }}


Important Network aspects
* The K3s server needs port 6443 to be accessible by all nodes.
* The nodes need to be able to reach other nodes over UDP port 8472 when using the Flannel VXLAN backend
* If you wish to utilize the metrics server, all nodes must be accessible to each other on port 10250
* The VXLAN port on nodes should not be exposed to the world as it opens up your cluster network to be accessed by anyone. Run your nodes behind a firewall/security group that disables access to port 8472.

Inbound Rules for K3s Nodes
|Protocol	|Port	|Source	|Destination	|Description
|-|-|-|-|-|
TCP |	2379-2380|	Servers|Servers	|Required only for HA with embedded etcd
TCP	|6443	|Agents	|Servers	|K3s supervisor and Kubernetes API Server
UDP	|8472|	All nodes	|All nodes|	Required only for Flannel VXLAN
TCP	|10250	|All nodes|	All nodes	|Kubelet metrics
UDP|	51820|	All nodes|	All nodes|	Required only for Flannel Wireguard with IPv4
UDP	|51821	|All nodes|All nodes|	Required only for Flannel Wireguard with IPv6
TCP	|5001|	All nodes	|All nodes	|Required only for embedded distributed registry (Spegel)
TCP	|6443|	All nodes|	All nodes|Required only for embedded distributed registry (Spegel)



<p align="center">
    <img alt="pikube-logo" src="../Graphics/under-construction.svg" width="40%">
</p>