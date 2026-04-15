#syncing the flask app
from flask import Flask, jsonify, request
from flask import Response
from pymongo import MongoClient
from bson import ObjectId
from flask_cors import CORS
import json


from urllib.parse import quote_plus


from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi


app = Flask(__name__)
CORS(app)

uri = "replace"

client = MongoClient(uri, server_api=ServerApi('1'))

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client['notes_db']
global collection 
collection = db['notes']

@app.route('/')
def default():
    return "default page"


@app.route('/api')
def get_data():
    data = {'message':'Server Online'}
    print("CALLED API")
    return jsonify(data)

@app.route('/listings/<min>/<max>')
def get_listings(min, max):
    min = int(min)
    max = int(max)
    cursor = collection.find({})
    data = list(cursor)
    for item in data:
        item['_id'] = str(item['_id'])
    data = [item for item in data if (int(item['rent']) < max and int(item['rent']) > min)]
    return Response(json.dumps(data),  mimetype='application/json')

@app.route('/post-listing', methods=['POST'])
def post_listing():
    data = request.json
    collection.insert_one(data)
    
    print(data)
    return 'Data Added'

@app.route('/delete-listing/<id>', methods=['DELETE'])
def delete_listing(id):

    collection.delete_one({'custom_id': id})
    return 'Listing Deleted'

if __name__ == '__main__':
    app.run(debug=False, port=8000)

#end sync