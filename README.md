# 🌌  Intelligence & Healthcare Analytics Core

A unified production-ready suite of advanced Edge Computer Vision, Multi-Modal Neural Classification Networks, and Natural Language Processing pipelines engineered for high-performance deployment.

---

```text
┌──────────────────────────────────────────────────────────────────────────┐
│  CENTRAL SYSTEM RUNTIME DIAGNOSTICS & HARDWARE ALLOCATION (v4.5)          │
├──────────────────────────────────────────────────────────────────────────┤
│  HOST STATUS: ACTIVE ───────────────────────── SYSTEM NODE: 2026-STABLE  │
│                                                                          │
│  [MODULE 01] Multimodal Stroke Risk Engine & LLM Assistant . . [LOADED]  │
│  ├── ResNet-18 Image Tensor Classifier (224x224 Normalized Shapes)        │
│  └── 8-Dimension Clinical Vector MLP & OpenRouter LLM Bridge             │
│                                                                          │
│  [MODULE 02] Sarcasm Analytics Control Pipeline . . . . . . . [LOADED]  │
│  └── Synchronized Dual-Stream Transformers (RoBERTa + Emoji-BERT)        │
│                                                                          │
│  [MODULE 03] Edge Audio-Visual Tracker Engine . . . . . . . . [LOADED]  │
│  └── Real-Time YOLO Detector Linked with Daemon-Threaded TTS Voice       │
│                                                                          │
│  DEVICE ALLOCATION: Auto-Mapping CUDA Compute Cores via PyTorch Latency  │
└──────────────────────────────────────────────────────────────────────────┘
📂 Master Repository Blueprint
Organize your engineering directory layout exactly as mapped out below to avoid operational pathway runtime errors:

Plaintext
zentrovik-intelligence-suite/
│
├── app_stroke.py                  # Module 1: Stroke Analytics & AI Portal
├── app_sarcasm.py                 # Module 2: Sarcasm Tracking Framework
├── app_vision.py                  # Module 3: Real-Time YOLO & TTS Engine
├── README.md                      # Unified Master Ecosystem Manual
│
├── models/
│   ├── brain_stroke_model_best.pth # ResNet-18 Imagery Weights
│   ├── stroke_prediction_model.pth # Tabular Form MLP Weights
│   ├── numeric_stroke_data.csv     # Scaler Baseline Dataset
│   └── sarcasm_detection_model.pth # Sarcasm Fusion Classifier Weights
│
└── templates/
    ├── index_stroke.html          # Stroke Interface Dashboard
    ├── index_sarcasm.html         # Sarcasm Console Room Visuals
    └── index_vision.html          # Video Rendering Target Webpage
🛠️ Global Environmental Prerequisites
1. Install Machine Learning & Web Core Libraries
Execute this configuration string in your local shell terminal window to establish baseline installation requirements:

Bash
# Install Deep Learning Frameworks paired with CUDA 11.8 Hardware acceleration
pip install torch torchvision torchaudio --index-url [https://download.pytorch.org/whl/cu118](https://download.pytorch.org/whl/cu118)

# Install Computer Vision, Transformers, and Web Processing dependencies
pip install opencv-python ultralytics transformers flask flask-cors pillow pandas scikit-learn requests pyttsx3
2. Native Operating System Sound Drivers (Linux Environments Only)
If you are deploying Module 03 on Linux micro-architectures (like Ubuntu Server or Raspberry Pi hardware modules), make sure the audio wrapper stack is active:

Bash
sudo apt-get update && sudo apt-get install espeak festival xsel libasound2-dev
🧬 Module Specifications & Launch Sequences
🧠 MODULE 01: Multimodal Stroke Prediction & Assistant
System Flow Architecture
Plaintext
 Patient Data ──► [MRI/CT Scanning] ──► ResNet-18 ──► Image Classification Matrix
               └── [Bio-Metrics]   ──► Aligned Scaler ──► MLP Vector Highway ────┼──► Clinical Report Out
 User Query   ──► OpenRouter API  ──► Cypher-Alpha  ──► Multi-Lingual Assistant  ┘
API Gateways
Imaging Port: POST /predict_image (Multipart Form -> Asset Key: file)

Tabular Port: POST /predict_text (Application/JSON Package)

JSON
{"gender": 1.0, "age": 67.0, "hypertension": 0.0, "heart_disease": 1.0, "ever_married": 1.0, "glucose": 228.69, "bmi": 36.6, "smoking": 1.0}
Operational Run Sequence
Set up your OpenRouter API Token inside your system parameters, then run the initialization file:

Bash
# Windows System CMD Configuration
set OPENROUTER_API_KEY="your_api_token_here" && python app_stroke.py
🎭 MODULE 02: Multi-Modal Sarcasm Analytics Hub
System Flow Architecture
Plaintext
 Raw Entry ──► Context String ──► RoBERTa Base ──► 768d Text Array ──┐
           └── Emoji Layer    ──► Emoji-BERT   ──► 768d Emoji Array ─┼──► [1536d Concatenation Matrix] ──► Prediction Out
API Gateways
Single Input Line: POST /predict (JSON Request Array)

Dataset Batch Stream Ingestion: POST /predict_file (Multipart Form -> Payload Key: file accepting .txt inputs)

Operational Run Sequence
Bash
python app_sarcasm.py
Note: File processing runs streaming evaluation checks line-by-line entirely inside server memory arrays without triggering disk allocations.

👁️ MODULE 03: Real-Time Audio-Visual Object Analytics Engine
System Flow Architecture
Plaintext
 Video Frames ──► Web Camera Capture ──► YOLO Core Engine ──► Bounding Box Rendering ──► Web UI
                                                │
                                                └──► Label Hashing Set ──► Spawning Daemon Thread ──► pyttsx3 Speech Out
Operational Run Sequence
Bash
python app_vision.py
Live Stream Route: GET /video_feed outputs a continuous multipart/x-mixed-replace binary stream.

Deduplication Safety Check: Utilizes localized hash sets inside frame steps to avoid duplicate verbal notifications, safeguarding audio tracking threads against queue blocks.

⚙️ Core Fail-Safe Guardrails
Zero-Overhead Memory Protection: Text files missing typical formatting loops or containing space carriage markers are safely disregarded during dataset batch tasks to preserve runtime performance.

Timeout Boundaries: Network calls targeting OpenRouter lines are restricted to a timeout=10 ceiling parameter, preventing hanging threads during network congestion windows.

Background Threads: Audio speech workers use a daemon thread configuration (daemon=True) to make sure that stopping the main web script instantly kills all background audio loops safely.
