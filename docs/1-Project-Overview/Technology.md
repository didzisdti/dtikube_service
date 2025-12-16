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
| **Orchestration** | <img src="../Graphics/containerd.svg" width="15%" style="display:inline; vertical-align:middle;"> [Containerd](https://containerd.io/) | Industry-standard container runtim |
| **Network**   | <img src="../Graphics/coredns.svg" width="15%" style="display:inline; vertical-align:middle;"> [CoreDNS](https://coredns.io/) | DNS and Service Discovery |
| **Network**   | <img src="../Graphics/haproxy.svg" width="15%" style="display:inline; vertical-align:middle;"> [HA Proxy](https://www.haproxy.org/) | Load balancer for Kubernetes |
| **Network**   | <img src="../Graphics/flannel.svg" width="15%" style="display:inline; vertical-align:middle;"> [Flannel](https://github.com/flannel-io/flannel) | Kubernetes Pod-to-Pod Container Network Interface (CNI) |


Target stack 2nd milestone:
| **Purpose** |**Technology** | **Description** |
|---------|------------|-------------|
| **Observability**   | <img src="../Graphics/prometheus.svg" width="15%" style="display:inline; vertical-align:middle;"> [Prometheus](https://prometheus.io/) | Monitoring and alerting |
| **Authentication**   | <img src="../Graphics/keycloak.svg" width="15%" style="display:inline; vertical-align:middle;"> [KeyCloak](https://www.keycloak.org/) | Identity and Access Management |
| **Authentication**   | <img src="../Graphics/oauth2-proxy.svg" width="15%" style="display:inline; vertical-align:middle;"> [OAuth2-proxy](https://oauth2-proxy.github.io/oauth2-proxy/) | Reverse proxy for adding authentication to applications |
| **Storage**   | <img src="../Graphics/longhorn.svg" width="15%" style="display:inline; vertical-align:middle;"> [Longhorn](https://longhorn.io/) | Cloud-native distributed block storage|
...

...




<p align="center">
    <img alt="pikube-logo" src="../Graphics/under-construction.svg" width="40%">
</p>