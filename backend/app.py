# CHOOSE ONE: EVENTLET MONKEY PATCH MUST BE AT THE VERY TOP (LINE 1 & 2)
import eventlet
eventlet.monkey_patch()

import time
import random
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'noc_cloud_supervision_secret_2026'
CORS(app, resources={r"/*": {"origins": "*"}})

# Inisialisasi SocketIO dengan engine async eventlet explicitly
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

# Konfigurasi Target & Ambang Batas Default
MONITOR_TARGET = "1.1.1.1 (Cloudflare DNS / Edge)"
LATENCY_THRESHOLD = 120  # ms

@app.route('/api/status', methods=['GET'])
def api_status():
    """Endpoint pengecekan status server NOC."""
    return jsonify({
        "status": "NOC Telemetry Cloud Engine Online",
        "target": MONITOR_TARGET,
        "server_time": time.strftime("%Y-%m-%d %H:%M:%S")
    })

@app.route('/api/ai-diagnose', methods=['POST'])
def ai_diagnose():
    """Endpoint AI Anomaly Explainer."""
    data = request.json or {}
    latency = data.get('latency', 0)
    
    if latency > LATENCY_THRESHOLD:
        analysis = f"🤖 [NOC AI Advisor]: Terdeteksi anomali latensi tinggi ({latency}ms). Kemungkinan penyebab: Reduksi bandwidth upstream ISP."
    else:
        analysis = f"🤖 [NOC AI Advisor]: Sistem berjalan normal di angka {latency}ms."
        
    return jsonify({"analysis": analysis})

def background_telemetry_generator():
    """Generator real-time yang memancarkan telemetri jaringan via eventlet helper loop."""
    print("🚀 Cloud Telemetry Engine Berjalan...")
    while True:
        # Gunakan socketio.sleep() agar memberikan waktu thread async lain bernafas
        socketio.sleep(1) 
        
        base_latency = random.randint(30, 85)
        if random.random() < 0.1:  
            base_latency = random.randint(130, 190)
            
        is_spike = base_latency > LATENCY_THRESHOLD
        status = "WARNING" if is_spike else "HEALTHY"
        message = f"Lonjakan latensi terdeteksi ({base_latency}ms)!" if is_spike else "Jaringan stabil & optimal."

        download_mbps = round(random.uniform(45.0, 95.2), 2)
        upload_mbps = round(random.uniform(15.0, 35.8), 2)

        payload = {
            "timestamp": time.strftime("%H:%M:%S"),
            "target": MONITOR_TARGET,
            "latency_ms": base_latency,
            "download_mbps": download_mbps,
            "upload_mbps": upload_mbps,
            "status": status,
            "message": message,
            "active_nodes": 12
        }

        # Mengirimkan data streaming telemetri ke semua tab browser yang terkoneksi
        socketio.emit('telemetry_stream', payload)

@socketio.on('connect')
def handle_connect():
    print("LOG: 🔌 Client baru terhubung ke cluster.")

if __name__ == '__main__':
    # Memulai task background telemetri secara asinkron
    socketio.start_background_task(background_telemetry_generator)
    socketio.run(app, host='0.0.0.0', port=5000, debug=False)
