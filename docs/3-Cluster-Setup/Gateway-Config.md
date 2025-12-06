---
  title: Gateway Node Configuration Guide 
  description: Key details on setting up cluster from scratch.

---

# {{ $frontmatter.title }}

(logo)

## Getway Setup
Central component in the architecture, controlling all the traffing, connecting to internet and acting as DNS, DCHP and firewall server. Cluster is accessed using gateway as a jump server.

### Gateway node
* **`berryX`** : RaspberryPi 4B, 8GB

## Network configuration
The network is segregated in 2 parts
* **Home Network Endpoint:** 192.168.1.10/24 Wifi connectiong to home internet router
* **Cluster Network Endpoint:** 10.0.0.1 cable setup into LAN switch

## Cloud-init configuration

Using standard YAML formatted file for all nodes to setup default access point.

Replace all content of user-data below content 

```yaml
#cloud-config

# System Configuration
timezone: Europe/London
locale: en_GB.UTF-8
hostname: berry01
manage_etc_hosts: localhost

# User Account Configuration
users:
- name: berryadmin
  primary_group: users
  groups: adm, sudo
  shell: /bin/bash
  lock_passwd: true
  ssh_authorized_keys:
    - ssh-ed25519 AAAAC3NzaC....TEMPLATE #Replace with your public key
  sudo: ALL=(ALL) NOPASSWD:ALL


# System Updates
package_update: true
package_upgrade: true

# Essential Packages
packages:
  - curl
  - wget
  - git

# Inherited security settings
ssh_pwauth: false
disable_root: true

# Reboot after configuration
power_state:
  mode: reboot
```

Replace all content of network below content 

```yaml
# Cloud-init network configuration
network:
  version: 2
  renderer: networkd

  ethernets:
    eth0:
      dhcp4: false
      addresses:
        - 10.0.0.1/24

  wifis:
    wlan0:
      dhcp4: false
      optional: true
      access-points:
        "YourWiFiSSID":
          password: "YourWiFiPassword"
        "YourWiFiSSID":
          password: "YourWiFiPassword"
      addresses:
        - 192.168.1.10/24
      routes:
        - to: default
          via: 192.168.1.1
      nameservers:
        addresses:
          - 1.1.1.1
          - 8.8.8.8
          - 8.8.4.4
```

### After initial cloud-init bootup

```bash
# Run package update
sudo apt update && sudo apt full-upgrade -y
```

```bash
# Network packages
sudo apt install -y \
    dnsmasq \
    nftables \

#system packages
sudo apt install -y \
    curl \
    git \
    wget 

```

## DNS & DHCP configuration

### dnsmasq configuation

dnsmaq is a lightweight DNS, DHCP service that is suitable for smaller network and home lab setup. The setup include Static IP management and DNS forwarding.

```bash
# 1. Ensure dnsmasq is installed and enabled
apt list --installed | grep dnsmasq
sudo systemctl status dnsmasq

#2. Backup default config
sudo cp /etc/dnsmasq.conf /etc/bak_dnsmasq.conf

#3 Create config location .d if one does not yet exist
sudo mkdir /etc/dnsmasq.d/

#4. Uncommnent dnsmasq.conf setting that enables conf file directory lookup
sudo sed -i 's|#conf-dir=/etc/dnsmasq\.d/,\*\.conf|conf-dir=/etc/dnsmasq.d/,*.conf|' /etc/dnsmasq.conf


```

### LAN config: `/etc/dnsmasq./10-lan.conf`

```bash
# -----------------------
# DNSMASQ CONFIG FOR LAN
# -----------------------

# Listen only on LAN interface
interface=eth0                                  # DNS and DCHP listening interface
except-interface=lo                             # exclude local loopback
bind-interfaces                                 # ownership of port 53, avoidance of conflict with other DNS resolvers

# DNS security settings
no-resolv                                       # ignore /etc/resolv.conf
bogus-priv                                      # blocks reverse lookup responses for private IP range
stop-dns-rebind                                 # prevents DNS rebind attacks
rebind-localhost-ok                             # allow localhost rebinding

# DNS performance settings
cache-size=500                                  # recommended for small networks 500-2k

# DHCP range on LAN
dhcp-range=10.0.0.20,10.0.0.200,24h             #

# DHCP options
dhcp-option=option:router,10.0.0.1              # router gateway (3)
dhcp-option=option:dns-server,10.0.0.1          # DNS server (6)
dhcp-option=option:ntp-server,10.0.0.1          # NTP server (42)

# Local DNS domain configurtion
domain=dtikube.techinsights.com
local=/dtikube.techinsights.com/
expand-hosts                                    # automatically append domain= to entries from hosts files. /etc/hosts

#Enable DNS and DCHP logging
log-queries=extra               # Log DNS
log-dhcp                        # Log DHCP

#DNS external servers
server=1.1.1.1                  # Cloudflare primary
server=8.8.8.8                  # Google primary
server=8.8.4.4                  # Google secondary

```

### Static config: `/etc/dnsmasq./10-lan.conf`

```bash
# -----------------------
# DNSMASQ CONFIG FOR Satic IP assignments
# -----------------------

#Resered satic IP addresses for master nodes
dhcp-host=d8:3a:dd:e2:85:37,berry01,10.0.0.5            #1st 

#Reserver static IP address for worker nodes
dhcp-host=d8:3a:dd:ef:cd:e5,berryw11,10.0.0.10          #2nd 
dhcp-host=d8:3a:dd:e2:81:5c,berryw12,10.0.0.11          #3rd
```

### Config post-checks

```bash
#1. Restart the service to apply the new settings
sudo systemctl restart dnsmasq

#2. Verify the new setup
sudo systemctl status dnsmasq

#3. Test DNS resolution, avoid false positive and force lookup through dnsmasq
nslookup google.com 10.0.0.1

```

