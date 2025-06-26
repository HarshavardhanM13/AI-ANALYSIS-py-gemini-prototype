

from flask import Flask
from flask_cors import CORS
from routes.authentication_routes import auth_blueprint
from routes.quiz_routes import *
from routes.AI_analyser import *

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_blueprint, url_prefix = "/auth")
app.register_blueprint(quiz_routes)
app.register_blueprint(analyse_routes)

if __name__ == "__main__":
    app.run(debug=True)