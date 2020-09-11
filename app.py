from flask import Flask
from flask_restful import Resource, Api
from app_service_login import Login
from app_service_loginLog import LoginLog
from app_service_operationLog import OperationLog
from flask_cors import CORS

app = Flask(__name__)
api = Api(app)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})


api.add_resource(Login, '/api/login')
api.add_resource(LoginLog, '/api/loginLog')
api.add_resource(OperationLog, '/api/operationLog')


if __name__ == '__main__':
    app.run(debug=True)
