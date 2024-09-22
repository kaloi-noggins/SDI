#include <bits/stdio.h>
#include <complex>
#include <iostream>
#include <mpi.h>


//mpic++ mandelbrot.cpp
// mpirun

using namespace std;

int main(int argc, char *argv[])
{
	int max_row, max_column, max_n;
	int size, rank;
	char **mat_resultado = NULL;
	char *bloco_resultado = NULL;
	char **mat_trabalho = NULL;
	char *bloco_trabalho = NULL;

	MPI_Init(&argc, &argv);
	MPI_Comm_size(MPI_COMM_WORLD, &size);
	MPI_Comm_rank(MPI_COMM_WORLD, &rank);

	// somente rank zero pode ler informações
	if (rank == 0)
	{
		cin >> max_row;
		cin >> max_column;
		cin >> max_n;
	}

	MPI_Bcast(&max_column, 1, MPI_INT, 0, MPI_COMM_WORLD);
	MPI_Bcast(&max_row, 1, MPI_INT, 0, MPI_COMM_WORLD);
	MPI_Bcast(&max_n, 1, MPI_INT, 0, MPI_COMM_WORLD);

	if (rank == 0)
	{
		mat_resultado = (char **)malloc(sizeof(char *) * max_row);
		bloco_resultado = (char *)malloc(sizeof(char) * max_row * max_column);

		for (int i = 0; i < max_row; i++)
			// mat[i] = (char *)malloc(sizeof(char) * max_column);
			mat_resultado[i] = &bloco_resultado[i * max_column];
	}

	int linhas_para_processar = max_row / size;
	mat_trabalho = (char **)malloc(sizeof(char *) * linhas_para_processar);
	bloco_trabalho = (char *)malloc(sizeof(char) * linhas_para_processar * max_column);

	for (int r = 0; r < linhas_para_processar; ++r)
	{
		for (int c = 0; c < max_column; ++c)
		{
			complex<float> z;
			int n = 0;
			while (abs(z) < 2 && ++n < max_n)
				z = pow(z, 2) + decltype(z)(
									(float)c * 2 / max_column - 1.5,
									(float)r * 2 / max_row - 1);
			mat_trabalho[r][c] = (n == max_n ? '#' : '.');
		}
	}

	// junção dos resultados
	MPI_Gather(&mat_resultado[0][0], linhas_para_processar * max_column, MPI_CHAR, mat_resultado, linhas_para_processar * max_column, MPI_CHAR, 0, MPI_COMM_WORLD);

	for (int r = 0; r < max_row; ++r)
	{
		for (int c = 0; c < max_column; ++c)
			std::cout << mat_resultado[r][c];
		cout << '\n';
	}

	// finalização do mpi
	MPI_Finalize();
}
