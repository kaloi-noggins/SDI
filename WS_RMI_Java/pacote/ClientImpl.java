package pacote;
/*
 * O cliente deve executar as operações com as matrizes e salvar os dados (recuperar e por fim excluir o arquivo)
 */

import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import javax.jws.WebService;

@WebService(endpointInterface = "pacote.ClientInterface")
public class ClientImpl implements ClientInterface {
    
    public void start() {

        String hostM = "127.0.0.1";
        String hostDB = "127.0.0.1";

        final int DATABASE_SERVER_PORT = 8002;
        final int MATRIX_SERVER_PORT = 8001;

        try {
            Registry registryMatrix = LocateRegistry.getRegistry(hostM, MATRIX_SERVER_PORT);
            Registry registryDB = LocateRegistry.getRegistry(hostDB, DATABASE_SERVER_PORT);

            IMatrix matrix_stub = (IMatrix) registryMatrix.lookup("matrix_service");
            IDatabase database_stub = (IDatabase) registryDB.lookup("database_service");
            double[][] a = matrix_stub.randfill(100, 100);
            double[][] b = matrix_stub.randfill(100, 100);
            double[][] c = matrix_stub.mult(a, b);

            database_stub.save(a, "a.txt");
            database_stub.save(b, "b.txt");
            double[][] na = database_stub.load("a.txt");
            double[][] nb = database_stub.load("b.txt");
            database_stub.remove("a.txt");
            database_stub.remove("b.txt");

        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

}