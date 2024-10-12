from flask import Flask, request, jsonify, render_template
import cv2
import os

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    img = cv2.imread(file_path)

    # Initialize OpenCV's QRCode detector
    qr_detector = cv2.QRCodeDetector()

    # Detect and decode the QR code
    data, points, _ = qr_detector.detectAndDecode(img)

    if not data:
        return jsonify({"error": "No QR code found"}), 400

    return jsonify({"data": data})

if __name__ == '__main__':
    app.run(debug=True)
