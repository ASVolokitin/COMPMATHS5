from decimal import Decimal
import decimal
from functools import reduce
from math import factorial
import math
from typing import List
from backend.utils.calculation_utils import calculate_finite_differences, get_gauss_coefficients
from backend.utils.constants import ZERO
from backend.utils.exceptions import UnequallySpacedXException
from backend.utils.http_entities import DataInput
from backend.utils.response_constructor import generate_result


from decimal import Decimal, getcontext
from math import factorial

from backend.utils.util_entities import ErrorCodes, GaussFormula
from backend.utils.utils import validate_polynomial, validate_uniform_grid

def get_coefficients(y_arr, diff_table, ptr):
    coefficients = []
    mid_ind = len(y_arr) // 2

    cur_ind = mid_ind
    coefficients = []
    for j in range(len(diff_table[0])):
        coefficients.append(diff_table[cur_ind][j])
        ptr += 1
        if ptr == 2:
            ptr = 0
            cur_ind -= 1
    
    return coefficients

def gauss_solve(data: DataInput):
    errors = []
    polynomial = None
    calculation_success = False
    finite_differences = [[]]

    try:
        x_arr = list(map(Decimal, data.x_arr))
        y_arr = list(map(Decimal, data.y_arr))
        n = len(x_arr)

        h = x_arr[1] - x_arr[0]
        validate_uniform_grid(data.x_arr)

        center_idx = n // 2
        x0 = x_arr[center_idx]

        finite_differences = calculate_finite_differences(y_arr)

        def gauss_second(x):
            coefficients = get_coefficients(data.x_arr, finite_differences, 1)
            t = (Decimal(x) - x0) / h
            result = y_arr[center_idx]
            t_term = Decimal(1)
            for i in range(1, n):
                k = i // 2
                if i % 2 == 1:
                    t_term *= (t - k)
                else:
                    t_term *= (t + k)
                result += (t_term * coefficients[i]) / Decimal(factorial(i))
            return result

        def gauss_first(x):
            coefficients = get_coefficients(data.x_arr, finite_differences, 0)
            t = (Decimal(x) - x0) / h
            result = y_arr[center_idx]
            t_term = Decimal(1)
            for i in range(1, n):
                k = i // 2
                if i % 2 == 1:
                    t_term *= (t + k)
                else:
                    t_term *= (t - k)
                result += (t_term * coefficients[i]) / Decimal(factorial(i))
            return result

        def P(x):
            return gauss_second(x) if Decimal(x) <= x0 else gauss_first(x)

        validate_polynomial(x_arr[0], P)
        polynomial = P
        calculation_success = True

    except (ZeroDivisionError, decimal.InvalidOperation) as e:
        errors.append(ErrorCodes.POLYNOMIAL_ZERO_DEVISION + f" ({e})")
    except ValueError as e:
        errors.append(str(e))
    except UnequallySpacedXException as e:
        errors.append(str(e))
    except Exception as e:
        errors.append(f"Unexpected error: {str(e)}")

    return generate_result(
        data=data,
        polynomial=polynomial if calculation_success else None,
        errors=errors,
        finite_differences=finite_differences,
        calculation_success=calculation_success
    )