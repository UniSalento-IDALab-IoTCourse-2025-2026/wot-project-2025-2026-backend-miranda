# IoT Biomedical Monitoring System - BLE Simulator (Backend)

## a) Project Overview
The **IoT Biomedical Monitoring System** is a comprehensive solution designed to simulate and track health parameters, originally modeled after a heart-failure IoT monitoring project (IIT Partnership). The system monitors real-time patient vitals via Bluetooth Low Energy (BLE), detects potential anomalies (such as high heart rate coupled with low movement), and provides a platform for patients to record clinical annotations and symptoms securely.

## b) System Architecture
The system is composed of two primary layers communicating over Bluetooth Low Energy (BLE):

1.  **The BLE Mock Server (Backend/Hardware):** A Node.js service running on a Raspberry Pi (or similar device) utilizing `@abandonware/bleno`. It advertises as a peripheral device (`IIT_Sensor_Mock`) and streams stochastic biometric data mimicking a wearable sensor. It uses the standard Bluetooth SIG Heart Rate Service (`180D`) and Characteristic (`2A37`).
2.  **The Mobile Application (Frontend):** A React Native application acting as the Central device. It scans for the specific hardware, connects via BLE GATT, and continuously parses the incoming raw byte stream. It utilizes Zustand for global state management to handle vitals, connection status, and clinical logs.

## c) Component Repositories
*   **[Frontend Repository - Mobile App]** (https://github.com/UniSalento-IDALab-IoTCourse-2025-2026/wot-project-2025-2026-frontend-miranda)
*   **[Backend Repository - Raspberry Pi BLE Server]** (https://github.com/UniSalento-IDALab-IoTCourse-2025-2026/wot-project-2025-2026-backend-miranda) *(Current Repository)*

---

## d) Present Component: Backend BLE Simulator

This repository contains the Node.js script used to mock a wearable medical sensor. It is intended to run on a Raspberry Pi or any Linux-based machine with a compatible Bluetooth radio.

### Key Features:
*   **Peripheral Advertising:** Uses `@abandonware/bleno` to broadcast the device presence under the local name `IIT_Sensor_Mock`.
*   **GATT Server Setup:** Establishes a Primary Service using the official Bluetooth SIG Heart Rate Service UUID (`180D`).
*   **Telemetry Streaming:** Creates a Characteristic (`2A37`) with `notify` properties to push continuous updates to subscribed clients.
*   **Stochastic Data Generation:** Generates a randomized heartbeat value between 60 and 150 BPM every 1000ms (1Hz) to simulate a live patient.
*   **Proper BLE Payload Formatting:** Writes data to a 2-byte buffer, adhering to the GATT specification (allocating byte 0 for formatting flags and byte 1 for the 8-bit BPM payload).

### Execution:
The script requires root/sudo privileges to control the Bluetooth HCI (Host Controller Interface) states. Once executed, it waits for a central device (the mobile app) to subscribe to the characteristic before it begins generating and transmitting the mock telemetry stream.