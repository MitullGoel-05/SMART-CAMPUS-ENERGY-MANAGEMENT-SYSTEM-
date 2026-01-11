#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

const char* ssid = "Ananya";
const char* password = "7078661270";
String serverName = "http://10.78.214.152:5000/iot";

//String serverName = "http://192.168.211.152:5000/iot";

#define LED_GREEN  D2
#define LED_YELLOW D3
#define LED_RED    D4
#define BUZZER     D5

void setup() {
  Serial.begin(9600);
  delay(1500);

  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_YELLOW, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  pinMode(BUZZER, OUTPUT);

  digitalWrite(LED_GREEN, LOW);
  digitalWrite(LED_YELLOW, LOW);
  digitalWrite(LED_RED, LOW);
  digitalWrite(BUZZER, LOW);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(400);
  }
  Serial.println("\nWiFi Connected!");
  Serial.println(WiFi.localIP());
}

// -------------- LED Logic --------------
void updateLEDs(float current) {
  if (current < 2) {
    digitalWrite(LED_GREEN, HIGH);
    digitalWrite(LED_YELLOW, LOW);
    digitalWrite(LED_RED, LOW);
  } else if (current < 6) {
    digitalWrite(LED_GREEN, LOW);
    digitalWrite(LED_YELLOW, HIGH);
    digitalWrite(LED_RED, LOW);
  } else {
    digitalWrite(LED_GREEN, LOW);
    digitalWrite(LED_YELLOW, LOW);
    digitalWrite(LED_RED, HIGH);
  }
}

void updateBuzzer(float current) {
  digitalWrite(BUZZER, current > 8 ? HIGH : LOW);
}

bool isValidFloat(float v) {
  return !(isnan(v) || isinf(v));
}

bool isClean(float t, float h, float c) {
  if (!isValidFloat(t) || !isValidFloat(h) || !isValidFloat(c)) return false;
  if (t < 5 || t > 60) return false;
  if (h < 10 || h > 100) return false;
  if (c < 0 || c > 50) return false;
  return true;
}

// ---------------- LOOP ----------------
void loop() {

  if (Serial.available()) {

    String data = Serial.readStringUntil('\n');
    data.replace("\r", "");
    data.replace("\n", "");
    data.trim();

    Serial.println("RAW: " + data);

    int c1 = data.indexOf(',');
    int c2 = data.lastIndexOf(',');

    if (c1 <= 0 || c2 <= c1) {
      Serial.println(" INVALID → Skipped (no JSON sent)");
      return;
    }

    float temp = data.substring(0, c1).toFloat();
    float hum  = data.substring(c1 + 1, c2).toFloat();
    float curr = data.substring(c2 + 1).toFloat();

    if (!isClean(temp, hum, curr)) {
      Serial.println(" BAD DATA → Skipped (garbage prevented)");
      return;
    }

    Serial.printf("OK Parsed → T: %.2f  H: %.2f  C: %.2f\n", temp, hum, curr);

    updateLEDs(curr);
    updateBuzzer(curr);

    // ---- SEND JSON ONLY IF VALID ----
    if (WiFi.status() == WL_CONNECTED) {

      WiFiClient client;
      HTTPClient http;

      http.begin(client, serverName);
      http.addHeader("Content-Type", "application/json");

      String json = "{\"temperature\":" + String(temp,2) +
                    ",\"humidity\":" + String(hum,2) +
                    ",\"current\":" + String(curr,3) + "}";

      Serial.println("JSON → " + json);

      int code = http.POST(json);
      Serial.print("SERVER → ");
      Serial.println(code);

      http.end();
    }
  }

  delay(40);
}
