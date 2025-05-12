# from pydantic import ValidationError
from decimal import Decimal
from typing import List
from backend.utils.calculation_utils import calculate_finite_differences
from backend.utils.http_entities import DataInput
from backend.utils.http_entities import ResultOutput
from backend.utils.util_entities import ErrorCodes
from backend.utils.utils import generate_graph_points
# from backend.utils.util_entities import InterpolationMethods

# def generate_response(parameters: ApproximationParameters):
#     coefficients=parameters.coefficients if parameters.coefficients is not None else [],
#     mse=parameters.mse if parameters.mse is not None else 0,
#     data=parameters.data,
#     phi=parameters.phi if parameters.phi is not None else [],
#     e_dots = parameters.e_dots if parameters.e_dots is not None else [],
#     coefficient_of_determination=parameters.coefficient_of_determination if parameters.coefficient_of_determination is not None else 0,
#     correlation_coefficient=parameters.correlation_coefficient if parameters.correlation_coefficient is not None else 0,
#     calculation_success=parameters.calculation_success,
#     best_approximation=False,
#     errors=parameters.errors

#     try:
#         return ResultOutput.create(
#             coefficients=parameters.coefficients if parameters.coefficients is not None else [],
#             mse=parameters.mse if parameters.mse is not None else 0,
#             data=parameters.data,
#             phi=parameters.phi if parameters.phi is not None else [],
#             e_dots = parameters.e_dots if parameters.e_dots is not None else [],
#             coefficient_of_determination=parameters.coefficient_of_determination if parameters.coefficient_of_determination is not None else 0,
#             calculation_success=parameters.calculation_success,
#             errors=parameters.errors
#         )
#     except ValidationError:
#         errors.append("The provided input results in values that are too large. Consider reducing the input range.")
#         return generate_response_fail_coefficients(data, errors)

# def generate_response_fail_coefficients(data, errors):
#     return ResultOutput.create_empty(data, errors)

# def generate_empty_response(data, errors):
#     return ResultOutput.create_empty(data=data, errors=errors)




# def generate_result(data: DataInput, polynomial, errors):

#     target_y = polynomial(data.target_x)

#     return ResultOutput.create(
#         data=data,
#         target_y=target_y,
#         polynomial_func=polynomial,
#         calculation_success=True,
#         errors=errors
#     )

def generate_result(
    data: DataInput,
    polynomial,
    errors,
    calculation_success: bool,
    finite_differences: List[List[Decimal]] = None
):
    target_y = polynomial(data.target_x) if polynomial and calculation_success else None
    if target_y is None:
        calculation_success = False
        errors.append(ErrorCodes.UNABLE_TO_CALCULATE_TARGET_Y)
    
    graph_info = generate_graph_points(data.x_arr, polynomial, errors) if polynomial else None
    if graph_info is None: 
        calculation_success = False
        errors.append(ErrorCodes.UNABLE_TO_CALCULATE_GRAPH_POINTS)
    
    return ResultOutput.create(
        data=data,
        target_y=target_y,
        calculation_success=calculation_success,
        errors=errors,
        graph_info=graph_info,
        finite_differences=finite_differences
    )