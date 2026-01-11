#===========================================================================
# SMART ENERGY MONITORING SYSTEM (STANDARD SKLEARN VERSION)
# Models: Random Forest, Gradient Boosting, SVR, Decision Tree
#===========================================================================


import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.svm import SVR
from sklearn.tree import DecisionTreeRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import r2_score, mean_squared_error
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.impute import SimpleImputer, KNNImputer
import joblib
import random
from datetime import datetime
import warnings


# Suppress warnings for cleaner output
warnings.filterwarnings('ignore')


print("=" * 70)
print("SMART ENERGY MONITORING SYSTEM v4.0")
print("=" * 70)


#===========================================================================
# 1. CONFIGURATION & CONSTANTS
#===========================================================================


class EnergyConfig:
    # Energy thresholds (kWh)
    LOW_THRESHOLD = 50
    MEDIUM_THRESHOLD = 80
    HIGH_THRESHOLD = 100
    CRITICAL_THRESHOLD = 120
   
    # Cost parameters
    ELECTRICITY_RATE = 8.50  # per kWh
    CARBON_FACTOR = 0.82  # kg CO2 per kWh
   
    # Appliance power profiles (Watts)
    APPLIANCE_PROFILES = {
        "AC_Floor1": {"min": 1500, "max": 3000, "location": "Floor 1"},
        "AC_Floor2": {"min": 1500, "max": 3000, "location": "Floor 2"},
        "Lights_Lab": {"min": 400, "max": 800, "location": "Computer Lab"},
        "Computers_Lab": {"min": 800, "max": 2000, "location": "Computer Lab"},
        "Water_Cooler": {"min": 100, "max": 300, "location": "Common Area"}
    }


#===========================================================================
# 2. DATA PREPROCESSING PIPELINE
#===========================================================================


class EnergyDataPreprocessor:
    def __init__(self):
        self.scaler = StandardScaler()
        self.numeric_imputer = KNNImputer(n_neighbors=5)
        self.categorical_imputer = SimpleImputer(strategy='most_frequent')
        self.label_encoders = {}
        self.feature_names = []


    def load_data(self, file_path):
        print("Loading data...")
        try:
            self.raw_data = pd.read_csv(file_path)
            print(f"Data loaded: {self.raw_data.shape[0]} rows, {self.raw_data.shape[1]} columns")
            return self.raw_data
        except Exception as e:
            print(f"Error loading data: {e}")
            return None


    def clean_data(self):
        print("Cleaning data...")
        self.cleaned_data = self.raw_data.copy()
       
        # Fix column names
        self.cleaned_data.columns = [col.strip().replace(' ', '_').replace('-', '_') for col in self.cleaned_data.columns]
       
        # Handle duplicates
        self.cleaned_data = self.cleaned_data.drop_duplicates()
       
        # Handle outliers (clip to 1.5 IQR)
        self.numeric_cols = self.cleaned_data.select_dtypes(include=[np.number]).columns.tolist()
       
        for col in self.numeric_cols:
            Q1 = self.cleaned_data[col].quantile(0.25)
            Q3 = self.cleaned_data[col].quantile(0.75)
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            self.cleaned_data[col] = np.clip(self.cleaned_data[col], lower_bound, upper_bound)
           
        return self.cleaned_data


    def feature_engineering(self):
        print("Feature engineering...")
       
        # Create time-based features
        timestamp_cols = [col for col in self.cleaned_data.columns if 'time' in col.lower() or 'date' in col.lower()]
        if timestamp_cols:
            timestamp_col = timestamp_cols[0]
            try:
                self.cleaned_data[timestamp_col] = pd.to_datetime(self.cleaned_data[timestamp_col])
               
                self.cleaned_data['hour'] = self.cleaned_data[timestamp_col].dt.hour
                self.cleaned_data['day_of_week'] = self.cleaned_data[timestamp_col].dt.dayofweek
                self.cleaned_data['month'] = self.cleaned_data[timestamp_col].dt.month
                self.cleaned_data['is_weekend'] = (self.cleaned_data['day_of_week'] >= 5).astype(int)
               
                self.cleaned_data = self.cleaned_data.drop(columns=[timestamp_col])
            except Exception as e:
                print(f"Could not parse timestamp: {e}")
                self.cleaned_data = self.cleaned_data.drop(columns=[timestamp_col])
       
        # Create polynomial features
        if 'Temperature' in self.cleaned_data.columns:
            self.cleaned_data['Temperature_squared'] = self.cleaned_data['Temperature'] ** 2
           
        if 'Occupancy' in self.cleaned_data.columns:
            self.cleaned_data['Occupancy_squared'] = self.cleaned_data['Occupancy'] ** 2
           
        return self.cleaned_data


    def encode_categorical_variables(self, target_column='EnergyConsumption'):
        print("Encoding categorical variables...")
       
        # Find any remaining text columns (e.g., 'Day', 'WeekStatus')
        # This fixes the "could not convert string to float: Friday" error
        object_cols = self.cleaned_data.select_dtypes(include=['object']).columns.tolist()
       
        for col in object_cols:
            if col != target_column:
                print(f" - Encoding text column: {col}")
                self.label_encoders[col] = LabelEncoder()
                self.cleaned_data[col] = self.label_encoders[col].fit_transform(self.cleaned_data[col].astype(str))
               
        return self.cleaned_data


    def handle_missing_values(self):
        print("Handling missing values...")
       
        # Re-identify numeric columns after encoding
        self.numeric_cols = self.cleaned_data.select_dtypes(include=[np.number]).columns.tolist()
       
        if self.numeric_cols:
            self.cleaned_data[self.numeric_cols] = self.numeric_imputer.fit_transform(
                self.cleaned_data[self.numeric_cols]
            )
           
        return self.cleaned_data


    def scale_features(self, target_column='EnergyConsumption'):
        print("Scaling features...")
       
        # Remove datetime objects if any remain
        self.cleaned_data = self.cleaned_data.select_dtypes(exclude=['datetime64'])
       
        # Identify feature columns
        feature_columns = [col for col in self.cleaned_data.columns if col != target_column]
       
        if feature_columns:
            self.feature_names = feature_columns # IMPORTANT: Save exact order
            self.cleaned_data[feature_columns] = self.scaler.fit_transform(self.cleaned_data[feature_columns])
            print(f"Scaled {len(feature_columns)} numeric features")
           
        return self.cleaned_data


    def get_preprocessed_data(self, target_column='EnergyConsumption'):
        # Auto-detect target if not found
        if target_column not in self.cleaned_data.columns:
            possible = [c for c in self.cleaned_data.columns if 'energy' in c.lower() or 'consum' in c.lower()]
            if possible:
                target_column = possible[0]
                print(f"Target detected: {target_column}")
            else:
                print("No target column found!")
                return None, None
               
        X = self.cleaned_data[self.feature_names]
        y = self.cleaned_data[target_column]
       
        return X, y


#===========================================================================
# 3. ML MODELS COMPARISON (FIXED LOGIC)
#===========================================================================


class MLModelComparator:
    def __init__(self):
        self.models = {}
        self.results = {}
        self.best_model = None
        # FIX 1: Initialize with Negative Infinity because we want to MAXIMIZE R2 Score
        self.best_score = -np.inf 


    def initialize_models(self):
        print("Initializing ML models...")
        self.models = {
            'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1),
            'Gradient Boosting': GradientBoostingRegressor(n_estimators=100, random_state=42),
            'SVR': SVR(kernel='rbf', C=1.0),
            'Decision Tree': DecisionTreeRegressor(random_state=42)
        }
        print(f"Initialized {len(self.models)} models")
        return self.models


    def train_and_compare_models(self, X_train, X_test, y_train, y_test):
        print("\nTraining and comparing models...")
        self.results = {}
        # Reset best score for new training run
        self.best_score = -np.inf 
        
        for name, model in self.models.items():
            print(f"Training {name}...")
            try:
                model.fit(X_train, y_train)
                y_pred = model.predict(X_test)
                
                r2 = r2_score(y_test, y_pred)
                rmse = np.sqrt(mean_squared_error(y_test, y_pred))
                
                self.results[name] = {
                    'model': model,
                    'r2': r2,
                    'rmse': rmse,
                    'y_pred': y_pred
                }
                
                # FIX 2: Logic changed to Maximize R2 Score instead of minimizing RMSE
                # This prioritizes model accuracy/fit over raw error minimization
                if r2 > self.best_score:
                    self.best_score = r2
                    self.best_model = name
                    
                print(f"   -> R2: {r2:.4f} | RMSE: {rmse:.4f}")
                
            except Exception as e:
                print(f"   Error in {name}: {e}")
                self.results[name] = None
        
        return self.results


    def display_comparison_results(self):
        print("\n" + "-"*50)
        print("MODEL COMPARISON RESULTS")
        print("-"*50)
        
        comparison_data = []
        for name, result in self.results.items():
            if result:
                comparison_data.append({
                    'Model': name,
                    'R2_Score': result['r2'],
                    'RMSE': result['rmse']
                })
        
        # Sort by R2 Score Descending (Best on top)
        df = pd.DataFrame(comparison_data).sort_values('R2_Score', ascending=False)
        print(df.to_string(index=False))
        
        print(f"\nWINNER: {self.best_model} (Highest R2 Score)")
        return df




#===========================================================================
# 4. COMPLETE ML PIPELINE
#===========================================================================


def train_energy_models(file_path):
    print("Starting ML training pipeline...")
   
    preprocessor = EnergyDataPreprocessor()
   
    raw_data = preprocessor.load_data(file_path)
    if raw_data is None:
        return None, None, None
       
    preprocessor.clean_data()
    preprocessor.feature_engineering()
    preprocessor.encode_categorical_variables() # Fix for text columns
    preprocessor.handle_missing_values()
    preprocessor.scale_features()
   
    X, y = preprocessor.get_preprocessed_data()
    if X is None or y is None:
        return None, None, None
       
    model_comparator = MLModelComparator()
    model_comparator.initialize_models()
   
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
   
    results = model_comparator.train_and_compare_models(X_train, X_test, y_train, y_test)
    comparison_df = model_comparator.display_comparison_results()
   
    # Save models
    for name, result in model_comparator.results.items():
        if result is not None:
            joblib.dump(result['model'], f"model_{name.replace(' ', '_')}.joblib")
           
    # Save preprocessor
    preprocess_data = {
        "scaler": preprocessor.scaler,
        "feature_names": preprocessor.feature_names,
        "best_model_name": model_comparator.best_model
    }
    joblib.dump(preprocess_data, "energy_preprocessor.joblib")
   
    print("Models and Preprocessor saved successfully.")
    return model_comparator, preprocessor, comparison_df


#===========================================================================
# 5. IOT MONITORING SYSTEM
#===========================================================================


class IoTEnergyMonitor:
    def __init__(self, model_comparator, preprocessor):
        self.model_comparator = model_comparator
        self.preprocessor = preprocessor
        if model_comparator.best_model is not None:
            self.best_model_name = model_comparator.best_model
            self.best_model = model_comparator.results[self.best_model_name]['model']
        else:
            self.best_model_name = None
            self.best_model = None
        self.appliances = {}
        self.energy_history = []


    def register_appliances(self):
        for name, profile in EnergyConfig.APPLIANCE_PROFILES.items():
            self.appliances[name] = {
                'location': profile['location'],
                'power_profile': {'min': profile['min'], 'max': profile['max']},
                'current_usage': 0
            }
        print(f"Registered {len(self.appliances)} appliances")
        print(f"Using {self.best_model_name} for predictions")


    def simulate_iot_sensors(self):
        building_data = {
            'Temperature': random.uniform(22, 35),
            'Humidity': random.uniform(40, 80),
            'Occupancy': random.randint(10, 100),
            'HVACUsage': random.choice([0, 1]),
            'LightingUsage': random.choice([0, 1]),
            'RenewableEnergy': random.uniform(10, 60),
            'hour': datetime.now().hour,
            'month': datetime.now().month,
            'day_of_week': datetime.now().weekday(),
            'is_weekend': 1 if datetime.now().weekday() >= 5 else 0
        }
       
        appliance_usage = {}
        for appliance, info in self.appliances.items():
            is_running = random.choice([0, 1])
            if is_running:
                power = random.uniform(info['power_profile']['min'], info['power_profile']['max'])
            else:
                power = 0
            appliance_usage[appliance] = power
            self.appliances[appliance]['current_usage'] = power
           
        return building_data, appliance_usage


    def preprocess_real_time_data(self, building_data):
        real_time_df = pd.DataFrame([building_data])
       
        # Add engineered features
        if 'Temperature' in real_time_df.columns:
            real_time_df['Temperature_squared'] = real_time_df['Temperature'] ** 2
        if 'Occupancy' in real_time_df.columns:
            real_time_df['Occupancy_squared'] = real_time_df['Occupancy'] ** 2
           
        # FIX: Ensure columns match training data EXACTLY
        for feature in self.preprocessor.feature_names:
            if feature not in real_time_df.columns:
                real_time_df[feature] = 0
               
        # Reorder columns strictly to match training order
        real_time_df = real_time_df[self.preprocessor.feature_names]
       
        # Scale
        scaled_array = self.preprocessor.scaler.transform(real_time_df)
       
        # Convert back to DataFrame (fixes warnings)
        real_time_df_scaled = pd.DataFrame(scaled_array, columns=self.preprocessor.feature_names)
       
        return real_time_df_scaled


    def predict_energy(self, building_data):
        if self.best_model is None:
            print("No trained model available for prediction")
            return 0
           
        processed_data = self.preprocess_real_time_data(building_data)
        predicted_energy = self.best_model.predict(processed_data)[0]
        return max(0, predicted_energy)


#===========================================================================
# 6. ALERT AND ANALYSIS SYSTEMS
#===========================================================================


class AlertSystem:
    def __init__(self):
        self.active_alerts = []


    def check_thresholds(self, current_energy, appliance_usage, building_data):
        alerts = []
       
        if current_energy >= EnergyConfig.CRITICAL_THRESHOLD:
            alerts.append(f'CRITICAL: Energy consumption {current_energy:.1f} kWh exceeds critical threshold!')
        elif current_energy >= EnergyConfig.HIGH_THRESHOLD:
            alerts.append(f'HIGH: Energy consumption {current_energy:.1f} kWh above high threshold')
           
        for appliance, power in appliance_usage.items():
            if power > 0:
                if "AC" in appliance and building_data['Occupancy'] < 20:
                    alerts.append(f'AC running in low occupancy: {appliance}')
                if "Lights" in appliance and building_data['Occupancy'] < 10:
                    alerts.append(f'Lights on in empty area: {appliance}')
                   
        if building_data['Temperature'] > 32:
            alerts.append(f'High temperature ({building_data["Temperature"]:.1f}C) increasing AC load')
           
        return alerts


class CarbonAnalyzer:
    @staticmethod
    def calculate_carbon_impact(energy_kwh):
        return energy_kwh * EnergyConfig.CARBON_FACTOR


class CostAnalyzer:
    @staticmethod
    def calculate_costs(energy_kwh):
        daily_cost = energy_kwh * EnergyConfig.ELECTRICITY_RATE
        monthly_cost = daily_cost * 30
        annual_cost = daily_cost * 365
        return daily_cost, monthly_cost, annual_cost


#===========================================================================
# 7. MAIN MONITORING SYSTEM
#===========================================================================


class EnergyMonitoringSystem:
    def __init__(self, data_file_path):
        print("Initializing Energy Monitoring System...")
        self.model_comparator, self.preprocessor, self.comparison_results = train_energy_models(data_file_path)
       
        if self.model_comparator is None or self.model_comparator.best_model is None:
            print("System initialization failed")
            return
           
        self.iot_monitor = IoTEnergyMonitor(self.model_comparator, self.preprocessor)
        self.alert_system = AlertSystem()
        self.carbon_analyzer = CarbonAnalyzer()
        self.cost_analyzer = CostAnalyzer()
        self.iot_monitor.register_appliances()
        print("System initialized successfully")


    def run_monitoring_cycle(self):
        if not hasattr(self, 'iot_monitor') or self.iot_monitor.best_model is None:
            print("System not properly initialized")
            return None
           
        building_data, appliance_usage = self.iot_monitor.simulate_iot_sensors()
        current_energy = self.iot_monitor.predict_energy(building_data)
       
        self.iot_monitor.energy_history.append({
            'timestamp': datetime.now(),
            'energy': current_energy,
            'temperature': building_data['Temperature']
        })
       
        alerts = self.alert_system.check_thresholds(current_energy, appliance_usage, building_data)
        carbon_impact = self.carbon_analyzer.calculate_carbon_impact(current_energy)
        daily_cost, monthly_cost, annual_cost = self.cost_analyzer.calculate_costs(current_energy)
       
        return {
            'building_data': building_data,
            'appliance_usage': appliance_usage,
            'current_energy': current_energy,
            'alerts': alerts,
            'carbon_impact': carbon_impact,
            'daily_cost': daily_cost,
            'monthly_cost': monthly_cost,
            'annual_cost': annual_cost,
            'model_used': self.iot_monitor.best_model_name
        }


#===========================================================================
# 8. MAIN EXECUTION
#===========================================================================


def main():
    data_file_path = "JIIT_Raw_Hourly_Energy_Data.csv" # Ensure this file exists
   
    energy_system = EnergyMonitoringSystem(data_file_path)
   
    if not hasattr(energy_system, 'model_comparator') or energy_system.model_comparator is None:
        print("Cannot start monitoring - system initialization failed")
        return
       
    print("\nStarting monitoring...")
    for cycle in range(3):
        print(f"\nMonitoring Cycle {cycle + 1}")
        print("-" * 30)
       
        results = energy_system.run_monitoring_cycle()
        if results is None:
            print("Monitoring cycle failed")
            continue
           
        print(f"Energy Consumption: {results['current_energy']:.1f} kWh")
        print(f"Model Used: {results['model_used']}")
        print(f"Temperature: {results['building_data']['Temperature']:.1f}C")
        print(f"Occupancy: {results['building_data']['Occupancy']} people")
       
        if results['alerts']:
            print("Alerts:")
            for alert in results['alerts']:
                print(f" - {alert}")
        else:
            print("No alerts")
           
        print(f"Carbon Impact: {results['carbon_impact']:.1f} kg CO2")
        print(f"Daily Cost: ${results['daily_cost']:.2f}")
        print(f"Monthly Cost: ${results['monthly_cost']:.2f}")
       
        if cycle < 2:
            import time
            time.sleep(2)


if __name__ == "__main__":
    main()



