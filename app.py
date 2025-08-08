from flask import Flask, request, jsonify, render_template, send_from_directory
import sqlite3, os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DB_PATH = "messages.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT,
        image TEXT
    )""")
    conn.commit()
    conn.close()

init_db()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/get", methods=["GET"])
def get_messages():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, text, image FROM messages ORDER BY id DESC")
    rows = c.fetchall()
    conn.close()
    messages = [{"id": r[0], "text": r[1], "image": r[2]} for r in rows]
    return jsonify(messages)

@app.route("/send", methods=["POST"])
def send_message():
    data = request.get_json() or {}
    text = data.get("text", "")[:1000]
    image = data.get("image", "")[:10_000_000]  # limit size
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("INSERT INTO messages (text, image) VALUES (?, ?)", (text, image))
    conn.commit()
    conn.close()
    return jsonify({"status":"ok"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
