---
  title: Gateway Node Configuration Guide 
  description: Key details on setting up cluster from scratch.

---

# {{ $frontmatter.title }}


## Custer Setup

### Gateway node
* **`berryX`** : RaspberryPi 4B, 8GB


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
# 1. Ensure dnsmasq is installed
apt list --installed | grep dnsmasq

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
interface=eth0
bind-interfaces

# DHCP range on LAN
dhcp-range=10.0.0.20,10.0.0.200,24h

# DHCP options
dhcp-option=option:router,10.0.0.1              # router gateway (3)
dhcp-option=option:dns-server,10.0.0.1          # DNS server (6)
dhcp-option=option:ntp-server,10.0.0.1          # NTP server (42)

# Local DNS domain
domain=home.lan
local=/home.lan/
expand-hosts

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