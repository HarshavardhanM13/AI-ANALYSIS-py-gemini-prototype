from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

@app.route('/leetcode-tags', methods=['POST'])
def get_leetcode_tags():
    data = request.json
    problem_slug = data.get('problemSlug')

    if not problem_slug:
        return jsonify({"error": "problemSlug is required"}), 400

    url = "https://leetcode.com/graphql"
    query = """
    query getQuestionDetail($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        questionId
        title
        difficulty
        topicTags {
          name
          slug
        }
      }
    }
    """
    variables = {"titleSlug": problem_slug}

    try:
        response = requests.post(url, json={"query": query, "variables": variables})
        response.raise_for_status()
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500

    json_data = response.json()

    if not json_data.get('data') or not json_data['data'].get('question'):
        return jsonify({"error": "Problem not found or invalid slug"}), 404

    return jsonify(json_data['data']['question'])

if __name__ == '__main__':
    app.run(debug=True)
