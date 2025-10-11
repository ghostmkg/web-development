from flask import Blueprint, request, jsonify
from models import users, concepts
import json

api = Blueprint('api', __name__)

# Load problems data
with open('../data/problems.json') as f:
    problems_data = json.load(f)

@api.route('/concepts', methods=['GET'])
def get_concepts():
    return jsonify({"concepts": concepts})

@api.route('/problems/<concept>', methods=['GET'])
def get_problems(concept):
    return jsonify({"problems": problems_data.get(concept, [])})

@api.route('/update-progress', methods=['POST'])
def update_progress():
    data = request.json
    username = data.get('username')
    concept = data.get('concept')
    problem_id = data.get('problem_id')

    if username not in users:
        users[username] = {c: [] for c in concepts}

    if problem_id not in users[username][concept]:
        users[username][concept].append(problem_id)

    return jsonify({"message": "Progress updated", "progress": users[username]})
