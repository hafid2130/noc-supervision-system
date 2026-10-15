import time
import random
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'noc_cloud_supervision_secret_2026'
CORS(app, resources={r"/*": {"origins": "*"}})

# Inisialisasi SocketIO dengan konfigurasi CORS universal
socketio = SocketIO(app, cors_allowed_origins="*")

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
    """Endpoint AI Anomaly Explainer untuk menganalisis lonjakan latensi/anomali."""
    data = request.json or {}
    latency = data.get('latency', 0)
    
    if latency > LATENCY_THRESHOLD:
        analysis = f"🤖 [NOC AI Advisor]: Terdeteksi anomali latensi tinggi ({latency}ms). Kemungkinan penyebab: Reduksi bandwidth upstream ISP, lonjakan trafik pada node gateway, atau interferensi node nirkabel. Rekomendasi: Lakukan rotasi kanal atau verifikasi ulang jalur *routing* hop berikutnya."
    else:
        analysis = f"🤖 [NOC AI Advisor]: Sistem berjalan pada parameter normal. Latensi stabil di angka {latency}ms tanpa indikasi packet loss."
        
    return jsonify({"analysis": analysis})

def background_telemetry_generator():
    """
    Generator telemetri real-time yang mensimulasikan pembacaan jaringan global 
    menggunakan context manager internal SocketIO agar broadcast berjalan lancar.
    """
    print("🚀 Cloud Telemetry Engine Berjalan...")
    while True:
        # Gunakan pembungkus sleep dari SocketIO untuk menjaga concurrency loop async
        socketio.sleep(1) 
        
        # Simulasi fluktuasi latensi realistis (antara 30ms - 85ms, sesekali ada spike)
        base_latency = random.randint(30, 85)
        if random.random() < 0.1:  # 10% kemungkinan terjadi lonjakan kecil (spike)
            base_latency = random.randint(130, 190)
            
        is_spike = base_latency > LATENCY_THRESHOLD
        status = "WARNING" if is_spike else "HEALTHY"
        message = f"Lonjakan latensi terdeteksi ({base_latency}ms)!" if is_spike else "Jaringan stabil & optimal."

        # Simulasi Throughput Upload/Download (Mbps)
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

        # Broadcast ke seluruh frontend yang terhubung via WebSocket
        socketio.emit('telemetry_stream', payload)

@socketio.on('connect')
def handle_connect():
    """Mencatat aktivitas koneksi masuk dari client browser."""
    print("🔌 Client terhubung ke WebSocket Server.")

if __name__ == '__main__':
    # Daftarkan loop telemetri ke dalam manager task background bawaan SocketIO
    socketio.start_background_task(background_telemetry_generator)

    # Jalankan server. Parameter debug disetel ke False untuk menghindari instansiasi ganda
    socketio.run(app, host='0.0.0.0', port=5000, debug=False)
