import os
import time
import random
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'noc_cloud_supervision_secret_2026'
CORS(app, resources={r"/*": {"origins": "*"}})

# Initialize using the gevent async engine
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='gevent')

MONITOR_TARGET = "1.1.1.1 (Cloudflare DNS / Edge)"
LATENCY_THRESHOLD = 120  # ms
bg_task_started = False

def global_telemetry_loop():
    """Independently manages broadcast emitting loop from within the global scope context."""
    print("🚀 Cloud Telemetry Engine Berjalan...", flush=True)
    while True:
        socketio.sleep(1)
        
        base_latency = random.randint(30, 85)
        if random.random() < 0.1:  
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

@app.route('/', methods=['GET'])
def home_ping():
    return jsonify({"status": "NOC Telemetry Cloud Router Alive"})

@app.route('/api/status', methods=['GET'])
def api_status():
    return jsonify({
        "status": "NOC Telemetry Cloud Engine Online",
        "target": MONITOR_TARGET,
        "server_time": time.strftime("%Y-%m-%d %H:%M:%S")
    })

@socketio.on('connect')
def handle_connect():
    global bg_task_started
    print("🔌 Client terhubung ke WebSocket Server.", flush=True)
    
    if not bg_task_started:
        socketio.start_background_task(target=global_telemetry_loop)
        bg_task_started = True

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    socketio.run(app, host='0.0.0.0', port=port, debug=False)
