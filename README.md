# IoMT BLE Sensor Simulator (Raspberry Pi 5)

## Overview
This repository contains the Node.js backend script designed to run on a Raspberry Pi 5. Its primary function is to act as a hardware emulator (Far Edge node) within an Internet of Medical Things (IoMT) architecture. The script configures the Raspberry Pi's integrated Bluetooth Low Energy (BLE) module to operate as a virtual GATT Server, simulating the real-time continuous transmission of multiparametric biomedical data (Heart Rate, Temperature, Movement, and Posture).

## Hardware
* **Target Device:** Raspberry Pi 5
* **Network Interface:** Integrated Bluetooth 5.0 / BLE radio
* **Role:** BLE Peripheral Device / GATT Server

## Software and Dependencies
The simulation environment relies on a JavaScript runtime executing directly on the Linux-based operating system (Raspberry Pi OS).

* **Runtime:** Node.js
* **Package Manager:** npm
* **Primary Library:** `@abandonware/bleno`
  * *Description:* A Node.js module for implementing BLE peripherals. It provides the low-level bindings required to interface with the Linux Bluetooth stack (BlueZ), allowing the definition of custom GAP (Generic Access Profile) advertising and GATT (Generic Attribute Profile) Services and Characteristics.

## Architecture and Structure
The backend is structured around the BLE client-server taxonomy. The script dynamically constructs a medical service profile based on standard Bluetooth SIG UUIDs.

### System Flow
1. **Radio State Management:** The script initializes the BLE radio. Once powered on, it begins advertising the device presence (e.g., `IIT_Sensor_Mock`).
2. **GATT Server Instantiation:** Services are broadcasted. For instance, the Heart Rate Service (`0x180D`).
3. **Characteristic Subscription:** When a Central Device (the React Native mobile application) connects and subscribes to the notification characteristic (e.g., `0x2A37`), the telemetry stream is initiated.
4. **Data Transmission (Raw Bytes):** To ensure power efficiency and adhere to BLE standards, data is not transmitted as JSON or Strings. The Node.js script allocates binary buffers (e.g., `Buffer.alloc(2)`), writes the requisite 8-bit format flags to the first byte, writes the simulated integer to the subsequent bytes, and pushes the payload over the air.

### Project Directory Structure
```text
simulator-iomt/
│
├── node_modules/             # Installed dependencies
├── package.json              # Project metadata and dependency tree
├── package-lock.json         # Exact dependency versions
└── simulator.js              # Main execution script containing the Bleno GATT 
```


### Execution
Because the script requires direct access to the Bluetooth hardware interface (HCI) on Linux, it must be executed with elevated root privileges.

To start the BLE GATT Server:
```
sudo node simulator.js
```
### Testing and Validation
Prior to interfacing with the final mobile application, the data stream integrity can be validated using a secondary device running nRF Connect for Mobile. Scanning for the advertised local name and inspecting the characteristic notifications will confirm the correct raw byte formatting and transmission intervals.