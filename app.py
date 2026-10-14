import time
import random
from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Background thread untuk mengirim data telemetri real-time via WebSocket
def background_telemetry():
    while True:
        time.sleep(1)
        current_time = time.strftime("%H:%M:%S")
        latency = random.randint(25, 95)
        
        # Simulasi status kesehatan jaringan
        status = "HEALTHY" if latency < 120 else "WARNING"
        
        telemetry_data = {
            "timestamp": current_time,
            "target": "1.1.1.1 (Cloudflare Edge)",
            "latency_ms": latency,
            "download_mbps": round(random.uniform(45.0, 85.0), 2),
            "upload_mbps": round(random.uniform(15.0, 35.0), 2),
            "status": status,
            "message": "Telemetry stream operational."
        }
        socketio.emit('telemetry_stream', telemetry_data)

@app.route('/api/ai-diagnose', methods=['POST'])
def ai_diagnose():
    data = request.get_json() or {}
    latency = data.get('latency', 40)
    
    if latency > 100:
        analysis = f"[WARNING] Terdeteksi lonjakan latensi tinggi ({latency} ms). Kemungkinan terjadi bottleneck pada uplink router utama atau gangguan routing BGP. Disarankan untuk memeriksa status interface atau mengalihkan jalur ke backup gateway."
    else:
        analysis = f"[OPTIMAL] Latensi stabil pada {latency} ms. Seluruh jalur transmisi jaringan, *packet loss*, dan *throughput* berjalan normal tanpa adanya indikasi anomali paket."
        
    return jsonify({"analysis": analysis})

if __name__ == '__main__':
    # Memulai background thread untuk streaming telemetri
    socketio.start_background_task(background_telemetry)
    print("NOC Telemetry Engine berjalan di http://127.0.0.1:5000")
    socketio.run(app, host='0.0.0.0', port=5000)