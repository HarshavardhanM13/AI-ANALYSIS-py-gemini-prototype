

from flask import Blueprint, request, jsonify
from db import get_connection
import bcrypt

auth_blueprint = Blueprint("auth",__name__)

@auth_blueprint.route("/register",methods=["POST"])
def register():
    data = request.json  # data is the json 
     
    # getting name email password from data 
    name = data["name"]
    email = data["email"]
    password = data["password"]
    
    encrypted_password = bcrypt.hashpw(password.encode('utf-8'),bcrypt.gensalt())
    
    connection = get_connection()
    cursor = connection.cursor()
    
    # Insert record to databse (table-> user) new user so that
    try:
        cursor.execute("insert into users(name,email,password) values (%s,%s,%s)",(name,email,encrypted_password))
        connection.commit()
        
        return jsonify({"message":"user registered successfully"}) , 201  # response msg and its method no
    except:
        return jsonify({"error ": "user Already exists"}) , 400 
    finally:
        cursor.close()
        connection.close() 
        
        
@auth_blueprint.route("/login",methods=["POST"])
def login():
    data = request.json
    email = data["email"]
    password = data["password"]
    
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)
    
    cursor.execute("select * from users where email = %s",(email,))
    user = cursor.fetchone()
    
    cursor.close()
    connection.close()
    
    if user and bcrypt.checkpw(password.encode("utf-8"),user["password"].encode("utf-8")):
        return jsonify({"message": "Login Successful", "user": {"id": user["id"], "name": user["name"]}})
    else:
        return jsonify({"error": "Invalid credentials"}), 401