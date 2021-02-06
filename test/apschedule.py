from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime

def my_interval():
    print('hello this time is: %s '%datetime.now())

def my_cron():
    print('hello? %s'%datetime.now())

if __name__ == '__main__':
    scheduler=BackgroundScheduler()
    scheduler.add_job(my_interval,'interval',seconds=30)
    scheduler.add_job(my_cron,'cron', hour=17,minute=48)
    scheduler.start()