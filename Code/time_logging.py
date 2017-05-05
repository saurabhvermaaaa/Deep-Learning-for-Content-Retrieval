from time import clock
start_time = 0

def start(string):
    start_time = clock()
    print string

def finish(string):
    print string, "\nTime Taken : " + str(clock() - start_time)


