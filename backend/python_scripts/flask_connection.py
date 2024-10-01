from flask import Flask, request, jsonify
from flask_cors import CORS
from pdf_scraper import parse_recipe

app = Flask(__name__)
CORS(app)


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    pdf_data = file.read()
    recipe = parse_recipe(pdf_data)

    # Return the result as a JSON object
    result = {"file": file.filename, "recipe": recipe, "message": "PDF processed successfully"}
    return jsonify(result)


if __name__ == '__main__':
    # run this script in pycharm, where python packages can be installed more easily
    app.run(debug=True)
