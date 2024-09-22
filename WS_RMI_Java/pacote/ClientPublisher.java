package pacote;
/*
 * O cliente deve executar as operações com as matrizes e salvar os dados (recuperar e por fim excluir o arquivo)
 */

import javax.xml.ws.Endpoint;

public class ClientPublisher {

	public static void main(String[] args) {

		System.out.println("Beginning to publish Client now");
		Endpoint.publish("http://127.0.0.1:6661/start", new ClientImpl());
		System.out.println("Done publishing");
	}

}