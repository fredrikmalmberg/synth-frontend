#!/usr/bin/env python3
"""
Description: an implementation of patcher.py for a headless Raspberry Pi
    creates a synthesizer that can be controlled with a USB MIDI controller
    patches/banks are changed using pads/buttons/knobs on the controller
    should work on other platforms as well
"""
import time, re, sys, os, traceback, subprocess
import patcher
from flask import Flask, jsonify, render_template, request, send_from_directory, make_response
app = Flask(__name__)


def get_current_patch():
    return mainapp.current_patch

def get_current_bank_name():
    return str(pxr.currentbank)

def get_current_bank_number():
    return pxr.banks.index(pxr.currentbank)

def get_all_patches():
    all = []
    for idx, patch in enumerate(pxr.patches):
        all.append([idx + 1, ". " +str(patch)])
    return all

def get_all_banks():
    all = []
    for bank in pxr.banks:
        all.append(str(bank))
    return all

def status():
    patch_list = get_all_patches()
    bank_list = get_all_banks()
    current_patch = mainapp.current_patch
    current_bank_name = str(pxr.currentbank)
    current_bank_number = pxr.banks.index(pxr.currentbank)
    response = jsonify(patch_list, bank_list, current_patch, current_bank_name, current_bank_number)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route('/api/select_bank/<int:number>')
def select_bank(number):
    if number > len(pxr.banks):
        print("This bank does not exist")
        return jsonify("Bank does not exist")
    if number != pxr.banks.index(pxr.currentbank):
        mainapp.load_bank(pxr.banks[number])
        pxr.write_config()
    response = status()
    return response

@app.route('/api/select_patch/<int:number>')
def select_patch(number):
    mainapp.select_patch(number)
    level = pxr.fluid_get('synth.reverb.level')
    active = pxr.fluid_get('synth.reverb.active')
    damp = pxr.fluid_get('reverb.damp')
    size = pxr.fluid_get('synth.reverb.room-size')
    width = pxr.fluid_get('synth.reverb.width')
    response = status()
    return response

@app.route('/api/')
def start_app():
    response = status()
    return response

@app.route('/api/fluid_setting/<string:opt>', methods = ['GET', 'POST'])
def fluid_setting(opt):
    if request.method == 'GET':
        # return the information for the setting <opt>
        setting = pxr.fluid_get(opt)
        response = jsonify(setting)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

    if request.method == 'POST':
        # modify/update the the setting <opt>
        try:
            val = float(request.data.decode("utf-8")) # a multidict containing POST data
            pxr.fluid_set(opt, val)
        except Exception as e:
            print("Could not convert data to float and set value", e)
        setting = pxr.fluid_get(opt)
        response = make_response("jsonify(setting)")
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.status_code = 200
        return response
        
@app.route('/api/shutdown/')
def shutdown_now():
    print("Shutting down..")
    subprocess.run('sudo shutdown -h now'.split())
    response = jsonify(["shutting down..."])
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response
        
# change these values to correspond to buttons/pads on your MIDI keyboard/controller
# or reprogram your controller to send the corresponding messages
CTRLS_MIDI_CHANNEL = 7
DEC_PATCH = 107         # decrement the patch number
INC_PATCH = 108         # increment the patch number
BANK_INC = 105          # load the next bank

# a continuous controller e.g. knob/slider can be used to select patches by value
SELECT_PATCH = 7

# hold this button down for 7 seconds to safely shut down the Pi
# if this = None the patch change buttons are used
SHUTDOWN_BTN = None

# this function creates MIDI router rules that connect MIDI messages to the desired functions
# modify this function directly if you want to change patches using notes or other MIDI messages
def connect_controls():
    selectspec =  f"0-127=0-{min(len(pxr.patches) - 1, 127)}" # transform CC values into patch numbers
    selectspecbank = f"0-127=0-{min(len(pxr.banks) - 1, 127)}"
    print("banks in controller" + str(len(pxr.banks)))
    pxr.add_router_rule(type='cc', chan=7, par1=7, par2=selectspec, patch='select')
    pxr.add_router_rule(type='cc', chan=8, par1=7, par2=selectspecbank, bank='select')
    if SHUTDOWN_BTN == None:
        pxr.add_router_rule(type='cc', chan=6, par1=7, shutdown=1)
# toggling the onboard LEDs requires writing to the SD card, which can cause audio stutters
# this is not usually noticeable, since it only happens when switching patches or shutting down
# but if it becomes annoying, LED control can be disabled here
DISABLE_LED = False


POLL_TIME = 0.025
ACT_LED = 0
PWR_LED = 1

if not os.path.exists('/sys/class/leds/led1/brightness'):
    PWR_LED = 0 # Pi Zero only has ACT led
if not os.path.exists('/sys/class/leds/led0/brightness') or DISABLE_LED:
    # leds don't exist or control disabled
    def onboardled_set(led, state=None, trigger=None):
        pass
        
    def onboardled_blink(led, n=0):
        pass
        
    def error_blink(n):
        sys.exit()
        
else:
    def onboardled_set(led, state=None, trigger=None):
        if trigger:
            e = subprocess.Popen(('echo', trigger), stdout=subprocess.PIPE)
            subprocess.run(('sudo', 'tee', f'/sys/class/leds/led{led}/trigger'), stdin=e.stdout, stdout=subprocess.DEVNULL)
        if state != None:
            e = subprocess.Popen(('echo', str(state)), stdout=subprocess.PIPE)
            subprocess.run(('sudo', 'tee', f'/sys/class/leds/led{led}/brightness'), stdin=e.stdout, stdout=subprocess.DEVNULL)

    def onboardled_blink(led, n=1):
        while n:
            onboardled_set(led, 1)
            time.sleep(0.1)
            onboardled_set(led, 0)
            n -= 1
            if n: time.sleep(0.1)
            
    def error_blink(n):
        # indicate a problem by blinking the PWR led and block forever
        while True:
            onboardled_blink(PWR_LED, n)
            time.sleep(1)

    def headless_excepthook(etype, val, tb):
        # catch all errors, quit if Ctrl+C was pressed
        # otherwise error_blink(4) forever if headless
        # and also print error to stdout if running from console
        if etype == KeyboardInterrupt:
            sys.exit()
        traceback.print_exception(etype, val, tb)
        error_blink(4)
    sys.excepthook = headless_excepthook

    onboardled_set(PWR_LED, 1, trigger='none') # red PWR led on
    onboardled_set(ACT_LED, 0, trigger='none') # green ACT led off


class HeadlessSynth:

    def __init__(self):
        self.shutdowntimer = 0
        self.pno = 0
        pxr.set_midimessage_callback(self.listener)
        self.load_bank(pxr.currentbank)
        self.current_bank_name=""
        self.status=""
        self.current_patch=0
        onboardled_blink(ACT_LED, 5) # ready to play

        #Shutting down right away instead of waiting

    def load_bank(self, bfile):
        print(f"Loading bank '{bfile}' .. ")
        self.status = "Loading bank '{bfile}' .. "
        bank = str(bfile)
        onboardled_set(ACT_LED, 1)
        try:
            pxr.load_bank(bfile)
        except Exception as e:
            print(f"Error loading {bfile}\n{str(e)}")
            error_blink(3)
        print("Bank loaded.")
        self.current_bank= "Current bank is: " + str(bfile)
        self.status ="Bank Loaded"
        onboardled_set(ACT_LED, 0)
        if pxr.patches:
            self.select_patch(0, force=True)
        else:
            pxr.apply_patch(None)
            connect_controls()
            print("No patches")

    def select_patch(self, n, force=False):
        if n == self.pno and not force: return
        self.pno = n
        pxr.apply_patch(self.pno)
        connect_controls()
        print(f"Selected patch {n + 1}/{len(pxr.patches)}: {pxr.patches[n]}")
        self.current_patch = n
        onboardled_blink(ACT_LED)

    def listener(self, msg):
    # catches custom midi :msg to change patch/bank
        if hasattr(msg, 'patch') and pxr.patches:
            if msg.patch == 'select':
                self.select_patch(int(msg.val))
            elif msg.val > 0:
                self.select_patch((self.pno + msg.patch) % len(pxr.patches))
        if hasattr(msg, 'bank') and msg.val > 0:
            if msg.bank == 'select':
                bno = int(msg.val)
            if bno != pxr.banks.index(pxr.currentbank):
                self.load_bank(pxr.banks[bno])
                pxr.write_config() 
        if hasattr(msg, 'shutdown'):
            print(str(msg.val))
            if msg.val > 1 and msg.val < 20:
                self.shutdowntimer = time.time()
            elif msg.val < 2:
                self.shutdowntimer = 1


cfgfile = sys.argv[1] if len(sys.argv) > 1 else 'SquishBox/squishboxconf.yaml'
try:
    pxr = patcher.Patcher(cfgfile)
except Exception as e:
    print(f"Error loading config file {cfgfile}\n{str(e)}")
    error_blink(2)

# hack to connect MIDI devices to old versions of fluidsynth
fport = re.search("client (\d+): 'FLUID Synth", subprocess.check_output(['aconnect', '-o']).decode())[1]
for port, client in re.findall(" (\d+): '([^\n]*)'", subprocess.check_output(['aconnect', '-i']).decode()):
    subprocess.run(['aconnect', port, fport])

mainapp = HeadlessSynth()
print("passed setting up main app")
app.run(host="0.0.0.0", debug=False)
print("passed setting up flask app")
