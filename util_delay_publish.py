from apscheduler.schedulers.blocking import BlockingScheduler
from datetime import datetime


# def my_interval():
#     print('hello this time is: %s '%datetime.now())

# def my_cron():
#     print('hello? %s'%datetime.now())


# if __name__ == '__main__':
#     scheduler = BlockingScheduler()
#     scheduler.add_job(my_interval, 'interval', seconds=30)
#     scheduler.add_job(my_cron, 'cron', hour=17, minute=53)
#     scheduler.start()
def decode_time(time_stamp):
    temp_datetime = datetime.fromtimestamp(time_stamp)
    result = {
        'year': temp_datetime.strftime('%Y'),
        'month': temp_datetime.strftime('%m'),
        'day': temp_datetime.strftime('%d'),
        'hour': temp_datetime.strftime('%H'),
        'minute': temp_datetime.strftime('%M'),
        'second': temp_datetime.strftime('%S')
    }
    return result


# def publish(data):


def start_publish(data, time):
    temp_decode_time = decode_time(time)
    print(temp_decode_time)
    # scheduler=BlockingScheduler()
    # scheduler.add_job(publish,'cron',)
    # scheduler.start()


start_publish(1, 1600850528)
