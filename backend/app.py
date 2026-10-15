import eventlet
eventlet.monkey_patch()

import time
import random
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'noc_cloud_supervision_secret_2026'
CORS(app, resources={r"/*": {"origins": "*"}})

# Explicitly bind to eventlet async mode for predictable cloud broadcasting
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

MONITOR_TARGET = "1.1.1.1 (Cloudflare DNS / Edge)"
LATENCY_THRESHOLD = 120  # ms

@app.route('/api/status', methods=['GET'])
def api_status():
    return jsonify({
        "status": "NOC Telemetry Cloud Engine Online",
        "target": MONITOR_TARGET,
        "server_time": time.strftime("%Y-%m-%d %H:%M:%S")
    })

@app.route('/api/ai-diagnose', methods=['POST'])
def ai_diagnose():
    data = request.json or {}
    latency = data.get('latency', 0)
    if latency > LATENCY_THRESHOLD:
        analysis = f"🤖 [NOC AI Advisor]: Anomali terdeteksi ({latency}ms). Jalur upstream mengalami kongesti."
    else:
        analysis = f"🤖 [NOC AI Advisor]: Sistem berjalan normal ({latency}ms)."
    return jsonify({"analysis": analysis})

def background_telemetry_generator():
    """Loops indefinitely, pushing standard metrics out over active connections."""
    print("🚀 Cloud Telemetry Engine Berjalan...", flush=True)
    while True:
        socketio.sleep(1)  # Non-blocking async sleep
        
        base_latency = random.randint(30, 85)
        if random.random() < 0.1:  # 10% chance of a network spike
            base_latency = random.randint(130, 190)
            
        is_spike = base_latency > LATENCY_THRESHOLD
        status = "WARNING" if is_spike else "HEALTHY"
        message = "Lonjakan latensi terdeteksi!" if is_spike else "Jaringan stabil & optimal."

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

        socketio.emit('telemetry_stream', payload)

@socketio.on('connect')
def handle_connect():
    print("🔌 Client terhubung ke WebSocket Server.", flush=True)

# Start background task loop immediately within the eventlet environment wrapper
socketio.start_background_task(background_telemetry_generator)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=False)
