import google.generativeai as gemini
from flask import Blueprint, jsonify, request
from models.AI_analyser_modal import *



analyse_routes = Blueprint("AI_analyser_route",__name__)

@analyse_routes.route("/store_explanation", methods=["POST"])
def store_explanation():
    try:
        data = request.get_json()
        print("Received Data:", data)  # Debugging

        if not data:
            return jsonify({"error": "Invalid JSON data"}), 400

        user_id = data.get("user_id")
        topic = data.get("topic")
        user_explanation = data.get("user_explanation")

        if not user_id or not topic or not user_explanation:
            return jsonify({"error": "Missing required fields"}), 400

        # Generate AI feedback
        ai_feedback = analyze_explanation(user_explanation, topic)

        # Save to database
        save_to_db(user_id, topic, user_explanation, ai_feedback)

        return jsonify({
            "message": "Explanation stored successfully",
            "ai_feedback": ai_feedback
        })

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": "Server error", "details": str(e)}), 500


@analyse_routes.route("/get_explanations", methods=['GET'])
def get_ai_response():
    user_id = request.args.get("user_id")
    topic = request.args.get("topic")

    if not user_id or not topic:
        return jsonify({"error": "Missing user_id or topic"}), 400

    results = get_response_from_db(user_id,topic)

    return jsonify({"explanations": results})