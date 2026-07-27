const bleno = require('@abandonware/bleno');

// Official Bluetooth SIG UUIDs
const HEART_RATE_SERVICE_UUID = '180D';
const HEART_RATE_MEASUREMENT_CHAR_UUID = '2A37';
const THERMOMETER_SERVICE_UUID = '1809';
const TEMPERATURE_CHAR_UUID = '2A1C';

// Custom UUIDs (Created for movement telemetry)
const MOVEMENT_SERVICE_UUID = '1900';
const MOVEMENT_CHAR_UUID = '2B01';

// 1. Heart Rate Characteristic
class HeartRateCharacteristic extends bleno.Characteristic {
  constructor() {
    super({ uuid: HEART_RATE_MEASUREMENT_CHAR_UUID, properties: ['notify'], value: null });
    this.intervalId = null;
  }
  
  onSubscribe(maxValueSize, updateValueCallback) {
    console.log('[BLE SERVER] Heart Rate telemetry started...');
    this.intervalId = setInterval(() => {
      const bpm = Math.floor(Math.random() * (150 - 60 + 1)) + 60;
      const data = Buffer.alloc(2);
      data.writeUInt8(0, 0);   
      data.writeUInt8(bpm, 1); 
      updateValueCallback(data); 
    }, 1000); 
  }
  
  onUnsubscribe() { 
    clearInterval(this.intervalId); 
  }
}

// 2. Body Temperature Characteristic
class TemperatureCharacteristic extends bleno.Characteristic {
  constructor() {
    super({ uuid: TEMPERATURE_CHAR_UUID, properties: ['notify'], value: null });
    this.intervalId = null;
  }
  
  onSubscribe(maxValueSize, updateValueCallback) {
    console.log('[BLE SERVER] Temperature telemetry started...');
    this.intervalId = setInterval(() => {
      // Generates temperature between 36.0 and 39.0
      const tempFloat = 36.0 + (Math.random() * 3.0);
      
      // Multiply by 10 and send as a 16-bit integer to avoid precision loss (e.g., 36.5 = 365)
      const tempInt = Math.round(tempFloat * 10);
      
      const data = Buffer.alloc(2);
      data.writeUInt16LE(tempInt, 0);
      updateValueCallback(data);
    }, 2000); // Updates every 2 seconds to simulate slower temperature changes
  }
  
  onUnsubscribe() { 
    clearInterval(this.intervalId); 
  }
}

// 3. Movement Characteristic
class MovementCharacteristic extends bleno.Characteristic {
  constructor() {
    super({ uuid: MOVEMENT_CHAR_UUID, properties: ['notify'], value: null });
    this.intervalId = null;
  }
  
  onSubscribe(maxValueSize, updateValueCallback) {
    console.log('[BLE SERVER] Movement telemetry started...');
    this.intervalId = setInterval(() => {
      // Generates movement intensity from 0 (completely still) to 10 (running/high activity)
      const movementLevel = Math.floor(Math.random() * 11);
      
      const data = Buffer.alloc(1);
      data.writeUInt8(movementLevel, 0);
      updateValueCallback(data);
    }, 1000);
  }
  
  onUnsubscribe() { 
    clearInterval(this.intervalId); 
  }
}

// BLE Radio State Management
bleno.on('stateChange', function(state) {
  console.log(`[BLE HCI] Radio state changed to: ${state}`);
  if (state === 'poweredOn') {
    bleno.startAdvertising('IIT_Sensor_Mock', [HEART_RATE_SERVICE_UUID, THERMOMETER_SERVICE_UUID, MOVEMENT_SERVICE_UUID]);
  } else {
    bleno.stopAdvertising();
  }
});

// Broadcast and Services Initialization
bleno.on('advertisingStart', function(error) {
  if (!error) {
    console.log('[BLE ADV] Advertising successfully started. Broadcasting services...');
    bleno.setServices([
      new bleno.PrimaryService({
        uuid: HEART_RATE_SERVICE_UUID,
        characteristics: [new HeartRateCharacteristic()]
      }),
      new bleno.PrimaryService({
        uuid: THERMOMETER_SERVICE_UUID,
        characteristics: [new TemperatureCharacteristic()]
      }),
      new bleno.PrimaryService({
        uuid: MOVEMENT_SERVICE_UUID,
        characteristics: [new MovementCharacteristic()]
      })
    ]);
  } else {
    console.error(`[BLE ADV] Advertising failed with error: ${error}`);
  }
});