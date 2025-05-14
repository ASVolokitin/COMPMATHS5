from decimal import Decimal


def calculate_finite_differences(y_arr):
    n = len(y_arr)
    table = [[Decimal(0) for _ in range(n)] for _ in range(n)]

    for i in range(n):
        table[i][0] = Decimal(y_arr[i])

    for j in range(1, n):
        for i in range(n - j):
            table[i][j] = table[i + 1][j - 1] - table[i][j - 1]

    return table
def calculate_divided_differences(x_arr, y_arr):

    n = len(x_arr)
    table = [[Decimal(0) for _ in range(n)] for _ in range(n)]

    for i in range(n): table[i][0] = Decimal(y_arr[i])

    for j in range(1, n):
        for i in range(n - j):
            xi, xj = Decimal(x_arr[i]), Decimal(x_arr[i + j])
            numerator = table[i + 1][j - 1] - table[i][j - 1]
            denominator = xj - xi
            table[i][j] = numerator / denominator

    return table