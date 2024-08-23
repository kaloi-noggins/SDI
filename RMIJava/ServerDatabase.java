
/*
 * O servidor deve oferecer:
 * - Operações com a base de dados (implementando IDatabase)
  */

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.server.UnicastRemoteObject;
import java.util.Arrays;

public class ServerDatabase implements IDatabase {

  public static void main(String[] args) {
    final int DATABASE_SERVER_PORT = 8002;

    try {
      // Instanciamento do objeto servidor e seu stub
      ServerDatabase server = new ServerDatabase();
      IDatabase stub = (IDatabase) UnicastRemoteObject.exportObject(server, 0);
      // Registro do stub no RMI Registry para que esteja visível a clientes
      Registry registry = LocateRegistry.createRegistry(DATABASE_SERVER_PORT);
      registry.bind("database_service", stub);
      System.out.println("Servidor pronto e escutando na porta " + DATABASE_SERVER_PORT);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public void save(double[][] a, String filename) throws RemoteException {
    try {
      BufferedWriter outputBufferedWriter = new BufferedWriter(new FileWriter(filename));
      int rows = a.length;

      for (int i = 0; i < rows; i++) {
        outputBufferedWriter.write(Arrays.toString(a[i]));
        outputBufferedWriter.newLine();
      }

      outputBufferedWriter.flush();
      outputBufferedWriter.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  public double[][] load(String filename) throws RemoteException {
    try {
      BufferedReader inputBufferedReader = new BufferedReader(new FileReader(filename));
      String line;
      double[][] matrix = null;
      int row = 0;

      // Read first line to determine matrix dimensions
      if ((line = inputBufferedReader.readLine()) != null) {
        String[] firstRow = line.replace("[", "").replace("]", "").split(", ");
        int cols = firstRow.length;
        matrix = new double[1][cols];
        for (int j = 0; j < cols; j++) {
          matrix[0][j] = Double.parseDouble(firstRow[j]);
        }
        row++;
      }

      // Read the remaining lines
      while ((line = inputBufferedReader.readLine()) != null) {
        String[] values = line.replace("[", "").replace("]", "").split(", ");
        double[][] tempMatrix = new double[row + 1][values.length];
        System.arraycopy(matrix, 0, tempMatrix, 0, row);
        for (int j = 0; j < values.length; j++) {
          tempMatrix[row][j] = Double.parseDouble(values[j]);
        }
        matrix = tempMatrix;
        row++;
      }

      inputBufferedReader.close();
      return matrix;
    } catch (IOException e) {
      e.printStackTrace();
      throw new RemoteException("Failed to load matrix from file.", e);
    }
  }

  public void remove(String filename) throws RemoteException {
    File file = new File(filename);
    if (file.exists()) {
      if (!file.delete()) {
        throw new RemoteException("Failed to delete the file.");
      }
    } else {
      throw new RemoteException("File not found.");
    }
  }

}
