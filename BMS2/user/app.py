from flask import Flask, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
from flask_cors import CORS
from dotenv import load_dotenv
import os
import json
from functools import wraps

# ... (dotenv loading, app setup, CORS, SECRET_KEY as before) ...
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(dotenv_path):
    print(f"[USER APP] Loading .env file from: {dotenv_path}")
    load_dotenv(dotenv_path)
else:
    print(f"[USER APP] WARNING: .env file not found at {dotenv_path}")

app = Flask(__name__)

app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'USER_APP_BAD_DEFAULT_SECRET_KEY_CHANGE_ME_123!')
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False # Set to True in production with HTTPS
app.config['SESSION_COOKIE_DOMAIN'] = '127.0.0.1'
app.config['SESSION_COOKIE_PATH'] = '/'

CORS(app,
     supports_credentials=True,
     origins=["http://127.0.0.1:5500", "http://localhost:5500"] # Adjust to your frontend live server origin
)

DATABASE_FILE = 'bookings.db'

def get_db_connection():
    try:
        db_path = os.path.join(os.path.dirname(__file__), DATABASE_FILE)
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON;")
        return conn
    except sqlite3.Error as e:
        print(f"[USER APP] Error connecting to SQLite at {db_path}: {e}")
        return None

def init_db():
    db_path = os.path.join(os.path.dirname(__file__), DATABASE_FILE)
    print(f"[USER APP] Initializing database at: {db_path}")
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("PRAGMA foreign_keys = ON;")
            # USERS Table
            cursor.execute('''CREATE TABLE IF NOT EXISTS users (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                username TEXT UNIQUE NOT NULL,
                                password_hash TEXT NOT NULL,
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                             )''')
            print("[USER APP] Table 'users' checked/created.")
            # MOVIES Table
            cursor.execute('''CREATE TABLE IF NOT EXISTS movies (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                title TEXT NOT NULL,
                                duration TEXT,
                                poster_image_filename TEXT,
                                is_default INTEGER DEFAULT 0,
                                unique_tag TEXT UNIQUE, -- For default movies to prevent re-seeding
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                             )''')
            print("[USER APP] Table 'movies' checked/created.")
            # SHOWTIMES Table
            cursor.execute('''CREATE TABLE IF NOT EXISTS showtimes (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                movie_id INTEGER NOT NULL,
                                time_slot TEXT NOT NULL,
                                FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE
                             )''')
            print("[USER APP] Table 'showtimes' checked/created.")
            # BOOKINGS Table - MODIFIED
            cursor.execute('''CREATE TABLE IF NOT EXISTS bookings (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                user_id INTEGER NOT NULL,
                                movie_id INTEGER NOT NULL,
                                movie_name TEXT NOT NULL,
                                show_time TEXT NOT NULL,
                                user_name TEXT NOT NULL, -- Name entered on booking form
                                seats TEXT NOT NULL, -- JSON array of seat IDs
                                is_cancelled INTEGER DEFAULT 0, -- 0 for active, 1 for cancelled
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                cancelled_at TIMESTAMP,          -- Timestamp of cancellation
                                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
                                FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE
                             )''')
            print("[USER APP] Table 'bookings' checked/created (with cancellation fields).")

            # Check if 'is_cancelled' column exists, add if not (for existing databases)
            cursor.execute("PRAGMA table_info(bookings)")
            columns = [column[1] for column in cursor.fetchall()]
            if 'is_cancelled' not in columns:
                cursor.execute("ALTER TABLE bookings ADD COLUMN is_cancelled INTEGER DEFAULT 0")
                print("[USER APP] Added 'is_cancelled' column to 'bookings' table.")
            if 'cancelled_at' not in columns:
                cursor.execute("ALTER TABLE bookings ADD COLUMN cancelled_at TIMESTAMP")
                print("[USER APP] Added 'cancelled_at' column to 'bookings' table.")


            # Seed default movies (as before)
            default_movies_data = [
                {"title": "Inception", "duration": "2h 28m", "poster": "inception.jpg", "tag": "inception_default", "showtimes": ["10:00 AM", "1:30 PM", "6:45 PM"]},
                {"title": "The Dark Knight", "duration": "2h 32m", "poster": "joker.jpg", "tag": "dark_knight_default", "showtimes": ["11:15 AM", "3:00 PM", "8:30 PM"]},
                {"title": "Avengers Endgame", "duration": "3h 1m", "poster": "end.jpg", "tag": "endgame_default", "showtimes": ["9:30 AM", "2:15 PM", "7:00 PM"]}
            ]
            seeded_count = 0
            for movie_data in default_movies_data:
                cursor.execute("SELECT id FROM movies WHERE unique_tag = ?", (movie_data["tag"],))
                if not cursor.fetchone():
                    cursor.execute("INSERT INTO movies (title, duration, poster_image_filename, is_default, unique_tag) VALUES (?, ?, ?, 1, ?)",
                                   (movie_data["title"], movie_data["duration"], movie_data["poster"], movie_data["tag"]))
                    movie_db_id = cursor.lastrowid
                    for time_slot in movie_data["showtimes"]:
                        cursor.execute("INSERT INTO showtimes (movie_id, time_slot) VALUES (?, ?)", (movie_db_id, time_slot))
                    print(f"[USER APP] Seeded default movie: {movie_data['title']}")
                    seeded_count += 1
            if seeded_count > 0: print(f"[USER APP] {seeded_count} default movies seeded.")
            else: print("[USER APP] Default movies likely already exist.")

            conn.commit()
            print(f"[USER APP] Database '{DATABASE_FILE}' initialization/update process complete.")
        except sqlite3.Error as e:
            print(f"[USER APP] Error during database initialization: {e}")
            if conn: conn.rollback()
        finally:
            if conn: conn.close()
    else:
        print(f"[USER APP] Could not connect to DB for init.")


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({"message": "Authentication required. Please log in."}), 401
        return f(*args, **kwargs)
    return decorated_function

# ... (index_route, signup, login, logout, auth_status as before) ...
@app.route('/') 
def index_route(): 
    return "Movie Ticket Booking API (User App) is running!"

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json(); conn = get_db_connection()
    if not data or not data.get('username') or not data.get('password'): return jsonify({"message": "Username and password required."}), 400
    username = data['username'].strip(); password = data['password']
    if not username or not password or len(password) < 6: return jsonify({"message": "Valid username and password (min 6 chars) required."}), 400
    if not conn: return jsonify({"message": "DB connection error."}), 500
    try:
        c = conn.cursor(); c.execute("SELECT id FROM users WHERE username = ?", (username,));
        if c.fetchone(): return jsonify({"message": "Username already exists."}), 409
        ph = generate_password_hash(password); c.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)", (username, ph))
        conn.commit(); uid = c.lastrowid; print(f"--- [USER APP - Auth] User '{username}' (ID:{uid}) signed up.")
        return jsonify({"message": "User created! Please log in.", "userId": uid}), 201
    except sqlite3.Error as e:
        if conn: conn.rollback(); print(f"--- [USER APP - Auth] Signup Error: {e}"); return jsonify({"message": "Error creating user.", "error": str(e)}), 500
    finally:
        if conn: conn.close()

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json(); conn = get_db_connection()
    if not data or not data.get('username') or not data.get('password'): return jsonify({"message": "Username and password required."}), 400
    username = data['username']; password = data['password']
    if not conn: return jsonify({"message": "DB connection error."}), 500
    try:
        c = conn.cursor(); c.execute("SELECT id, username, password_hash FROM users WHERE username = ?", (username,));
        ur = c.fetchone()
        if not ur: print(f"--- [USER APP - Auth] Login Failed: User '{username}' not found."); return jsonify({"message": "Invalid username or password."}), 401
        user = dict(ur)
        if not check_password_hash(user['password_hash'], password): print(f"--- [USER APP - Auth] Login Failed: Incorrect password for '{username}'."); return jsonify({"message": "Invalid username or password."}), 401
        session.clear(); session['user_id'] = user['id']; session['username'] = user['username']
        print(f"--- [USER APP - Auth] User '{user['username']}' (ID:{user['id']}) logged in. Session SET: {dict(session)}")
        return jsonify({"message": "Login successful!", "userId": user['id'], "username": user['username']}), 200
    except sqlite3.Error as e: print(f"--- [USER APP - Auth] Login Error: {e}"); return jsonify({"message": "Error during login.", "error": str(e)}), 500
    finally: 
        if conn: conn.close()

@app.route('/api/auth/logout', methods=['POST'])
@login_required
def logout():
    uid = session.get('user_id', 'Unknown'); print(f"--- [USER APP - Auth] User ID {uid} logging out. Session before: {dict(session)}")
    session.clear(); print(f"--- [USER APP - Auth] Session cleared for User ID {uid}.")
    return jsonify({"message": "Logout successful."}), 200

@app.route('/api/auth/status', methods=['GET'])
def auth_status():
    if 'user_id' in session:
        print(f"--- [USER APP - Auth] Status check: Logged In. User ID: {session['user_id']}, Username: {session.get('username')}. Session: {dict(session)}")
        return jsonify({"isLoggedIn": True, "userId": session['user_id'], "username": session.get('username')}), 200
    else:
        print(f"--- [USER APP - Auth] Status check: Not Logged In. Session: {dict(session)}")
        return jsonify({"isLoggedIn": False}), 200


@app.route('/api/movies-for-display', methods=['GET'])
def get_movies_for_display():
    # ... (no changes needed here, it just lists movies) ...
    print("--- [USER APP LOG] GET /api/movies-for-display")
    conn = get_db_connection()
    if not conn: return jsonify({"message": "Database connection failed."}), 500
    movies_display_list = []
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT m.id, m.title, m.duration, m.poster_image_filename, m.is_default, m.unique_tag FROM movies m ORDER BY m.is_default DESC, m.id ASC")
        movie_rows = cursor.fetchall()
        if not movie_rows: return jsonify([]), 200
        for row in movie_rows:
            movie = dict(row)
            movie_showtimes = []
            showtimes_cursor = conn.cursor() 
            showtimes_cursor.execute("SELECT time_slot FROM showtimes WHERE movie_id = ? ORDER BY time_slot ASC", (movie['id'],))
            st_rows = showtimes_cursor.fetchall()
            for st_row in st_rows: movie_showtimes.append(st_row['time_slot'])
            movies_display_list.append({"id": movie['id'], "title": movie['title'], "duration": movie['duration'], "poster": movie['poster_image_filename'], "is_default": movie['is_default'], "unique_tag": movie['unique_tag'], "showtimes": movie_showtimes})
        print(f"--- [USER APP LOG] Returning {len(movies_display_list)} movies for display.")
        return jsonify(movies_display_list), 200
    except sqlite3.Error as e: print(f"--- [USER APP LOG] Error retrieving movies for display: {e}"); return jsonify({"message": "Server error.", "error": str(e)}), 500
    finally: 
        if conn: conn.close()

@app.route('/api/movies/<string:movie_db_id>/showtimes/<path:show_time_str>/booked-seats', methods=['GET'])
def get_booked_seats_for_showtime(movie_db_id, show_time_str):
    print(f"--- [USER APP LOG] GET /api/movies/{movie_db_id}/showtimes/{show_time_str}/booked-seats")
    conn = get_db_connection()
    if not conn: return jsonify({"message": "Database connection failed."}), 500
    booked_seat_ids_list = []
    try:
        cursor = conn.cursor()
        # MODIFIED: Only fetch seats from active (not cancelled) bookings
        sql = "SELECT seats FROM bookings WHERE movie_id = ? AND show_time = ? AND (is_cancelled = 0 OR is_cancelled IS NULL)"
        cursor.execute(sql, (int(movie_db_id), show_time_str))
        booking_rows = cursor.fetchall()
        if not booking_rows: return jsonify([]), 200
        for row in booking_rows:
            booking_data = dict(row)
            try:
                seats_for_this_booking = json.loads(booking_data.get('seats', '[]'))
                if isinstance(seats_for_this_booking, list): booked_seat_ids_list.extend(seats_for_this_booking)
            except (TypeError, json.JSONDecodeError) as e: print(f"--- [USER APP LOG] Error decoding seats JSON: {e}")
        unique_booked_seat_ids = sorted(list(set(booked_seat_ids_list)))
        print(f"--- [USER APP LOG] Returning booked seats for active bookings: {unique_booked_seat_ids}")
        return jsonify(unique_booked_seat_ids), 200
    except ValueError: print(f"--- [USER APP LOG] Invalid movie_db_id: {movie_db_id}"); return jsonify({"message": "Invalid movie ID."}), 400
    except sqlite3.Error as e: print(f"--- [USER APP LOG] Error retrieving booked seats: {e}"); return jsonify({"message": "Server error.", "error": str(e)}), 500
    finally:
        if conn: conn.close()

@app.route('/api/bookings', methods=['POST'])
@login_required
def create_booking():
    # ... (no changes needed here, new bookings are active by default) ...
    data = request.get_json(); current_user_id = session['user_id']
    if not data: return jsonify({"message": "Invalid JSON."}), 400
    print(f"--- [USER APP LOG - Booking] User ID {current_user_id} creating booking: {data}")
    movie_db_id = data.get('movieId'); movie_name_from_data = data.get('movieName', 'N/A_Name')
    show_time = data.get('showTime', 'N/A_Time'); user_name_from_form = data.get('userName', session.get('username', 'N/A_User')) 
    seats_array = data.get('seats', [])
    if not movie_db_id or movie_name_from_data == 'N/A_Name' or show_time == 'N/A_Time' or user_name_from_form == 'N/A_User' or not seats_array:
        return jsonify({"message": "Missing critical booking info."}), 400
    seats_json_string = json.dumps(seats_array)
    conn = get_db_connection();
    if not conn: return jsonify({"message": "DB error."}), 500
    try:
        c = conn.cursor(); sql = "INSERT INTO bookings (user_id, movie_id, movie_name, show_time, user_name, seats, is_cancelled) VALUES (?, ?, ?, ?, ?, ?, 0)" # Explicitly set is_cancelled=0
        val = (current_user_id, movie_db_id, movie_name_from_data, show_time, user_name_from_form, seats_json_string)
        c.execute(sql, val); conn.commit(); booking_id = c.lastrowid
        print(f"--- [USER APP LOG - Booking] Created ID {booking_id} for User {current_user_id}, Movie {movie_db_id}")
        resp_data = {"movieId": movie_db_id, "movieName": movie_name_from_data, "showTime": show_time, "userName": user_name_from_form, "seats": seats_array, "_id": booking_id, "userId": current_user_id}
        return jsonify({"message": "Booking created!", "bookingId": booking_id, "data": resp_data }), 201
    except sqlite3.Error as e:
        if conn: conn.rollback(); print(f"Create Booking Error for User {current_user_id}: {e}"); return jsonify({"message": "Server error.", "error": str(e)}), 500
    finally:
        if conn: conn.close()


@app.route('/api/my-bookings', methods=['GET'])
@login_required
def get_my_bookings():
    current_user_id = session['user_id']; print(f"User ID {current_user_id} requesting /api/my-bookings")
    conn = get_db_connection();
    if not conn: return jsonify({"m": "DB error."}), 500
    bl = [];
    try:
        c = conn.cursor()
        # MODIFIED: Only fetch active bookings for "My Bookings" page
        sql = """SELECT id, movie_id, movie_name, show_time, user_name, seats, created_at
                 FROM bookings
                 WHERE user_id = ? AND (is_cancelled = 0 OR is_cancelled IS NULL)
                 ORDER BY created_at DESC"""
        c.execute(sql, (current_user_id,))
        br = c.fetchall();
        if not br: return jsonify([]), 200
        for r in br:
            b = dict(r);
            try: b['seats'] = json.loads(b['seats'])
            except: b['seats'] = []
            b['_id'] = b.pop('id'); b['userNameFromBooking'] = b.pop('user_name', 'N/A');
            b['showTime'] = b.get('show_time', 'N/A'); b['movieName'] = b.get('movie_name', 'N/A'); b['movieId'] = b.get('movie_id', 'N/A');
            bl.append(b)
        return jsonify(bl), 200
    except sqlite3.Error as e: print(f"Get My Bookings Error for User {current_user_id}: {e}"); return jsonify({"m": "Server error.", "e": str(e)}), 500
    finally:
        if conn: conn.close()

@app.route('/api/bookings/<int:booking_id>', methods=['GET'])
@login_required
def get_booking(booking_id): # This shows a single ticket, should show even if cancelled by admin later.
    # For "Your Ticket" page, we might want to show it even if it was cancelled,
    # perhaps with a "CANCELLED" stamp. For now, it fetches regardless of is_cancelled.
    # If you want it to only show active tickets here, add "AND (is_cancelled = 0 OR is_cancelled IS NULL)"
    current_user_id = session['user_id']; print(f"User ID {current_user_id} requesting GET /api/bookings/{booking_id}")
    conn = get_db_connection();
    if not conn: return jsonify({"m": "DB error."}), 500
    try:
        c = conn.cursor(); sql = """
            SELECT id, movie_id, movie_name, show_time, user_name, seats, created_at, is_cancelled
            FROM bookings WHERE id = ? AND user_id = ?
        """
        c.execute(sql, (booking_id, current_user_id)); br = c.fetchone();
        if not br: return jsonify({"message": "Booking not found or access denied."}), 404
        bdfd = dict(br);
        fr = {
            "_id": bdfd.get('id'),
            "movieName": bdfd.get('movie_name', 'N/A'),
            "showTime": bdfd.get('show_time', 'N/A'),
            "userName": bdfd.get('user_name', 'N/A'),
            "seats": [],
            "isCancelled": bdfd.get('is_cancelled', 0) == 1 # Add cancellation status
        }
        try:
            ls = json.loads(bdfd.get('seats', '[]'));
            if isinstance(ls, list): fr['seats'] = ls
        except (TypeError, json.JSONDecodeError) as e: print(f"Error decoding seats for booking {booking_id}: {e}")
        return jsonify(fr), 200
    except sqlite3.Error as e: print(f"GET /api/bookings/{booking_id} Error for User {current_user_id}: {e}"); return jsonify({"m": "Server error.", "e": str(e)}), 500
    finally:
        if conn: conn.close()


@app.route('/api/bookings/<int:booking_id>', methods=['DELETE'])
@login_required
def delete_booking(booking_id): # This is now "cancel_booking" effectively
    current_user_id = session['user_id']
    print(f"User ID {current_user_id} requesting to CANCEL (soft delete) /api/bookings/{booking_id}")
    conn = get_db_connection()
    if not conn: return jsonify({"m": "DB error."}), 500
    try:
        c = conn.cursor()
        # Check if booking exists, belongs to user, and is not already cancelled
        c.execute("SELECT id, is_cancelled FROM bookings WHERE id = ? AND user_id = ?", (booking_id, current_user_id))
        booking_to_cancel = c.fetchone()

        if not booking_to_cancel:
            print(f"CANCEL: Booking {booking_id} not found for User {current_user_id}.")
            return jsonify({"m": f"Booking {booking_id} not found or access denied."}), 404

        if booking_to_cancel['is_cancelled'] == 1:
            print(f"CANCEL: Booking {booking_id} already cancelled for User {current_user_id}.")
            return jsonify({"m": f"Booking {booking_id} is already cancelled."}), 400 # Bad request or conflict

        # Perform soft delete: UPDATE is_cancelled and set cancelled_at
        c.execute("""
            UPDATE bookings
            SET is_cancelled = 1, cancelled_at = CURRENT_TIMESTAMP
            WHERE id = ? AND user_id = ?
        """, (booking_id, current_user_id))
        conn.commit()

        if c.rowcount > 0:
            print(f"Soft deleted (cancelled) Booking ID {booking_id} for User {current_user_id}.")
            return jsonify({"m": f"Booking {booking_id} successfully cancelled."}), 200
        else:
            # This case should ideally not be reached if previous checks passed
            print(f"CANCEL: No row affected for Booking ID {booking_id}, User {current_user_id}. Might be a race condition or already cancelled.")
            return jsonify({"m": f"Booking {booking_id} could not be cancelled or was already cancelled."}), 404 # Or 500 if unexpected

    except sqlite3.Error as e:
        if conn: conn.rollback()
        print(f"CANCEL Error for Booking ID {booking_id}, User {current_user_id}: {e}")
        return jsonify({"m": "Server error during cancellation.", "e": str(e)}), 500
    finally:
        if conn: conn.close()


if __name__ == '__main__':
    db_file_in_user_dir = os.path.join(os.path.dirname(__file__), DATABASE_FILE)
    # Always run init_db to ensure schema is up-to-date
    print(f"[USER APP] Ensuring database schema is current via init_db()...")
    init_db()
        
    port = int(os.getenv("PORT", 5000))
    app.run(host='127.0.0.1', debug=True, port=port)