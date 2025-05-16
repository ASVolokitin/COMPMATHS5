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

# def stirling_interpolation(x_arr, y_arr, target_x):
#     n = len(x_arr)
#     if n != len(y_arr):
#         raise ValueError("x_arr and y_arr must have the same length")
#     if n < 2:
#         raise ValueError("At least 2 data points are required for interpolation")
    
#     h = x_arr[1] - x_arr[0]
#     try:
#         validate_uniform_grid(x_arr)
#     except:
#         raise UnequallySpacedXException
    
#     central_idx = min(range(n), key=lambda i: abs(x_arr[i] - target_x))
#     x0 = x_arr[central_idx]
#     p = (target_x - x0) / h 

#     diff_table = calculate_finite_differences(y_arr)
    
#     result = Decimal(diff_table[central_idx][0])
    
#     if central_idx > 0 and central_idx < n - 1:
#         delta1 = (diff_table[central_idx][1] + diff_table[central_idx - 1][1]) / Decimal(2)
#         result += p * delta1
        
#         delta2 = diff_table[central_idx - 1][2]
#         result += (p ** 2) * delta2 / factorial(2)
        
#         if central_idx > 1 and central_idx < n - 2:
#             delta3 = (diff_table[central_idx - 1][3] + diff_table[central_idx - 2][3]) / Decimal(2)
#             result += p * (p ** 2 - 1) * delta3 / factorial(3)
            
#             delta4 = diff_table[central_idx - 2][4]
#             result += (p ** 2) * (p ** 2 - 1) * delta4 / factorial(4)
    
#     return result

def stirling_interpolation(x_arr, y_arr, target_x):
    n = len(x_arr)
    x_arr = list(map(Decimal, x_arr))
    y_arr = list(map(Decimal, y_arr))
    target_x = Decimal(target_x)

    # Проверка на равномерный шаг
    h = x_arr[1] - x_arr[0]
    validate_uniform_grid(x_arr)

    # Центральный индекс
    s = n // 2
    a = x_arr[s]
    u = (target_x - a) / h

    # Строим таблицу центральных разностей
    diff_table = calculate_finite_differences(y_arr)

    # Начинаем с центрального значения
    result = y_arr[s]

    temp1 = Decimal(1)
    temp2 = Decimal(1)
    d = Decimal(1)
    k = 1
    l = 1

    for i in range(1, n):
        s_idx = (n - i) // 2
        d *= i

        if i % 2 == 1:
            if k != 2:
                temp1 *= (u ** k - (k - 1) ** 2)
            else:
                temp1 *= (u ** 2 - (k - 1) ** 2)

            k += 1
            if s_idx == 0:
                break
            result += (temp1 / (2 * d)) * (diff_table[s_idx][i] + diff_table[s_idx - 1][i])
        else:
            temp2 *= (u ** 2 - (l - 1) ** 2)
            l += 1
            result += (temp2 / d) * diff_table[s_idx][i]

    return result

def ucal(u, n):
    if n == 0:
        return Decimal(1)

    temp = Decimal(u)
    for i in range(1, int(n / 2 + 1)):
        temp *= Decimal(u - i)

    for i in range(1, int(n / 2)):
        temp *= Decimal(u + i)

    return temp

def bessel_interpolation(x_arr, y_arr, target_x):
    n = len(x_arr)
    x_arr = list(map(Decimal, x_arr))
    y_arr = list(map(Decimal, y_arr))
    target_x = Decimal(target_x)

    validate_uniform_grid(x_arr)
    h = x_arr[1] - x_arr[0]


    if n % 2 == 0:center_index = n // 2 - 1
    else: center_index = n // 2

    diff_table = calculate_finite_differences(y_arr)

    u = (target_x - x_arr[center_index]) / h
    sum = (y_arr[center_index] + y_arr[center_index + 1]) / 2
    k = center_index

    for i in range(1, n):
        if i % 2 == 1:
            sum += ((u - Decimal(0.5)) *
                    ucal(u, i - 1) *
                    diff_table[k][i]) / factorial(i)
        else:
            if k == 0:
                break 
            sum += (ucal(u, i) *
                    (diff_table[k][i] + diff_table[k - 1][i]) /
                    (2 * factorial(i)))
            k -= 1

    return sum