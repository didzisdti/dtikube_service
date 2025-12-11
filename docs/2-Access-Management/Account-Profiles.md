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

## :frowning_man: Control User

Cluster setup currently is operating under main admin user: `berryadmin` which controls all configuration, setup, start and stop or service and has elevated access rights.

| Username | Role | Privileges | Authentication | Expiry |Used for |
|----------|------|-------------|----------------|--------|---------|
| root | Superuser | root |  disabled | - | Linux |
| berryadmin | Control user | sudo | Only SSH | - | Linux, Kubernetes |
| ... | ...

## :key: SSH Key Generation
SSH (Secure Shell) keys provides a password less more secure, encrypted way to remotely access and control another computer over a network. 2 keys are generated, a public key that is shared with target server and private key which is not distributed and used to authenticate. [SSH Git](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)

```bash
# Process to generate SSH key
# Note it will prompt key location, name and passphrase
# Leave passphrase empty if you don't require authentication each time you use the key
ssh-keygen -t ed25519 -C "your_email@example.com"
```

Key pair with private key:`id_ed25519` and public key:`id_ed25519.pub` will be generated in ~/.ssh directory.