from flask import Flask, jsonify, request, Response
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from bson import ObjectId
from flask_cors import CORS
import json

import os
from dotenv import load_dotenv
load_dotenv()
mdb = os.environ.get('MDB_LINK')

app = Flask(__name__)
CORS(app)

uri = mdb
client = MongoClient(uri, server_api=ServerApi('1'))

try:
    client.admin.command('ping')
    print("Connected to MongoDB!")
except Exception as e:
    print(e)

db = client['notes_db']
collection = db['notes']

@app.route('/')
def default():
    return "SubleaseU API"


@app.route('/api')
def get_data():
    return jsonify({'message': 'Server Online'})


@app.route('/listings')
def get_listings():
    # Read filters from query params: /listings?min=0&max=9999&bedrooms=2&bathrooms=1
    min_rent = int(request.args.get('min', 0))
    max_rent = int(request.args.get('max', 99999))
    bedrooms = request.args.get('bedrooms', None)
    bathrooms = request.args.get('bathrooms', None)

    # Build MongoDB query
    query = {
        'rent': {'$gte': str(min_rent), '$lte': str(max_rent)}
    }

    # Only filter by bedrooms/bathrooms if user selected something
    if bedrooms and bedrooms != 'any':
        query['bedrooms'] = bedrooms
    if bathrooms and bathrooms != 'any':
        query['bathrooms'] = bathrooms

    cursor = collection.find({})
    data = list(cursor)

    for item in data:
        item['_id'] = str(item['_id'])

    # Filter by rent in Python (handles string rent values already in DB)
    data = [
        item for item in data
        if min_rent <= int(item.get('rent', 0)) <= max_rent
    ]

    # Filter by bedrooms/bathrooms if specified
    if bedrooms and bedrooms != 'any':
        data = [item for item in data if item.get('bedrooms') == bedrooms]
    if bathrooms and bathrooms != 'any':
        data = [item for item in data if item.get('bathrooms') == bathrooms]

    return Response(json.dumps(data), mimetype='application/json')


@app.route('/post-listing', methods=['POST'])
def post_listing():
    data = request.json
    # Basic server-side validation
    required = ['address', 'rent', 'email']
    for field in required:
        if not data.get(field):
            return jsonify({'error': f'Missing required field: {field}'}), 400

    try:
        rent = int(data['rent'])
        if rent <= 0:
            return jsonify({'error': 'Rent must be a positive number'}), 400
    except ValueError:
        return jsonify({'error': 'Rent must be a number'}), 400

    if not data['email'].endswith('@illinois.edu'):
        return jsonify({'error': 'Email must be an @illinois.edu address'}), 400

    collection.insert_one(data)
    return jsonify({'message': 'Listing created successfully'}), 201


@app.route('/delete-listing/<id>', methods=['DELETE'])
def delete_listing(id):
    result = collection.delete_one({'custom_id': id})
    if result.deleted_count == 0:
        return jsonify({'error': 'Listing not found'}), 404
    return jsonify({'message': 'Listing deleted'})


if __name__ == '__main__':
    app.run(debug=True, port=8000)