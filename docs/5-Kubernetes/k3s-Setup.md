---
  title: K3s Cluster Configuration
  description: Setup details

---

# {{ $frontmatter.title }}

<p align="center">
    <img alt="k3s" src="../Graphics/K3s.svg" width="25%">
</p>

## :eye: Overview
K3d is a lightweight Kubernetes distribution. It is CNCF Certified project and it is designed for resources limited evnironments, an ideal choice for a mini data center.

K3s has two primary roles:
* **`K3s-Server:`** Runs server components: control place, scheduler, cloud-controller, helm-controller, etcd, API server, kubelet and kube-proxy. Note that master nodes can also run worker node simultneously.
* **`K3s-Agent:`** Runs worker node components: kubelet and kube-proxy



## Cluster Architecture configuration
Cluster currently consists of 4 nodes and is planned to expand to meet the high availability setup in near future.

### Master Nodes
* **`berry01`** (10.0.0.5) - Primary master node
* **`berry02`** (10.0.0.6) - Secondary master node

### Worker Nodes
* **`berryw10`** (10.0.0.11) - Raspberry Pi 4B worker
* **`berryw11`** (10.0.0.12) - Raspberry Pi 5 worker

## Setup Pre-requisites
Steps to action on all nodes before K3s installation to ensure smooth start.

### Enable cgroup
For Raspberry Pi by default this is not enabled and Kubernetes would not start successfully.
Target file: `/boot/firmware/cmdline.txt` or `/boot/firmware/current/cmdline.txt` check the system before executing

**Checks:**
```bash
# Check existing setup
mount | grep cgroup
cat /sys/fs/cgroup/cgroup.controllers | grep memory
```
**Update:**
```bash
# Add to the existing kernel parameters in the same line:
# cgroup_enable=cpuset cgroup_memory=1 cgroup_enable=memory
sudo sed -i 's/$/ cgroup_enable=cpuset cgroup_memory=1 cgroup_enable=memory/' /boot/firmware/current/cmdline.txt
```

### Enable Bridge Networking
Bridge networking lets pods communicate with each other and the host via a virtual network. It’s needed for consistent pod networking and isolation in Kubernetes.

**Checks:**

```bash
# Check if netfilter settings are correct
cat /etc/sysctl.d/k8s.conf

# Expected:
#net.bridge.bridge-nf-call-ip6tables = 1
#net.bridge.bridge-nf-call-iptables = 1

# Check if iptables are enabled to process bridged traffic by loading the required kernel module:
cat /etc/modules-load.d/k8s.conf

#Expected: br_netfilter

```
**Update:**
```bash
# Enable iptables kernel module
echo "br_netfilter" | sudo tee /etc/modules-load.d/k8s.conf

# enable netfilter
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
```

### Disable Swap
Ruuning Kubernetes with acitve swap is not advised, it can affect pod stability as kubelet does not “see” memory in swap.
Swap can also adversly affect the lifespan of your MicroSD cards.

**Checks:**

```bash
# Check if swap is being allocated and used
free -h
htop
```

**Update:**
```bash
# Temporary disable swap
sudo swapoff -a

# For persistant removal of swap comment outw with '#' swap entries in file below  
sudo nano /etc/fstab

```


...

...

<p align="center">
    <img alt="pikube-logo" src="../Graphics/under-construction.svg" width="40%">
</p>