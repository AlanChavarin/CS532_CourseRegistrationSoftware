class UserController:
    @staticmethod
    def get_all_users():
        # This is where you'd typically interact with a database
        # For now, we'll just return a dummy list
        return ["User1", "User2", "User3"]

    @staticmethod
    def get_user(user_id):
        # Again, you'd typically fetch this from a database
        return f"User with id {user_id}"

    @staticmethod
    def create_user(user_data):
        # Here you'd typically create a new user in the database
        return f"Created user with data: {user_data}"

