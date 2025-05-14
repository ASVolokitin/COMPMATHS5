from decimal import Decimal
from math import factorial
from backend.utils.calculation_utils import calculate_finite_differences
from backend.utils.constants import ZERO
from backend.utils.exceptions import unequallySpacedXException
from backend.utils.http_entities import DataInput
from backend.utils.response_constructor import generate_result


from decimal import Decimal, getcontext
from math import factorial

from backend.utils.util_entities import ErrorCodes
from backend.utils.utils import validate_polynomial

def gauss_interpolate(x_arr, y_arr, x):
    n = len(x_arr)
    h = x_arr[1] - x_arr[0]  # шаг (предполагаем равномерную сетку)
    t = (Decimal(x) - Decimal(x_arr[n // 2])) / Decimal(h)  # нормировка

    # Вычисляем конечные разности
    diff_table = calculate_finite_differences(y_arr)

    # Выбираем центральные разности
    center = n // 2
    result = diff_table[center][0]
    term = Decimal(1)

    for k in range(1, n):
        term *= (t - (-1)**(k % 2) * (k // 2))  # (t)(t-1)(t+1)(t-2)...
        coef = diff_table[center - (k // 2)][k] if k % 2 == 1 else diff_table[center - (k // 2)][k]
        result += coef * term / Decimal(factorial(k))

    return result

def gauss_solve(data: DataInput):
    errors = []
    polynomial = None
    calculation_success = False
    diff_table = [[]]

    try:
        h = data.x_arr[1] - data.x_arr[0]
        for i in range(2, len(data.x_arr)):
            if not abs((data.x_arr[i] - data.x_arr[i - 1]) - h) < ZERO:
                raise unequallySpacedXException()

        diff_table = calculate_finite_differences(data.y_arr)

        def P(x):
            return gauss_interpolate(data.x_arr, data.y_arr, x)

        validate_polynomial(data.x_arr[len(data.x_arr) // 2], P)
        polynomial = P
        calculation_success = True

    except unequallySpacedXException as e:
        errors.append(ErrorCodes.UNEQUALLY_SPACED_X)
        calculation_success = False
    except ZeroDivisionError as e:
        errors.append(ErrorCodes.POLYNOMIAL_ZERO_DEVISION)
        calculation_success = False
    except Exception as e:
        errors.append(f"Unexpected error: {str(e)}")
        calculation_success = False

    return generate_result(
        data=data,
        polynomial=polynomial if calculation_success else None,
        errors=errors,
        finite_differences=diff_table,
        calculation_success=calculation_success
    )