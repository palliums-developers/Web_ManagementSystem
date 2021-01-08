from flask import Flask
from flask_restful import Resource, Api
from app_service_login import Login
from app_service_loginLog import LoginLog
from app_service_operationLog import OperationLog
from app_service_user import User
from app_service_currentUser import CurrentUser
from app_service_bank import Bank
from app_service_coin_management import CoinManagement
from app_service_captcha import CAPTCHA
from app_service_category import Category
from app_service_group import Group
from app_service_article import Article
from app_service_role import Role
from app_service_help_center_web import HelpCenter
from flask_cors import CORS


app = Flask(__name__)

api = Api(app)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})


# class index(Resource):
#     def get(self):
#         return {'message': 'hello'}, 201


# api.add_resource(index, '/')
api.add_resource(Login, '/api/login')
api.add_resource(CurrentUser, '/api/currentUser')
api.add_resource(User, '/api/user')
api.add_resource(LoginLog, '/api/loginLog')
api.add_resource(OperationLog, '/api/operationLog')
api.add_resource(Bank, '/api/bank')
api.add_resource(CoinManagement, '/api/coin')
api.add_resource(CAPTCHA, '/api/captcha')
api.add_resource(Role, '/api/role')
api.add_resource(Category, '/api/category')
api.add_resource(Group, '/api/group')
api.add_resource(Article, '/api/article')
api.add_resource(HelpCenter, '/api/help_center')
# api.add_resource(CAPTCHA, '/api/getGroupName')
# api.add_resource(CAPTCHA, '/api/getArticleName')
# api.add_resource(CAPTCHA, '/api/allArticle')
# api.add_resource(CAPTCHA, '/api/help')
# api.add_resource(CAPTCHA, '/api/help/category')
# api.add_resource(CAPTCHA, '/api/help/article')


if __name__ == '__main__':
    # app.run(debug=True)
    app.run(host='0.0.0.0', port=5000, debug=True)
