package pacote;
/*
 * O servidor deve oferecer:
 * - Operações com matriz (implementando a interface IMatrix);
  */

import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.server.UnicastRemoteObject;

public class ServerMatrix implements IMatrix {

  public static void main(String[] args) {

    final int MATRIX_SERVER_PORT = 8001;

    try {
      // Instanciamento do objeto servidor e seu stub
      ServerMatrix server = new ServerMatrix();
      IMatrix stub = (IMatrix) UnicastRemoteObject.exportObject(server, 0);
      // Registro do stub no RMI Registry para que esteja visível a clientes
      Registry registry = LocateRegistry.createRegistry(MATRIX_SERVER_PORT);
      registry.bind("matrix_service", stub);
      System.out.println("Servidor pronto e escutando na porta " + MATRIX_SERVER_PORT);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public double[][] sum(double[][] a, double[][] b) throws RemoteException {
    int rows = a.length;
    int cols = a[0].length;
    double[][] sumMatrix = new double[rows][cols];

    for (int i = 0; i < rows; i++) {
      for (int j = 0; j < cols; j++) {
        sumMatrix[i][j] = a[i][j] + b[i][j];
      }
    }

    return sumMatrix;
  }

  public double[][] mult(double[][] a, double[][] b) throws RemoteException {
    int rowsA = a.length;
    int colsA = a[0].length;
    int rowsB = b.length;
    int colsB = b[0].length;

    if (colsA != rowsB) {
      throw new IllegalArgumentException("Matrices cannot be multiplied due to incompatible dimensions.");
    }

    double[][] productMatrix = new double[rowsA][colsB];

    for (int i = 0; i < rowsA; i++) {
      for (int j = 0; j < colsB; j++) {
        for (int k = 0; k < colsA; k++) {
          productMatrix[i][j] += a[i][k] * b[k][j];
        }
      }
    }

    return productMatrix;
  }

  public double[][] randfill(int rows, int cols) throws RemoteException {
    double[][] newMatrix = new double[rows][cols];

    for (int i = 0; i < rows; i++) {
      for (int j = 0; j < cols; j++) {
        newMatrix[i][j] = Math.random() * 100;
      }
    }
    return newMatrix;
  }

}
