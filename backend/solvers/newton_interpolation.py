from decimal import Decimal
from math import factorial
from backend.utils.constants import ZERO
from backend.utils.exceptions import unequallySpacedXException
from backend.utils.http_entities import DataInput
from backend.utils.response_constructor import generate_result
from backend.utils.util_entities import ErrorCodes
from backend.utils.utils import validate_polynomial

def calculate_divided_differences(x_arr, y_arr):

    n = len(x_arr)
    table = [[Decimal(0) for _ in range(n)] for _ in range(n)]

    for i in range(n):
        table[i][0] = Decimal(y_arr[i])

    for j in range(1, n):
        for i in range(n - j):
            xi, xj = Decimal(x_arr[i]), Decimal(x_arr[i + j])
            numerator = table[i + 1][j - 1] - table[i][j - 1]
            denominator = xj - xi
            table[i][j] = numerator / denominator

    return table

def newton_solve(data: DataInput):
    errors = []
    polynomial = None
    calculation_success = False
    
    try:

        n = len(data.x_arr)
        table = calculate_divided_differences(data.x_arr, data.y_arr)
        coefficients = [table[0][j] for j in range(n)]  

        x_arr_decimal = [Decimal(x) for x in data.x_arr]

        def P(x):
            x = Decimal(x)
            result = coefficients[0]
            term = Decimal(1)
            for i in range(1, n):
                term *= (x - x_arr_decimal[i - 1])
                result += coefficients[i] * term
            return result
        
        validate_polynomial(data.x_arr[0] if data.x_arr else 0, P)
        polynomial = P
        calculation_success = True
        
    except ZeroDivisionError as e:
        errors.append(ErrorCodes.POLINOMIAL_ZERO_DEVISION)
        calculation_success = False
    except ValueError as e:
        errors.append(ErrorCodes.POLINOMIAL_VALUE_ERROR)
        calculation_success = False
    except Exception as e:
        errors.append(f"Unexpected error: {str(e)}")
        calculation_success = False

    return generate_result(
        data=data,
        polynomial=polynomial if calculation_success else None,
        errors=errors,
        finite_differences=table,
        calculation_success=calculation_success
    )