---
  title: Gateway Node Configuration Guide 
  description: Key details on setting up cluster from scratch.

---

# {{ $frontmatter.title }}

<p align="center">
    <img alt="pikube-logo" src="../Graphics/gateway.svg" width="25%">
</p>

## Getway Setup
Central component in the architecture, controlling all the traffing, connecting to internet and acting as DNS, DCHP and firewall server. Cluster is accessed using gateway as a jump server.

### Gateway node
* **`berryX`** : RaspberryPi 4B, 8GB

## OS deployment
The gateway node runs on the latest Ubuntu 25.10 server. The process for setting up your OS on Raspebbry Pi can be done in following steps.

1. Download and install microSD Imager: [Raspberry Pi Imager](https://ubuntu.com/download/raspberry-pi)

2. Flash the MicroSD card with desired OS type and version

3. Update cloud-init config files: `user-data` and `network-config` 


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
    net-tools 

#system packages
sudo apt install -y \
    curl \
    git \
    wget 

```

## Network configuration
The network is segregated in 2 parts
* **Home Network Endpoint:** 192.168.1.10/24 Wifi connectiong to home internet router
* **Cluster Network Endpoint:** 10.0.0.1 cable setup into LAN switch

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

## Router Configuration
LAN cluster by default cannot reach internet outside its local network area. To enable it gateway is configured to act as a router.

```bash
# Enable packet forwarding
echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.conf

# Apply fowarding changes now
sudo sysctl -p

# Verify setup
cat /proc/sys/net/ipv4/ip_forward

```
With forwarding enabled, the traffic might still not reach intended destination. Lets look at firewall setup to ensure that router setup is working.


## Firewall Configuration
To configure our firewall settings `nftables` will be used as it is more modern and the successor for iptables config. All rules in theory can be defined in `/etc/nftables.conf` for a small and relatively static network setup.

### Check Existing Setup
```bash
# Check nftables is installed. Use "enable" and "start" if not active.
apt list --installed | grep nftables
sudo systemctl status nftables

# Check existing config of nftables
cat /etc/nftables.conf
```

 The chosen setup features the professional approach of modular structure for nftables configuration, often used in production environments and has improved maintainability and scalaility. In addition the configuration files are numbered to guarantee loading order and provide predictability.

 ### Creating Modular Structure

```bash
# Create main structure
sudo mkdir /etc/nftables.d/
sudo mkdir /etc/nftables.d/60-nat/

# Creating main filtering rulesets and static
sudo nano /etc/nftables.d/10-constants.nft
sudo nano /etc/nftables.d/20-sets.nft
sudo nano /etc/nftables.d/30-input.nft
sudo nano /etc/nftables.d/40-forward.nft
sudo nano /etc/nftables.d/50-output.nft

# Creating NAT rulesets
sudo nano /etc/nftables.d/60-nat/10-prerouting.nft
sudo nano /etc/nftables.d/60-nat/20-postrouting.nft
``` 


### Update `/etc/nftables.conf`

 ```bash
#!/usr/sbin/nft -f
# General Firewall settings
# This config file is updated only once during intial creation

# Clear ruleset before applying new
flush ruleset

# include all modular files
include "/etc/nftables.d/*.nft"
include "/etc/nftables.d/nat/*.nft"
 ``` 

### Create Constants Set `/etc/nftables.d/10-constants.nft`
```bash
# Network Interface Definitions
define lan_if = eth0      # LAN network, listening local
define wan_if = wlan0     # Home network, listening external

# Network Address Ranges
define lan_net = 10.0.0.0/24        # LAN local network
define home_net = 192.168.1.0/24    # Home network
```

### Create Constants Set `/etc/nftables.d/20-sets.nft`
```bash

```

### Incomming Traffic Rules `/etc/nftables.d/30-input.nft`
```bash

```

### Create Constants Set `/etc/nftables.d/40-forward.nft`
```bash

```

### Outgoing traffic Rules `/etc/nftables.d/50-output.nft`
```bash
# Ruleset for filtering outgoing traffic
# Required to initiate package and system updates and communicate with external services

# Configuration does not restrict outgoing traffic
table ip filter {

    chain output {
        type filter hook output priority 0;
        policy accept;
    }
}
```

### Create DNAT Ruleset `/etc/nftables.d/60-nat/10-prerouting.nft`
```bash
# Ruleset for DNAT (destination network address translation) and port forwarding

table ip nat {

    chain prerouting {
        type nat hook prerouting priority -100;

        #Custom string to help with high level analysis and limiting log input to not flood the logs
        log prefix "[NAT PREROUTING]: " limit rate 5/minute burst 5 packets
    }
}

#Example: port forwarding of external port 80 to internal destination
# iifname $wan_if tcp dport 80 dnat 10.0.0.5.80
```

### Create SNAT Ruleset `/etc/nftables.d/60-nat/20-postrouting.nft`
```bash
# Ruleset for SNAT (source network address translation)
# Important enabler for LAN cluster access to internet

table ip nat {

    chain postrouting {
        type nat hook postrouting priority 100;

        # Transform (masquarade) intnerl IPs 10.0.0.x into gteway external 192.168.1.x
        oif $WAN_IF ip saddr $LAN_NET masquerade

        #Custom string to help with high level analysis and limiting log input to not flood the logs
        log prefix "[NAT POSTROUTING]: " limit rate 5/minute burst 5 packets
    }
}
```

## NTP Configuration

Gateway server position to provide Network Time Protocol services using `chrony`, allowing seemless time accuracy accross the cluster. Recoomented for kubertenetes environment. 

```bash
# Check chrony is installed
apt list --installed | grep chrony

# Check current setup
cat /etc/chrony/chrony.conf

# Check current status, Use enable and start to activate.
sudo systemctl status chrony

```

<p align="center">
    <img alt="pikube-logo" src="../Graphics/under-construction.svg" width="40%">
</p>