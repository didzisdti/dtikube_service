---
# Homepage definition of your site. (landing page and Home button page)
layout: home

hero:
  name: Kube Platform 
  text: Setup Guide & Documentation 
  tagline: Deploy, manage, and scale your Pi-based K3s cluster with ease
  image: 
    src: /education.png

  actions:
      - theme: brand
        text: Start Learning
        link: /1-Project-Overview/Purpose
      - theme: alt
        text: Open Github
        link: https://github.com/didzisdti/dtikube_service

features:
  - icon:
      src: Graphics/book.png
    title: Content Library
    details: Learn the lifecycle of cluster managment from hardware provisioning and configuration to orchestration and service deployment.
  - icon:
      src: Graphics/automation.png
    title: Automation
    details: Automate each server. OS setup on baremetal, automated and seamless deployment of cluster nodes using Ansible and cloud-init.
  - icon:
      src: Graphics/resilience.png
    title: Resillience
    details: Maintain ressillience and availability of the service through use of encrpytion, secure netwrok practices, high availaiblity and load balancing as well as back up and restore in a scenario of full failure.
---