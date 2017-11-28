import serial
import urllib
import requests
import os

ser = serial.Serial('/dev/ttyAMA0',  115200, timeout = 0.5)
#Open the serial Port
ser.flushInput() # Clear the input buffer

while True:
    data = ser.readlines()
    if data:
        c = data[0].split()[4].strip('\r\n').strip('n')
        d = data[1].split()[4].strip('\r\n')
        serial = c + d
        payload = { 'serial' : serial}
        r = requests.get('http://www.easybook2017.com/nfc',params = payload)
        f = urllib.urlopen(r.url)
        myfile = f.read()
        if myfile == '0':
            print "Success!"
            os.system('aplay /home/pi/success.wav')
        elif myfile == '1':
            print "This book does not exist!"
            os.system('aplay /home/pi/stop.wav')
        elif myfile == '2':
            print "Data transfer error!"
            os.system('aplay /home/pi/fail.wav')