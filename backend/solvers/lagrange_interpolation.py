from backend.utils.calculation_utils import calculate_finite_differences
from backend.utils.http_entities import DataInput
from backend.utils.response_constructor import generate_result
from backend.utils.util_entities import ErrorCodes
from backend.utils.utils import validate_polynomial


def lagrange_solve(data: DataInput):
    errors = []
    polynomial = None
    calculation_success = False
    finite_differences = [[]]
    
    try:
        def P(x):
            total = 0
            n = len(data.x_arr)
            for i in range(n):
                li = data.y_arr[i]
                for j in range(n):
                    if i != j:
                        denominator = data.x_arr[i] - data.x_arr[j]
                        if denominator == 0:
                            raise ZeroDivisionError(f"Zero division at x[{i}]={data.x_arr[i]}, x[{j}]={data.x_arr[j]}")
                        li *= (x - data.x_arr[j]) / denominator
                total += li
            return total
        
        validate_polynomial(data.x_arr[0] if data.x_arr else 0, P)
        polynomial = P
        calculation_success = True

        finite_differences = calculate_finite_differences(data.y_arr)
        
    except ZeroDivisionError as e:
        errors.append(ErrorCodes.LAGRANGE_ZERO_DEVISION + f" ({e})")
        calculation_success = False
    except ValueError as e:
        errors.append(ErrorCodes.POLYNOMIAL_VALUE_ERROR)
        calculation_success = False
    except Exception as e:
        errors.append(f"Unexpected error: {str(e)}")
        calculation_success = False
    
    return generate_result(
        data=data,
        polynomial=polynomial if calculation_success else None,
        errors=errors,
        finite_differences=finite_differences,
        calculation_success=calculation_success
    )