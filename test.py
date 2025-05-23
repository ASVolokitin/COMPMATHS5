import numpy as np


def calculate_central_differences(y):
    n = len(y)
    delta = np.zeros((n, n))
    
    delta[:, 0] = y
    
    for j in range(1, n):
        for i in range(n - j):
            delta[i, j] = delta[i + 1, j - 1] - delta[i, j - 1]
    
    return delta

print(calculate_central_differences([0, 1, 4, 9, 16, 25, 36, 49]))