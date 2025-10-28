from flask import Flask, request, jsonify, session
import sqlite3
from flask_cors import CORS
from dotenv import load_dotenv
import os
import json
from functools import wraps
from datetime import datetime
from collections import Counter

# ... (all existing imports and setup are the same) ...
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(dotenv_path):
    print(f"[ADMIN APP] Loading .env file from: {dotenv_path}")
    load_dotenv(dotenv_path)
else:
    print(f"[ADMIN APP] WARNING: admin/.env file not found at {dotenv_path}. Using defaults.")

admin_app = Flask(__name__)

admin_app.config['SECRET_KEY'] = os.getenv('ADMIN_SECRET_KEY', 'ADMIN_APP_VERY_INSECURE_DEFAULT_KEY_!@#$_CHANGE_ME')
admin_app.config['SESSION_COOKIE_HTTPONLY'] = True
admin_app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
admin_app.config['SESSION_COOKIE_SECURE'] = False
admin_app.config['SESSION_COOKIE_DOMAIN'] = '127.0.0.1'
admin_app.config['SESSION_COOKIE_PATH'] = '/admin-api/'

ADMIN_FRONTEND_ORIGIN = os.getenv('ADMIN_FRONTEND_ORIGIN', "http://127.0.0.1:5500")
CORS(admin_app,
     supports_credentials=True,
     origins=[ADMIN_FRONTEND_ORIGIN, "http://localhost:5500", "http://127.0.0.1:5500"]
)

DATABASE_FILE_PATH_FROM_ENV = os.getenv('DATABASE_PATH', '../user/bookings.db')
BASE_DIR_ADMIN_APP = os.path.dirname(os.path.abspath(__file__))
ABSOLUTE_DATABASE_PATH = os.path.abspath(os.path.join(BASE_DIR_ADMIN_APP, DATABASE_FILE_PATH_FROM_ENV))

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME_CONFIG", "1ds23is127@dsce.edu.in")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD_CONFIG", "Dsce@0210")

print(f"[ADMIN APP] Effective Admin Username for Login: '{ADMIN_USERNAME}'")

def get_admin_db_connection():
    try:
        if not os.path.exists(ABSOLUTE_DATABASE_PATH):
            print(f"[ADMIN APP] CRITICAL DB ERROR: File not found at {ABSOLUTE_DATABASE_PATH}")
            return None
        conn = sqlite3.connect(ABSOLUTE_DATABASE_PATH)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON;")
        return conn
    except sqlite3.Error as e:
        print(f"[ADMIN APP] Error connecting to SQLite: {e} (Path: {ABSOLUTE_DATABASE_PATH})")
        return None

def admin_auth_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.method == 'OPTIONS':
            return f(*args, **kwargs)
        if not session.get('admin_logged_in'):
            return jsonify({"message": "Admin authentication required."}), 401
        return f(*args, **kwargs)
    return decorated_function

def _build_cors_preflight_response():
    response = jsonify({"message": "CORS preflight OK"})
    response.status_code = 204
    return response

# ... (All auth, movie management, and other stats endpoints are the same as before) ...
@admin_app.route('/admin-api/')
def admin_api_index(): return "Admin Movie Booking API is running!"
@admin_app.route('/admin-api/login', methods=['POST', 'OPTIONS'])
def admin_login():
    if request.method == 'OPTIONS': return _build_cors_preflight_response()
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'): return jsonify({"message": "Username and password required."}), 400
    username = data['username']; password = data['password']
    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        session.clear(); session['admin_logged_in'] = True; session['admin_username'] = username
        return jsonify({"message": "Admin login successful!", "admin_username": username}), 200
    else: return jsonify({"message": "Invalid admin credentials."}), 401
@admin_app.route('/admin-api/logout', methods=['POST', 'OPTIONS'])
@admin_auth_required
def admin_logout():
    if request.method == 'OPTIONS': return _build_cors_preflight_response()
    session.clear()
    return jsonify({"message": "Admin logged out successfully."}), 200
@admin_app.route('/admin-api/auth/status', methods=['GET', 'OPTIONS'])
def admin_auth_status():
    if request.method == 'OPTIONS': return _build_cors_preflight_response()
    if session.get('admin_logged_in'): return jsonify({"isAdminLoggedIn": True, "adminUsername": session.get('admin_username')}), 200
    else: return jsonify({"isAdminLoggedIn": False}), 200
@admin_app.route('/admin-api/stats', methods=['GET', 'OPTIONS'])
@admin_auth_required
def get_dashboard_stats():
    if request.method == 'OPTIONS': return _build_cors_preflight_response()
    conn = get_admin_db_connection()
    if not conn: return jsonify({"message": "DB connection error"}), 500
    stats = {}
    try:
        c = conn.cursor()
        c.execute("SELECT COUNT(*) as count FROM movies"); stats["totalMovies"] = c.fetchone()['count']
        c.execute("SELECT COUNT(*) as count FROM users"); stats["totalUsers"] = c.fetchone()['count']
        c.execute("SELECT COUNT(*) as count FROM bookings WHERE is_cancelled = 0 OR is_cancelled IS NULL"); stats["totalBookings"] = c.fetchone()['count']
        return jsonify(stats), 200
    finally:
        if conn: conn.close()
@admin_app.route('/admin-api/movies', methods=['GET', 'POST', 'OPTIONS'])
@admin_auth_required
def handle_movies():
    if request.method == 'OPTIONS': return _build_cors_preflight_response()
    if request.method == 'GET': return get_all_movies_logic()
    elif request.method == 'POST': return add_new_movie_logic()
@admin_app.route('/admin-api/movies/<int:movie_id>', methods=['PUT', 'DELETE', 'OPTIONS'])
@admin_auth_required
def handle_single_movie(movie_id):
    if request.method == 'OPTIONS': return _build_cors_preflight_response()
    if request.method == 'PUT': return update_movie_logic(movie_id)
    elif request.method == 'DELETE': return delete_movie_logic(movie_id)

def get_all_movies_logic():
    conn = get_admin_db_connection()
    if not conn: return jsonify({"message": "DB error"}), 500
    movies = []
    try:
        c = conn.cursor()
        c.execute("SELECT id, title, duration, poster_image_filename, is_default, unique_tag FROM movies ORDER BY id")
        for movie_row in c.fetchall():
            movie = dict(movie_row)
            sc = conn.cursor()
            sc.execute("SELECT id as showtime_id, time_slot as time FROM showtimes WHERE movie_id = ? ORDER BY time_slot", (movie['id'],))
            movie['showtimes'] = [dict(st) for st in sc.fetchall()]
            movies.append(movie)
        return jsonify(movies), 200
    finally:
        if conn: conn.close()

def add_new_movie_logic():
    data = request.get_json()
    if not data or not all(k in data for k in ['title', 'duration', 'poster_image_filename']): return jsonify({"message": "Missing required fields"}), 400
    conn = get_admin_db_connection()
    if not conn: return jsonify({"message": "DB error"}), 500
    try:
        c = conn.cursor()
        c.execute("INSERT INTO movies (title, duration, poster_image_filename) VALUES (?, ?, ?)", (data['title'], data['duration'], data['poster_image_filename']))
        movie_id = c.lastrowid
        new_showtimes = []
        if 'showtimes' in data and isinstance(data['showtimes'], list):
            for st in data['showtimes']:
                c.execute("INSERT INTO showtimes (movie_id, time_slot) VALUES (?, ?)", (movie_id, st))
                new_showtimes.append({'id': c.lastrowid, 'time': st})
        conn.commit()
        return jsonify({"message": "Movie added!", "movie": {**data, 'id': movie_id, 'showtimes': new_showtimes}}), 201
    except sqlite3.Error as e:
        conn.rollback()
        return jsonify({"message": str(e)}), 500
    finally:
        if conn: conn.close()
def update_movie_logic(movie_id):
    data = request.get_json()
    conn = get_admin_db_connection()
    if not conn: return jsonify({"message": "DB error"}), 500
    try:
        c = conn.cursor()
        c.execute("UPDATE movies SET title=?, duration=?, poster_image_filename=? WHERE id=?", (data['title'], data['duration'], data['poster_image_filename'], movie_id))
        c.execute("DELETE FROM showtimes WHERE movie_id=?", (movie_id,))
        updated_showtimes = []
        if 'showtimes' in data and isinstance(data['showtimes'], list):
            for st in data['showtimes']:
                c.execute("INSERT INTO showtimes (movie_id, time_slot) VALUES (?, ?)", (movie_id, st))
                updated_showtimes.append({'id': c.lastrowid, 'time': st})
        conn.commit()
        return jsonify({"message": "Movie updated!", "movie": {**data, 'id': movie_id, 'showtimes': updated_showtimes}}), 200
    except sqlite3.Error as e:
        conn.rollback()
        return jsonify({"message": str(e)}), 500
    finally:
        if conn: conn.close()
def delete_movie_logic(movie_id):
    conn = get_admin_db_connection()
    if not conn: return jsonify({"message": "DB error"}), 500
    try:
        c = conn.cursor()
        c.execute("SELECT is_default FROM movies WHERE id=?", (movie_id,))
        movie = c.fetchone()
        if not movie: return jsonify({"message": "Movie not found"}), 404
        if movie['is_default']: return jsonify({"message": "Cannot delete default movies"}), 403
        c.execute("DELETE FROM movies WHERE id=?", (movie_id,))
        conn.commit()
        return jsonify({"message": "Movie deleted"}), 200
    except sqlite3.Error as e:
        conn.rollback()
        return jsonify({"message": str(e)}), 500
    finally:
        if conn: conn.close()
@admin_app.route('/admin-api/bookings/stats/overall', methods=['GET', 'OPTIONS'])
@admin_auth_required
def get_overall_booking_stats():
    if request.method == 'OPTIONS': return _build_cors_preflight_response()
    conn = get_admin_db_connection()
    if not conn: return jsonify({"message": "DB error"}), 500
    stats = {}
    try:
        c = conn.cursor()
        c.execute("SELECT COUNT(*) as count FROM bookings WHERE is_cancelled = 0 OR is_cancelled IS NULL"); stats['activeBookings'] = c.fetchone()['count']
        c.execute("SELECT seats FROM bookings WHERE is_cancelled = 0 OR is_cancelled IS NULL")
        stats['totalSeatsBooked'] = sum(len(json.loads(row['seats'])) for row in c.fetchall() if row['seats'])
        c.execute("SELECT COUNT(DISTINCT movie_id) as count FROM bookings WHERE is_cancelled = 0 OR is_cancelled IS NULL"); stats['uniqueMoviesBooked'] = c.fetchone()['count']
        c.execute("SELECT COUNT(DISTINCT user_id) as count FROM bookings WHERE is_cancelled = 0 OR is_cancelled IS NULL"); stats['uniqueUsersWithBookings'] = c.fetchone()['count']
        return jsonify(stats), 200
    finally:
        if conn: conn.close()
@admin_app.route('/admin-api/bookings/stats/user-activity', methods=['GET', 'OPTIONS'])
@admin_auth_required
def get_user_activity_stats():
    if request.method == 'OPTIONS': return _build_cors_preflight_response()
    conn = get_admin_db_connection()
    if not conn: return jsonify({"message": "DB error"}), 500
    stats = {}
    try:
        c = conn.cursor()
        c.execute("SELECT u.username, COUNT(b.id) as count FROM bookings b JOIN users u ON u.id = b.user_id WHERE b.is_cancelled = 0 OR b.is_cancelled IS NULL GROUP BY u.id ORDER BY count DESC LIMIT 1")
        stats['userWithMostActiveBookings'] = dict(c.fetchone() or {'username': 'N/A', 'count': 0})
        c.execute("SELECT u.username, COUNT(b.id) as count FROM bookings b JOIN users u ON u.id = b.user_id WHERE b.is_cancelled = 1 GROUP BY u.id ORDER BY count DESC LIMIT 1")
        stats['userWithMostCancelledBookings'] = dict(c.fetchone() or {'username': 'N/A', 'count': 0})
        c.execute("SELECT id, username, created_at FROM users")
        all_users = [dict(row) for row in c.fetchall()]
        stats['allRegisteredUsers'] = all_users
        stats['totalRegisteredUsers'] = len(all_users)
        c.execute("SELECT DISTINCT user_id FROM bookings WHERE is_cancelled = 0 OR is_cancelled IS NULL")
        users_with_bookings = {row['user_id'] for row in c.fetchall()}
        stats['usersWithNoBookingsCount'] = stats['totalRegisteredUsers'] - len(users_with_bookings)
        return jsonify(stats), 200
    finally:
        if conn: conn.close()
@admin_app.route('/admin-api/bookings/stats/movie-popularity', methods=['GET', 'OPTIONS'])
@admin_auth_required
def get_movie_popularity_stats():
    if request.method == 'OPTIONS': return _build_cors_preflight_response()
    conn = get_admin_db_connection()
    if not conn: return jsonify({"message": "DB error"}), 500
    try:
        c = conn.cursor()
        c.execute("""
            SELECT m.title, SUM(JSON_ARRAY_LENGTH(b.seats)) as tickets_sold
            FROM bookings b JOIN movies m ON m.id = b.movie_id
            WHERE (b.is_cancelled = 0 OR b.is_cancelled IS NULL) AND b.seats != ''
            GROUP BY m.id ORDER BY tickets_sold DESC
        """)
        return jsonify({'moviesBySalesActive': [dict(row) for row in c.fetchall()]}), 200
    finally:
        if conn: conn.close()
@admin_app.route('/admin-api/bookings/stats/cancellation-patterns', methods=['GET', 'OPTIONS'])
@admin_auth_required
def get_cancellation_pattern_stats():
    if request.method == 'OPTIONS': return _build_cors_preflight_response()
    conn = get_admin_db_connection()
    if not conn: return jsonify({"message": "DB error"}), 500
    stats = {}
    try:
        c = conn.cursor()
        c.execute("SELECT COUNT(*) as count FROM bookings WHERE is_cancelled = 1"); stats['totalCancelledBookings'] = c.fetchone()['count']
        c.execute("SELECT seats FROM bookings WHERE is_cancelled = 1"); stats['totalSeatsInCancelledBookings'] = sum(len(json.loads(r['seats'])) for r in c.fetchall() if r['seats'])
        c.execute("SELECT m.title, COUNT(b.id) as count FROM bookings b JOIN movies m ON m.id = b.movie_id WHERE b.is_cancelled = 1 GROUP BY m.id ORDER BY count DESC LIMIT 1"); stats['movieWithMostCancels'] = dict(c.fetchone() or {'title': 'N/A', 'count': 0})
        c.execute("SELECT u.username, COUNT(b.id) as count FROM bookings b JOIN users u ON u.id = b.user_id WHERE b.is_cancelled = 1 GROUP BY u.id ORDER BY count DESC LIMIT 1"); stats['userWithMostCancels'] = dict(c.fetchone() or {'username': 'N/A', 'count': 0})
        return jsonify(stats), 200
    finally:
        if conn: conn.close()
        
@admin_app.route('/admin-api/bookings/stats/by-showtime', methods=['GET', 'OPTIONS'])
@admin_auth_required
def get_booking_showtime_stats():
    if request.method == 'OPTIONS': return _build_cors_preflight_response()
    conn = get_admin_db_connection()
    if not conn: return jsonify({"message": "Database connection error."}), 500
    
    query = """
        SELECT 
            show_time,
            COUNT(id) as booking_count
        FROM bookings
        WHERE is_cancelled = 0 OR is_cancelled IS NULL
        GROUP BY show_time
        ORDER BY show_time ASC;
    """
    try:
        cursor = conn.cursor()
        cursor.execute(query)
        showtime_data = [dict(row) for row in cursor.fetchall()]
        return jsonify(showtime_data), 200
    except Exception as e:
        print(f"--- [ADMIN Bookings] Error fetching booking by showtime: {e}")
        return jsonify({"message": "An unexpected server error occurred.", "error": str(e)}), 500
    finally:
        if conn: conn.close()

@admin_app.route('/admin-api/bookings/all', methods=['GET', 'OPTIONS'])
@admin_auth_required
def get_all_bookings_raw():
    if request.method == 'OPTIONS': return _build_cors_preflight_response()
    conn = get_admin_db_connection()
    if not conn: return jsonify({"message": "Database connection error."}), 500
    
    # --- START OF FIX ---
    # Get filter values as strings to handle empty inputs robustly.
    # .strip() removes any accidental whitespace from the frontend.
    raw_user_id = request.args.get('userId', default='').strip()
    raw_movie_id = request.args.get('movieId', default='').strip()
    filter_cancelled_status = request.args.get('isCancelled') 
    # --- END OF ORIGINAL CODE BEING REPLACED ---

    query = """
        SELECT b.id as booking_id, b.user_id, u.username as booked_by_username, 
               b.movie_id, b.movie_name, b.show_time, b.user_name as name_on_booking, 
               b.seats, 
               b.is_cancelled, strftime('%Y-%m-%d %H:%M:%S', b.cancelled_at) as cancelled_at_ts
        FROM bookings b
        JOIN users u ON b.user_id = u.id 
    """
    conditions, params = [], []

    # --- START OF FIX LOGIC ---
    # Manually check if the string is a valid digit before adding it to the query.
    # This correctly ignores empty strings or non-numeric text.
    if raw_user_id.isdigit():
        conditions.append("b.user_id = ?")
        params.append(int(raw_user_id))
    
    if raw_movie_id.isdigit():
        conditions.append("b.movie_id = ?")
        params.append(int(raw_movie_id))
    # --- END OF FIX LOGIC ---

    if filter_cancelled_status == 'true': 
        conditions.append("b.is_cancelled = 1")
    elif filter_cancelled_status == 'false': 
        conditions.append("(b.is_cancelled = 0 OR b.is_cancelled IS NULL)")

    if conditions: 
        query += " WHERE " + " AND ".join(conditions)

    query += " ORDER BY b.id DESC"

    all_bookings = []
    try:
        cursor = conn.cursor()
        cursor.execute(query, tuple(params))
        for row in cursor.fetchall():
            booking_dict = dict(row)
            try: 
                booking_dict['seats'] = json.loads(booking_dict.get('seats', '[]'))
            except: 
                booking_dict['seats'] = []
            booking_dict['is_cancelled'] = bool(booking_dict['is_cancelled'])
            all_bookings.append(booking_dict)
        return jsonify(all_bookings), 200
    except Exception as e:
        return jsonify({"message": f"An unexpected server error occurred: {e}"}), 500
    finally:
        if conn: conn.close()

if __name__ == '__main__':
    if not os.path.exists(ABSOLUTE_DATABASE_PATH):
        print(f"[ADMIN APP] CRITICAL: DB file not found at {ABSOLUTE_DATABASE_PATH}. User app (user/app.py) must run init_db() first.")
    else:
        print(f"[ADMIN APP] DB file found at {ABSOLUTE_DATABASE_PATH}. Admin app ready.")
    admin_port = int(os.getenv("ADMIN_APP_PORT", 5001))
    admin_app.run(host='127.0.0.1', port=admin_port, debug=True, use_reloader=False)