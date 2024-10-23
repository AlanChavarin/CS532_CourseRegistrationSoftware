# scaffold a basic flask app
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from routes.user_routes import user_routes
from config import Config

app = Flask(__name__)
# Configure the SQLAlchemy part of the app instance
app.config.from_object(Config)

# Print out config variables
print("Configuration variables:")
for key, value in app.config.items():
    if key.isupper():  # Convention: only uppercase variables are configuration
        print(f"{key}: {value}")


# Create the SQLAlchemy db instance
db = SQLAlchemy(app)

# Register the blueprint
app.register_blueprint(user_routes)

@app.route('/test')
def hello():
    return "Hello, World!"

if __name__ == '__main__':
    app.run(debug=True)
