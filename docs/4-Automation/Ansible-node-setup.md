---
  title: Ansible Node Setup
  description: Setup details

---

# {{ $frontmatter.title }}

<p align="center">
    <img alt="pikube-logo" src="../Graphics/ansible.svg" width="25%">
</p>

Ansible provides open-source automation that reduces complexity and allows automation for the cluster node setup. It is agentless automation tool that you install on a single host called the Control node.

::: info Why should we use Ansible?
* **Agent-less architecture:** No additional install maintenance across IT infrastructure.

* **Simplicity:** Easy to read .yaml, decentralized using SSH to access nodes.

* **Scalability and flexibility:** Modular design and wide range of supported platforms.
:::

## :eye: Control node choice
Ansible offers several options for setting up the control node 
* Linux environment options include any Linux machine with supported Linux OS on it.

* Windows environment with Windows Subsystem for Linux (WSL)


WSL is already chosen for other activities, the Ansible will also reside on WSL.

## :memo: Ansible Setup Guide

For executing our first ansible playbook we will start with the basics of the setup

### Setup Pre-requisites
```bash
# Install pre-requisite packages
sudo apt install -y \
  python3 \
  ansible 
```


### Creating Ansible Project Directory
```bash
# Create project directory structure
mkdir -p /ansible-project/{inventories,roles/system/tasks,playbooks,collections,templates}

# Create starting config files
touch ~/ansible-project/ansible.cfg \
      ~/ansible-project/inventories/hosts.yml \
      ~/ansible-project/roles/system/tasks/main.yml \
      ~/ansible-project/playbooks/system_setup.yml \
      ~/ansible-project/playbooks/kubernetes_setup.yml \
      ~/ansible-project/playbooks/kubernetes_seplay_remotetup.yml \
      ~/ansible-project/test_file   
```

```
# Project structure visualised
📁 /ansible-project
|   ⚙️ ansible.cfg
|   📄 test_file
├── 📁 inventories
│   └── 📄 hosts.yml
├── 📁 roles
│   └── 📁 system
│       └── 📁 tasks
├── 📁 playbooks
│   └── 📄 play_remote.yml
├── 📁 collections
└── 📁 templates
```

### Initial Configuration
```bash
# Config example: ansible.cfg
[defaults]
# Path to inventory file
inventory = ./inventories/hosts.yml

# Roles search path
roles_path = ./roles:/usr/share/ansible/roles

# Collections search path (singular to avoid deprecation warning)
collections_path = ./collections:/usr/share/ansible/collections

# Disable SSH host key checking (useful for local testing)
host_key_checking = False

# Human-readable YAML output
stdout_callback = yaml

# Optional: Suppress deprecation warnings
deprecation_warnings = False

# Optional: parallelism
forks = 5


# Hosts example: inventories/hosts.yml
all:
  hosts:
    gateway:
      ansible_host: 192.168.1.10                        # Replace with your server IP
      ansible_user: user                                # replace with your SSH username
      ansible_ssh_private_key_file: /home/user/.ssh/key # Path to SSH key

#  playbook example: playbooks/play_remote.yml
- name: Deploy file_test to production server
  hosts: gateway
  become: yes
  tasks:
    - name: Copy file_test to /home/user on remote server
      ansible.builtin.copy:
        src: ~/ansible-project/file_test         # from control node
        dest: ./file_test                        # on target node
        mode: '0644'
```

### Testing Configuration
```bash
# Check ansbile able to communicate with the target machines
ansible gateway -m ping
# Expected: gateway | SUCCESS => {...

# Testing sample playbook
ansible-playbook ./playbooks/play_remote.yml
# Expected: output with no errors  ok=2 changed =1
# you can also ssh on the target and see the new file created

# Remote command execution
ansible gateway -a "ls -l /etc/dnsmasq.d"
# Expected: should return list of files in that directory from target hosts

```

Now we can start building more elaborate playbooks to automate system and service setup.

Next target, system package installations, updates and Kubernetes setup automation



## --PLANNED-- Creating Container Environment (EE)
--PLANNED-- exploring at later stage containered setup for Ansible 

Main components, ansible-builder, ansible-navigator

...

...
<p align="center">
    <img alt="pikube-logo" src="../Graphics/under-construction.svg" width="40%">
</p>

