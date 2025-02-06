import socket 
from ghosting_protocol import *
import logging
import time 
import threading

class GhostingServer:
    def __init__(self, host="localhost", port=1337):
        self.host = host
        self.port = port
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.clients = {}  # Store client states
        with open("flag.txt", "r") as f:
            self.flag = f.read().strip()

        logging.basicConfig(level=logging.INFO,
                            format='%(asctime)s - %(levelname)s - %(message)s')
        self.logger = logging.getLogger("Ghosting Server")

    def cleanup_client(self):
        current_time = time.time()
        to_remove = []
        for addr, state in self.clients.items():
            if current_time - state["last_seen"] > 60:
                to_remove.append(addr)
        for addr in to_remove:
            del self.clients[addr]
            self.logger.info(f"Client {addr} removed due to inactivity")
    
    def send_response(self, response_packet, addr):
        try:
            self.sock.sendto(response_packet.pack(), addr)
            self.logger.info(f"Sent response to {addr}: {response_packet}")
        except Exception as e:
            self.logger.error(f"Failed to send response to {addr}: {e}")

    def handle_packet(self, data, addr):
        try:
            packet = GhostingPacket.unpack(data)
            self.logger.info(f"Received packet from {addr}: {packet}")
            
            # Check if client exists in our state
            client_state = self.clients.get(addr)
            
            # If client doesn't exist, only accept SYN packets
            if client_state is None:
                if packet.flags & Flags.SYN:
                    # New client sending SYN - handle handshake
                    self.clients[addr] = {
                        'handshake': True,
                        'last_seen': time.time()
                    }
                    response = GhostingPacket(
                        packet_type=PacketType.SEEN,
                        flags=Flags.SYN | Flags.ACK
                    )
                    self.send_response(response, addr)
                    self.logger.info(f"Handshake completed for {addr}")
                    return True
                else:
                    # Client trying to communicate without handshake
                    self.logger.warning(f"Client {addr} attempting to communicate without handshake")
                    response = GhostingPacket(
                        packet_type=PacketType.ERROR,
                        flags=Flags.ERROR
                    )
                    self.send_response(response, addr)
                    return False

            # Update last_seen for existing client
            client_state['last_seen'] = time.time()
            
            # Handle flag request
            if packet.flags & Flags.DEV and packet.rsv== b'FLAG':
                response = GhostingPacket(
                    packet_type=PacketType.SEEN,
                    flags = Flags.ACK,
                    rsv = b'NICE',
                    payload_length=len(self.flag),
                    payload=self.flag.encode()
                )
                self.send_response(response, addr)
                return True
            
            # Default response
            response = GhostingPacket(packet_type=PacketType.SEEN, flags=Flags.ACK, rsv = b'xxxx')
            self.send_response(response, addr)
            return True

        except Exception as e:
            self.logger.error(f"Error processing packet from {addr}: {e}")
            response = GhostingPacket(
                packet_type=int(PacketType.ERROR),
                flags=Flags.ERROR
            )
            self.send_response(response, addr)
            return False

    def start(self):
        self.sock.bind((self.host, self.port))
        self.logger.info(f"Ghosting server started at {self.host}:{self.port}")
        
        # Start cleanup thread
        cleanup_thread = threading.Thread(target=self._cleanup_loop, daemon=True)
        cleanup_thread.start()

        while True:
            try:
                data, addr = self.sock.recvfrom(1024)
                # Handle each client in a separate thread
                client_thread = threading.Thread(
                    target=self.handle_packet,
                    args=(data, addr)
                )
                client_thread.start()
            except Exception as e:
                self.logger.error(f"Failed to receive data: {e}")
                
    def _cleanup_loop(self):
        """Periodic cleanup of inactive clients"""
        while True:
            time.sleep(30)
            self.cleanup_client()

    def stop(self):
        """Stop the server"""
        self.sock.close()
        self.logger.info("Server stopped")

if __name__ == "__main__":
    server = GhostingServer()
    try:
        server.start()
    except KeyboardInterrupt:
        server.stop()
        exit(0)
