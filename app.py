import os
import torch
import torch.nn as nn
import torchvision.transforms as transforms
from torchvision import models
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from PIL import Image
import pandas as pd
from sklearn.preprocessing import StandardScaler
import requests
import json

# OpenRouter API configuration
API_KEY = "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"
MODEL_NAME = "openrouter/cypher-alpha:free"

app = Flask(__name__, template_folder="templates", static_folder="static")
CORS(app)  # Enable CORS for all routes

# Load Pretrained Image Model (if available)
def load_image_model():
    model = models.resnet18(pretrained=False)
    num_ftrs = model.fc.in_features
    model.fc = nn.Linear(num_ftrs, 4)
    image_model_path = os.path.join("models", "brain_stroke_model_best.pth")
    if os.path.exists(image_model_path):
        model.load_state_dict(torch.load(image_model_path, map_location='cpu'))
    model.eval()
    return model

image_model = load_image_model()

# Image Preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
])

# Clinical Data Model
class StrokePredictionModel(torch.nn.Module):
    def __init__(self, input_dim):
        super(StrokePredictionModel, self).__init__()
        self.fc1 = nn.Linear(input_dim, 64)
        self.fc2 = nn.Linear(64, 32)
        self.fc3 = nn.Linear(32, 16)
        self.fc4 = nn.Linear(16, 2)
        self.relu = nn.ReLU()
    def forward(self, x):
        x = self.relu(self.fc1(x))
        x = self.relu(self.fc2(x))
        x = self.relu(self.fc3(x))
        x = self.fc4(x)
        return x

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
text_model = StrokePredictionModel(input_dim=8).to(device)
model_path = os.path.join("models", "stroke_prediction_model.pth")
if os.path.exists(model_path):
    text_model.load_state_dict(torch.load(model_path, map_location=device))
    text_model.eval()
else:
    raise FileNotFoundError(f"Model file not found: {model_path}")

# Load Scaler for Text Model
csv_path = os.path.join("models", "numeric_stroke_data.csv")
if not os.path.exists(csv_path):
    print(f"Warning: CSV file not found: {csv_path}")
    scaler = None
else:
    df_train = pd.read_csv(csv_path)
    scaler = StandardScaler()
    scaler.fit(df_train.drop(columns=['stroke']))

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/predict_image', methods=['POST'])
def predict_image():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"})
        file = request.files['file']
        image = Image.open(file).convert("RGB")
        image_tensor = transform(image).unsqueeze(0)
        with torch.no_grad():
            output = image_model(image_tensor)
            _, predicted_class = torch.max(output, 1)
        class_labels = {0: "Haemorrhagic Stroke", 1: "Ischemic Stroke", 2: "Normal", 3: "Stroke"}
        prediction = class_labels.get(predicted_class.item(), "Unknown")
        tips, doctor = get_health_recommendations(prediction)
        return jsonify({"prediction": prediction, "tips": tips, "doctor": doctor})
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/predict_text', methods=['POST'])
def predict_text():
    try:
        data = request.json
        features = [
            float(data['gender']),
            float(data['age']),
            float(data['hypertension']),
            float(data['heart_disease']),
            float(data['ever_married']),
            float(data['glucose']),
            float(data['bmi']),
            float(data['smoking'])
        ]
        df = pd.DataFrame([features])
        df_scaled = scaler.transform(df)
        input_tensor = torch.tensor(df_scaled, dtype=torch.float32).to(device)
        with torch.no_grad():
            output = text_model(input_tensor)
            _, predicted_class = torch.max(output, 1)
        prediction = "Stroke: YES" if predicted_class.item() == 1 else "Stroke: NO"
        tips, doctor = get_health_recommendations(prediction)
        return jsonify({"prediction": prediction, "tips": tips, "doctor": doctor})
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/chatbot', methods=['POST'])
def chatbot():
    try:
        user_message = request.json['message']
        is_tamil = any("\u0B80" <= char <= "\u0BFF" for char in user_message)
        
        # Using OpenRouter API instead of Gemini
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json",
            },
            data=json.dumps({
                "model": MODEL_NAME,
                "messages": [
                    {
                        "role": "user",
                        "content": user_message
                    }
                ]
            })
        )
        
        if response.status_code == 200:
            response_data = response.json()
            if 'choices' in response_data and len(response_data['choices']) > 0:
                reply = response_data['choices'][0]['message']['content']
            else:
                reply = "Sorry, I couldn't understand that. Please ask again."
        else:
            reply = f"Error: API returned status code {response.status_code}"
            
        response = {"en": reply, "ta": reply} if is_tamil else {"en": reply}
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)})

def get_health_recommendations(prediction):
    if "Stroke: YES" in prediction or "Stroke" in prediction:
        tips = "1️⃣ Reduce salt intake 🧂\n2️⃣ Exercise daily 🏃\n3️⃣ Eat a balanced diet 🥗"
        doctor = "Consult a Neurologist 🧠 or a Cardiologist ❤️"
    else:
        tips = "1️⃣ Maintain a healthy diet 🍎\n2️⃣ Regular health checkups 🏥\n3️⃣ Stay active 🚶"
        doctor = "No doctor needed, but keep a healthy lifestyle."
    return tips, doctor

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)