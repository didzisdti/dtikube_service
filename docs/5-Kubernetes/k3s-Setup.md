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

> [!IMPORTANT]
> For changes to apply, you must reboot the target host.

## High Availability Configuration
For Cluster that has more than 1 master the setup will require a load balancing element. HAProxy will be used to load balanace using our central gateway node.

### Installation
```bash
# Check HAProxy is already deployed
sudo systemctl status haproxy

# Install the required packge
sudo apt install haproxy
```

### Configuration `/etc/haproxy/haproxy.cfg`
Once installed we have default values already provided, most of which we will use.
```bash
# ----------------------------
# Defaults post installation
# ----------------------------

global
        # Loggs to debug HAProxy
        log /dev/log    local0
        log /dev/log    local1 notice

        # Security setting
        chroot /var/lib/haproxy

        # Enables external tools to query HAProxy for status
        stats socket /run/haproxy/admin.sock mode 660 level admin
        stats timeout 30s

        # Security and process management
        user haproxy
        group haproxy
        daemon

        # Default SSL material locations
        ca-base /etc/ssl/certs
        crt-base /etc/ssl/private

        # See: https://ssl-config.mozilla.org/#server=haproxy&server-version=2.0.3&config=intermediate
        ssl-default-bind-ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384
        ssl-default-bind-ciphersuites TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256
        ssl-default-bind-options ssl-min-ver TLSv1.2 no-tls-tickets

defaults
        # Logging
        log     global
        
        # Connection more with options
        mode    http
        option  httplog
        option  dontlognull
        
        # Timeout ettings (in seconds)
        timeout connect 5000
        timeout client  50000
        timeout server  50000

        # Error page config
        errorfile 400 /etc/haproxy/errors/400.http
        errorfile 403 /etc/haproxy/errors/403.http
        errorfile 408 /etc/haproxy/errors/408.http
        errorfile 500 /etc/haproxy/errors/500.http
        errorfile 502 /etc/haproxy/errors/502.http
        errorfile 503 /etc/haproxy/errors/503.http
        errorfile 504 /etc/haproxy/errors/504.http

# ----------------------------
# Additionally added config
# ----------------------------

#-------------------------------
# Frontend API
#-------------------------------
frontend k3s_api
    # Listen configuration
    bind *:6443
    mode tcp
    option tcplog
    
    # Route to backend
    default_backend k3s_backend

#-------------------------------
# Backend Control Plane
#-------------------------------
backend k3s_backend
    # Connection configuration
    mode tcp
    option tcp-check
    balance roundrobin
    
    # Master nodes
    server berry01 10.0.0.5:6443 check
    server berry02 10.0.0.6:6443 check
```

### Check and Restart
```bash
# Validate config syntax
sudo haproxy -c -f /etc/haproxy/haproxy.cfg

# Apply change and ensure startup after servere restart
sudo systemctl restart haproxy
sudo systemctl enable haproxy
```

## Master Creation
Cluster has primary master to which all other nodes (master and worker) will be joining.



## Worker Creation

...

...

<p align="center">
    <img alt="pikube-logo" src="../Graphics/under-construction.svg" width="40%">
</p>