---
  title: Cluster Node Configuration Guide 
  description: Key details on setting up cluster from scratch.

---

# {{ $frontmatter.title }}


## Custer Setup
The cluster currently consists of Raspberry Pi nodes with similar hardware settings.

### Mater node
* **`berry01`** : RaspberryPi 4B, 8GB

### Worker node
* **`berryw11`** : RaspberryPi 4B, 8GB
* **`berryw12`** : RaspberryPi 4B, 8GB


## :gear: Cloud-init configuration

Using standard YAML formatted file for all nodes to setup default access point.

Replace all content of user-data below content 

```yaml
#cloud-config

# System Configuration
timezone: Europe/London
locale: en_GB.UTF-8
hostname: berry01git 
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

### After initial cloud-init bootup

```bash
# Run package update
sudo apt update && sudo apt full-upgrade -y
```

```bash
# Network packages
sudo apt install -y \
    net-tools 

#system packages
sudo apt install -y \
    curl \
    git \
    wget \
    net-tools 

```

## :clock3: NTP/NTS Configuration

### Create Client Configuration
```bash
# Add target NTP server, local Router server
sudo nano /etc/chrony/sources.d/router-ntp.sources

# Remove existing sources which are external
sudo mv ubuntu-ntp-pools.sources ubuntu-ntp-pools.sources.disable
```

### Client Source Configuration `/etc/chrony/sources.d/router-ntp.sources`
```bash
server 10.0.0.1 iburst prefer
```


### Test NTP/NTS Config
```bash
# Restart chrony to load the new cofig
sudo systemctl restart chrony

# Check connection details
chronyc -n sources
# Look for an output srarting with ^* (source we are using)

# View chrony activity
chronyc activity

# Client side test to NTP server
sudo chronyc makestep
# Expected: 200 OK

```

<p align="center">
    <img alt="pikube-logo" src="../Graphics/under-construction.svg" width="40%">
</p>
