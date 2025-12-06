---
  title: Identity and Access Management
  description: High level overview on the open source stack that is utilised inside the project 

---

# {{ $frontmatter.title }}

<p align="center">
    <img alt="iam-logo" 
    src="../Graphics/iam.svg" 
    width="25%">
</p>

## Control User

Cluster setup currently is operating under main admin user: `berryadmin` which controls all configuration, setup, start and stop or service and has elevated access rights.

| Username | Role | Priveledges | Authentication | Expiry |Used for |
|----------|------|-------------|----------------|--------|---------|
| root | Superuser | root |  disabled | - | Linux |
| berryadmin | Control user | sudo | Only SSH | - | Linux, Kubernetes |
| ... | ...

