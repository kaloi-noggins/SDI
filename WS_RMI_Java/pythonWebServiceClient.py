from zeep.client import Client

# RPC style soap service
client = Client("http://127.0.0.1:6661/start")
print(client.service.start())
