from decimal import Decimal
from math import factorial

from backend.utils.exceptions import UnequallySpacedXException
from backend.utils.util_entities import GaussFormula, InterpolationMethods
from backend.utils.utils import validate_uniform_grid


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

def get_gauss_coefficients(y_arr, diff_table, formula_type: GaussFormula):
    if formula_type == GaussFormula.FIRST: ptr = 0
    else: ptr = 1
    coefficients = []
    mid_ind = len(y_arr) // 2

    cur_ind = mid_ind
    coefficients = []
    for j in range(len(diff_table[0])):
        coefficients.append(diff_table[cur_ind][j])
        ptr += 1
        if ptr == 2:
            ptr = 0
            cur_ind -= 11
    
    return coefficients

def stirling_interpolation(x_arr, y_arr, target_x):

    n = len(x_arr)
    h = x_arr[1] - x_arr[0]
    try:
        validate_uniform_grid(x_arr)
    except:
        raise UnequallySpacedXException
    
    central_idx = min(range(n), key=lambda i: abs(x_arr[i] - target_x))
    x0 = x_arr[central_idx]
    p = (target_x - x0) / h 

    diff_table = calculate_finite_differences(y_arr)
    
    result = Decimal(diff_table[central_idx][0])
    
    if central_idx > 0 and central_idx < n - 1:
        delta1 = (diff_table[central_idx][1] + diff_table[central_idx - 1][1]) / Decimal(2)
        result += p * delta1
        
        delta2 = diff_table[central_idx - 1][2]
        result += (p ** 2) * delta2 / factorial(2)
        
        if central_idx > 1 and central_idx < n - 2:
            delta3 = (diff_table[central_idx - 1][3] + diff_table[central_idx - 2][3]) / Decimal(2)
            result += p * (p ** 2 - 1) * delta3 / factorial(3)
            
            delta4 = diff_table[central_idx - 2][4]
            result += (p ** 2) * (p ** 2 - 1) * delta4 / factorial(4)
    
    return result