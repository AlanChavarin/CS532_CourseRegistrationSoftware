from flask import Blueprint

user = Blueprint('main', __name__)

@user.route('/')
def index():
    return "Welcome to the main page!"

@user.route('/about')
def about():
    return "This is the about page."

@user.route('/contact')
def contact():
    return "Contact us here."

