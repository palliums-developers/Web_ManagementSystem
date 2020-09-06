import os

iniName = 'database.ini'
currentDir = os.path.split(os.path.realpath(__file__))[0]
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
configPath = os.path.join(currentDir, iniName)
print(configPath)
print(BASE_DIR)