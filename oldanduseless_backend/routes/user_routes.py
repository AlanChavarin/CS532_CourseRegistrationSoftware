from flask import Blueprint, jsonify, request
from controller.user_controller import UserController

user_routes = Blueprint('user_routes', __name__)

@user_routes.route('/users', methods=['GET'])
def get_users():
    users = UserController.get_all_users()
    return jsonify(users)

@user_routes.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = UserController.get_user(user_id)
    return jsonify(user)

@user_routes.route('/users', methods=['POST'])
def create_user():
    user_data = request.json
    result = UserController.create_user(user_data)
    return jsonify(result), 201
