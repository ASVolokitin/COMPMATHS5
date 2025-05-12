from backend.utils.http_entities import DataInput
from backend.utils.response_constructor import generate_result
from backend.utils.util_entities import ErrorCodes
from backend.utils.utils import validate_polynomial


def lagrange_solve(data: DataInput):
    errors = []
    polynomial = None
    calculation_success = False
    
    try:
        def P(x):
            total = 0
            n = len(data.x_arr)
            for i in range(n):
                xi, yi = data.x_arr[i], data.y_arr[i]
                term = yi
                for j in range(n):
                    if i != j:
                        denominator = xi - data.x_arr[j]
                        if denominator == 0:
                            raise ZeroDivisionError(f"Zero division at x[{i}]={xi}, x[{j}]={data.x_arr[j]}")
                        term *= (x - data.x_arr[j]) / denominator
                total += term
            return total
        
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
        calculation_success=calculation_success
    )