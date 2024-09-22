package pacote;
 
import java.net.URL;
import javax.xml.namespace.QName;
import javax.xml.ws.Service;
 
public class WebServiceClient {
 
	public static void main(String[] args) {
 
		try {
 
			URL url = new URL("http://localhost:6661/start?wsdl");
			QName qname = new QName("http://pacote/",
					"ClientImplService");
 
			Service service = Service.create(url, qname);
 
			ClientInterface server = service.getPort(ClientInterface.class);
            
            server.start();

		} catch (Exception e) {
			e.printStackTrace();
		}
 
	}
 
}
