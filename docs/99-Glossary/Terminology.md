---
  title: Glossary Guide
  description: Terms and abbreviations in the technologies that are used in the project

---

# {{ $frontmatter.title }}

<p align="center">
    <img alt="k3s" src="../Graphics/dictionary.svg" width="25%">
</p>

Through the project documentation and beyond in additional reading material, you will come across terms and abbreviations that might not be immediately familiar to a new reader. This page serves as a general guide to those references.

**Items for Reference**

| Term |   Description    | Example|  Reference   |
|------|------------------|--------|--------------|
|**DNS** - Domain Name System| A system that translates human-readable names into IP addresses. | Translates `google.com` into IP of `142.250.75.100` | dnsmasq, CoreDNS|
|**DHCP** - Dynamic Host Configuration Protocol| A network protocol that automatically gives devices their network configuration when they join the network. | Server that joins our cluster gets random allocated 10.0.0.x IP address |cloud-init, dnsmasq |
|**NAT** - Network Address Translation| A networking technique that rewrites IP addresses (and sometimes ports) as traffic passes through a router or gateway. | Converts our `10.0.0.x`address pool into `192.168.1.1` when leaving through our gateway server |nftables, CNI (Flannel)|
|**NTP** - Network Time Protocol| A protocol used to synchronize clocks of computers over a network. | Perform a check on linux `timedatectl status` | chrony|
|**CNI** - Container Network Interface | CNI is a standard specification and set of libraries that define how container runtimes set up networking for containers and pods.| When a Pod starts, the CNI plugin sets up its network so Pods can communicate across nodes as if they were on the same network | Flannel, Callico, Traefik|
| **CRI** - Container runtime interface | CRI is a Kubernetes API specification that defines how Kubernetes communicates with container runtimes| When a Pod is scheduled, kubelet uses CRI to ask the runtime (like containerd) to pull images, start containers, and report their status. | Docker, containerd|
| **CIDR** - Classless Inter-Domain Routing | A notation and routing method for defining IP address ranges using variable-length prefixes.| A range of IP addresses using a prefix length  `10.244.1.0/24` | Kubernetes control plane, CNI|
| **VxLAN** - Virtual eXtensible LAN | VXLAN is a network encapsulation technology that lets you create a virtual Layer-2 network on top of a Layer-3 (IP) network. Simply put, its a virtual network across machines and data centers using IP packets.|  | CNI |
| **IPAM** - IP Address Management | A is the system responsible for allocating and managing IP addresses in a network.|  |Networking |
| **MTU** - Maximum Transmission Unit | In networking (including Docker and Kubernetes), MTU is the largest size (in bytes) of a packet that can be sent over a network interface without being fragmented.| |Networking |
| **VTEP** -VXLAN Tunnel Endpoint | The host that encapsulates and decapsulates VXLAN traffic| |Networking | 

