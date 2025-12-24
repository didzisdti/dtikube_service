// .vitepress/config.js
import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'


export default withMermaid(
  defineConfig
        ({  // Metadata
        title: 'Kube documentation', // The title of your documentation site
        description: 'Documentation for the Baremetal kubernetes setup', // A brief description of your site
        base: '/dtikube_service/', // url path base
        // Theme configuration
        themeConfig: {
            outline: 'deep',
            nav: [{text: 'Home', link: '/'}],
            sidebar: [
                    {
                    text: 'Project Overview',
                    collapsed: true,
                    items: [
                            {text: 'Purpose', link: '/1-Project-Overview/Purpose' },
                            {text: 'Architecture Setup', link: '/1-Project-Overview/Architecture-Design' },
                            {text: 'Technology Stack', link: '/1-Project-Overview/Technology' },
                            ],
                    },
                    {
                    text: 'Access management',
                    collapsed: true,
                    items: [
                            {text: 'Account Profiles', link: '/2-Access-Management/Account-Profiles' },
//                            {text: 'Setup and Hardening', link: '/2-Access-Management/Setup-And-Hardening' },
                            ],
                    },
                    {
                    text: 'Cluster setup',
                    collapsed: true,
                    items: [
                            {text: 'Gateway Config', link: '/3-Cluster-Setup/Gateway-Config' },
                            {text: 'Node Config', link: '/3-Cluster-Setup/Node-Config' },
                            ],
                    },
                    {
                    text: 'Automation',
                    collapsed: false,
                    items: [
                            {text: 'Ansible Node Setup', link: '/4-Automation/Ansible-node-setup' },
                            ],
                    },
                    {
                    text: 'Kubernetes',
                    collapsed: true,
                    items: [
                            {text: 'k3s Setup', link: '/5-Kubernetes/k3s-Setup' },
                            {text: 'k3s Networking', link: '/6-Networking/k3s-Networking' },
                            {text: 'Kube Commands', link: '/5-Kubernetes/Kube-commands' },                                                    
                            ],
                    },
                    {
                    text: 'Monitoring and Observability',
                    collapsed: true,
                    items: [
                            {text: 'Metric Server', link: '/7-Monitoring/Metric-server' },
                            {text: 'Prometheus Guide', link: '/7-Monitoring/Prometheus-setup' },
                            ],
                    },
                    {
                    text: 'Glossary',
                    collapsed: true,
                    items: [
                            {text: 'Glossary Guide', link: '/99-Glossary/Terminology' },
                            ],
                    },
                ],

            },
        markdown: {
          toc: false,
          math: true,
          mermaid: true
        },
     },)
)
