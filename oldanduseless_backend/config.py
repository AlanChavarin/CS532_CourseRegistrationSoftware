import os

class Config:
    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'postgresql://postgres:ioMTRiIfUwwCBvIhuqGDnPCVrnrFDnCS@autorack.proxy.rlwy.net:27709/railway')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Flask configuration
    DEBUG = True  # This should be set to False in production

    # You can add more configuration variables here as needed
    # For example:
    # SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key')
    # FLASK_ENV = os.environ.get('FLASK_ENV', 'development')

    @staticmethod
    def init_app(app):
        pass
