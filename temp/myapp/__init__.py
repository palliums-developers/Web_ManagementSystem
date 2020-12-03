from flask import Flask
from flask_restful import Api

# import os, sys
# BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# print(BASE_DIR)
# sys.path.append(BASE_DIR)

from service import login

app = Flask(__name__)
api = Api(app)

api.add_resource(login.Login, '/login')
api.add_resource(login.List,'/list')

if __name__ == '__main__':
    app.run(debug=True)