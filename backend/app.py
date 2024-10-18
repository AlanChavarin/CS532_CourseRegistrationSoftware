# scaffhold a basic flask app
from flask import Flask
from routes import user

app = Flask(__name__)
# Register the blueprint
app.register_blueprint(user)

@app.route('/test')
def hello():
    return "Hello, World!"

if __name__ == '__main__':
    app.run(debug=True)
