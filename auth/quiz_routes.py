

from flask import Blueprint, jsonify, request
import models
import models.quiz_model

quiz_routes = Blueprint("quiz_routes",__name__)

@quiz_routes.route("/api/get_questions",methods=["GET"])
def get_quiz_question():
    questions = models.quiz_model.get_questions(limit=10)
    
    if questions:
        return jsonify({"questions" : questions})
    
    return jsonify({"message" : "No questions Available"}),404

@quiz_routes.route('/api/get_reverse_learning_questions',methods=["GET"])
def get_reverse_learning_questions():
    category = request.args.get('category')
    questions = models.quiz_model.get_reverse_learning_questions(2,category)
    if questions:
        return jsonify({"questions" : questions})
    return jsonify({"message": "no question available"})