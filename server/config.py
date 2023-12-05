# Standard library imports
import os
# Remote library imports
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
import secrets
from dotenv import load_dotenv
from flask_bcrypt import Bcrypt
load_dotenv()

# Local imports


# deployed version uncomment below code, local version comment out below code
app = Flask(
    __name__,
    static_url_path='',
    static_folder='../client/dist',
    template_folder='../client/dist'
)

# Instantiate app, set attributes

# deployed version comment out below code, local version comment in below code
# app = Flask(__name__)

# Instantiate app, set attributes
# app = Flask(__name__)
print(os.environ.get('DATABASE_URI'))
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://live_coding_class_website_user:lMkQRfBziI0oGRB8ssZX01Mxjn1oZKj7@dpg-clnpk4ofvntc73b5rr30-a.oregon-postgres.render.com/live_coding_class_website'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False
app.secret_key = secrets.token_hex(16)


# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
})

db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

# Instantiate REST API
api = Api(app)

# Instantiate CORS
CORS(app)

bcrypt = Bcrypt(app)