---
  title: Architecture, Infrastructure Components and Configuration 
  description: The amazing description

---

# {{ $frontmatter.title }}

(logo)

## :hammer_and_wrench: Hardware

The project hardware setup details each element, required to build a small cluster, from power management and cabling to processing boards and physcial cluster rack assembly.

(arc diagram)


### Processing board: Raspberry Pi 4B
* **CPU:** Broadcom BCM2711, Processor Quad core A72 (ARM v8) 64-bit, 1.5GHz
* **RAM:** 8GB LPDDR4 SDRAM
* **Ethernet:** 1 Gbit ethernet
* **WIFI** 2.4GHz/5.0GHz IEEE 802.11ac
* **USB:** 2 x USB 2.0 ports, 2 x USB 3.0 ports
* **Storage:** MircoSD card slot 
* **POWER:** 3 Options available
  * 5V/3A DC via USB-C or 
  * 5V/3A DC via GPIO header or 
  * Power over Ethernet (PoE) enabled (requires separate PoE HAT)

### Storage
* **SanDisk:**
  * A2, SanDisk 256GB Extreme PRO micro SD
  * Read/Write: 140/200 MB/s 
  * A1, SanDisk 256GB Ultra microSDXC card
  * Read/Write: 30/150 MB/s
* **Lexar:** 
  * A2, Lexar Blue Micro SD Card 256GB
  * Read/Write: 40/160 MB/s


### Network
* **TP-Link TL-SG608E:** 8-port managed switch with VLAN support and remote management capabilities for enhanced network functionality.

* **CAT Cabling:** UGREEN Ethernet Cat 8 Flat Cable 0.5M, With Speed up to 40Gbps 2000Mhz ensuring stability in connection.

### Power supply
* **Anker Prime Charger, 200W 6-Port GaN:** 4 x USB-C ports with up to 100W supply on a single port, and 2 USB ports with up to 22.5W supply. Utilised by both control node and cluster.
  * **ActiveShield 3.0:** Offers voltage protection, current regulation, and real-time temperature monitoring.
  * **PowerIQ 3.0:** Technology guarantees reconginition and fast charging for a wide range of devices
* **Wiring:** USB-C to USB-C Cable, 60W 20V/3A

### Cooling
* **Open-Case Frame:** Open Pi Cluster case allowing adequate air ciruclation
* **Cooling Fan:** Mounted on top of each board in the cluster
* **Idividual Heatsinks:** Alluminium heatsinks applied on Processor, RAM, USB controller and Ethernet controller

## Network topology 


## Technology stack





examples of technologies used and where to learn more about it

k3s, Arco CD, Ansible