import os
from flask import Flask, request, jsonify, send_from_directory
import sqlite3
from flask_cors import CORS

# Define absolute path to the dist folder (React build)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(BASE_DIR, 'dist')

# Configure Flask to use the dist directory
app = Flask(__name__, static_folder=DIST_DIR, template_folder=DIST_DIR)
CORS(app)

# Route to initialize the SQLite database
@app.route('/init', methods=['GET'])
def create_database():
    conn = sqlite3.connect('mydatabase.db')
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS users
                      (id INTEGER PRIMARY KEY, name TEXT, email TEXT)''')
    conn.commit()
    conn.close()
    return 'Database Created'

# API route to create a new user
@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    conn = sqlite3.connect('mydatabase.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO users (name, email) VALUES (?, ?)', (name, email))
    conn.commit()
    user_id = cursor.lastrowid
    conn.close()
    return jsonify({'id': user_id, 'name': name, 'email': email}), 201

# API route to get all users
@app.route('/api/users', methods=['GET'])
def get_users():
    conn = sqlite3.connect('mydatabase.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, name, email FROM users')
    rows = cursor.fetchall()
    conn.close()
    users = [{'id': row[0], 'name': row[1], 'email': row[2]} for row in rows]
    return jsonify(users)

# API route to get a user by ID
@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    conn = sqlite3.connect('mydatabase.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, name, email FROM users WHERE id = ?', (user_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return jsonify({'id': row[0], 'name': row[1], 'email': row[2]})
    else:
        return jsonify({'error': 'User not found'}), 404

# API route to update a user by ID
@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.json
    name = data.get('name')
    email = data.get('email')
    conn = sqlite3.connect('mydatabase.db')
    cursor = conn.cursor()
    cursor.execute('UPDATE users SET name = ?, email = ? WHERE id = ?', (name, email, user_id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'User updated successfully'})

# API route to delete a user by ID
@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    conn = sqlite3.connect('mydatabase.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM users WHERE id = ?', (user_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'User deleted successfully'})

# Route to serve React frontend
@app.route('/')
@app.route('/<path:path>')
def serve_react(path='index.html'):
    return send_from_directory(app.template_folder, path)

# Start the server
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

