import subprocess
from time import sleep
from pathlib import Path
from multiprocessing import Process

path = Path.cwd().absolute().resolve()

def run_backend():
    # print("Hello from backend")
    subprocess.run(
        ["python3", "main.py"],
        cwd = path / "backend",
        # capture_output=True,
        stdout = subprocess.PIPE
    )   
    
def run_frontend():
    # print("Hello from frontend")
    subprocess.run(
        ["bash", "start_node.sh"],
        cwd = path / "frontend",
        # capture_output=True,
        stdout = subprocess.PIPE
    )

if __name__ == "__main__":
    try:
        process_backend = Process(target=run_backend)
        process_frontend = Process(target=run_frontend)
        process_backend.start()
        sleep(1.0) # Give time to start backend
        process_frontend.start()
        sleep(0.1)
        print("Backend process PID: {}\nFrontend process PID: {}\n".format(process_backend.pid, process_frontend.pid))
        while True:
            sleep(2.0)
    except Exception as e:
        print(e)
    finally:
        process_frontend.terminate()
        process_backend.terminate()
        sleep(0.1)
        exit(0)