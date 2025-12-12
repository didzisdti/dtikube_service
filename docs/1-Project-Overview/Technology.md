---
  title: Building with Open Source Technologies 
  description: High level overview on the open source stack that is utilised inside the project 

---

# {{ $frontmatter.title }}

The focuses on exploring the capabilities and utilising open source technologies, with preference of projects from Could Cloud Native Computing Foundation [CNCF](https://www.cncf.io/projects/) ecosystem.

Target stack for our first milestone: Kube platform activation
| **Purpose** |**Technology** | **Description** |
|---------|------------|-------------|
| **Automation** | <img src="../Graphics/cloud-init.svg" width="15%" style="display:inline; vertical-align:middle;"> [Cloud-init](https://cloudinit.readthedocs.io/en/latest/)  | Initial OS configuration |
| **Automation** | <img src="../Graphics/ansible.svg" width="15%" style="display:inline; vertical-align:middle;"> [Ansible](https://www.redhat.com/en/ansible-collaborative)  | Automates system configuration |
| **Automation** | <img src="../Graphics/Argo_CD.svg" width="15%" style="display:inline; vertical-align:middle;"> [Ago CD](https://argoproj.github.io/cd/)  | Declarative, GitOps continuous delivery |
| **Orchestration** | <img src="../Graphics/K3s.svg" width="15%" style="display:inline; vertical-align:middle;"> [K3S](https://k3s.guide/docs/welcome) | Lightweight Kubernetes distro |
| **Network**   | <img src="../Graphics/haproxy.svg" width="15%" style="display:inline; vertical-align:middle;"> [HA Proxy](https://www.haproxy.org/) | Load balancer for Kubernetes |
| **Network**   | <img src="../Graphics/flannel.svg" width="15%" style="display:inline; vertical-align:middle;"> [Flannel](https://www.haproxy.org/) | Kubernetes Pod-to-Pod Container Network Interface (CNI) |
...

...




<p align="center">
    <img alt="pikube-logo" src="../Graphics/under-construction.svg" width="40%">
</p>