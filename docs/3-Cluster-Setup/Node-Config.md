---
  title: Cluster Node Configuration Guide 
  description: Key details on setting up cluster from scratch.

---

# {{ $frontmatter.title }}


## Custer Setup

### Mater node
* **`berry01`** : RaspberryPi 4B, 8GB

### Worker node
* **`berryw11`** : RaspberryPi 4B, 8GB
* **`berryw12`** : RaspberryPi 4B, 8GB


## Cloud-init configuration

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