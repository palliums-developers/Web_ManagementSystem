from apscheduler.schedulers.blocking import BlockingScheduler
from datetime import datetime


def my_interval():
    print('hello this time is: %s '%datetime.now())

def my_cron():
    print('hello? %s'%datetime.now())


if __name__ == '__main__':
    scheduler = BlockingScheduler()
    scheduler.add_job(my_interval, 'interval', seconds=10)
    scheduler.add_job(my_cron, 'cron', hour=17, minute=53)
    scheduler.start()
