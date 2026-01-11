#include <DHT.h>

#define DHTPIN 4       // DHT11 data pin connected to Arduino pin 2
#define DHTTYPE DHT11   // Define sensor type

DHT dht(DHTPIN, DHTTYPE);

#define ACS_PIN A0

const float SENSITIVITY=0.066;
const float ZERO_CURRENT_VOLTAGE=2.5;


const int NUM_SAMPLES=50;   
void setup() {
  Serial.begin(9600);   // Serial communication with NodeMCU
  dht.begin();          // Start DHT sensor
  delay(2000);          // Sensor warm-up
  Serial.println("Arduino DHT11 + ACS712 transmitter ready");
}

void loop() {
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  float sensorValue=0;
  for(int i=0;i<NUM_SAMPLES;i++){
    sensorValue+=analogRead(ACS_PIN);
    delay(2);
  }
sensorValue/=NUM_SAMPLES;
float voltage=(sensorValue/1023.0)*5.0;
float current = (voltage-ZERO_CURRENT_VOLTAGE)/SENSITIVITY;
if(current<0) {
  current=0;
}
  // Check if readings are valid
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Error reading from DHT11");
  } else {
    // Send as comma-separated values
    Serial.print(temperature, 2);
    Serial.print(",");
    Serial.print(humidity, 2);
    Serial.print(",");
    Serial.println(current,3);
  }

  delay(3000); // Send data every 3 seconds
}
