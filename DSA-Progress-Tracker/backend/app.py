from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import json

app = Flask(__name__)
CORS(app)

# ✅ Correct path to problems.json (one level up from backend)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(os.path.dirname(BASE_DIR), 'data', 'problems.json')

# ✅ Load problems safely
try:
    with open(DATA_PATH, encoding='utf-8') as f:
        problems_data = json.load(f)
except FileNotFoundError:
    problems_data = {}
    print(f"⚠️ problems.json not found at {DATA_PATH}")

@app.route('/api/concepts')
def get_concepts():
    return jsonify({"concepts": list(problems_data.keys())})

@app.route('/api/problems/<concept>')
def get_problems(concept):
    return jsonify({"problems": problems_data.get(concept, [])})

@app.route('/api/update-progress', methods=['POST'])
def update_progress():
    data = request.json
    concept = data.get("concept")
    problem = data.get("problem")
    status = data.get("status")
    print(f"Progress update: {concept} -> {problem}: {status}")
    return jsonify({"status": "success"})

if __name__ == '__main__':
    app.run(debug=True)
