from flask import Blueprint

user_routes = Blueprint('user_routes', __name__)

from . import user_routes
